import Utils from '../../utils'
import Request from '../../request'
import Urls from '../../urls'

import LoadRelationsQueryBuilder from '../load-relations-query-builder'

import { extractQueryOptions } from './extract-query-options'
import { parseFindResponse } from './parse'

//TODO: refactor me

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

function manageRelation(method, className, parent, columnName, children, asyncHandler) {
  const relation = collectRelationObject(parent, columnName, children)
  const responder = asyncHandler

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

  return Request.send({
    method      : method,
    url         : buildRelationUrl(className, relation),
    isAsync     : !!responder,
    asyncHandler: responder,
    data        : relation.childrenIds
  })
}

function buildRelationUrl(className, relation) {
  let url = Urls.dataTableObjectRelation(className, relation.parentId, relation.columnName)

  if (relation.whereClause) {
    url += '?' + Utils.toQueryParams({ whereClause: relation.whereClause })
  }

  return url
}

export function loadRelations(parentObjectId, queryBuilder, asyncHandler) {
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

  let url = Urls.dataTableObjectRelation(this.className, parentObjectId, relationName)

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler, resp => parseFindResponse(resp, dataQuery.relationModel))
  }

  if (query.length) {
    url += '?' + query.join('&')
  }

  const result = Request.get({
    url         : url,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })

  if (asyncHandler) {
    return result
  }

  return parseFindResponse(result, dataQuery.relationModel)
}

export function setRelation(parent, columnName, children, asyncHandler) {
  return manageRelation('POST', this.className, parent, columnName, children, asyncHandler)
}

export function addRelation(parent, columnName, children, asyncHandler) {
  return manageRelation('PUT', this.className, parent, columnName, children, asyncHandler)
}

export function deleteRelation(parent, columnName, children, asyncHandler) {
  return manageRelation('DELETE', this.className, parent, columnName, children, asyncHandler)
}
