import Utils from '../../utils'
import Urls from '../../urls'
import Async from '../../request/async'
import Request from '../../request'

import QueryBuilder from '../query-builder'

import { parseFindResponse } from './parse'
import { extractQueryOptions } from './extract-query-options'

export function findUtil(className, Model, dataQuery, asyncHandler) {
  dataQuery = dataQuery || {}

  let props
  let whereClause
  let options
  const query = []
  let url = Urls.dataTable(className)

  if (dataQuery.properties && dataQuery.properties.length) {
    props = 'props=' + Utils.encodeArrayToUriComponent(dataQuery.properties)
  }

  if (dataQuery.condition) {
    whereClause = 'where=' + encodeURIComponent(dataQuery.condition)
  }

  if (dataQuery.options) {
    options = extractQueryOptions(dataQuery.options)
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler, resp => parseFindResponse(resp, Model))
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

export function find(queryBuilder, asyncHandler) {
  //TODO: add an ability to get object as QueryBuilder

  if (queryBuilder instanceof Async) {
    asyncHandler = queryBuilder
    queryBuilder = undefined
  }

  if (queryBuilder && !(queryBuilder instanceof QueryBuilder)) {
    throw new Error('The first argument should be instance of Backendless.DataQueryBuilder')
  }

  const dataQuery = queryBuilder ? queryBuilder.build() : {}

  return findUtil(this.className, this.model, dataQuery, asyncHandler)
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
  } else {
    throw new Error('Invalid value for the "value" argument. The argument must contain only string or object values')
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
