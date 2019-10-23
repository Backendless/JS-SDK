import geoConstructor from './geo-constructor'

class GeoJSONParser {
  constructor(srs) {
    this.srs = srs
  }

  read(geoJSON) {
    const geoObject = JSON.parse(geoJSON)

    return geoConstructor(geoObject, this.srs)
  }
}

export default GeoJSONParser