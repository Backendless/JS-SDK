import Utils from '../../utils'
import { resolveModelClassFromString } from '../utils'
import EventHandler from '../rt-store'

import DataQueryBuilder from '../query-builder'
import LoadRelationsQueryBuilder from '../load-relations-query-builder'
import { extractQueryOptions } from './extract-query-options'
import { parseFindResponse } from './parse'

export default class DataStore {

  constructor(model, classToTableMap, app) {
    this.classToTableMap = classToTableMap

    if (Utils.isString(model)) {
      this.className = model
      this.model = classToTableMap[this.className] || resolveModelClassFromString(this.className)

    } else {
      this.className = Utils.getClassName(model)
      this.model = classToTableMap[this.className] || model
    }

    if (!this.className) {
      throw new Error('Class name should be specified')
    }

    this.app = app

    Utils.enableAsyncHandlers(this, [
      'save',
      'remove',
      'find',
      'findById',
      'loadRelations',
      'findFirst',
      'findLast',
      'getObjectCount',
      'setRelation',
      'setRelation',
      'addRelation',
      'deleteRelation',
      'bulkCreate',
      'bulkUpdate',
      'bulkDelete',
    ])
  }

  rt() {
    return this.eventHandler = this.eventHandler || new EventHandler(this, this.app)
  }

