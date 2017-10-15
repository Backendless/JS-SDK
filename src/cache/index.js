import Utils from '../utils'
import { deprecated } from '../decorators'

import { put } from './put'
import { get } from './get'
import { remove } from './remove'
import { contains } from './contains'
import { expireIn } from './expire-in'
import { expireAt } from './expire-at'
import { Parsers } from './parsers'

const Cache = {

  @deprecated('Backendless.Cache', 'Backendless.Cache.put')
  putSync: Utils.synchronized(put),
  put    : Utils.promisified(put),

  @deprecated('Backendless.Cache', 'Backendless.Cache.get')
  getSync: Utils.synchronized(get),
  get    : Utils.promisified(get),

  @deprecated('Backendless.Cache', 'Backendless.Cache.remove')
  removeSync: Utils.synchronized(remove),
  remove    : Utils.promisified(remove),

  @deprecated('Backendless.Cache', 'Backendless.Cache.contains')
  containsSync: Utils.synchronized(contains),
  contains    : Utils.promisified(contains),

  @deprecated('Backendless.Cache', 'Backendless.Cache.expireIn')
  expireInSync: Utils.synchronized(expireIn),
  expireIn    : Utils.promisified(expireIn),

  @deprecated('Backendless.Cache', 'Backendless.Cache.expireAt')
  expireAtSync: Utils.synchronized(expireAt),
  expireAt    : Utils.promisified(expireAt),

  //TODO: do we need it?
  setObjectFactory(objectName, factoryMethod) {
    Parsers.set(objectName, factoryMethod)
  }
}

export default Cache