import Geometry from './geometry'
import { GeoTypes } from './constants'

const GEOJSON_TYPE = GeoTypes.POINT
const WKT_TYPE = GEOJSON_TYPE.toUpperCase()
const PRECISION = .000000001

export default class Point extends Geometry {
  constructor(srs) {
    super(srs)
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
    this.x = x

    return this
  }

  setY(y) {
    this.y = y

    return this
  }

  setLongitude(x) {
    return this.setX(x)
  }

  setLatitude(y) {
    return this.setY(y)
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
    return [this.x, this.y]
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