export default class GeoQuery {
  constructor(args) {
    args = args || {}

    this.searchRectangle = args.searchRectangle || undefined
    this.categories = args.categories || []
    this.includeMetadata = args.includeMetadata || true
    this.metadata = args.metadata || undefined
    this.condition = args.condition || undefined
    this.relativeFindMetadata = args.relativeFindMetadata || undefined
    this.relativeFindPercentThreshold = args.relativeFindPercentThreshold || undefined
    this.pageSize = args.pageSize || undefined
    this.latitude = args.latitude || undefined
    this.longitude = args.longitude || undefined
    this.radius = args.radius || undefined
    this.units = args.units || undefined
    this.degreePerPixel = args.degreePerPixel || undefined
    this.clusterGridSize = args.clusterGridSize || undefined
  }

  addCategory(category) {
    this.categories = this.categories || []
    this.categories.push(category)
  }

  setClusteringParams(westLongitude, eastLongitude, mapWidth, clusterGridSize) {
    clusterGridSize = clusterGridSize || 0

    const parsedWestLongitude = parseFloat(westLongitude)
    const parsedEastLongitude = parseFloat(eastLongitude)
    const parsedMapWidth = parseInt(mapWidth)
    const parsedClusterGridSize = parseInt(clusterGridSize)

    if (!isFinite(parsedWestLongitude) || parsedWestLongitude < -180 || parsedWestLongitude > 180) {
      throw new Error('The westLongitude value must be a number in the range between -180 and 180')
    }

    if (!isFinite(parsedEastLongitude) || parsedEastLongitude < -180 || parsedEastLongitude > 180) {
      throw new Error('The eastLongitude value must be a number in the range between -180 and 180')
    }

    if (!isFinite(parsedMapWidth) || parsedMapWidth < 1) {
      throw new Error('The mapWidth value must be a number greater or equal to 1')
    }

    if (!isFinite(parsedClusterGridSize) || parsedClusterGridSize < 0) {
      throw new Error('The clusterGridSize value must be a number greater or equal to 0')
    }

    let longDiff = parsedEastLongitude - parsedWestLongitude

    if (longDiff < 0) {
      longDiff += 360
    }

    this.degreePerPixel = longDiff / parsedMapWidth
    this.clusterGridSize = parsedClusterGridSize || null
  }
}