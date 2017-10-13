import Utils from '../utils'

import Permissions from './permissions'
import Store from './store'
import QueryBuilder from './query-builder'
import LoadRelationsQueryBuilder from './load-relations-query-builder'

import { describe } from './describe'

const StoresCache = {}

const Data = {
  Permissions              : Permissions,
  QueryBuilder             : QueryBuilder,
  LoadRelationsQueryBuilder: LoadRelationsQueryBuilder,

  of: function(model) {
    const tableName = Utils.isString(model) ? model : Utils.getClassName(model)

    //TODO: don't cache storage
    //TODO: always return new instance of Data Store
    //TODO: caching will be removed when RT is released
    return StoresCache[tableName] = StoresCache[tableName] || new Store(model)
  },

  reset() {
    //TODO: temporary solution, will be removed when RT is released
    Object.keys(tableName => {
      delete StoresCache[tableName]
    })
  },

  describe    : Utils.promisified(describe),
  describeSync: Utils.synchronized(describe),


  save(className, obj){
    console.warn('Backendless.Data.save is deprecated method and will be remove soon')
    return this.of(className).save(obj)
  },

  saveSync(className, obj, async){
    console.warn('Backendless.Data.saveSync is deprecated method and will be remove soon')
    return this.of(className).saveSync(obj, async)
  }

}

export default Data