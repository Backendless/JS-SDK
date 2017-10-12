import Utils from '../utils'

import { validatePlayPurchase } from './validate-play-purchase'
import { cancelPlaySubscription } from './cancel-play-subscription'
import { getPlaySubscriptionStatus } from './get-play-subscription-status'

const Commerce = {

  validatePlayPurchase    : Utils.promisified(validatePlayPurchase),
  validatePlayPurchaseSync: Utils.synchronized(validatePlayPurchase),

  cancelPlaySubscription    : Utils.promisified(cancelPlaySubscription),
  cancelPlaySubscriptionSync: Utils.synchronized(cancelPlaySubscription),

  getPlaySubscriptionStatus    : Utils.promisified(getPlaySubscriptionStatus),
  getPlaySubscriptionStatusSync: Utils.synchronized(getPlaySubscriptionStatus),

}

export default Commerce

