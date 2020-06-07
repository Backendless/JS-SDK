import Utils from '../utils'
import RTHandlers from './rt-handlers'
import DataQueryBuilder from './data-query-builder'
import LoadRelationsQueryBuilder from './load-relations-query-builder'

import geoConstructor, { GEO_CLASSES } from './geo/geo-constructor'

export default class DataStore {

  constructor(model, dataService) {
    this.app = dataService.app
    this.classToTableMap = dataService.classToTableMap

    if (typeof model === 'string') {
      this.className = model
      this.model = this.classToTableMap[this.className]

    } else {
      this.className = Utils.getClassName(model)
      this.model = this.classToTableMap[this.className] || model
    }

    if (!this.className) {
      throw new Error('Class name should be specified')
    }
  }

  rt() {
    return this.rtHandlers = this.rtHandlers || new RTHandlers(this)
  }

  async save(object) {
    //TODO: refactor me
    replCircDeps(object)

    return this.app.request
      .put({
        url : this.app.urls.dataTable(this.className),
        data: object,
      })
      .then(result => this.parseFindResponse(result))
  }

  async remove(object) {
    const objectId = object && object.objectId || object

    if (!objectId || typeof objectId !== 'string') {
      throw new Error('Object Id must be provided and must be a string.')
    }

    return this.app.request.delete({
      url: this.app.urls.dataTableObject(this.className, objectId),
    })
  }

  async find(query) {
    return this.app.request
      .get({
        url        : this.app.urls.dataTable(this.className),
        queryString: DataQueryBuilder.toQueryString(query),
      })
      .then(result => this.parseFindResponse(result))
  }

  async findById(objectId, query) {
    let result

    if (objectId && typeof objectId === 'object' && !Array.isArray(objectId)) {
      // this is relevant for External Data Connectors where may be more that on primary key

      if (Object.keys(objectId).length < 2) {
        throw new Error('Provided object must have at least 2 primary keys.')
      }

      result = await this.app.request.get({
        url  : this.app.urls.dataTablePrimaryKey(this.className),
        query: objectId,
      })

    } else {
      if (!objectId || typeof objectId !== 'string') {
        throw new Error('Object Id must be provided and must be a string or an object of primary keys.')
      }

      result = await this.app.request
        .get({
          url        : this.app.urls.dataTableObject(this.className, objectId),
          queryString: DataQueryBuilder.toQueryString(query),
        })
    }

    return this.parseFindResponse(result)
  }

  async findFirst(query) {
    return this.app.request
      .get({
        url        : this.app.urls.dataTableObject(this.className, 'first'),
        queryString: DataQueryBuilder.toQueryString(query),
      })
      .then(result => this.parseFindResponse(result))
  }

  async findLast(query) {
    return this.app.request
      .get({
        url        : this.app.urls.dataTableObject(this.className, 'last'),
        queryString: DataQueryBuilder.toQueryString(query),
      })
      .then(result => this.parseFindResponse(result))
  }

  async getObjectCount(condition) {
    if (condition) {
      if (condition instanceof DataQueryBuilder) {
        condition = condition.getWhereClause() || undefined
      } else if (typeof condition !== 'string') {
        throw new Error('Condition must be a string or an instance of DataQueryBuilder.')
      }
    }

    return this.app.request.get({
      url  : this.app.urls.dataTableCount(this.className),
      query: { where: condition },
    })
  }

  async loadRelations(parent, queryBuilder) {
    const parentObjectId = parent && parent.objectId || parent

    if (!parentObjectId || typeof parentObjectId !== 'string') {
      throw new Error('Parent Object Id must be provided and must be a string.')
    }

    const { relationName, relationModel, ...query } = queryBuilder instanceof LoadRelationsQueryBuilder
      ? queryBuilder.toJSON()
      : queryBuilder

    if (!relationName || typeof relationName !== 'string') {
      throw new Error('Relation Name must be provided and must be a string.')
    }

    return this.app.request
      .get({
        url        : this.app.urls.dataTableObjectRelation(this.className, parentObjectId, relationName),
        queryString: LoadRelationsQueryBuilder.toQueryString(query)
      })
      .then(result => this.parseFindResponse(result, relationModel))
  }

  async setRelation(parent, columnName, children) {
    return this.changeRelation(this.app.request.Methods.POST, parent, columnName, children)
  }

  async addRelation(parent, columnName, children) {
    return this.changeRelation(this.app.request.Methods.PUT, parent, columnName, children)
  }

  async deleteRelation(parent, columnName, children) {
    return this.changeRelation(this.app.request.Methods.DELETE, parent, columnName, children)
  }

  async bulkCreate(objects) {
    const errorMessage = 'Objects must be provided and must be an array of objects.'

    if (!objects || !Array.isArray(objects)) {
      throw new Error(errorMessage)
    }

    objects = objects.map(object => {
      if (!object || typeof object !== 'object' || Array.isArray(object)) {
        throw new Error(errorMessage)
      }

      return object
    })

    return this.app.request.post({
      url : this.app.urls.dataBulkTable(this.className),
      data: objects,
    })
  }

  async bulkUpdate(condition, changes) {
    if (!condition || typeof condition !== 'string') {
      throw new Error('Condition must be provided and must be a string.')
    }

    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
      throw new Error('Changes must be provided and must be a object.')
    }

