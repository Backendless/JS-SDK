import { OperationType } from './constants'
import { OpResult } from './op-result'

function resolveOpResultValueReference(uow, value) {
  if (Array.isArray(value)) {
    return value.map(item => resolveOpResultValueReference(uow, item))
  }

  if (value && typeof value === 'object') {
    if (value.___ref) {
      const opResult = uow.getOpResultById(value.opResultId)

      if (value.resultIndex !== undefined) {
        return opResult.resolveTo(value.resultIndex, value.propName)
      }

      if (value.propName !== undefined) {
        return opResult.resolveTo(value.propName)
      }

      return opResult
    }

    const result = {}

    for (const prop in value) {
      result[prop] = resolveOpResultValueReference(uow, value[prop])
    }

    return result
  }

  return value
}

export const OperationJSONAdapter = {

  CREATE: (uow, { table, payload }) => uow.create.call(uow, table, resolveOpResultValueReference(uow, payload)),

  DELETE: (uow, { table, payload }) => uow.delete.call(uow, table, resolveOpResultValueReference(uow, payload)),

  UPDATE: (uow, { table, payload }) => uow.update.call(uow, table, resolveOpResultValueReference(uow, payload)),

  UPSERT: (uow, { table, payload }) => uow.upsert.call(uow, table, resolveOpResultValueReference(uow, payload)),

  UPDATE_BULK: (uow, { table, payload }) => {
    const args = baseBulkArgs(uow, { table, payload })

    args.push(resolveOpResultValueReference(uow, payload.changes))

    return uow.bulkUpdate.apply(uow, args)
  },

  DELETE_BULK: (uow, { table, payload }) => {
    const args = baseBulkArgs(uow, { table, payload })

    return uow.bulkDelete.apply(uow, args)
  },

  CREATE_BULK: (uow, { table, payload }) => {
    return uow.bulkCreate.call(uow, table, resolveOpResultValueReference(uow, payload))
  },

  UPSERT_BULK: (uow, { table, payload }) => {
    return uow.bulkUpsert.call(uow, table, resolveOpResultValueReference(uow, payload))
  },

  SET_RELATION: (uow, { table, payload }) => updateRelations(uow, 'setRelation', { table, payload }),

  DELETE_RELATION: (uow, { table, payload }) => updateRelations(uow, 'deleteRelation', { table, payload }),

  ADD_RELATION: (uow, { table, payload }) => updateRelations(uow, 'addToRelation', { table, payload }),

  FIND: (uow, { table, payload }) => (
    uow.addOperations(OperationType.FIND, table, payload)
  ),
}

function baseBulkArgs(uow, { table, payload }) {
  const args = []

  if (payload.conditional) {
    args.push(table)
    args.push(payload.conditional)
  } else {
    const opRef = resolveOpResultValueReference(uow, payload.unconditional)

    if (opRef instanceof OpResult) {
      args.push(opRef)
    } else {
      args.push(table)
      args.push(opRef)
    }
  }

  return args
}

function updateRelations(uow, method, { table, payload }) {
  const args = [table]

  if (typeof payload.parentObject === 'string') {
    args.push({ objectId: payload.parentObject })
  } else {
    args.push(resolveOpResultValueReference(uow, payload.parentObject))
  }

  args.push(payload.relationColumn)
  args.push(payload.conditional || resolveOpResultValueReference(uow, payload.unconditional))

  return uow[method].apply(uow, args)
}
