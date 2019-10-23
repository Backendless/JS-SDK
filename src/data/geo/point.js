import Geometry from './geometry'
import SpatialReferenceSystem from './spatial-reference-system'
import { GeoTypes } from './constants'

const GEOJSON_TYPE = GeoTypes.POINT
const WKT_TYPE = GEOJSON_TYPE.toUpperCase()
const PRECISION = .000000001

const VALIDATION_MSG = 'In geospatial systems \'longitude\'(x) and \'latitude\'(y) should have correct values.'

const validateX = (x, srs) => {
  if ((srs === SpatialReferenceSystem.WGS84 || srs === SpatialReferenceSystem.PULKOVO_1995) && (x > 180 || x < -180)) {
    throw new Error(VALIDATION_MSG)
  }
}

const validateY = (y, srs) => {
  if ((srs === SpatialReferenceSystem.WGS84 || srs === SpatialReferenceSystem.PULKOVO_1995) && (y > 90 || y < -90)) {
    throw new Error(VALIDATION_MSG)
  }
}

export default class Point extends Geometry {
  constructor(srs) {
    srs = srs || SpatialReferenceSystem.DEFAULT

    super(srs)
  }

  validate() {
    validateX(this.x, this.srs)
    validateY(this.y, this.srs)
  }

  getX() {
    return this.x
  }

  getY() {
    return this.y
  }

  getLongitude() {
    return this.x
  }

  getLatitude() {
    return this.y
  }

  setX(x) {
    validateX(x, this.srs)
    this.x = x

    return this
  }

  setY(y) {
    validateY(y, this.srs)
    this.y = y

    return this
  }

  setLongitude(x) {
    return this.setX(x)
  }

  setLatitude(y) {
    return this.setY(y)
  }

  setSrs(srs) {
    this.srs = srs

    return this
  }

  getGeojsonType() {
    return GEOJSON_TYPE
  }

  getWktType() {
    return WKT_TYPE
  }

  wktCoordinatePairs() {
    return `${ this.x } ${ this.y }`
  }

  jsonCoordinatePairs() {
    return JSON.stringify([this.x, this.y])
  }

  equals(point) {
    if (this === point) {
      return true
    }

    if (!(point instanceof Point)) {
      return false
    }

    return Math.abs(point.x - this.x) < PRECISION
      && Math.abs(point.y - this.y) < PRECISION
      && this.srs === point.srs
  }
}