import Geometry from './geometry'
import SpatialReferenceSystem from './spatial-reference-system'
import { GeoTypes } from './constants'

const GEOJSON_TYPE = GeoTypes.LINE_STRING
const WKT_TYPE = GEOJSON_TYPE.toUpperCase()

const DIFFERENT_SRS_ERROR_MSG = (
  'Some of the points were created in the Spatial Reference System (SRS) that differs from the passed argument \'srs\'.'
)

const POINTS_NUMBER_ERROR_MSG = 'The number of points must be greater than two.'

const NOT_ARRAY_ERROR_MSG = 'Points argument should be an array'

class LineString extends Geometry {
  constructor(points, srs) {
    srs = srs || arguments.length > 1 ? null : SpatialReferenceSystem.DEFAULT
    points = points || []

    super(srs)

    this.validate(points)
    this.points = points
  }

  getPoints() {
    return this.points
  }

  setPoints(points) {
    this.validate(points)
    this.points = points

    return this
  }

  getGeojsonType() {
    return GEOJSON_TYPE
  }

  getWktType() {
    return WKT_TYPE
  }

  jsonCoordinatePairs() {
    const pointsArray = []

    this.getPoints().forEach(point => {
      pointsArray.push([point.getX(), point.getY()])
    })

    return JSON.stringify(pointsArray)
  }

  wktCoordinatePairs() {
    return this.getPoints()
      .map(point => `${ point.getX() } ${ point.getY() }`)
      .join(',')
  }

  validate = points => {
    if (!Array.isArray(points)) {
      throw new Error(NOT_ARRAY_ERROR_MSG)
    }

    if (points.length < 2) {
      throw new Error(POINTS_NUMBER_ERROR_MSG)
    }

    for (const point of points) {
      if (point.getSRS() !== this.srs) {
        throw new Error(DIFFERENT_SRS_ERROR_MSG)
      }
    }
  }
}

export default LineString