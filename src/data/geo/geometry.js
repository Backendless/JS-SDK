import SpatialReferenceSystem from './spatial-reference-system'

class Geometry {
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