    return this.app.request.put({
      url  : this.app.urls.dataBulkTable(this.className),
      query: { where: condition },
      data : changes,
    })
  }

  async bulkDelete(condition) {
    if (!condition || (typeof condition !== 'string' && !Array.isArray(condition))) {
      throw new Error('Condition must be provided and must be a string or a list of objects.')
    }

    const queryData = {}

    if (typeof condition === 'string') {
      queryData.where = condition

    } else {
      const objectIds = condition.map(object => {
        const objectId = object && object.objectId || object

        if (!objectId || typeof objectId !== 'string') {
          throw new Error(
            'Can not transform "objects" to "whereClause". ' +
            'Item must be a string or an object with property "objectId" as string.'
          )
        }

        return `'${objectId}'`
      })

      queryData.where = `objectId in (${objectIds.join(',')})`
    }

    return this.app.request.post({
      url : this.app.urls.dataBulkTableDelete(this.className),
      data: queryData
    })
  }

  /**
   * @private
   * */
  parseFindResponse(result, model) {
    return parseFindResponse(result, model || this.model, this.classToTableMap)
  }

  /**
   * @private
   * */
  changeRelation(method, parent, columnName, children) {
    const parentId = parent && parent.objectId || parent

    if (!parentId || typeof parentId !== 'string') {
      throw new Error('Relation Parent must be provided and must be a string or an object with objectId property.')
    }

    if (!columnName || typeof columnName !== 'string') {
      throw new Error('Relation Column Name must be provided and must be a string.')
    }

    if (!children || (typeof children !== 'string' && !Array.isArray(children))) {
      throw new Error('Relation Children must be provided and must be a string or a list of objects.')
    }

    const condition = {}

    if (typeof children === 'string') {
      condition.whereClause = children

    } else {
      condition.childrenIds = children.map(child => {
        const childId = child && child.objectId || child

        if (!childId || typeof childId !== 'string') {
          throw new Error('Child Id must be provided and must be a string.')
        }

        return childId
      })
    }

    const query = {}

    if (condition.whereClause) {
      query.whereClause = condition.whereClause
    }

    return this.app.request.send({
      method,
      url : this.app.urls.dataTableObjectRelation(this.className, parentId, columnName),
      query,
      data: condition.childrenIds
    })
  }
}

function replCircDeps(object) {
  const objMap = [object]
  let pos

  const _replCircDepsHelper = obj => {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'object' && obj[prop] != null) {
        if ((pos = objMap.indexOf(obj[prop])) !== -1) {
          objMap[pos]['__subID'] = objMap[pos]['__subID'] || Utils.uuid()
          obj[prop] = { '__originSubID': objMap[pos]['__subID'] }

        } else if (obj[prop] && obj[prop] instanceof Date) {
          obj[prop] = obj[prop].getTime()

        } else {
          objMap.push(obj[prop])
          _replCircDepsHelper(obj[prop])
        }
      }
    }
  }

  _replCircDepsHelper(object)
}

function parseCircularDependencies(record, result, subIds, postAssign, classToTableMap) {
  const iteratedItems = []

  if (record.__subID) {
    if (subIds[record.__subID]) {
      return subIds[record.__subID]
    }

    subIds[record.__subID] = result
    delete record.__subID
  }

  function ensureCircularDep(source, target, prop) {
    if (subIds[source[prop].__originSubID]) {
      target[prop] = subIds[source[prop].__originSubID]
    } else {
      postAssign.push([target, prop, source[prop].__originSubID])
    }
  }

  function processModel(source, target, prop) {
    if (source[prop].__subID && subIds[source[prop].__subID]) {
      target[prop] = subIds[source[prop].__subID]
    } else {
      const className = source[prop].___class
      const Model = classToTableMap[className] || Utils.globalScope[className] || source[prop].constructor

      target[prop] = new Model()
    }

    if (source[prop].__subID && !subIds[source[prop].__subID]) {
      subIds[source[prop].__subID] = target[prop]
      delete source[prop].__subID
    }
  }

  function buildCircularDeps(source, target) {
    iteratedItems.push(source)

    for (const prop in source) {
      if (iteratedItems.includes(source[prop])) {
        target[prop] = source[prop]
      } else if (!Array.isArray(target[prop]) || !target[prop]) {
        if (Array.isArray(source[prop])) {
          buildCircularDeps(source[prop], target[prop] = [])

        } else if (source[prop] && typeof source[prop] === 'object') {
          if (GEO_CLASSES.includes(source[prop].___class)) {
            target[prop] = geoConstructor(source[prop])
          } else if (source[prop].__originSubID) {
            ensureCircularDep(source, target, prop)
          } else {
            processModel(source, target, prop)

            buildCircularDeps(source[prop], target[prop])
          }

        } else {
          target[prop] = source[prop]
        }
      }
    }
  }

  buildCircularDeps(record, result)

  return result
}

function parseFindResponse(response, Model, classToTableMap) {
  if (!response) {
    return response
  }

  //TODO: refactor me
  const subIds = {}
  const postAssign = []

  const sanitizeResponseItem = record => {
    Model = typeof Model === 'function' ? Model : classToTableMap[record.___class]

    return parseCircularDependencies(record, Model ? new Model() : {}, subIds, postAssign, classToTableMap)
  }

  const result = Array.isArray(response)
    ? response.map(sanitizeResponseItem)
    : sanitizeResponseItem(response)

  postAssign.forEach(([target, prop, __originSubID]) => target[prop] = subIds[__originSubID])

  return result

}
