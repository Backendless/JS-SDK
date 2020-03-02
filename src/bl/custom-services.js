import Utils from '../utils'
import { deprecated } from '../decorators'

import { invokeServiceMethod } from './invoke-service-method'

class CustomServices {
  constructor(app) {
    this.app = app
  }
}

Object.assign(CustomServices.prototype, {
  @deprecated('Backendless.CustomServices', 'Backendless.CustomServices.invoke')
  invokeSync: Utils.synchronized(invokeServiceMethod),
  invoke    : Utils.promisified(invokeServiceMethod),
})

export default CustomServices

