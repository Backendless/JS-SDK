import Utils from '../utils'

import { dispatchEvent } from './dispatch-event'

const Events = {

  dispatch: Utils.promisified(dispatchEvent),

  dispatchSync: Utils.synchronized(dispatchEvent)

}

export default Events
