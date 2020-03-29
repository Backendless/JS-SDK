import Utils from '../utils'

import { validatePlayPurchase } from './validate-play-purchase'
import { cancelPlaySubscription } from './cancel-play-subscription'
import { getPlaySubscriptionStatus } from './get-play-subscription-status'

class Commerce {
  constructor(app) {
    this.app = app
  }
}

Object.assign(Commerce.prototype, {
  validatePlayPurchase: Utils.promisified(validatePlayPurchase),

  cancelPlaySubscription: Utils.promisified(cancelPlaySubscription),

  getPlaySubscriptionStatus: Utils.promisified(getPlaySubscriptionStatus),

})

export default Commerce

