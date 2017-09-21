import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'

import LoadRelationsQueryBuilder from './load-relations-query-builder'

const createModelClassFromString = (/** className */) => {
  //TODO: improve me
  return function() {
  }
}

export default class DataStore {

  constructor(model) {
    if (Utils.isString(model)) {
      this.model = model === Backendless.User.className
        ? Backendless.User
        : createModelClassFromString(model)

    } else {
      this.model = model
    }

    this.className = Utils.getClassName(model)

    if ((typeof model).toLowerCase() === 'string') {
      this.className = model
    }

    if (!this.className) {
      throw new Error('Class name should be specified')
    }

    // this.restUrl = Urls.dataTable(this.className)
    // this.bulkRestUrl = Urls.dataBulkTable(this.className)
  }

  _extractQueryOptions(options) {
    const params = []

    if (typeof options.pageSize !== 'undefined') {
      if (options.pageSize < 1 || options.pageSize > 100) {
        throw new Error('PageSize can not be less then 1 or greater than 100')
      }

      params.push('pageSize=' + encodeURIComponent(options.pageSize))
    }

    if (typeof options.offset !== 'undefined') {
      if (options.offset < 0) {
        throw new Error('Offset can not be less then 0')
      }

      params.push('offset=' + encodeURIComponent(options.offset))
    }

    if (options.sortBy) {
      if (Utils.isString(options.sortBy)) {
        params.push('sortBy=' + encodeURIComponent(options.sortBy))
      } else if (Utils.isArray(options.sortBy)) {
        params.push('sortBy=' + Utils.encodeArrayToUriComponent(options.sortBy))
      }
    }

    if (options.relationsDepth) {
      if (Utils.isNumber(options.relationsDepth)) {
        params.push('relationsDepth=' + Math.floor(options.relationsDepth))
      }
    }

    if (options.relations) {
      if (Utils.isArray(options.relations)) {
        params.push('loadRelations=' + (options.relations.length ? Utils.encodeArrayToUriComponent(options.relations) : '*'))
      }
    }

    return params.join('&')
  }

  _parseResponse(response) {
    const _Model = this.model
    const item = new _Model()

    response = response.fields || response

    Utils.deepExtend(item, response)

    return this._formCircDeps(item)
  }

  _parseFindResponse(response, model) {
    const _Model = model === undefined ? this.model : model
    let result

    const sanitizeResponseItem = function(response) {
      const item = Utils.isFunction(_Model) ? new _Model() : {}

      response = response.fields || response

      return Utils.deepExtend(item, response)
    }

    if (Utils.isArray(response)) {
      result = response.map(sanitizeResponseItem)
    } else {
      result = sanitizeResponseItem(response)
    }

    return this._formCircDeps(result)
  }

  _load(url, async) {
    if (url) {
      let responder = Utils.extractResponder(arguments), isAsync = false

      if (responder) {
        isAsync = true
        responder = Utils.wrapAsync(responder, this._parseResponse, this)
      }

      const result = Backendless._ajax({
        method      : 'GET',
        url         : url,
        isAsync     : isAsync,
        asyncHandler: responder
      })

      return isAsync ? result : this._parseResponse(result)
    }
  }

  _replCircDeps(obj) {
    const objMap = [obj]
    let pos

    const genID = function() {
      for (var b = '', a = b; a++ < 36; b += a * 51 && 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-') {
      }
      return b
    }

    const _replCircDepsHelper = function(obj) {
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

    _replCircDepsHelper(obj)
  }

  _formCircDeps(obj) {
    const result = new obj.constructor()
    const circDepsIDs = {}
    const iteratedObjects = []

    const _formCircDepsHelper = function(obj, result) {
      if (iteratedObjects.indexOf(obj) === -1) {
        iteratedObjects.push(obj)

        if (obj.hasOwnProperty('__subID')) {
          circDepsIDs[obj['__subID']] = result
          delete obj['__subID']
        }

        for (const prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (typeof obj[prop] === 'object' && obj[prop] != null) {
              if (obj[prop].hasOwnProperty('__originSubID')) {
                result[prop] = circDepsIDs[obj[prop]['__originSubID']]
              } else {
                result[prop] = new (obj[prop].constructor)()
                _formCircDepsHelper(obj[prop], result[prop])
              }
            } else {
              result[prop] = obj[prop]
            }
          }
        }
      }
    }

    _formCircDepsHelper(obj, result)

    return result
  }

  save = Utils.promisified('_save')

  saveSync = Utils.synchronized('_save')

