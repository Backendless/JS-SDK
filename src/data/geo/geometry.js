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

  /**
   * @abstract
   * @description It is an abstract method and it must be overridden in an inherited class
   */
  getGeojsonType() {
  }

  /**
   * @abstract
   * @description It is an abstract method and it must be overridden in an inherited class
   */
  getWktType() {
  }

  /**
   * @abstract
   * @description It is an abstract method and it must be overridden in an inherited class
   */
  wktCoordinatePairs() {
  }

  /**
   * @abstract
   * @description It is an abstract method and it must be overridden in an inherited class
   */
  jsonCoordinatePairs() {
  }

  asGeoJSON() {
    return {
      type       : this.getGeojsonType(),
      coordinates: this.jsonCoordinatePairs()
    }
  }

  asWKT() {
    return this.getWktType() + '(' + this.wktCoordinatePairs() + ')'
  }

  toJSON() {
    return this.asGeoJSON()
  }

  toString() {
    return '\'' + this.asWKT() + '\''
  }
}

export default Geometry