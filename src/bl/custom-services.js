import Utils from '../utils'

import { invokeServiceMethod } from './invoke-service-method'

class CustomServices {
  constructor(app) {
    this.app = app
  }
}

Object.assign(CustomServices.prototype, {
  invoke: Utils.promisified(invokeServiceMethod),
})

export default CustomServices