  _save(obj, async) {
    this._replCircDeps(obj)
    let responder = Utils.extractResponder(arguments),
        isAsync   = false,
        method    = 'PUT',
        url       = Urls.dataTable(this.className),
        objRef    = obj

    if (responder) {
      isAsync = true
      responder = Utils.wrapAsync(responder, this._parseResponse, this)
    }

    const result = Backendless._ajax({
      method      : method,
      url         : url,
      data        : JSON.stringify(obj),
      isAsync     : isAsync,
      asyncHandler: responder
    })

    if (!isAsync) {
      Utils.deepExtend(objRef, this._parseResponse(result))
    }

    return isAsync ? result : objRef
  }

  remove = Utils.promisified('_remove')

  removeSync = Utils.synchronized('_remove')

  _remove(objId, async) {
    if (!Utils.isObject(objId) && !Utils.isString(objId)) {
      throw new Error('Invalid value for the "value" argument. The argument must contain only string or object values')
    }

    let responder = Utils.extractResponder(arguments), isAsync = false

    if (responder) {
      isAsync = true
      responder = Utils.wrapAsync(responder, this._parseResponse, this)
    }

    let result

    if (Utils.isString(objId) || objId.objectId) {
      objId = objId.objectId || objId
      result = Backendless._ajax({
        method      : 'DELETE',
        url         : Urls.dataTableObject(this.className, objId),
        isAsync     : isAsync,
        asyncHandler: responder
      })
    } else {
      result = Backendless._ajax({
        method      : 'DELETE',
        url         : Urls.dataTable(this.className),
        data        : JSON.stringify(objId),
        isAsync     : isAsync,
        asyncHandler: responder
      })
    }

    return isAsync ? result : this._parseResponse(result)
  }

  find = Utils.promisified('_find')
  findSync = Utils.synchronized('_find')

  _find(queryBuilder) {
    const args = this._parseFindArguments(arguments)
    const dataQuery = args.queryBuilder ? args.queryBuilder.build() : {}

    return this._findUtil(dataQuery, args.async)
  }

  _validateFindArguments(args) {
    if (args.length === 0) {
      return
    }

    if (!(args[0] instanceof Backendless.DataQueryBuilder) && !(args[0] instanceof Async)) {
      throw new Error(
        'Invalid find method argument. ' +
        'The argument should be instance of Backendless.DataQueryBuilder or Async'
      )
    }
  }

  _parseFindArguments(args) {
    this._validateFindArguments(args)

    const result = {
      queryBuilder: args[0] instanceof Backendless.DataQueryBuilder ? args[0] : null,
      async       : args[0] instanceof Async ? args[0] : null
    }

    if (args.length > 1) {
      result.async = args[1]
    }

    return result
  }

  _findUtil(dataQuery) {
    dataQuery = dataQuery || {}

    let props,
        whereClause,
        options,
        query     = [],
        url       = Urls.dataTable(this.className),
        responder = Utils.extractResponder(arguments),
        isAsync   = !!responder,
        result

    if (dataQuery.properties && dataQuery.properties.length) {
      props = 'props=' + Utils.encodeArrayToUriComponent(dataQuery.properties)
    }

    if (dataQuery.condition) {
      whereClause = 'where=' + encodeURIComponent(dataQuery.condition)
    }

    if (dataQuery.options) {
      options = this._extractQueryOptions(dataQuery.options)
    }

    if (responder) {
      responder = Utils.wrapAsync(responder, this._parseFindResponse, this)
    }

    if (options) {
      query.push(options)
    }

    if (whereClause) {
      query.push(whereClause)
    }

    if (props) {
      query.push(props)
    }

    query = query.join('&')

    if (dataQuery.url) {
      url += '/' + dataQuery.url
    }

    if (query) {
      url += '?' + query
    }

    result = Backendless._ajax({
      method      : 'GET',
      url         : url,
      isAsync     : isAsync,
      asyncHandler: responder,
      cachePolicy : dataQuery.cachePolicy
    })

    return isAsync ? result : this._parseFindResponse(result)
  }

  findById = Utils.promisified('_findById')

  findByIdSync = Utils.synchronized('_findById')

