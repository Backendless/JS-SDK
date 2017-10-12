export default class GeoCluster {
  constructor(args) {
    args = args || {}

    this.categories = args.categories
    this.latitude = args.latitude
    this.longitude = args.longitude
    this.metadata = args.metadata
    this.objectId = args.objectId
    this.totalPoints = args.totalPoints
    this.geoQuery = args.geoQuery
    this.distance = args.distance
  }
}