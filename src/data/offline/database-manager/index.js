import * as JsStore from 'jsstore'
import * as JsStoreWorker from 'jsstore/dist/jsstore.worker.commonjs2'
import Data from '../../../data'
import Utils from '../../../utils'
import DataQueryBuilder from '../../query-builder'
import { onOnline } from '../network'
import { LocalStoragePolicy } from '../policy'
import { executeTransactions } from '../transactions'
import { findAll } from './find-all'
import { findById } from './find-by-id'
import { findFirst } from './find-first'
import { findLast } from './find-last'
import { convertBooleansToStrings } from './utils'

if (Utils.isBrowser) {
  window['JsStoreWorker'] = JsStoreWorker
}

export const idbConnection = Utils.isBrowser && new JsStore.Connection()
export const DBName = 'backendless'
export const DataType = JsStore.DATA_TYPE

window.idbConnection = idbConnection

export const SyncModes = {
  AUTO     : 'AUTO',
  SEMI_AUTO: 'SEMI_AUTO',
  MANUAL   : 'MANUAL',
}

const getDBTablesList = async () => {
  const dbSchema = await idbConnection.getDbSchema(DBName)

  return dbSchema ? dbSchema.tables : []
}

function storeAllFindResults(tableName, records) {
  const objectsToStore = Utils.castArray(records).map(record => ({ ...record, blLocalId: record.objectId }))

  return idbConnection.insert({
    into  : tableName,
    values: objectsToStore,
    upsert: true
  })
}

function storeUpdatedFindResults(tableName, records) {
  return Promise.all(Utils.castArray(records).map(record => idbConnection.update({
    in   : tableName,
    set  : { ...record, blLocalId: record.objectId },
    where: { objectId: record.objectId }
  })))
}

class DatabaseManager {
  constructor() {
    if (!Utils.isBrowser) {
      throw new Error('Offline DB is not available outside of browser')
    }

    this.globalSyncMode = SyncModes.AUTO
    this.tablesSyncMode = {}

    onOnline(this.onNetworkEnabled.bind(this))
  }

  async isTableExist(tableName) {
    const dbSchema = await idbConnection.getDbSchema(DBName)

    return dbSchema.tables && !!dbSchema.tables.find(table => table.name === tableName)
  }

  async addTable(tableName, columns) {
    const [dbVersion, dbSchema] = await Promise.all([
      idbConnection.getDbVersion(DBName),
      idbConnection.getDbSchema(DBName)
    ])

    const dbTables = dbSchema ? dbSchema.tables : []
    const nextVersion = dbVersion + 1 // To say DB is must to update schema/tables, version should be incremented

    dbTables.forEach(table => {
      table.columns = table.columns.reduce((cols, column) => ({
        ...cols,
        [column.name]: column
      }), {})

      table.primaryKey = 'blLocalId'
      table.version = nextVersion
    })

    const indexOfTable = dbTables.findIndex(table => table.name === tableName)

    const table = {
      name      : tableName,
      columns   : columns,
      version   : nextVersion,
      primaryKey: 'blLocalId'
    }

    if (indexOfTable !== -1) {
      dbTables[indexOfTable] = table
    } else {
      dbTables.push(table)
    }

    await this.initJsStore(dbTables)
  }

  upsertObject(tableName, record) {
    return idbConnection.insert({
      into  : tableName,
      values: [convertBooleansToStrings(record)],
      upsert: true
    })
  }

  replaceLocalObject(tableName, record, blLocalId) {
    return Promise.all([
      idbConnection.remove({
        from : tableName,
        where: {
          blLocalId
        }
      }),
      idbConnection.insert({
        into  : tableName,
        values: [convertBooleansToStrings(record)]
      })
    ])
  }

  deleteLocalObject(tableName, record) {
    return idbConnection.remove({
      from : tableName,
      where: { blLocalId: record.blLocalId || record.objectId }
    })
  }

  async find(tableName, dataQuery) {
    const url = dataQuery && dataQuery.url
    const first = url === 'first'
    const last = url === 'last'
    const byId = url && !first && !last

    if (first) {
      return findFirst(tableName)
    }

    if (last) {
      return findLast(tableName)
    }

    if (byId) {
      return findById(tableName, dataQuery.url)
    }

    return findAll(tableName, dataQuery)
  }

  async storeFindResult(tableName, records, localStoragePolicy) {
    if (localStoragePolicy !== LocalStoragePolicy.DONOTSTOREANY) {
      const tableExists = await this.isTableExist(tableName)

      if (!tableExists) {
        await Data.of(tableName).initLocalDatabase(DataQueryBuilder.create().setWhereClause('objectId is null'))
      }
    }

    if (localStoragePolicy === LocalStoragePolicy.STOREALL) {
      await storeAllFindResults(tableName, records)
    }

    if (localStoragePolicy === LocalStoragePolicy.STOREUPDATED) {
      await storeUpdatedFindResults(tableName, records)
    }
  }

  setGlobalSyncMode(globalSyncMode) {
    this.globalSyncMode = globalSyncMode
  }

  getGlobalSyncMode() {
    return this.globalSyncMode
  }

  setTableSyncMode(tableName, syncMode) {
    this.tablesSyncMode[tableName] = syncMode
  }

  getTableSyncMode(tableName) {
    return this.tablesSyncMode[tableName] || this.globalSyncMode
  }

  async onNetworkEnabled() {
    const dbTables = await getDBTablesList()
    const tablesToSync = []

    dbTables.forEach(table => {
      if (this.getTableSyncMode(table.name) === SyncModes.AUTO) {
        tablesToSync.push(table.name)
      }
    })

    let promiseChain = Promise.resolve()

    tablesToSync.forEach(tableName => {
      promiseChain = promiseChain.then(() => executeTransactions(tableName))
    })

    return promiseChain
  }

  async startOfflineSync(tableName) {
    if (tableName) {
      return executeTransactions(tableName)
    }

    const dbTables = await getDBTablesList()

    const syncStatus = {
      successfulCompletion: {},
      failedCompletion    : {},
    }

    const syncStatuses = await Promise.all(dbTables.map(table => executeTransactions(table.name)))

    syncStatuses.forEach((status, i) => {
      syncStatus.successfulCompletion[dbTables[i]] = status.successfulCompletion
      syncStatus.failedCompletion[dbTables[i]] = status.failedCompletion
    })

    return syncStatus
  }

  getDb(tables) {
    return {
      name: DBName,
      tables
    }
  }

  async initJsStore(tables = []) {
    await idbConnection.initDb(this.getDb(tables))
  }
}

export const DBManager = new DatabaseManager()