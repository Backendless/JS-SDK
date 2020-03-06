import Async from '../../request/async'
import Utils from '../../utils'

import { isOnline } from '../offline/network'
import { DataRetrievalPolicy, LocalStoragePolicy } from '../offline/constants'

import QueryBuilder from '../query-builder'
import { extractQueryOptions } from './extract-query-options'

import { parseFindResponse } from './parse'

//TODO: refactor me

function getRetrievalPolicy(dataQuery) {
  return dataQuery instanceof QueryBuilder
    ? dataQuery.getRetrievalPolicy()
    : this.app.Data.RetrievalPolicy
}

function getLocalStoragePolicy(dataQuery) {
  return dataQuery instanceof QueryBuilder
    ? dataQuery.getStoragePolicy()
    : this.app.Data.LocalStoragePolicy
}

function shouldSearchLocally(dataQuery) {
  if (!Utils.isBrowser) {
    return false
  }

  const retrievalPolicy = getRetrievalPolicy.call(this, dataQuery)

  return retrievalPolicy === DataRetrievalPolicy.OFFLINEONLY
    || (!isOnline() && retrievalPolicy === DataRetrievalPolicy.DYNAMIC)
}

function buildURL(dataQuery) {
  const dataQueryURL = dataQuery.url

  if (dataQuery instanceof QueryBuilder) {
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

  if (dataQuery.properties && dataQuery.properties.length) {
    query.push('props=' + Utils.encodeArrayToUriComponent(dataQuery.properties))
  }

  let url = this.app.urls.dataTable(this.className)

  if (dataQueryURL) {
    url += '/' + dataQueryURL
  }

  if (query.length) {
    url += '?' + query.join('&')
  }

  return url
}

export function findUtil(dataQuery, asyncHandler) {
  const searchLocally = shouldSearchLocally.call(this, dataQuery)
  const localStoragePolicy = getLocalStoragePolicy.call(this, dataQuery)
  const shouldStoreResult = Utils.isBrowser && !searchLocally && localStoragePolicy !== LocalStoragePolicy.DONOTSTOREANY

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler, resp => {
      if (shouldStoreResult) {
        this.app.OfflineDBManager
          .storeFindResult(this.className, resp, localStoragePolicy)
          .catch(err => console.log(err))
      }

      return parseFindResponse(resp, this.model, this.classToTableMap)
    })
  }

  if (searchLocally) {
    return this.app.OfflineDBManager
      .find(this.className, dataQuery)
      .then(result => asyncHandler.success(result))
      .catch(error => asyncHandler.fault(error))
  }

  dataQuery = dataQuery || {}

  const url = buildURL.call(this, dataQuery)

  const result = this.app.request.get({
    url,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler,
    cachePolicy : dataQuery.cachePolicy
  })

  if (asyncHandler) {
    return result
  }

  return parseFindResponse(result, this.model, this.classToTableMap)
}

export function find(queryBuilder, asyncHandler) {
  //TODO: add an ability to get object as QueryBuilder

  if (queryBuilder instanceof Async) {
    asyncHandler = queryBuilder
    queryBuilder = undefined
  }

  return findUtil.call(this, queryBuilder, asyncHandler)
}

export function findById() {
  let dataQuery
  let asyncHandler = Utils.extractResponder(arguments)

  const url = this.app.urls.dataTable(this.className)

  if (Utils.isString(arguments[0])) {
    dataQuery = !(arguments[1] instanceof Async) ? (arguments[1] || {}) : {}
    dataQuery.url = arguments[0]

    if (!dataQuery.url) {
      throw new Error('missing argument "object ID" for method findById()')
    }

    return findUtil.call(this, dataQuery, asyncHandler)
  }

  if (Utils.isObject(arguments[0])) {
    dataQuery = arguments[0]
    const isAsync = !!asyncHandler
    let query = '/pk?'

    for (const key in dataQuery) {
      query += key + '=' + dataQuery[key] + '&'
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler, resp => {
        return parseFindResponse(resp, this.model, this.classToTableMap)
      })
    }

    let result

    if (Utils.getClassName(arguments[0]) === 'Object') {
      result = this.app.request.get({
        url         : url + query.replace(/&$/, ''),
        isAsync     : isAsync,
        asyncHandler: asyncHandler
      })
    } else {
      result = this.app.request.put({
        url         : url,
        data        : dataQuery,
        isAsync     : isAsync,
        asyncHandler: asyncHandler
      })
    }

    return isAsync ? result : parseFindResponse(result, this.model, this.classToTableMap)
  }
}

export function findFirst(dataQuery, asyncHandler) {
  if (dataQuery instanceof Async) {
    asyncHandler = dataQuery
    dataQuery = {}
  }

  dataQuery.url = 'first'

  return findUtil.call(this, dataQuery, asyncHandler)
}

export function findLast(dataQuery, asyncHandler) {
  if (dataQuery instanceof Async) {
    asyncHandler = dataQuery
    dataQuery = {}
  }

  dataQuery.url = 'last'

  return findUtil.call(this, dataQuery, asyncHandler)
}
