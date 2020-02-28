import Utils from '../../utils'
import Async from '../../request/async'

import QueryBuilder from '../query-builder'

import { parseFindResponse } from './parse'
import { extractQueryOptions } from './extract-query-options'


//TODO: refactor me

function findUtil(url, Model, dataQuery, asyncHandler) {
  dataQuery = dataQuery || {}

  const dataQueryURL = dataQuery.url

  if (dataQuery instanceof QueryBuilder) {
    dataQuery = dataQuery.build()
  }

  const query = []

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler, resp => parseFindResponse(resp, Model, this.classToTableMap))
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

  if (dataQueryURL) {
    url += '/' + dataQueryURL
  }

  if (query.length) {
    url += '?' + query.join('&')
  }

  const result = this.app.request.get({
    url,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler,
    cachePolicy : dataQuery.cachePolicy
  })

  if (asyncHandler) {
    return result
  }

  return parseFindResponse(result, Model, this.classToTableMap)
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
  const url = this.app.urls.dataTable(this.className)

  return findUtil.call(this, url, this.model, dataQuery, asyncHandler, this.classToTableMap)
}

export function findById() {
  let argsObj
  let responder = Utils.extractResponder(arguments)

  const url = this.app.urls.dataTable(this.className)

  if (Utils.isString(arguments[0])) {
    argsObj = !(arguments[1] instanceof Async) ? (arguments[1] || {}) : {}
    argsObj.url = arguments[0]

    if (!argsObj.url) {
      throw new Error('missing argument "object ID" for method findById()')
    }

    return findUtil.call(this, url, this.model, argsObj, responder, this.classToTableMap)
  } else if (Utils.isObject(arguments[0])) {
    argsObj = arguments[0]
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
      result = this.app.request.get({
        url         : url + send.replace(/&$/, ''),
        isAsync     : isAsync,
        asyncHandler: responder
      })
    } else {
      result = this.app.request.put({
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

  const url = this.app.urls.dataTable(this.className)

  return findUtil.call(this, url, this.model, dataQuery, asyncHandler, this.classToTableMap)
}

export function findLast(dataQuery, asyncHandler) {
  if (dataQuery instanceof Async) {
    asyncHandler = dataQuery
    dataQuery = {}
  }

  dataQuery.url = 'last'

  const url = this.app.urls.dataTable(this.className)

  return findUtil.call(this, url, this.model, dataQuery, asyncHandler, this.classToTableMap)
}
