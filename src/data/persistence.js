import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'
import DataStore from './data-store'
import Private from '../private'

const persistence = {

  save: Utils.promisified('_save'),

  saveSync: Utils.synchronized('_save'),

  _save: function(className, obj, async) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    if (Utils.isString(className)) {
      const url = Urls.dataTable(className)

      return Backendless._ajax({
        method      : 'POST',
        url         : url,
        data        : obj,
        isAsync     : isAsync,
        asyncHandler: responder
      })
    }

    if (Utils.isObject(className)) {
      return new DataStore(className)._save(className, obj, async)
    }
  },

  getView: Utils.promisified('_getView'),

  getViewSync: Utils.synchronized('_getView'),

  _getView: function(viewName, whereClause, pageSize, offset/**, async */) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    if (Utils.isString(viewName)) {
      let url = Urls.dataTable(viewName)

      if ((arguments.length > 1) && !(arguments[1] instanceof Async)) {
        url += '?'
      }
      if (Utils.isString(whereClause)) {
        url += 'where=' + whereClause
      } else {
        pageSize = whereClause
        offset = pageSize
      }
      if (Utils.isNumber(pageSize)) {
        url += '&' + new DataStore()._extractQueryOptions({
          pageSize: pageSize
        })
      }
      if (Utils.isNumber(offset)) {
        url += '&' + new DataStore()._extractQueryOptions({
          offset: offset
        })
      }

      return Backendless._ajax({
        method      : 'GET',
        url         : url,
        isAsync     : isAsync,
        asyncHandler: responder
      })
    } else {
      throw new Error('View name is required string parameter')
    }
  },

  callStoredProcedure: Utils.promisified('_callStoredProcedure'),

  callStoredProcedureSync: Utils.synchronized('_callStoredProcedure'),

  _callStoredProcedure: function(spName, argumentValues/**, async */) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    if (Utils.isString(spName)) {
      const url = Urls.dataTable(spName)
      const data = Utils.isObject(argumentValues) ? argumentValues : {}

      return Backendless._ajax({
        method      : 'POST',
        url         : url,
        data        : data,
        isAsync     : isAsync,
        asyncHandler: responder
      })
    } else {
      throw new Error('Stored Procedure name is required string parameter')
    }
  },

  of: function(model) {
    let tableName

    if (Utils.isString(model)) {
      tableName = model
    } else {
      tableName = Utils.getClassName(model)
    }

    let store = Private.getDataFromStore(tableName)

    if (!store) {
      store = new DataStore(model)
      Private.setDataToStore(tableName, store)
    }

    return store
  },

  describe: Utils.promisified('_describe'),

  describeSync: Utils.synchronized('_describe'),

  _describe: function(className, async) {
    className = Utils.isString(className) ? className : Utils.getClassName(className)

    return Backendless._ajax({
      method      : 'GET',
      url         : Urls.dataTableProps(className),
      isAsync     : !!async,
      asyncHandler: async
    })
  }
}

export default persistence