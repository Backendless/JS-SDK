import { deprecated } from '../../decorators'
import Utils from '../../utils'
import { ActionTypes, callbackManager } from '../offline/callback-manager'
import { SyncModes } from '../offline/database-manager'
import { initLocalDatabase } from '../offline/database-manager/init-local-database'
import EventHandler from '../rt-store'
import { resolveModelClassFromString } from '../utils'
import { bulkCreate, bulkDelete, bulkUpdate } from './bulk'
import { getObjectCount } from './count'
import fetchAll from './fetch-all'
import { find, findById, findFirst, findLast } from './find'

import { addRelation, deleteRelation, loadRelations, setRelation } from './relations'
import { remove } from './remove'
import { removeEventually } from './remove-eventually'
import { save } from './save'
import { saveEventually } from './save-eventually'

const checkIfOfflineEnabled = () => {
  if (!Utils.isBrowser) {
    throw new Error('Offline DB is not available outside of browser')
  }
}

//TODO: will be removed when remove sync methods
const namespaceLabel = 'Backendless.Data.of(<ClassName>)'

class DataStore {
  constructor(model, classToTableMap, app) {
    this.classToTableMap = classToTableMap

    if (Utils.isString(model)) {
      this.className = model
      this.model = classToTableMap[this.className] || resolveModelClassFromString(this.className)

    } else {
      this.className = Utils.getClassName(model)
      this.model = classToTableMap[this.className] || model
    }

    if (!this.className) {
      throw new Error('Class name should be specified')
    }

    this.app = app
  }

  rt() {
    return this.eventHandler = this.eventHandler || new EventHandler(this, this.app)
  }

  async clearLocalDatabase() {
    checkIfOfflineEnabled()

    await this.app.OfflineDBManager.connection.clear(this.className)
  }

  onSave(onSuccess, onError) {
    callbackManager.register(ActionTypes.SAVE, this.className, [onSuccess, onError])
  }

  onRemove(onSuccess, onError) {
    callbackManager.register(ActionTypes.DELETE, this.className, [onSuccess, onError])
  }

  enableAutoSync() {
    checkIfOfflineEnabled()

    this.app.OfflineDBManager.setTableSyncMode(this.className, SyncModes.AUTO)
  }

  disableAutoSync() {
    checkIfOfflineEnabled()

    this.app.OfflineDBManager.setTableSyncMode(this.className, null)
  }

  isAutoSyncEnabled() {
    checkIfOfflineEnabled()

    return this.app.OfflineDBManager.getTableSyncMode(this.className) === SyncModes.AUTO
  }

  startOfflineSync() {
    checkIfOfflineEnabled()

    return this.app.OfflineDBManager.startOfflineSync(this.className)
  }
}

Object.assign(DataStore.prototype, {

  @deprecated(namespaceLabel, `${ namespaceLabel }.save`)
  saveSync: Utils.synchronized(save),
  save    : Utils.promisified(save),

  @deprecated(namespaceLabel, `${ namespaceLabel }.remove`)
  removeSync: Utils.synchronized(remove),
  remove    : Utils.promisified(remove),

  @deprecated(namespaceLabel, `${ namespaceLabel }.find`)
  findSync: Utils.synchronized(find),
  find    : Utils.promisified(find),

  @deprecated(namespaceLabel, `${ namespaceLabel }.findById`)
  findByIdSync: Utils.synchronized(findById),
  findById    : Utils.promisified(findById),

  @deprecated(namespaceLabel, `${ namespaceLabel }.loadRelations`)
  loadRelationsSync: Utils.synchronized(loadRelations),
  loadRelations    : Utils.promisified(loadRelations),

  @deprecated(namespaceLabel, `${ namespaceLabel }.findFirst`)
  findFirstSync: Utils.synchronized(findFirst),
  findFirst    : Utils.promisified(findFirst),

  @deprecated(namespaceLabel, `${ namespaceLabel }.findLast`)
  findLastSync: Utils.synchronized(findLast),
  findLast    : Utils.promisified(findLast),

  @deprecated(namespaceLabel, `${ namespaceLabel }.getObjectCount`)
  getObjectCountSync: Utils.synchronized(getObjectCount),
  getObjectCount    : Utils.promisified(getObjectCount),

  @deprecated(namespaceLabel, `${ namespaceLabel }.setRelation`)
  setRelationSync: Utils.synchronized(setRelation),
  setRelation    : Utils.promisified(setRelation),

  @deprecated(namespaceLabel, `${ namespaceLabel }.addRelation`)
  addRelationSync: Utils.synchronized(addRelation),
  addRelation    : Utils.promisified(addRelation),

  @deprecated(namespaceLabel, `${ namespaceLabel }.deleteRelation`)
  deleteRelationSync: Utils.synchronized(deleteRelation),
  deleteRelation    : Utils.promisified(deleteRelation),

  @deprecated(namespaceLabel, `${ namespaceLabel }.bulkCreate`)
  bulkCreateSync: Utils.synchronized(bulkCreate),
  bulkCreate    : Utils.promisified(bulkCreate),

  @deprecated(namespaceLabel, `${ namespaceLabel }.bulkUpdate`)
  bulkUpdateSync: Utils.synchronized(bulkUpdate),
  bulkUpdate    : Utils.promisified(bulkUpdate),

  @deprecated(namespaceLabel, `${ namespaceLabel }.bulkDelete`)
  bulkDeleteSync: Utils.synchronized(bulkDelete),
  bulkDelete    : Utils.promisified(bulkDelete),

  fetchAll: fetchAll,

  initLocalDatabase: initLocalDatabase,

  saveEventually: saveEventually,

  removeEventually: removeEventually
})

export default DataStore
