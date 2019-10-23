class Geometry {
  constructor(srs) {
    if (srs == null) {
      throw new Error('Spatial Reference System (SRS) cannot be null.')
    }

    this.srs = srs
  }

  getSRS() {
    return this.srs
  }

  asGeoJSON() {
    return JSON.stringify({
      type       : this.getGeojsonType(),
      coordinates: this.jsonCoordinatePairs()
    })
  }

  asWKT() {
    return this.getWktType() + '(' + this.wktCoordinatePairs() + ')'
  }

  toString() {
    return '\'' + this.asWKT() + '\''
  }
}

export default Geometry