  _findById() {
    let argsObj
    let responder = Utils.extractResponder(arguments)

    if (Utils.isString(arguments[0])) {
      argsObj = !(arguments[1] instanceof Async) ? (arguments[1] || {}) : {}
      argsObj.url = arguments[0]

      if (!argsObj.url) {
        throw new Error('missing argument "object ID" for method findById()')
      }

      return this._findUtil(argsObj, responder)
    } else if (Utils.isObject(arguments[0])) {
      argsObj = arguments[0]
      let url = Urls.dataTable(this.className)
      let isAsync = !!responder
      let send = '/pk?'

      for (const key in argsObj) {
        send += key + '=' + argsObj[key] + '&'
      }

      !!responder && (responder = Utils.wrapAsync(responder, this._parseResponse, this))

      let result

      if (Utils.getClassName(arguments[0]) === 'Object') {
        result = Backendless._ajax({
          method      : 'GET',
          url         : url + send.replace(/&$/, ''),
          isAsync     : isAsync,
          asyncHandler: responder
        })
      } else {
        result = Backendless._ajax({
          method      : 'PUT',
          url         : url,
          data        : JSON.stringify(argsObj),
          isAsync     : isAsync,
          asyncHandler: responder
        })
      }

      return isAsync ? result : this._parseResponse(result)
    } else {
      throw new Error('Invalid value for the "value" argument. The argument must contain only string or object values')
    }
  }

  loadRelations = Utils.promisified('_loadRelations')

  loadRelationsSync = Utils.synchronized('_loadRelations')

  _loadRelations(parentObjectId, queryBuilder, async) {
    this._validateLoadRelationsArguments(parentObjectId, queryBuilder)

    const dataQuery = queryBuilder.build()
    const relationModel = dataQuery.relationModel || null
    let responder = Utils.extractResponder(arguments)
    const relationName = dataQuery.options.relationName
    const query = this._extractQueryOptions(dataQuery.options)
    let url = Urls.dataTable(this.className) + Utils.toUri(parentObjectId, relationName)

    responder = responder && Utils.wrapAsync(responder, function(response) {
      return this._parseFindResponse(response, relationModel)
    }, this)

    url += query ? '?' + query : ''

    const result = Backendless._ajax({
      method      : 'GET',
      url         : url,
      isAsync     : !!responder,
      asyncHandler: responder
    })

    return !!responder ? result : this._parseFindResponse(result, relationModel)
  }

