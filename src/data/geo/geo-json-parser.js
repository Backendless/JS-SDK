import geoConstructor from './geo-constructor'

export default class GeoJSONParser {
  constructor(srs) {
    this.srs = srs
  }

  read(geoJSON) {
    return geoConstructor(geoJSON, this.srs)
  }
}
