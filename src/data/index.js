import Utils from '../utils'
import Urls from '../urls'
import { deprecated } from '../decorators'

import Permissions from './permissions'
import Store from './store'
import QueryBuilder from './query-builder'
import LoadRelationsQueryBuilder from './load-relations-query-builder'

import { describe } from './describe'

export default class Data {
  constructor(backendless) {
    this.backendless = backendless

    this.Permissions = new Permissions(backendless)
    this.QueryBuilder = QueryBuilder
    this.LoadRelationsQueryBuilder = LoadRelationsQueryBuilder
  }

  of(model) {
    return new Store(model, this.backendless)
  }

  @deprecated('Backendless.Data', 'Backendless.Data.describe')
  describeSync(...args) {
    return Utils.synchronized(describe).call(this, ...args)
  }

  describe(...args) {
    return Utils.promisified(describe).call(this, ...args)
  }

  @deprecated('Backendless.Data', 'Backendless.Data.of(<ClassName>).save')
  save(className, obj) {
    return this.of(className).save(obj)
  }

  @deprecated('Backendless.Data', 'Backendless.Data.of(<ClassName>).save')
  saveSync(className, obj, asyncHandler) {
    return this.of(className).saveSync(obj, asyncHandler)
  }
}

export default Data