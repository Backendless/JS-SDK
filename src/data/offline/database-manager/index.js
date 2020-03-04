import * as JsStore from 'jsstore'
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
  window['JsStoreWorker'] = require('jsstore/dist/jsstore.worker.commonjs2')
}

export const DataType = JsStore.DATA_TYPE

export const SyncModes = {
  AUTO     : 'AUTO',
  SEMI_AUTO: 'SEMI_AUTO',
  MANUAL   : 'MANUAL',
}

function prepareOfflineSyncResponse(dbTables, response) {
  const syncStatus = {
    successfulCompletion: {},
    failedCompletion    : {},
  }

  return response.forEach((status, i) => {
    syncStatus.successfulCompletion[dbTables[i]] = status.successfulCompletion
    syncStatus.failedCompletion[dbTables[i]] = status.failedCompletion
  })
}

export default class OfflineDBManager {
  constructor(app) {
    if (!Utils.isBrowser) {
      throw new Error('Offline DB is not available outside of browser')
    }

    this.__idbConnection = new JsStore.Connection()
    this.app = app
    this.DBName = `backendless_${ app.applicationId }`
    this.globalSyncMode = SyncModes.AUTO
    this.tablesSyncMode = {}
    this.isDbOpened = false

    this.openDb().then(() => {
      this.isDbOpened = true
    })

    onOnline(this.onNetworkEnabled.bind(this))
  }

  get connection() {
    return this.__idbConnection
  }

  isDbExist() {
    return this.connection.isDbExist(this.DBName)
  }

  async isTableExist(tableName) {
    const dbSchema = await this.connection.getDbSchema(this.DBName)

    return dbSchema && !!dbSchema.tables.find(table => table.name === tableName)
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
    if (this.tablesSyncMode[tableName] !== undefined) {
      return this.tablesSyncMode[tableName]
    }

    return this.globalSyncMode
  }

  async getDBTablesList() {
    const dbSchema = await this.connection.getDbSchema(this.DBName)

    return dbSchema ? dbSchema.tables : []
  }

  async addTable(tableName, columns) {
    if (!this.isDbOpened) {
      await this.openDb()
      this.isDbOpened = true
    }

    const [dbVersion, dbSchema] = await Promise.all([
      this.connection.getDbVersion(this.DBName),
      this.connection.getDbSchema(this.DBName)
    ])

    const dbTables = dbSchema ? dbSchema.tables : []
    const indexOfTable = dbTables.findIndex(table => table.name === tableName)
    const nextVersion = dbVersion + 1 // To say DB is must to update schema/tables, version should be incremented

    // transform existing table's columns from array to object
    // [{ name: 'columnName', dataType: 'string' }, ...] => { columnName: { dataType: 'string' }, ...}
    dbTables.forEach(table => {
      table.columns = table.columns.reduce((cols, column) => ({
        ...cols,
        [column.name]: column
      }), {})

      table.version = dbVersion
    })

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
    return this.connection.insert({
      into  : tableName,
      values: [convertBooleansToStrings(record)],
      upsert: true
    })
  }

  replaceLocalObject(tableName, record, blLocalId) {
    return Promise.all([
      this.connection.remove({
        from : tableName,
        where: {
          blLocalId
        }
      }),

      this.connection.insert({
        into  : tableName,
        values: [convertBooleansToStrings(record)]
      })
    ])
  }

  deleteLocalObject(tableName, record) {
    return this.connection.remove({
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
      return findFirst.call(this, tableName)
    }

    if (last) {
      return findLast.call(this, tableName)
    }

    if (byId) {
      return findById.call(this, tableName, dataQuery.url)
    }

    return findAll.call(this, tableName, dataQuery)
  }

  async storeFindResult(tableName, records, localStoragePolicy) {
    if (localStoragePolicy !== LocalStoragePolicy.DONOTSTOREANY) {
      const tableExists = await this.isTableExist(tableName)

      if (!tableExists) {
        await this.app.Data
          .of(tableName)
          .initLocalDatabase(DataQueryBuilder.create().setWhereClause('objectId is null'))
      }
    }

    if (localStoragePolicy === LocalStoragePolicy.STOREALL) {
      await this.storeAllFindResults(tableName, records)
    }

    if (localStoragePolicy === LocalStoragePolicy.STOREUPDATED) {
      await this.storeUpdatedFindResults(tableName, records)
    }
  }

  storeAllFindResults(tableName, records) {
    const objectsToStore = Utils.castArray(records).map(record => {
      return convertBooleansToStrings({ ...record, blLocalId: record.objectId })
    })

    return this.connection.insert({
      into  : tableName,
      values: objectsToStore,
      upsert: true
    })
  }

  storeUpdatedFindResults(tableName, records) {
    return Promise.all(Utils.castArray(records).map(record => this.connection.update({
      in   : tableName,
      set  : { ...convertBooleansToStrings(record), blLocalId: record.objectId },
      where: { objectId: record.objectId }
    })))
  }

  async onNetworkEnabled() {
    const dbTables = await this.getDBTablesList()
    const tablesToSync = []

    dbTables.forEach(table => {
      if (this.getTableSyncMode(table.name) === SyncModes.AUTO) {
        tablesToSync.push(table.name)
      }
    })

    for (const table of tablesToSync) {
      await executeTransactions.call(this, table)
    }
  }

  async startOfflineSync(tableName) {
    if (tableName) {
      return executeTransactions.call(this, tableName)
    }

    const dbTables = await this.getDBTablesList()

    const response = await Promise.all(dbTables.map(table => executeTransactions.call(this, table.name)))

    return prepareOfflineSyncResponse(dbTables, response)
  }

  async initJsStore(tables = []) {
    await this.connection.initDb({
      name: this.DBName,
      tables
    })
  }

  async openDb() {
    if (await this.connection.isDbExist(this.DBName)) {
      await this.connection.openDb(this.DBName)
    }
  }
}
