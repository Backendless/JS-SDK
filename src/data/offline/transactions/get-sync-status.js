import { DBOperations } from '../constants'

export const getSyncStatus = result => {
  const syncStatus = {
    successfulCompletion: {
      created: [],
      updated: [],
      deleted: [],
    },
    failedCompletion    : {
      createErrors: [],
      updateErrors: [],
      deleteErrors: [],
    }
  }

  result.forEach(({ object, status, blPendingOperation, errorMessage }) => {
    if (status === 'success') {
      const prop = blPendingOperation === DBOperations.CREATE
        ? 'created'
        : blPendingOperation === DBOperations.UPDATE
          ? 'updated'
          : 'deleted'

      syncStatus.successfulCompletion[prop].push(object)
    }

    if (status === 'error') {
      const prop = blPendingOperation === DBOperations.CREATE
        ? 'createErrors'
        : blPendingOperation === DBOperations.UPDATE
          ? 'updateErrors'
          : 'deleteErrors'

      syncStatus.failedCompletion[prop].push({ object, error: errorMessage })
    }
  })

  return syncStatus
}
