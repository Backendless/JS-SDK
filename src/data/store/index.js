import Backendless from '../../bundle'
import Utils from '../../utils'

import { loadRelations, setRelation, addRelation, deleteRelation } from './relations'
import { bulkCreate, bulkUpdate, bulkDelete } from './bulk'
import { find, findById, findFirst, findLast } from './find'
import { save } from './save'
import { remove } from './remove'
import { getObjectCount } from './count'

const createModelClassFromString = (/** className */) => {
  //TODO:fix me
  return function() {
  }
}

class DataStore {

  constructor(model) {
    if (Utils.isString(model)) {
      this.className = model
      this.model = model === Backendless.User.className
        ? Backendless.User
        : createModelClassFromString(model)

    } else {
      this.className = Utils.getClassName(model)
      this.model = model
    }

    if (!this.className) {
      throw new Error('Class name should be specified')
    }
  }

}

Object.setPrototypeOf(DataStore.prototype, {

  save    : Utils.promisified(save),
  saveSync: Utils.synchronized(save),

  remove    : Utils.promisified(remove),
  removeSync: Utils.synchronized(remove),

  find    : Utils.promisified(find),
  findSync: Utils.synchronized(find),

  findById    : Utils.promisified(findById),
  findByIdSync: Utils.synchronized(findById),

  loadRelations    : Utils.promisified(loadRelations),
  loadRelationsSync: Utils.synchronized(loadRelations),

  findFirst    : Utils.promisified(findFirst),
  findFirstSync: Utils.synchronized(findFirst),

  findLast    : Utils.promisified(findLast),
  findLastSync: Utils.synchronized(findLast),

  getObjectCount    : Utils.promisified(getObjectCount),
  getObjectCountSync: Utils.synchronized(getObjectCount),

  setRelation    : Utils.promisified(setRelation),
  setRelationSync: Utils.synchronized(setRelation),

  addRelation    : Utils.promisified(addRelation),
  addRelationSync: Utils.synchronized(addRelation),

  deleteRelation    : Utils.promisified(deleteRelation),
  deleteRelationSync: Utils.synchronized(deleteRelation),

  bulkCreate    : Utils.promisified(bulkCreate),
  bulkCreateSync: Utils.synchronized(bulkCreate),

  bulkUpdate    : Utils.promisified(bulkUpdate),
  bulkUpdateSync: Utils.synchronized(bulkUpdate),

  bulkDelete    : Utils.promisified(bulkDelete),
  bulkDeleteSync: Utils.synchronized(bulkDelete),

})

export default DataStore