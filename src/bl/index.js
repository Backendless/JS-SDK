import { ExecutionTypes } from './constants'

import CustomServices from './custom-services'
import Events from './events'

class BL {
  constructor(backendless) {
    this.backendless = backendless

    this.ExecutionTypes = ExecutionTypes

    this.CustomServices = new CustomServices(backendless)
    this.Events = new Events(backendless)
  }
}

export default BL