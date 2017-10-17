export default class GeoPoint {

  constructor(args) {
    args = args || {}

    this.___class = 'GeoPoint'
    this.categories = args.categories
    this.latitude = args.latitude
    this.longitude = args.longitude
    this.metadata = args.metadata
    this.objectId = args.objectId
    this.distance = args.distance
  }
}