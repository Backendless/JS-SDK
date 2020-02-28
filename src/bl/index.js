import { ExecutionTypes } from './constants'

import CustomServices from './custom-services'
import Events from './events'

class BL {
  constructor(app) {
    this.app = app

    this.ExecutionTypes = ExecutionTypes

    this.CustomServices = new CustomServices(app)
    this.Events = new Events(app)
  }
}

export default BL