export const DBOperations = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
}

export const DataRetrievalPolicy = {
  OFFLINEONLY: 'OFFLINEONLY', // Retrieve from the local db only, regardless of the connection status
  ONLINEONLY : 'ONLINEONLY', // Retrieve from the remote db only regardless of the connection status
  DYNAMIC    : 'DYNAMIC', // Retrieve from local db only if disconnected, otherwise retrieve from the remote database
}

export const LocalStoragePolicy = {
  STOREALL     : 'STOREALL', // Store all data retrieved from remote in the local database
  DONOTSTOREANY: 'DONOTSTOREANY', // Do not store any data retrieved from remote in the local database
  STOREUPDATED : 'STOREUPDATED', // Stores in the local db only those objects retrieved from remote,
  // which already exist in local
}

export const SyncModes = {
  AUTO     : 'AUTO',
  SEMI_AUTO: 'SEMI_AUTO',
  MANUAL   : 'MANUAL',
}
