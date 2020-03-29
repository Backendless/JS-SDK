import Utils from '../utils'

import { dispatchEvent } from './dispatch-event'

class Events {
  constructor(app) {
    this.app = app
  }
}

Object.assign(Events.prototype, {
  dispatch: Utils.promisified(dispatchEvent),
})

export default Events
