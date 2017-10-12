import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'
import GeoCluster from './cluster'
import GeoPoint from './point'
import GeoQuery from './query'
import FindHelpers from './find-helpers'

import { EARTH_RADIUS, UNITS } from './constants'
import GeoUtils from './utils'
import GeoTrackerMonitor from './tracker-monitor'
import { savePoint } from './save-point'
import { addCategory } from './add-category'

export function deleteCategory(name /**, async */) {
  if (!name) {
    throw new Error('Category name is required.')
  }

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder
  let result = {}

  try {
    result = Backendless._ajax({
      method      : 'DELETE',
      url         : Urls.geoCategory(name),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  } catch (e) {
    if (e.statusCode === 404) {
      result = false
    } else {
      throw e
    }
  }

  return (typeof result.result === 'undefined') ? result : result.result
}
