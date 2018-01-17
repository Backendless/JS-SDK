import Utils from '../utils'

//TODO: refactor me
const FindHelpers = {
  searchRectangle: function(arg) {
    const rect = [
      'nwlat=' + arg[0], 'nwlon=' + arg[1], 'selat=' + arg[2], 'selon=' + arg[3]
    ]
    return rect.join('&')
  },

  latitude: function(arg) {
    return 'lat=' + arg
  },

  longitude: function(arg) {
    return 'lon=' + arg
  },

  metadata: function(arg) {
    return 'metadata=' + JSON.stringify(arg)
  },

  units: function(arg) {
    return 'units=' + arg
  },

  radius: function(arg) {
    return 'r=' + arg
  },

  categories: function(arg) {
    arg = Utils.isString(arg) ? [arg] : arg

    return 'categories=' + Utils.encodeArrayToUriComponent(arg)
  },

  includeMetadata: function(arg) {
    return 'includemetadata=' + arg
  },

  pageSize: function(arg) {
    if (arg < 1) {
      throw new Error('PageSize can not be less then 1')
    }

    return 'pagesize=' + arg
  },

  offset: function(arg) {
    if (arg < 0) {
      throw new Error('Offset can not be less then 0')
    }

    return 'offset=' + arg
  },

  relativeFindPercentThreshold: function(arg) {
    if (arg <= 0) {
      throw new Error('Threshold can not be less then or equal 0')
    }

    return 'relativeFindPercentThreshold=' + arg
  },

  relativeFindMetadata: function(arg) {
    return 'relativeFindMetadata=' + encodeURIComponent(JSON.stringify(arg))
  },

  condition: function(arg) {
    return 'whereClause=' + encodeURIComponent(arg)
  },

  degreePerPixel: function(arg) {
    return 'dpp=' + arg
  },

  clusterGridSize: function(arg) {
    return 'clustergridsize=' + arg
  },

  geoFence: function(arg) {
    return 'geoFence=' + arg
  }
}

export default FindHelpers
