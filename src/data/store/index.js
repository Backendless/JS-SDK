import Utils from '../../utils'
import { deprecated } from '../../decorators'
import { resolveModelClassFromString } from '../utils'
import EventHandler from '../rt-store'

import { loadRelations, setRelation, addRelation, deleteRelation } from './relations'
import { bulkCreate, bulkUpdate, bulkDelete } from './bulk'
import { find, findById, findFirst, findLast } from './find'
import { save } from './save'
import { remove } from './remove'
import { getObjectCount } from './count'

//TODO: will be removed when remove sync methods
const namespaceLabel = 'Backendless.Data.of(<ClassName>)'

class DataStore {

  constructor(model) {
    if (Utils.isString(model)) {
      this.className = model
      this.model = resolveModelClassFromString(this.className)

    } else {
      this.className = Utils.getClassName(model)
      this.model = model
    }

    if (!this.className) {
      throw new Error('Class name should be specified')
    }
  }

  rt() {
    return this.eventHandler = this.eventHandler || new EventHandler(this)
  }
}

Object.assign(DataStore.prototype, {

  @deprecated(namespaceLabel, `${namespaceLabel}.save`)
  saveSync: Utils.synchronized(save),
  save    : Utils.promisified(save),

  @deprecated(namespaceLabel, `${namespaceLabel}.remove`)
  removeSync: Utils.synchronized(remove),
  remove    : Utils.promisified(remove),

  @deprecated(namespaceLabel, `${namespaceLabel}.find`)
  findSync: Utils.synchronized(find),
  find    : Utils.promisified(find),

  @deprecated(namespaceLabel, `${namespaceLabel}.findById`)
  findByIdSync: Utils.synchronized(findById),
  findById    : Utils.promisified(findById),

  @deprecated(namespaceLabel, `${namespaceLabel}.loadRelations`)
  loadRelationsSync: Utils.synchronized(loadRelations),
  loadRelations    : Utils.promisified(loadRelations),

  @deprecated(namespaceLabel, `${namespaceLabel}.findFirst`)
  findFirstSync: Utils.synchronized(findFirst),
  findFirst    : Utils.promisified(findFirst),

  @deprecated(namespaceLabel, `${namespaceLabel}.findLast`)
  findLastSync: Utils.synchronized(findLast),
  findLast    : Utils.promisified(findLast),

  @deprecated(namespaceLabel, `${namespaceLabel}.getObjectCount`)
  getObjectCountSync: Utils.synchronized(getObjectCount),
  getObjectCount    : Utils.promisified(getObjectCount),

  @deprecated(namespaceLabel, `${namespaceLabel}.setRelation`)
  setRelationSync: Utils.synchronized(setRelation),
  setRelation    : Utils.promisified(setRelation),

  @deprecated(namespaceLabel, `${namespaceLabel}.addRelation`)
  addRelationSync: Utils.synchronized(addRelation),
  addRelation    : Utils.promisified(addRelation),

  @deprecated(namespaceLabel, `${namespaceLabel}.deleteRelation`)
  deleteRelationSync: Utils.synchronized(deleteRelation),
  deleteRelation    : Utils.promisified(deleteRelation),

  @deprecated(namespaceLabel, `${namespaceLabel}.bulkCreate`)
  bulkCreateSync: Utils.synchronized(bulkCreate),
  bulkCreate    : Utils.promisified(bulkCreate),

  @deprecated(namespaceLabel, `${namespaceLabel}.bulkUpdate`)
  bulkUpdateSync: Utils.synchronized(bulkUpdate),
  bulkUpdate    : Utils.promisified(bulkUpdate),

  @deprecated(namespaceLabel, `${namespaceLabel}.bulkDelete`)
  bulkDeleteSync: Utils.synchronized(bulkDelete),
  bulkDelete    : Utils.promisified(bulkDelete),

})

export default DataStore