import Backendless from '../../bundle'
import Urls from '../../urls'

import GeoPoint from '../point'
import GeoUtils from '../utils'

import GeoTracker from './tracker'
import GeoFenceActions from './fence-actions'

const INTERVAL = 5000


//TODO: refactor me

const _getFences = function(geoFence) {
  return Backendless._ajax({
    method: 'GET',
    url   : Urls.geoFences(geoFence)
  })
}

const _isDefiniteRect = function(nwPoint, sePoint) {
  return nwPoint != null && sePoint != null
}

const _typesMapper = {
  'RECT'  : function(fence) {
    fence.nwPoint = fence.nodes[0]
    fence.sePoint = fence.nodes[1]
  },
  'CIRCLE': function(fence) {
    const outRect = GeoUtils.getOutRectangle(fence.nodes[0], fence.nodes[1])
    fence.nwPoint = {
      latitude : outRect[0],
      longitude: outRect[1]
    }
    fence.sePoint = {
      latitude : outRect[2],
      longitude: outRect[3]
    }
  },
  'SHAPE' : function(fence) {
    const outRect = GeoUtils.getOutRectangle(fence.nodes[0], fence.nodes[1])
    fence.nwPoint = {
      latitude : outRect[0],
      longitude: outRect[1]
    }
    fence.sePoint = {
      latitude : outRect[2],
      longitude: outRect[3]
    }
  }
}

const _checkPosition = function(geofenceName, coords, fences, geoPoint, GeoFenceCallback, lastResults, async) {
  const tracker = GeoTracker.get()

  for (let k = 0; k < tracker._trackedFences.length; k++) {
    const _trackedFences = tracker._trackedFences[k]

    const isInFence = _isDefiniteRect(_trackedFences.nwPoint, _trackedFences.sePoint)
      && GeoUtils.isPointInFence(coords, _trackedFences)

    let rule = null

    if (isInFence !== lastResults[tracker._trackedFences[k].geofenceName]) {
      if (lastResults[tracker._trackedFences[k].geofenceName]) {
        rule = 'onexit'
      } else {
        rule = 'onenter'
      }

      lastResults[tracker._trackedFences[k].geofenceName] = isInFence
    }

    if (rule) {
      const duration = tracker._trackedFences[k].onStayDuration * 1000

      const timeoutFuncInApp = (savedK, savedCoords, duration) => {
        const callBack = () => {
          GeoFenceCallback['onstay'](tracker._trackedFences[savedK].geofenceName,
            tracker._trackedFences[savedK].objectId, savedCoords.latitude, savedCoords.longitude)
        }

        tracker._timers[tracker._trackedFences[savedK].geofenceName] = setTimeout(callBack, duration)
      }

      const timeoutFuncRemote = (savedK, savedCoords, duration, geoPoint) => {
        const callBack = () => {
          GeoFenceActions.run('onstay', tracker._trackedFences[savedK].geofenceName, geoPoint, async)
        }

        tracker._timers[tracker._trackedFences[savedK].geofenceName] = setTimeout(callBack, duration)
      }

      if (GeoFenceCallback) {
        if (rule === 'onenter') {
          GeoFenceCallback[rule](tracker._trackedFences[k].geofenceName, tracker._trackedFences[k].objectId,
            coords.latitude, coords.longitude)

          if (duration > -1) {
            (function(k, coords, duration) {
              return timeoutFuncInApp(k, coords, duration)
            })(k, coords, duration)
          } else {
            GeoFenceCallback['onstay'](tracker._trackedFences[k].geofenceName,
              tracker._trackedFences[k].objectId, coords.latitude, coords.longitude)
          }
        } else {
          clearTimeout(tracker._timers[tracker._trackedFences[k].geofenceName])
          GeoFenceCallback[rule](tracker._trackedFences[k].geofenceName, tracker._trackedFences[k].objectId,
            coords.latitude, coords.longitude)
        }
      } else if (geoPoint) {
        geoPoint.latitude = coords.latitude
        geoPoint.longitude = coords.longitude

        if (rule === 'onenter') {
          GeoFenceActions.run(rule, tracker._trackedFences[k].geofenceName, geoPoint, async)

          if (duration > -1) {
            (function(k, coords, duration, geoPoint) {
              return timeoutFuncRemote(k, coords, duration, geoPoint)
            })(k, coords, duration, geoPoint)
          } else {
            GeoFenceActions.run('onstay', tracker._trackedFences[k].geofenceName, geoPoint, async)
          }
        } else {
          clearTimeout(tracker._timers[tracker._trackedFences[k].geofenceName])
          GeoFenceActions.run(rule, tracker._trackedFences[k].geofenceName, geoPoint, async)
        }
      }
    }
  }
}

export function startMonitoring(geofenceName, secondParam, async) {
  const tracker = GeoTracker.get()

  let isGeoPoint = false

  if (secondParam instanceof GeoPoint) {
    isGeoPoint = true
  }

  const fences = _getFences(geofenceName)

  for (let ii = 0; ii < fences.length; ii++) {
    if (!_containsByPropName(tracker._trackedFences, fences[ii], 'geofenceName')) {
      _typesMapper[fences[ii].type](fences[ii])
      tracker._lastResults[fences[ii].geofenceName] = false
      tracker._trackedFences.push(fences[ii])
    }
  }

  function _containsByPropName(collection, object, name) {
    const length = collection.length
    let result = false

    for (let i = 0; i < length; i++) {
      if (result = collection[i][name] === object[name]) {
        break
      }
    }

    return result
  }

  const getPosition = (position) => {
    _checkPosition(geofenceName, position.coords, fences, (isGeoPoint) ? secondParam : null, (!isGeoPoint) ? secondParam : null, tracker._lastResults, async)
  }

  function errorCallback(error) {
    throw new Error('Error during current position calculation. Error ' + error.message)
  }

  function getCurPos() {
    navigator.geolocation.getCurrentPosition(getPosition, errorCallback, {
      timeout           : 5000,
      enableHighAccuracy: true
    })
  }

  if (!tracker.monitoringId) {
    if (fences.length) {
      tracker.monitoringId = !GeoUtils.isMobileDevice()
        ? setInterval(getCurPos, INTERVAL)
        : navigator.geolocation.watchPosition(getPosition, errorCallback, {
          timeout           : INTERVAL,
          enableHighAccuracy: true
        })
    } else {
      throw new Error('Please, add some fences to start monitoring')
    }
  }
}

