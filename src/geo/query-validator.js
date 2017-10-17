import Utils from '../utils'

//TODO: refactor me

export function validateQueryObject(query) {
  if (query.geoFence !== undefined && !Utils.isString(query.geoFence)) {
    throw new Error('Invalid value for argument "geoFenceName". Geo Fence Name must be a String')
  }

  if (query.searchRectangle && query.radius) {
    throw new Error(
      'Inconsistent geo query. Query should not contain both rectangle and radius search parameters.'
    )
  }

  if (query.radius && (query.latitude === undefined || query.longitude === undefined)) {
    throw new Error('Latitude and longitude should be provided to search in radius')
  }

  if ((query.relativeFindMetadata || query.relativeFindPercentThreshold)
    && !(query.relativeFindMetadata && query.relativeFindPercentThreshold)) {
    throw new Error(
      'Inconsistent geo query. ' +
      'Query should contain both relativeFindPercentThreshold and relativeFindMetadata or none of them'
    )
  }
}