  async save(obj) {
    const genID = () => {
      //TODO: refactor me
      let b = ''

      for (let a = b; a++ < 36; b += a * 51
      && 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-') {
      }

      return b
    }

    function replCircDeps(object) {
      const objMap = [object]
      let pos

      const _replCircDepsHelper = obj => {
        for (const prop in obj) {
          if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'object' && obj[prop] != null) {
            if ((pos = objMap.indexOf(obj[prop])) !== -1) {
              objMap[pos]['__subID'] = objMap[pos]['__subID'] || genID()
              obj[prop] = { '__originSubID': objMap[pos]['__subID'] }

            } else if (Utils.isDate(obj[prop])) {
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

    replCircDeps(obj)

    return this.app.request.put({
      url   : this.app.urls.dataTable(this.className),
      data  : obj,
      parser: result => parseFindResponse(result, this.model, this.classToTableMap),
    })
  }

  async remove(object) {
    if (!Utils.isObject(object) && !Utils.isString(object)) {
      throw new Error('Invalid value for the "value" argument. The argument must contain only string or object values')
    }

    return this.app.request.delete({
      url: this.app.urls.dataTableObject(this.className, object.objectId || object),
    })
  }

  async find(queryBuilder) {
    //TODO: add an ability to get object as DataQueryBuilder

    if (queryBuilder && !(queryBuilder instanceof DataQueryBuilder)) {
      throw new Error('The first argument should be instance of Backendless.DataQueryBuilder')
    }

    const dataQuery = queryBuilder ? queryBuilder.build() : {}
    const url = this.app.urls.dataTable(this.className)

    return findUtil.call(this, url, this.model, dataQuery)
  }

  async findById() {
    let argsObj

    const url = this.app.urls.dataTable(this.className)

    if (Utils.isString(arguments[0])) {
      argsObj = arguments[1] || {}
      argsObj.url = arguments[0]

      if (!argsObj.url) {
        throw new Error('missing argument "object ID" for method findById()')
      }

      return findUtil.call(this, url, this.model, argsObj)
    }

    if (Utils.isObject(arguments[0])) {
      argsObj = arguments[0]

      let send = '/pk?'

      for (const key in argsObj) {
        send += key + '=' + argsObj[key] + '&'
      }

      if (Utils.getClassName(arguments[0]) === 'Object') {
        return this.app.request.get({
          url   : url + send.replace(/&$/, ''),
          parser: resp => parseFindResponse(resp, this.model, this.classToTableMap),
        })
      }

      return this.app.request.put({
        url   : url,
        data  : argsObj,
        parser: resp => parseFindResponse(resp, this.model, this.classToTableMap),
      })
    }
  }

  async loadRelations(parentObjectId, queryBuilder) {
    if (!parentObjectId || !Utils.isString(parentObjectId)) {
      throw new Error('The parentObjectId is required argument and must be a nonempty string')
    }

    if (!(queryBuilder instanceof LoadRelationsQueryBuilder)) {
      throw new Error(
        'Invalid queryBuilder object.' +
        'The queryBuilder is required and must be instance of the Backendless.LoadRelationsQueryBuilder'
      )
    }

    const dataQuery = queryBuilder.build()

    const relationName = dataQuery.options && dataQuery.options.relationName

    if (!relationName || !Utils.isString(relationName)) {
      throw new Error('The options relationName is required and must contain string value')
    }

    let options
    const query = []

    if (dataQuery.options) {
      options = extractQueryOptions(dataQuery.options)
    }

    if (options) {
      query.push(options)
    }

    if (dataQuery.condition) {
      query.push('where=' + encodeURIComponent(dataQuery.condition))
    }

    if (dataQuery.havingClause) {
      query.push('having=' + encodeURIComponent(dataQuery.havingClause))
    }

    if (dataQuery.properties && dataQuery.properties.length) {
      query.push('props=' + Utils.encodeArrayToUriComponent(dataQuery.properties))
    }

    let url = this.app.urls.dataTableObjectRelation(this.className, parentObjectId, relationName)

    if (query.length) {
      url += '?' + query.join('&')
    }

    return this.app.request.get({
      url   : url,
      parser: resp => parseFindResponse(resp, dataQuery.relationModel),
    })
  }

  async findFirst(dataQuery) {
    dataQuery = dataQuery || {}
    dataQuery.url = 'first'

    const url = this.app.urls.dataTable(this.className)

    return findUtil.call(this, url, this.model, dataQuery)
  }

  async findLast(dataQuery) {
    dataQuery = dataQuery || {}
    dataQuery.url = 'last'

    const url = this.app.urls.dataTable(this.className)

    return findUtil.call(this, url, this.model, dataQuery)
  }

  async getObjectCount(condition) {
    if (condition instanceof DataQueryBuilder) {
      condition = condition.build().condition || undefined
    }

    return this.app.request.get({
      url  : this.app.urls.dataTableCount(this.className),
      query: { where: condition },
    })
  }

  async setRelation(parent, columnName, children) {
    const relation = collectRelationObject(parent, columnName, children)
    const url = buildRelationUrl.call(this, this.className, relation)

    return manageRelation.call(this, 'POST', url, relation)
  }

  async addRelation(parent, columnName, children) {
    const relation = collectRelationObject(parent, columnName, children)
    const url = buildRelationUrl.call(this, this.className, relation)

    return manageRelation.call(this, 'PUT', url, relation)
  }

  async deleteRelation(parent, columnName, children) {
    const relation = collectRelationObject(parent, columnName, children)
    const url = buildRelationUrl.call(this, this.className, relation)

    return manageRelation.call(this, 'DELETE', url, relation)
  }

  async bulkCreate(objects) {
    const MSG_ERROR = (
      'Invalid bulkCreate argument. ' +
      'The first argument must contain only array of objects.'
    )

    if (!Utils.isArray(objects)) {
      throw new Error(MSG_ERROR)
    }

    objects.forEach(obj => {
      if (!Utils.isObject(obj) || Array.isArray(obj)) {
        throw new Error(MSG_ERROR)
      }
    })

    return this.app.request.post({
      url : this.app.urls.dataBulkTable(this.className),
      data: objects,
    })
  }

  async bulkUpdate(where, changes) {
    if (!where || !Utils.isString(where)) {
      throw new Error('Invalid bulkUpdate argument. The first argument must be "whereClause" string.')
    }

    if (!Utils.isObject(changes) || Array.isArray(changes)) {
      throw new Error('Invalid bulkUpdate argument. The second argument must be object.')
    }

    return this.app.request.put({
      url  : this.app.urls.dataBulkTable(this.className),
      query: { where },
      data : changes,
    })
  }

  async bulkDelete(where) {
    if (!Utils.isArray(where) && !Utils.isString(where)) {
      throw new Error(
        'Invalid bulkDelete argument. ' +
        'The first argument must contain array of objects or array of id or "whereClause" string.'
      )
    }

    function objectsToWhereClause(objects) {
      const objectIds = objects.map(obj => {
        if (!obj || (!Utils.isString(obj) && !obj.objectId)) {
          throw new Error(
            'Can not transform "objects" to "whereClause". ' +
            'Item must be a string or an object with property "objectId" as string.'
          )
        }

        return `'${Utils.isString(obj) ? obj : obj.objectId}'`
      })

      return `objectId in (${objectIds.join(',')})`
    }

    const queryData = {
      where: Utils.isString(where) ? where : objectsToWhereClause(where)
    }

    return this.app.request.post({
      url : this.app.urls.dataBulkTableDelete(this.className),
      data: queryData
    })
  }
}

function collectRelationObject(parent, columnName, children) {
  const relation = {
    columnName
  }

  if (Utils.isString(parent)) {
    relation.parentId = parent
  } else if (Utils.isObject(parent)) {
    relation.parentId = parent.objectId
  }

  if (Utils.isString(children)) {
    relation.whereClause = children

  } else if (Utils.isArray(children)) {
    relation.childrenIds = children.map(child => Utils.isObject(child) ? child.objectId : child)
  }

  return relation
}

function manageRelation(method, url, relation) {
  if (!relation.parentId) {
    throw new Error(
      'Invalid value for the "parent" argument. ' +
      'The argument is required and must contain only string or object values.'
    )
  }

  if (!relation.columnName) {
    throw new Error(
      'Invalid value for the "columnName" argument. ' +
      'The argument is required and must contain only string values.'
    )
  }

  if (!relation.whereClause && !relation.childrenIds) {
    throw new Error(
      'Invalid value for the third argument. ' +
      'The argument is required and must contain string values if it sets whereClause ' +
      'or array if it sets childObjects.'
    )
  }

  return this.app.request.send({
    method,
    url,
    data: relation.childrenIds
  })
}

function buildRelationUrl(className, relation) {
  let url = this.app.urls.dataTableObjectRelation(className, relation.parentId, relation.columnName)

  if (relation.whereClause) {
    url += '?' + Utils.toQueryParams({ whereClause: relation.whereClause })
  }

  return url
}

function findUtil(url, Model, dataQuery) {
  dataQuery = dataQuery || {}

  const dataQueryURL = dataQuery.url

  if (dataQuery instanceof DataQueryBuilder) {
    dataQuery = dataQuery.build()
  }

  const query = []

  if (dataQuery.options) {
    query.push(extractQueryOptions(dataQuery.options))
  }

  if (dataQuery.condition) {
    query.push('where=' + encodeURIComponent(dataQuery.condition))
  }

  if (dataQuery.havingClause) {
    query.push('having=' + encodeURIComponent(dataQuery.havingClause))
  }

  if (Array.isArray(dataQuery.properties)) {
    dataQuery.properties.forEach(property => {
      query.push('property=' + encodeURIComponent(property))
    })
  }

  if (Array.isArray(dataQuery.excludeProps) && dataQuery.excludeProps.length) {
    query.push('excludeProps=' + Utils.encodeArrayToUriComponent(dataQuery.excludeProps))
  }

  if (dataQueryURL) {
    url += '/' + dataQueryURL
  }

  if (query.length) {
    url += '?' + query.join('&')
  }

  return this.app.request.get({
    url,
    parser     : resp => parseFindResponse(resp, Model, this.classToTableMap),
    cachePolicy: dataQuery.cachePolicy
  })
}
