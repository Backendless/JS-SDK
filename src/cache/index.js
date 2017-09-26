import Utils from '../utils'

import { put } from './put'
import { get } from './get'
import { remove } from './remove'
import { contains } from './contains'
import { expireIn } from './expire-in'
import { expireAt } from './expire-at'
import { Parsers } from './parsers'

const Cache = {

  put    : Utils.promisified(put),
  putSync: Utils.synchronized(put),

  get    : Utils.promisified(get),
  getSync: Utils.synchronized(get),

  remove    : Utils.promisified(remove),
  removeSync: Utils.synchronized(remove),

  contains    : Utils.promisified(contains),
  containsSync: Utils.synchronized(contains),

  expireIn    : Utils.promisified(expireIn),
  expireInSync: Utils.synchronized(expireIn),

  expireAt    : Utils.promisified(expireAt),
  expireAtSync: Utils.synchronized(expireAt),

  //TODO: do we need it?
  setObjectFactory(objectName, factoryMethod) {
    Parsers.set(objectName, factoryMethod)
  }
}

export default Cache