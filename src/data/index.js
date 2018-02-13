import Utils from '../utils'
import { deprecated } from '../decorators'

import Permissions from './permissions'
import Store from './store'
import QueryBuilder from './query-builder'
import LoadRelationsQueryBuilder from './load-relations-query-builder'

import { describe } from './describe'

const Data = {
  Permissions              : Permissions,
  QueryBuilder             : QueryBuilder,
  LoadRelationsQueryBuilder: LoadRelationsQueryBuilder,

  of: function(model) {
    return new Store(model)
  },

  @deprecated('Backendless.Data', 'Backendless.Data.describe')
  describeSync: Utils.synchronized(describe),
  describe    : Utils.promisified(describe),

  @deprecated('Backendless.Data', 'Backendless.Data.of(<ClassName>).save')
  save(className, obj){
    return this.of(className).save(obj)
  },

  @deprecated('Backendless.Data', 'Backendless.Data.of(<ClassName>).save')
  saveSync(className, obj, asyncHandler){
    return this.of(className).saveSync(obj, asyncHandler)
  }

}

export default Data