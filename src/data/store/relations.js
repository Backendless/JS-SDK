import Utils from '../../utils'
import Request from '../../request'
import Urls from '../../urls'

import LoadRelationsQueryBuilder from '../load-relations-query-builder'

import { extractQueryOptions } from './extract-query-options'
import { parseFindResponse } from './parse'

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

function manageRelation(method, className, parent, columnName, children, async) {
  const relation = collectRelationObject(parent, columnName, children)
  const responder = async

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
  let url = Urls.dataTable(className) + Utils.toUri(relation.parentId, relation.columnName)

  if (relation.whereClause) {
    url += '?' + Utils.toQueryParams({ where: relation.whereClause })
  }

  return url
}

export function loadRelations(parentObjectId, queryBuilder/**, async */) {
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

  let whereClause
  let options
  const query = []

  if (dataQuery.condition) {
    whereClause = 'where=' + encodeURIComponent(dataQuery.condition)
  }

  if (dataQuery.options) {
    options = extractQueryOptions(dataQuery.options)
  }

  options && query.push(options)
  whereClause && query.push(whereClause)

  const relationModel = dataQuery.relationModel || null
  let responder = Utils.extractResponder(arguments)
  let url = Urls.dataTable(this.className) + Utils.toUri(parentObjectId, relationName)

  if (responder) {
    responder = Utils.wrapAsync(responder, resp => parseFindResponse(resp, relationModel))
  }

  if (query.length) {
    url += '?' + query.join('&')
  }

  const result = Request.get({
    url         : url,
    isAsync     : !!responder,
    asyncHandler: responder
  })

  return !!responder ? result : parseFindResponse(result, relationModel)
}

export function setRelation(parent, columnName, children, async) {
  return manageRelation('POST', this.className, parent, columnName, children, async)
}

export function addRelation(parent, columnName, children, async) {
  return manageRelation('PUT', this.className, parent, columnName, children, async)
}

export function deleteRelation(parent, columnName, children, async) {
  return manageRelation('DELETE', this.className, parent, columnName, children, async)
}
