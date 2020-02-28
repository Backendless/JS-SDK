import geoConstructor from './geo-constructor'

class GeoJSONParser {
  constructor(srs) {
    this.srs = srs
  }

  read(geoJSON) {
    return geoConstructor(geoJSON, this.srs)
  }
}

export default GeoJSONParser