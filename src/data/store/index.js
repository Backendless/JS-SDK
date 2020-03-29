import Utils from '../../utils'
import { resolveModelClassFromString } from '../utils'
import EventHandler from '../rt-store'

import { loadRelations, setRelation, addRelation, deleteRelation } from './relations'
import { bulkCreate, bulkUpdate, bulkDelete } from './bulk'
import { find, findById, findFirst, findLast } from './find'
import { save } from './save'
import { remove } from './remove'
import { getObjectCount } from './count'

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
}

Object.assign(DataStore.prototype, {

  save: Utils.promisified(save),

  remove: Utils.promisified(remove),

  find: Utils.promisified(find),

  findById: Utils.promisified(findById),

  loadRelations: Utils.promisified(loadRelations),

  findFirst: Utils.promisified(findFirst),

  findLast: Utils.promisified(findLast),

  getObjectCount: Utils.promisified(getObjectCount),

  setRelation: Utils.promisified(setRelation),

  addRelation: Utils.promisified(addRelation),

  deleteRelation: Utils.promisified(deleteRelation),

  bulkCreate: Utils.promisified(bulkCreate),

  bulkUpdate: Utils.promisified(bulkUpdate),

  bulkDelete: Utils.promisified(bulkDelete),

})

export default DataStore
