import Utils from '../utils'
import { deprecated } from '../decorators'

import { dispatchEvent } from './dispatch-event'

class Events {
  constructor(app) {
    this.app = app
  }
}

Object.assign(Events.prototype, {
  @deprecated('Backendless.Events', 'Backendless.Events.dispatch')
  dispatchSync: Utils.synchronized(dispatchEvent),
  dispatch    : Utils.promisified(dispatchEvent),
})

export default Events
