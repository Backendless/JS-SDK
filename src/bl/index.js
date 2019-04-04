import Utils from '../utils'
import { deprecated } from '../decorators'

import { ExecutionTypes } from './constants'
import { dispatchEvent } from './dispatch-event'
import { invokeServiceMethod } from './invoke-service-method'

const BL = {
  ExecutionTypes,

  CustomServices: {

    @deprecated('Backendless.CustomServices', 'Backendless.CustomServices.invoke')
    invokeSync: Utils.synchronized(invokeServiceMethod),
    invoke    : Utils.promisified(invokeServiceMethod),

  },

  Events: {

    @deprecated('Backendless.Events', 'Backendless.Events.dispatch')
    dispatchSync: Utils.synchronized(dispatchEvent),
    dispatch    : Utils.promisified(dispatchEvent),

  },
}

export default BL