  _validateLoadRelationsArguments(parentObjectId, queryBuilder) {
    if (!parentObjectId || !Utils.isString(parentObjectId)) {
      throw new Error('The parentObjectId is required argument and must be a nonempty string')
    }

    if (!queryBuilder || !(queryBuilder instanceof LoadRelationsQueryBuilder)) {
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
  }

  findFirst = Utils.promisified('_findFirst')

  findFirstSync = Utils.synchronized('_findFirst')

  _findFirst() {
    const argsObj = !(arguments[0] instanceof Async) ? (arguments[0] || {}) : {}
    argsObj.url = 'first'

    return this._findUtil.apply(this, [argsObj].concat(Array.prototype.slice.call(arguments)))
  }

  findLast = Utils.promisified('_findLast')

  findLastSync = Utils.synchronized('_findLast')

  _findLast() {
    const argsObj = !(arguments[0] instanceof Async) ? (arguments[0] || {}) : {}
    argsObj.url = 'last'

    return this._findUtil.apply(this, [argsObj].concat(Array.prototype.slice.call(arguments)))
  }

  getObjectCount = Utils.promisified('_getObjectCount')

  getObjectCountSync = Utils.synchronized('_getObjectCount')

  _getObjectCount(queryBuilder, async) {
    const args = this._parseFindArguments(arguments)
    const dataQuery = args.queryBuilder ? args.queryBuilder.build() : {}
    let url = Urls.dataTableCount(this.className)
    const isAsync = !!args.async

    if (dataQuery.condition) {
      url += '?where=' + encodeURIComponent(dataQuery.condition)
    }

    return Backendless._ajax({
      method      : 'GET',
      url         : url,
      isAsync     : isAsync,
      asyncHandler: args.async
    })
  }

  /**
   * Set relations
   *
   * @param {object} parentObject,
   * @param {string} columnName
   * @param {object[]|string[]|string} childObjectsArray|childObjectIdArray|whereClause
   * @returns {Promise}
   **/

  setRelation = Utils.promisified('_setRelation')

  setRelationSync = Utils.synchronized('_setRelation')

  _setRelation() {
    return this._manageRelation('POST', arguments)
  }

  addRelation = Utils.promisified('_addRelation')

  addRelationSync = Utils.synchronized('_addRelation')

  _addRelation() {
    return this._manageRelation('PUT', arguments)
  }

  deleteRelation = Utils.promisified('_deleteRelation')

  deleteRelationSync = Utils.synchronized('_deleteRelation')

  _deleteRelation() {
    return this._manageRelation('DELETE', arguments)
  }

  _collectRelationObject(args) {
    const relation = {
      columnName: args[1]
    }

    const parent = args[0]

    if (Utils.isString(parent)) {
      relation.parentId = parent
    } else if (Utils.isObject(parent)) {
      relation.parentId = parent.objectId
    }

    const children = args[2]

    if (Utils.isString(children)) {
      relation.whereClause = children
    } else if (Utils.isArray(children)) {
      relation.childrenIds = children.map(function(child) {
        return Utils.isObject(child) ? child.objectId : child
      })
    }

    return relation
  }

  _validateRelationObject(relation) {
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
  }

  _manageRelation(method, args) {
    const relation = this._collectRelationObject(args)
    const responder = Utils.extractResponder(args)

    this._validateRelationObject(relation)

    return Backendless._ajax({
      method      : method,
      url         : this._buildRelationUrl(relation),
      isAsync     : !!responder,
      asyncHandler: responder,
      data        : relation.childrenIds && JSON.stringify(relation.childrenIds)
    })
  }

  _buildRelationUrl(relation) {
    let url = Urls.dataTable(this.className) + Utils.toUri(relation.parentId, relation.columnName)

    if (relation.whereClause) {
      url += '?' + Utils.toQueryParams({ where: relation.whereClause })
    }

    return url
  }

  bulkCreate = Utils.promisified('_bulkCreate')

  bulkCreateSync = Utils.synchronized('_bulkCreate')

  _bulkCreate(objectsArray, async) {
    this._validateBulkCreateArg(objectsArray)

    return Backendless._ajax({
      method      : 'POST',
      url         : Urls.dataBulkTable(this.className),
      data        : JSON.stringify(objectsArray),
      isAsync     : !!async,
      asyncHandler: async
    })
  }

  bulkUpdate = Utils.promisified('_bulkUpdate')

  bulkUpdateSync = Utils.synchronized('_bulkUpdate')

  _bulkUpdate(templateObject, whereClause, async) {
    this._validateBulkUpdateArgs(templateObject, whereClause)

    return Backendless._ajax({
      method      : 'PUT',
      url         : Urls.dataBulkTable(this.className) + '?' + Utils.toQueryParams({ where: whereClause }),
      data        : JSON.stringify(templateObject),
      isAsync     : !!async,
      asyncHandler: async
    })
  }

  bulkDelete = Utils.promisified('_bulkDelete')

  bulkDeleteSync = Utils.synchronized('_bulkDelete')

  _bulkDelete(objectsArray, async) {
    this._validateBulkDeleteArg(objectsArray)

    let whereClause
    let objects

    if (Utils.isString(objectsArray)) {
      whereClause = objectsArray
    } else if (Utils.isArray(objectsArray)) {
      objects = objectsArray.map(function(obj) {
        return Utils.isString(obj) ? obj : obj.objectId
      })
    }

    return Backendless._ajax({
      method      : 'DELETE',
      url         : Urls.dataBulkTable(this.className) + '?' + Utils.toQueryParams({ where: whereClause }),
      data        : objects && JSON.stringify(objects),
      isAsync     : !!async,
      asyncHandler: async
    })
  }

  _validateBulkCreateArg(objectsArray) {
    const MSG_ERROR = (
      'Invalid value for the "objectsArray" argument. ' +
      'The argument must contain only array of objects.'
    )

    if (!Utils.isArray(objectsArray)) {
      throw new Error(MSG_ERROR)
    }

    for (let i = 0; i < objectsArray.length; i++) {
      if (!Utils.isObject(objectsArray[i])) {
        throw new Error(MSG_ERROR)
      }
    }
  }

  _validateBulkUpdateArgs(templateObject, whereClause) {
    if (!templateObject || !Utils.isObject(templateObject)) {
      throw new Error('Invalid templateObject argument. The first argument must contain object')
    }

    if (!whereClause || !Utils.isString(whereClause)) {
      throw new Error('Invalid whereClause argument. The first argument must contain "whereClause" string.')
    }
  }

  _validateBulkDeleteArg(arg) {
    const MSG_ERROR = (
      'Invalid bulkDelete argument. ' +
      'The first argument must contain array of objects or array of id or "whereClause" string'
    )

    if (!arg || (!Utils.isArray(arg) && !Utils.isString(arg))) {
      throw new Error(MSG_ERROR)
    }

    for (let i = 0; i < arg.length; i++) {
      if (!Utils.isObject(arg[i]) && !Utils.isString(arg[i])) {
        throw new Error(MSG_ERROR)
      }
    }
  }

}
