import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'
import GeoCluster from './geo-cluster'
import GeoPoint from './geo-point'
import GeoQuery from './geo-query'

function Geo() {
  // this.restUrl = Urls.geo()
  this.monitoringId = null
}

Geo.prototype = {
  UNITS: {
    METERS    : 'METERS',
    KILOMETERS: 'KILOMETERS',
    MILES     : 'MILES',
    YARDS     : 'YARDS',
    FEET      : 'FEET'
  },

  _load: function(url, async) {
    let responder = Utils.extractResponder(arguments),
        isAsync   = !!responder

    return Backendless._ajax({
      method      : 'GET',
      url         : url,
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  _findHelpers: {
    'searchRectangle'             : function(arg) {
      const rect = [
        'nwlat=' + arg[0], 'nwlon=' + arg[1], 'selat=' + arg[2], 'selon=' + arg[3]
      ]
      return rect.join('&')
    },
    'latitude'                    : function(arg) {
      return 'lat=' + arg
    },
    'longitude'                   : function(arg) {
      return 'lon=' + arg
    },
    'metadata'                    : function(arg) {
      return 'metadata=' + JSON.stringify(arg)
    },
    'units'                       : function(arg) {
      return 'units=' + arg
    },
    'radius'                      : function(arg) {
      return 'r=' + arg
    },
    'categories'                  : function(arg) {
      arg = Utils.isString(arg) ? [arg] : arg
      return 'categories=' + Utils.encodeArrayToUriComponent(arg)
    },
    'includeMetadata'             : function(arg) {
      return 'includemetadata=' + arg
    },
    'pageSize'                    : function(arg) {
      if (arg < 1 || arg > 100) {
        throw new Error('PageSize can not be less then 1 or greater than 100')
      } else {
        return 'pagesize=' + arg
      }
    },
    'offset'                      : function(arg) {
      if (arg < 0) {
        throw new Error('Offset can not be less then 0')
      } else {
        return 'offset=' + arg
      }
    },
    'relativeFindPercentThreshold': function(arg) {
      if (arg <= 0) {
        throw new Error('Threshold can not be less then or equal 0')
      } else {
        return 'relativeFindPercentThreshold=' + arg
      }
    },
    'relativeFindMetadata'        : function(arg) {
      return 'relativeFindMetadata=' + encodeURIComponent(JSON.stringify(arg))
    },
    'condition'                   : function(arg) {
      return 'whereClause=' + encodeURIComponent(arg)
    },
    'degreePerPixel'              : function(arg) {
      return 'dpp=' + arg
    },
    'clusterGridSize'             : function(arg) {
      return 'clustergridsize=' + arg
    },
    'geoFence'                    : function(arg) {
      return 'geoFence=' + arg
    }
  },

  _validateQueryObject: function(query) {
    if (query.geoFence !== undefined && !Utils.isString(query.geoFence)) {
      throw new Error('Invalid value for argument "geoFenceName". Geo Fence Name must be a String')
    }

    if (query.searchRectangle && query.radius) {
      throw new Error('Inconsistent geo query. Query should not contain both rectangle and radius search parameters.')
    }

    if (query.radius && (query.latitude === undefined || query.longitude === undefined)) {
      throw new Error('Latitude and longitude should be provided to search in radius')
    }

    if ((query.relativeFindMetadata || query.relativeFindPercentThreshold) && !(query.relativeFindMetadata && query.relativeFindPercentThreshold)) {
      throw new Error('Inconsistent geo query. Query should contain both relativeFindPercentThreshold and relativeFindMetadata or none of them')
    }
  },

  _toQueryParams: function(query) {
    const params = []

    if (query.units) {
      params.push('units=' + query.units)
    }

    for (const prop in query) {
      if (query.hasOwnProperty(prop) && this._findHelpers.hasOwnProperty(prop) && query[prop] != null) {
        params.push(this._findHelpers[prop](query[prop]))
      }
    }

    return params.join('&')
  },

  savePoint: Utils.promisified('_savePoint'),

  savePointSync: Utils.synchronized('_savePoint'),

  _savePoint: function(geopoint, async) {
    if (null == geopoint.latitude || null == geopoint.longitude) {
      throw new Error('Latitude or longitude not a number')
    }
    geopoint.categories = geopoint.categories || ['Default']
    geopoint.categories = Utils.isArray(geopoint.categories) ? geopoint.categories : [geopoint.categories]

    const objectId = geopoint.objectId
    let method = objectId ? 'PATCH' : 'POST'
    let url = Urls.geoPoints()

    if (objectId) {
      url += '/' + objectId
    }

    let responder = Utils.extractResponder(arguments)
    const isAsync = !!responder
    const responderOverride = function(async) {
      const success = function(data) {
        const geoPoint = new GeoPoint()
        geoPoint.categories = data.geopoint.categories
        geoPoint.latitude = data.geopoint.latitude
        geoPoint.longitude = data.geopoint.longitude
        geoPoint.metadata = data.geopoint.metadata
        geoPoint.objectId = data.geopoint.objectId

        async.success(geoPoint)
      }
      const error = function(data) {
        async.fault(data)
      }

      return new Async(success, error)
    }

    responder = responderOverride(responder)

    return Backendless._ajax({
      method      : method,
      url         : url,
      data        : JSON.stringify(geopoint),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  /** @deprecated */
  addPoint: function(geopoint, async) {
    return this.savePoint.apply(this, arguments)
  },

  _findUtil: function(query, async) {
    let responder = Utils.extractResponder(arguments),
        isAsync   = false

    this._validateQueryObject(query)

    const url = query.url + (query.searchRectangle ? '/rect' : '/points') + '?' + this._toQueryParams(query)

    const responderOverride = function(async) {
      const success = function(data) {
        const geoCollection = []
        let geoObject
        let isCluster
        let GeoItemType

        //TODO: refctor me when released 4.x
        const collection = data.collection || data

        for (let i = 0; i < collection.length; i++) {
          geoObject = collection[i]
          geoObject.geoQuery = query

          isCluster = geoObject.hasOwnProperty('totalPoints')
          GeoItemType = isCluster ? GeoCluster : GeoPoint

          geoCollection.push(new GeoItemType(geoObject))
        }

        async.success(geoCollection)
      }

      const error = function(data) {
        async.fault(data)
      }

      return new Async(success, error)
    }

    if (responder) {
      isAsync = true
    }

    responder = responderOverride(responder)

    return Backendless._ajax({
      method      : 'GET',
      url         : url,
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  find: Utils.promisified('_find'),

  findSync: Utils.synchronized('_find'),

  _find: function(query, async) {
    query['url'] = Urls.geo()

    return this._findUtil(query, async)
  },

  loadMetadata: Utils.promisified('_loadMetadata'),

  loadMetadataSync: Utils.synchronized('_loadMetadata'),

  _loadMetadata: function(geoObject, async) {
    let url = ''
    let responder = Utils.extractResponder(arguments)
    let isAsync = false

    if (geoObject.objectId) {
      if (geoObject instanceof GeoCluster) {
        if (geoObject.geoQuery instanceof GeoQuery) {
          url = Urls.geoPointMetaData(geoObject.objectId) + '?'

          for (const prop in geoObject.geoQuery) {
            if (geoObject.geoQuery.hasOwnProperty(prop) && this._findHelpers.hasOwnProperty(prop) && geoObject.geoQuery[prop] != null) {
              url += '&' + this._findHelpers[prop](geoObject.geoQuery[prop])
            }
          }
        } else {
          throw new Error('Invalid GeoCluster object. Make sure to obtain an instance of GeoCluster using the Backendless.Geo.find API')
        }
      } else if (geoObject instanceof GeoPoint) {
        url = Urls.geoPointMetaData(geoObject.objectId)

      } else {
        throw new Error('Method argument must be a valid instance of GeoPoint or GeoCluster persisted on the server')
      }
    } else {
      throw new Error('Method argument must be a valid instance of GeoPoint or GeoCluster persisted on the server')
    }

    if (responder) {
      isAsync = true
    }

    return Backendless._ajax({
      method      : 'GET',
      url         : url,
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  getClusterPoints: Utils.promisified('_getClusterPoints'),

  getClusterPointsSync: Utils.synchronized('_getClusterPoints'),

  _getClusterPoints: function(geoObject, async) {
    let url = ''
    let responder = Utils.extractResponder(arguments)
    let isAsync = false

    if (geoObject.objectId) {
      if (geoObject instanceof GeoCluster) {
        if (geoObject.geoQuery instanceof GeoQuery) {
          url = Urls.geoClusterPoints(geoObject.objectId) + '?'

          for (const prop in geoObject.geoQuery) {
            if (geoObject.geoQuery.hasOwnProperty(prop) && this._findHelpers.hasOwnProperty(prop) && geoObject.geoQuery[prop] != null) {
              url += '&' + this._findHelpers[prop](geoObject.geoQuery[prop])
            }
          }
        } else {
          throw new Error('Invalid GeoCluster object. Make sure to obtain an instance of GeoCluster using the Backendless.Geo.find API')
        }
      } else {
        throw new Error('Method argument must be a valid instance of GeoCluster persisted on the server')
      }
    } else {
      throw new Error('Method argument must be a valid instance of GeoCluster persisted on the server')
    }

    const responderOverride = function(async) {
      const success = function(geoCollection) {
        for (let i = 0; i < geoCollection.length; i++) {
          geoCollection[i] = new GeoPoint(geoCollection[i])
        }

        async.success(geoCollection)
      }

      const error = function(data) {
        async.fault(data)
      }

      return new Async(success, error)
    }

    if (responder) {
      isAsync = true
    }

    responder = responderOverride(responder)

    return Backendless._ajax({
      method      : 'GET',
      url         : url,
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  relativeFind: Utils.promisified('_relativeFind'),

  relativeFindSync: Utils.synchronized('_relativeFind'),

  _relativeFind: function(query, async) {
    if (!(query.relativeFindMetadata && query.relativeFindPercentThreshold)) {
      throw new Error('Inconsistent geo query. Query should contain both relativeFindPercentThreshold and relativeFindMetadata')
    } else {
      query['url'] = Urls.geoRelative()

      return this._findUtil(query, async)
    }
  },

  addCategory: Utils.promisified('_addCategory'),

  addCategorySync: Utils.synchronized('_addCategory'),

  _addCategory: function(name, async) {
    if (!name) {
      throw new Error('Category name is required.')
    }

    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    const result = Backendless._ajax({
      method      : 'PUT',
      url         : Urls.geoCategory(name),
      isAsync     : isAsync,
      asyncHandler: responder
    })

    return (typeof result.result === 'undefined') ? result : result.result
  },

  getCategories: Utils.promisified('_getCategories'),

  getCategoriesSync: Utils.synchronized('_getCategories'),

  _getCategories: function(async) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    return Backendless._ajax({
      method      : 'GET',
      url         : Urls.geoCategories(),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  deleteCategory: Utils.promisified('_deleteCategory'),

  deleteCategorySync: Utils.synchronized('_deleteCategory'),

  _deleteCategory: function(name, async) {
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
      if (e.statusCode == 404) {
        result = false
      } else {
        throw e
      }
    }

    return (typeof result.result === 'undefined') ? result : result.result
  },

  deletePoint: Utils.promisified('_deletePoint'),

  deletePointSync: Utils.synchronized('_deletePoint'),

  _deletePoint: function(point, async) {
    if (!point || Utils.isFunction(point)) {
      throw new Error('Point argument name is required, must be string (object Id), or point object')
    }

    let pointId   = Utils.isString(point) ? point : point.objectId,
        responder = Utils.extractResponder(arguments),
        isAsync   = !!responder,
        result    = {}

    try {
      result = Backendless._ajax({
        method      : 'DELETE',
        url         : Urls.geoPoint(pointId),
        isAsync     : isAsync,
        asyncHandler: responder
      })
    } catch (e) {
      if (e.statusCode == 404) {
        result = false
      } else {
        throw e
      }
    }

    return (typeof result.result === 'undefined') ? result : result.result
  },

  getFencePoints: Utils.promisified('_getFencePoints'),

  getFencePointsSync: Utils.synchronized('_getFencePoints'),

  _getFencePoints: function(geoFenceName, query, async) {
    query = query || new GeoQuery()

    query.geoFence = geoFenceName
    query.url = Urls.geo()

    return this._findUtil(query, async)
  },

  /**
   * Count of points
   *
   * @param {(string|GeoQuery)} [fenceName] - fenceName name, or an GeoQuery.
   * @param {GeoQuery} query
   *
   * @return {Promise}
   */
  getGeopointCount: Utils.promisified('_getGeopointCount'),

  /**
   * Count of points (sync)
   *
   * @param {(string|GeoQuery)} [fenceName] - fenceName name, or an GeoQuery.
   * @param {GeoQuery} query
   *
   * @return {number}
   */
  getGeopointCountSync: Utils.synchronized('_getGeopointCount'),

  _getGeopointCount: function(fenceName, query, async) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder
    query = this._buildCountQueryObject(arguments, isAsync)

    this._validateQueryObject(query)

    const url = Urls.geoCount() + '?' + this._toQueryParams(query)

    return Backendless._ajax({
      method      : 'GET',
      url         : url,
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  _buildCountQueryObject: function(args, isAsync) {
    args = isAsync ? Array.prototype.slice.call(args, 0, -1) : args

    let query
    let fenceName

    if (args.length === 1) {
      query = args[0]
    }

    if (args.length === 2) {
      fenceName = args[0]
      query = args[1]

      query['geoFence'] = fenceName
    }

    return query
  },

  _runFenceAction: function(action, geoFenceName, geoPoint, async) {
    if (!Utils.isString(geoFenceName)) {
      throw new Error("Invalid value for parameter 'geoFenceName'. Geo Fence Name must be a String")
    }

    if (geoPoint && !(geoPoint instanceof Async) && !(geoPoint instanceof GeoPoint) && !geoPoint.objectId) {
      throw new Error('Method argument must be a valid instance of GeoPoint persisted on the server')
    }

    let responder = Utils.extractResponder(arguments),
        isAsync   = !!responder,
        data      = {
          method      : 'POST',
          url         : Urls.geoFence(action, geoFenceName),
          isAsync     : isAsync,
          asyncHandler: responder
        }

    if (geoPoint) {
      data.data = JSON.stringify(geoPoint)
    }

    return Backendless._ajax(data)
  },

  runOnStayAction: Utils.promisified('_runOnStayAction'),

  runOnStayActionSync: Utils.synchronized('_runOnStayAction'),

  _runOnStayAction: function(geoFenceName, geoPoint, async) {
    return this._runFenceAction('onstay', geoFenceName, geoPoint, async)
  },

  runOnExitAction: Utils.promisified('_runOnExitAction'),

  runOnExitActionSync: Utils.synchronized('_runOnExitAction'),

  _runOnExitAction: function(geoFenceName, geoPoint, async) {
    return this._runFenceAction('onexit', geoFenceName, geoPoint, async)
  },

  runOnEnterAction: Utils.promisified('_runOnEnterAction'),

  runOnEnterActionSync: Utils.synchronized('_runOnEnterAction'),

  _runOnEnterAction: function(geoFenceName, geoPoint, async) {
    return this._runFenceAction('onenter', geoFenceName, geoPoint, async)
  },

  _getFences: function(geoFence) {
    return Backendless._ajax({
      method: 'GET',
      url   : Urls.geoFences(geoFence)
    })
  },

  EARTH_RADIUS: 6378100.0,

  _distance: function(lat1, lon1, lat2, lon2) {
    let deltaLon = lon1 - lon2
    deltaLon = (deltaLon * Math.PI) / 180
    lat1 = (lat1 * Math.PI) / 180
    lat2 = (lat2 * Math.PI) / 180

    return this.EARTH_RADIUS * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(deltaLon))
  },

  _updateDegree: function(degree) {
    degree += 180
    while (degree < 0) {
      degree += 360
    }

    return degree === 0 ? 180 : degree % 360 - 180
  },

  _countLittleRadius: function(latitude) {
    const h = Math.abs(latitude) / 180 * this.EARTH_RADIUS
    const diametre = 2 * this.EARTH_RADIUS
    const l_2 = (Math.pow(diametre, 2) - diametre * Math.sqrt(Math.pow(diametre, 2) - 4 * Math.pow(h, 2))) / 2
    return diametre / 2 - Math.sqrt(l_2 - Math.pow(h, 2))
  },

  _isDefiniteRect: function(nwPoint, sePoint) {
    return nwPoint != null && sePoint != null
  },

  _getOutRectangle: function() {
    return (arguments.length === 1) ? this._getOutRectangleNodes(arguments[1]) : this._getOutRectangleCircle(arguments[0],
      arguments[1])
  },

  _getOutRectangleCircle: function(center, bounded) {
    const radius = this._distance(center.latitude, center.longitude, bounded.latitude, bounded.longitude)
    const boundLat = center.latitude + (180 * radius) / (Math.PI * this.EARTH_RADIUS) * (center.latitude > 0 ? 1 : -1)
    const littleRadius = this._countLittleRadius(boundLat)
    let westLong, eastLong, northLat, southLat

    if (littleRadius > radius) {
      westLong = center.longitude - (180 * radius) / littleRadius
      eastLong = 2 * center.longitude - westLong
      westLong = this._updateDegree(westLong)
      eastLong = eastLong % 360 === 180 ? 180 : this._updateDegree(eastLong)
    } else {
      westLong = -180
      eastLong = 180
    }

    if (center.latitude > 0) {
      northLat = boundLat
      southLat = 2 * center.latitude - boundLat
    } else {
      southLat = boundLat
      northLat = 2 * center.latitude - boundLat
    }

    return [Math.min(northLat, 90), westLong, Math.max(southLat, -90), eastLong]
  },

  _getOutRectangleNodes: function(geoPoints) {
    let nwLat = geoPoints[0].latitude
    let nwLon = geoPoints[0].longitude
    let seLat = geoPoints[0].latitude
    let seLon = geoPoints[0].longitude
    let minLon = 0, maxLon = 0, lon = 0

    for (let i = 1; i < geoPoints.length; i++) {
      if (geoPoints[i].latitude > nwLat) {
        nwLat = geoPoints[i].latitude
      }

      if (geoPoints[i].latitude < seLat) {
        seLat = geoPoints[i].latitude
      }

      let deltaLon = geoPoints[i].latitude - geoPoints[i - 1].latitude

      if (deltaLon < 0 && deltaLon > -180 || deltaLon > 270) {
        if (deltaLon > 270) {
          deltaLon -= 360
        }

        lon += deltaLon

        if (lon < minLon) {
          minLon = lon
        }
      } else if (deltaLon > 0 && deltaLon <= 180 || deltaLon <= -270) {
        if (deltaLon <= -270) {
          deltaLon += 360
        }

        lon += deltaLon

        if (lon > maxLon) {
          maxLon = lon
        }
      }
    }

    nwLon += minLon
    seLon += maxLon

    if (seLon - nwLon >= 360) {
      seLon = 180
      nwLon = -180
    } else {
      seLon = this._updateDegree(seLon)
      nwLon = this._updateDegree(nwLon)
    }

    return [nwLat, nwLon, seLat, seLon]
  },

  _getPointPosition: function(point, first, second) {
    const delta = second.longitude - first.longitude

    if (delta < 0 && delta > -180 || delta > 180) {
      const tmp = first
      first = second
      second = tmp
    }

    if (point.latitude < first.latitude === point.latitude < second.latitude) {
      return 'NO_INTERSECT'
    }

    let x = point.longitude - first.longitude

    if (x < 0 && x > -180 || x > 180) {
      x = (x - 360) % 360
    }

    const x2 = (second.longitude - first.longitude + 360) % 360
    const result = x2 * (point.latitude - first.latitude) / (second.latitude - first.latitude) - x

    if (result > 0) {
      return 'INTERSECT'
    }

    return 'NO_INTERSECT'
  },

  _isPointInRectangular: function(currentPosition, nwPoint, sePoint) {
    if (currentPosition.latitude > nwPoint.latitude || currentPosition.latitude < sePoint.latitude) {
      return false
    }

    if (nwPoint.longitude > sePoint.longitude) {
      return currentPosition.longitude >= nwPoint.longitude || currentPosition.longitude <= sePoint.longitude
    } else {
      return currentPosition.longitude >= nwPoint.longitude && currentPosition.longitude <= sePoint.longitude
    }
  },

  _isPointInCircle: function(currentPosition, center, radius) {
    return this._distance(currentPosition.latitude, currentPosition.longitude, center.latitude,
      center.longitude) <= radius
  },

  _isPointInShape: function(point, shape) {
    let count = 0

    function getIndex(i, shape) {
      return (i + 1) % shape.length
    }

    for (let i = 0; i < shape.length; i++) {
      const position = this._getPointPosition(point, shape[i], shape[getIndex(i, shape)])
      switch (position) {
        case 'INTERSECT': {
          count++
          break
        }
        case 'ON_LINE':
        case 'NO_INTERSECT':
        default:
          break
      }
    }

    return count % 2 === 1
  },

  _isPointInFence: function(geoPoint, geoFence) {
    return this._isPointInRectangular(geoPoint, geoFence.nwPoint, geoFence.sePoint) ||
      geoFence.type === 'CIRCLE' && this._isPointInCircle(geoPoint, geoFence.nodes[0],
        this._distance(geoFence.nodes[0].latitude, geoFence.nodes[0].longitude, geoFence.nodes[1].latitude,
          geoFence.nodes[1].longitude)) ||
      geoFence.type === 'SHAPE' && this._isPointInShape(geoPoint, geoFence.nodes)
  },

  _typesMapper: {
    'RECT'  : function(fence) {
      fence.nwPoint = fence.nodes[0]
      fence.sePoint = fence.nodes[1]
    },
    'CIRCLE': function(fence, self) {
      const outRect = self._getOutRectangle(fence.nodes[0], fence.nodes[1])
      fence.nwPoint = {
        latitude : outRect[0],
        longitude: outRect[1]
      }
      fence.sePoint = {
        latitude : outRect[2],
        longitude: outRect[3]
      }
    },
    'SHAPE' : function(fence, self) {
      const outRect = self._getOutRectangle(fence.nodes[0], fence.nodes[1])
      fence.nwPoint = {
        latitude : outRect[0],
        longitude: outRect[1]
      }
      fence.sePoint = {
        latitude : outRect[2],
        longitude: outRect[3]
      }
    }
  },

  _maxDuration: 5000,
  _timers     : {},

  _checkPosition: function(geofenceName, coords, fences, geoPoint, GeoFenceCallback, lastResults, async) {
    const self = this

    for (let k = 0; k < self._trackedFences.length; k++) {
      const isInFence = self._isDefiniteRect(self._trackedFences[k].nwPoint,
        self._trackedFences[k].sePoint) && self._isPointInFence(coords, self._trackedFences[k])
      let rule = null

      if (isInFence !== lastResults[self._trackedFences[k].geofenceName]) {
        if (lastResults[self._trackedFences[k].geofenceName]) {
          rule = 'onexit'
        } else {
          rule = 'onenter'
        }

        lastResults[self._trackedFences[k].geofenceName] = isInFence
      }

      if (rule) {
        const duration = self._trackedFences[k].onStayDuration * 1000

        const timeoutFuncInApp = function(savedK, savedCoords, duration) {
          const callBack = function() {
            GeoFenceCallback['onstay'](self._trackedFences[savedK].geofenceName,
              self._trackedFences[savedK].objectId, savedCoords.latitude, savedCoords.longitude)
          }

          self._timers[self._trackedFences[savedK].geofenceName] = setTimeout(callBack, duration)
        }

        const timeoutFuncRemote = function(savedK, savedCoords, duration, geoPoint) {
          const callBack = function() {
            self._runFenceAction('onstay', self._trackedFences[savedK].geofenceName, geoPoint,
              async)
          }

          self._timers[self._trackedFences[savedK].geofenceName] = setTimeout(callBack, duration)
        }

        if (GeoFenceCallback) {
          if (rule === 'onenter') {
            GeoFenceCallback[rule](self._trackedFences[k].geofenceName, self._trackedFences[k].objectId,
              coords.latitude, coords.longitude)

            if (duration > -1) {
              (function(k, coords, duration) {
                return timeoutFuncInApp(k, coords, duration)
              })(k, coords, duration)
            } else {
              GeoFenceCallback['onstay'](self._trackedFences[k].geofenceName,
                self._trackedFences[k].objectId, coords.latitude, coords.longitude)
            }
          } else {
            clearTimeout(self._timers[self._trackedFences[k].geofenceName])
            GeoFenceCallback[rule](self._trackedFences[k].geofenceName, self._trackedFences[k].objectId,
              coords.latitude, coords.longitude)
          }
        } else if (geoPoint) {
          geoPoint.latitude = coords.latitude
          geoPoint.longitude = coords.longitude

          if (rule === 'onenter') {
            self._runFenceAction(rule, self._trackedFences[k].geofenceName, geoPoint, async)

            if (duration > -1) {
              (function(k, coords, duration, geoPoint) {
                return timeoutFuncRemote(k, coords, duration, geoPoint)
              })(k, coords, duration, geoPoint)
            } else {
              self._runFenceAction('onstay', self._trackedFences[k].geofenceName, geoPoint, async)
            }
          } else {
            clearTimeout(self._timers[self._trackedFences[k].geofenceName])
            self._runFenceAction(rule, self._trackedFences[k].geofenceName, geoPoint, async)
          }
        }
      }
    }
  },

  _mobilecheck: function() {
    let check = false;
    (function(a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,
          4))) {
        check = true
      }
    })(navigator.userAgent || navigator.vendor || window.opera)

    return check
  },

  _trackedFences: [],
  _lastResults  : {},

  _startMonitoring: function(geofenceName, secondParam, async) {
    const self = this
    let isGeoPoint = false

    if (secondParam instanceof GeoPoint) {
      isGeoPoint = true
    }

    const fences = this._getFences(geofenceName)

    for (let ii = 0; ii < fences.length; ii++) {
      if (!_containsByPropName(self._trackedFences, fences[ii], 'geofenceName')) {
        self._typesMapper[fences[ii].type](fences[ii], self)
        self._lastResults[fences[ii].geofenceName] = false
        self._trackedFences.push(fences[ii])
      } else {
        //console.warn(fences[ii].geofenceName + ' cannot be tracked again. This fence is already tracked');
      }
    }

    function _containsByPropName(collection, object, name) {
      let length = collection.length,
          result = false
      for (let i = 0; i < length; i++) {
        if (result = collection[i][name] === object[name]) {
          break
        }
      }

      return result
    }

    function getPosition(position) {
      self._checkPosition(geofenceName, position.coords, fences, (isGeoPoint) ? secondParam : null,
        (!isGeoPoint) ? secondParam : null, self._lastResults, async)
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

    if (!this.monitoringId) {
      if (fences.length) {
        this.monitoringId = (!this._mobilecheck()) ? setInterval(getCurPos,
          self._maxDuration) : navigator.geolocation.watchPosition(getPosition, errorCallback, {
          timeout           : self._maxDuration,
          enableHighAccuracy: true
        })
      } else {
        throw new Error('Please, add some fences to start monitoring')
      }
    }
  },

  startGeofenceMonitoringWithInAppCallback: Utils.promisified('_startGeofenceMonitoringWithInAppCallback'),

  startGeofenceMonitoringWithInAppCallbackSync: Utils.synchronized('_startGeofenceMonitoringWithInAppCallback'),

  _startGeofenceMonitoringWithInAppCallback: function(geofenceName, inAppCallback, async) {
    this._startMonitoring(geofenceName, inAppCallback, async)
  },

  startGeofenceMonitoringWithRemoteCallback: Utils.promisified('_startGeofenceMonitoringWithRemoteCallback'),

  startGeofenceMonitoringWithRemoteCallbackSync: Utils.synchronized('_startGeofenceMonitoringWithRemoteCallback'),

  _startGeofenceMonitoringWithRemoteCallback: function(geofenceName, geoPoint, async) {
    this._startMonitoring(geofenceName, geoPoint, async)
  },

  stopGeofenceMonitoring: function(geofenceName) {
    const self = this
    //removed = [];
    if (geofenceName) {
      for (let i = 0; i < self._trackedFences.length; i++) {
        if (self._trackedFences[i].geofenceName == geofenceName) {
          self._trackedFences.splice(i, 1)
          delete self._lastResults[geofenceName]
          //removed.push(geofenceName);
        }
      }
    } else {
      //for (var ii = 0; ii < self._trackedFences.length; ii++) {
      //    removed.push(self._trackedFences[ii].geofenceName)
      //}
      this._lastResuls = {}
      this._trackedFences = []
    }
    if (!self._trackedFences.length) {
      self.monitoringId = null;
      (!self._mobilecheck()) ? clearInterval(self.monitoringId) : navigator.geolocation.clearWatch(self.monitoringId)
    }
    //removed.length ? console.info('Removed fences: ' + removed.join(", ")) : console.info('No fences are tracked');
  }
}

export default Geo
