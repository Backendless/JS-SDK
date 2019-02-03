import Utils from '../../utils'
import Urls from '../../urls'
import Async from '../../request/async'
import Request from '../../request'

import QueryBuilder from '../query-builder'

import { parseFindResponse } from './parse'
import { extractQueryOptions } from './extract-query-options'

//TODO: refactor me

export function findUtil(className, Model, dataQuery, asyncHandler) {
  dataQuery = dataQuery || {}

  const query = []

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler, resp => parseFindResponse(resp, Model))
  }

  if (dataQuery.options) {
    query.push(extractQueryOptions(dataQuery.options))
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

  let url = Urls.dataTable(className)

  if (dataQuery.url) {
    url += '/' + dataQuery.url
  }

  if (query.length) {
    url += '?' + query.join('&')
  }

  const result = Request.get({
    url         : url,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler,
    cachePolicy : dataQuery.cachePolicy
  })

  if (asyncHandler) {
    return result
  }

  return parseFindResponse(result, Model)
}

export function find(dataQuery, asyncHandler) {
  if (dataQuery instanceof Async) {
    asyncHandler = dataQuery
    dataQuery = undefined
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler, resp => parseFindResponse(resp, this.model))
  }

  dataQuery = (dataQuery instanceof QueryBuilder)
    ? dataQuery.toJSON()
    : dataQuery

  dataQuery = Object.assign({}, dataQuery)

  if (Array.isArray(dataQuery.props)) {
    dataQuery.props = dataQuery.props.join(',')
  }

  if (Array.isArray(dataQuery.sortBy)) {
    dataQuery.sortBy = dataQuery.sortBy.join(',')
  }

  if (Array.isArray(dataQuery.groupBy)) {
    dataQuery.groupBy = dataQuery.groupBy.join(',')
  }

  if (Array.isArray(dataQuery.loadRelations)) {
    dataQuery.loadRelations = dataQuery.loadRelations.join(',')
  }

  const result = Request.post({
    url         : Urls.dataTableFind(this.className),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler,
    cachePolicy : dataQuery.cachePolicy,
    data        : dataQuery,
  })

  if (asyncHandler) {
    return result
  }

  return parseFindResponse(result, this.model)
}

export function findById() {
  let argsObj
  let responder = Utils.extractResponder(arguments)

  if (Utils.isString(arguments[0])) {
    argsObj = !(arguments[1] instanceof Async) ? (arguments[1] || {}) : {}
    argsObj.url = arguments[0]

    if (!argsObj.url) {
      throw new Error('missing argument "object ID" for method findById()')
    }

    return findUtil(this.className, this.model, argsObj, responder)
  } else if (Utils.isObject(arguments[0])) {
    argsObj = arguments[0]
    const url = Urls.dataTable(this.className)
    const isAsync = !!responder
    let send = '/pk?'

    for (const key in argsObj) {
      send += key + '=' + argsObj[key] + '&'
    }

    if (responder) {
      responder = Utils.wrapAsync(responder, resp => parseFindResponse(resp, this.model))
    }

    let result

    if (Utils.getClassName(arguments[0]) === 'Object') {
      result = Request.get({
        url         : url + send.replace(/&$/, ''),
        isAsync     : isAsync,
        asyncHandler: responder
      })
    } else {
      result = Request.put({
        url         : url,
        data        : argsObj,
        isAsync     : isAsync,
        asyncHandler: responder
      })
    }

    return isAsync ? result : parseFindResponse(result, this.model)
  }
}

export function findFirst(dataQuery, asyncHandler) {
  if (dataQuery instanceof Async) {
    asyncHandler = dataQuery
    dataQuery = {}
  }

  dataQuery.url = 'first'

  return findUtil(this.className, this.model, dataQuery, asyncHandler)
}

export function findLast(dataQuery, asyncHandler) {
  if (dataQuery instanceof Async) {
    asyncHandler = dataQuery
    dataQuery = {}
  }

  dataQuery.url = 'last'

  return findUtil(this.className, this.model, dataQuery, asyncHandler)
}
