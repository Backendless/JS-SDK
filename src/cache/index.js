import Utils from '../utils'

import { put } from './put'
import { get } from './get'
import { remove } from './remove'
import { contains } from './contains'
import { expireIn } from './expire-in'
import { expireAt } from './expire-at'
import { Parsers } from './parsers'

class Cache {
  constructor(app) {
    this.app = app
  }

  //TODO: do we need it?
  setObjectFactory(objectName, factoryMethod) {
    Parsers.set(objectName, factoryMethod)
  }
}

Object.assign(Cache.prototype, {
  put    : Utils.promisified(put),

  get    : Utils.promisified(get),

  remove    : Utils.promisified(remove),

  contains    : Utils.promisified(contains),

  expireIn    : Utils.promisified(expireIn),

  expireAt    : Utils.promisified(expireAt),
})

export default Cache
