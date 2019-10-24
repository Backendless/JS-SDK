import SpatialReferenceSystem from './spatial-reference-system'
import GeoJSONParser from './geo-json-parser'
import WKTParser from './wkt-parser'

class Geometry {
  static fromWKT(wellKnownText, srs) {
    return new WKTParser(srs).read(wellKnownText)
  }

  static fromGeoJSON(geoJSON, srs) {
    return new GeoJSONParser(srs).read(geoJSON)
  }

  constructor(srs) {
    this.srs = srs || SpatialReferenceSystem.DEFAULT
  }

  getSRS() {
    return this.srs
  }

  toGeoJSON() {
    return JSON.stringify({
      type       : this.getGeojsonType(),
      coordinates: this.jsonCoordinatePairs()
    })
  }

  toWKT() {
    return this.getWktType() + '(' + this.wktCoordinatePairs() + ')'
  }

  toString() {
    return '\'' + this.toWKT() + '\''
  }
}

export default Geometry