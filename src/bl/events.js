import Utils from '../utils'
import { deprecated } from '../decorators'

import { dispatchEvent } from './dispatch-event'

const Events = {
  ExecutionTypes: {
    SYNC              : 'sync',
    ASYNC             : 'async',
    ASYNC_LOW_PRIORITY: 'async-low-priority'
  },

  @deprecated('Backendless.Events', 'Backendless.Events.dispatch')
  dispatchSync: Utils.synchronized(dispatchEvent),
  dispatch    : Utils.promisified(dispatchEvent),

}

export default Events
