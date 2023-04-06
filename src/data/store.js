import Utils from '../utils'
import Expression from '../expression'
import RTHandlers from './rt-handlers'
import DataQueryBuilder from './data-query-builder'
import LoadRelationsQueryBuilder from './load-relations-query-builder'
import JSONUpdateBuilder from './json-update-builder'

import geoConstructor, { GEO_CLASSES } from './geo/geo-constructor'
import Geometry from './geo/geometry'

function buildFindFirstLastQuery(queryBuilder, sortDir) {
  const query = (queryBuilder instanceof DataQueryBuilder)
    ? queryBuilder.toJSON()
    : (queryBuilder ? { ...queryBuilder } : {})

  query.pageSize = 1
  query.offset = 0

  const { sortBy } = query

  if (!sortBy) {
    query.sortBy = [`created ${sortDir}`]
  }

  return DataQueryBuilder.toRequestBody(query)
}

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

  async save(object, isUpsert) {
    const url = isUpsert
      ? this.app.urls.dataTableUpsert(this.className)
      : this.app.urls.dataTable(this.className)

    return this.app.request
      .put({
        url,
        data: convertToServerRecord(object),
      })
      .then(result => this.parseResponse(result))
  }

  async deepSave(object) {
    return this.app.request
      .put({
        url : this.app.urls.dataTableDeepSave(this.className),
        data: convertToServerRecord(object),
      })
      .then(result => this.parseResponse(result))
  }

  async remove(object) {
    const objectId = object && object.objectId || object

    if (!objectId || (typeof objectId !== 'string' && typeof objectId !== 'number')) {
      throw new Error('Object Id must be provided and must be a string or number.')
    }

    return this.app.request.delete({
      url: this.app.urls.dataTableObject(this.className, objectId),
    })
  }

  async find(query) {
    return this.app.request
      .post({
        url : this.app.urls.dataTableFind(this.className),
        data: DataQueryBuilder.toRequestBody(query),
      })
      .then(result => this.parseResponse(result))
  }

  async group(query) {
    return this.app.request
      .post({
        url : this.app.urls.dataGrouping(this.className),
        data: DataQueryBuilder.toRequestBody(query)
      })
  }

  async countInGroup(query) {
    if (!query.groupPath || typeof query.groupPath !== 'object') {
      throw new Error('Group Path must be provided and must be an object.')
    }

    return this.app.request
      .post({
        url : `${this.app.urls.dataGrouping(this.className)}/count`,
        data: DataQueryBuilder.toRequestBody(query)
      })
  }

  async findById(objectId, query) {
    let result

    if (objectId && typeof objectId === 'object' && !Array.isArray(objectId)) {
      // this is relevant for External Data Connectors where may be more that on primary key

      if (!Object.keys(objectId).length) {
        throw new Error('Provided object must have at least 1 primary keys.')
      }

      result = await this.app.request.get({
        url  : this.app.urls.dataTablePrimaryKey(this.className),
        query: objectId,
      })

    } else {
      if (!objectId || (typeof objectId !== 'string' && typeof objectId !== 'number')) {
        throw new Error('Object Id must be provided and must be a string or number or an object of primary keys.')
      }

      if (query) {
        query.pageSize = null
        query.offset = null
      }

      result = await this.app.request
        .get({
          url        : this.app.urls.dataTableObject(this.className, objectId),
          queryString: DataQueryBuilder.toQueryString(query),
        })
    }

    return this.parseResponse(result)
  }

  async findFirst(query) {
    return this.app.request
      .post({
        url : this.app.urls.dataTableFind(this.className),
        data: buildFindFirstLastQuery(query, 'asc'),
      })
      .then(result => this.parseResponse(result[0]))
  }

  async findLast(query) {
    return this.app.request
      .post({
        url : this.app.urls.dataTableFind(this.className),
        data: buildFindFirstLastQuery(query, 'desc'),
      })
      .then(result => this.parseResponse(result[0]))
  }

  async getObjectCount(condition) {
    let distinct = undefined
    let groupBy = undefined

    if (condition) {
      if (condition instanceof DataQueryBuilder) {
        distinct = condition.getDistinct() || undefined
        groupBy = condition.getGroupBy() || undefined
        condition = condition.getWhereClause() || undefined
      } else if (typeof condition !== 'string') {
        throw new Error('Condition must be a string or an instance of DataQueryBuilder.')
      }
    }

    return this.app.request.post({
      url : this.app.urls.dataTableCount(this.className),
      data: { where: condition, distinct, groupBy },
    })
  }

  async loadRelations(parent, queryBuilder) {
    const parentObjectId = parent && parent.objectId || parent

    if (!parentObjectId || (typeof parentObjectId !== 'string' && typeof parentObjectId !== 'number')) {
      throw new Error('Parent Object Id must be provided and must be a string or number.')
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
      .then(result => this.parseRelationsResponse(result, relationModel))
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

  async bulkUpsert(objects) {
    const errorMessage = 'Objects must be provided and must be an array of objects.'

    if (!objects || !Array.isArray(objects) || !objects.length) {
      throw new Error(errorMessage)
    }

    objects = objects.map(object => {
      if (!object || typeof object !== 'object' || Array.isArray(object)) {
        throw new Error(errorMessage)
      }

      return object
    })

    return this.app.request.put({
      url : this.app.urls.dataBulkTableUpsert(this.className),
      data: objects,
    })
  }

  async bulkUpdate(condition, changes) {
    if (!condition || typeof condition !== 'string') {
      throw new Error('Condition must be provided and must be a string.')
    }

    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
      throw new Error('Changes must be provided and must be an object.')
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

        if (!objectId || (typeof objectId !== 'string' && typeof objectId !== 'number')) {
          throw new Error(
            'Can not transform "objects" to "whereClause". ' +
            'Item must be a string or number or an object with property "objectId" as string.'
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
  parseRelationsResponse(result, RelationModel) {
    return convertToClientRecords(result, RelationModel, this)
  }

  /**
   * @private
   * */
  parseResponse(result) {
    return convertToClientRecords(result, this.model, this)
  }

  /**
   * @private
   * */
  changeRelation(method, parent, columnName, children) {
    const parentId = parent && parent.objectId || parent

    if (!parentId || (typeof parentId !== 'string' && typeof parentId !== 'number')) {
      throw new Error(
        'Relation Parent must be provided and must be a string or number or an object with objectId property.'
      )
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

        if (!childId || (typeof childId !== 'string' && typeof childId !== 'number')) {
          throw new Error('Child Id must be provided and must be a string or number.')
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

const convertToServerRecord = (() => {
  return sourceRecord => {
    const context = {
      instancesMap: new WeakMap()
    }

    return processTargetProps(context, sourceRecord, {})
  }

  function processTargetProps(context, source, target) {
    for (const prop in source) {
      if (Array.isArray(source[prop])) {
        processTargetProps(context, source[prop], target[prop] = [])

      } else if (
        source[prop] && typeof source[prop] === 'object'
        && !(source[prop] instanceof Geometry)
        && !(source[prop] instanceof JSONUpdateBuilder)
        && !(source[prop] instanceof Expression)) {

        if (source[prop] instanceof Date) {
          target[prop] = source[prop].getTime()

        } else if (context.instancesMap.has(source[prop])) {
          const iteratedTarget = context.instancesMap.get(source[prop])

          if (!iteratedTarget.__subID) {
            iteratedTarget.__subID = Utils.uuid()
          }

          target[prop] = { __originSubID: iteratedTarget.__subID }
        } else {
          const iteratedTarget = target[prop] = {}

          context.instancesMap.set(source[prop], iteratedTarget)

          processTargetProps(context, source[prop], iteratedTarget)
        }
      } else {
        target[prop] = source[prop]
      }
    }

    return target
  }
})()

const convertToClientRecords = (() => {
  return (records, RootModel, dataStore) => {
    if (!records) {
      return records
    }

    const context = {
      RootModel,
      app            : dataStore.app,
      classToTableMap: dataStore.classToTableMap,
      subIds         : {},
      postAssign     : [],
    }

    const result = Array.isArray(records)
      ? records.map(record => sanitizeItem(context, record))
      : sanitizeItem(context, records)

    assignPostRelations(context)

    return result
  }

  function createTargetRecord(context, source, target, prop) {
    const __subID = source[prop].__subID

    if (__subID && context.subIds[__subID]) {
      target[prop] = context.subIds[__subID]
      delete source[prop].__subID

    } else {
      const Model = context.classToTableMap[source[prop].___class]

      target[prop] = Model ? new Model() : {}

      if (__subID && !context.subIds[__subID]) {
        context.subIds[__subID] = target[prop]
        delete source[prop].__subID
      }

      processTargetProps(context, source[prop], target[prop])
    }
  }

  function processTargetProp(context, source, target, prop) {
    if (Array.isArray(source[prop])) {
      processTargetProps(context, source[prop], target[prop] = [])

    } else if (source[prop] && typeof source[prop] === 'object') {
      if (GEO_CLASSES.includes(source[prop].___class)) {
        target[prop] = geoConstructor(source[prop])

      } else if (source[prop].__originSubID) {
        context.postAssign.push([target, prop, source[prop].__originSubID])

      } else {
        createTargetRecord(context, source, target, prop)
      }

    } else {
      target[prop] = source[prop]
    }
  }

  function processTargetProps(context, source, target) {
    for (const prop in source) {
      processTargetProp(context, source, target, prop)
    }
  }

  function sanitizeItem(context, sourceRecord) {
    const Model = context.RootModel || context.classToTableMap[sourceRecord.___class]

    const targetRecord = Model ? new Model() : {}

    if (sourceRecord.__subID) {
      if (context.subIds[sourceRecord.__subID]) {
        return context.subIds[sourceRecord.__subID]
      }

      context.subIds[sourceRecord.__subID] = targetRecord
      delete sourceRecord.__subID
    }

    processTargetProps(context, sourceRecord, targetRecord)

    return targetRecord
  }

  function assignPostRelations(context) {
    context.postAssign.forEach(([target, prop, __originSubID]) => {
      target[prop] = context.subIds[__originSubID]
    })
  }
})()
