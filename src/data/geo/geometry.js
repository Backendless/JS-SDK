import SpatialReferenceSystem from './spatial-reference-system'

class Geometry {
  constructor(srs) {
    srs = srs || SpatialReferenceSystem.DEFAULT

    this.srs = srs
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