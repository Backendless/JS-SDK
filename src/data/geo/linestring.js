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

const validate = (points, srs) => {
  if (!Array.isArray(points)) {
    throw new Error(NOT_ARRAY_ERROR_MSG)
  }

  if (points.length < 2) {
    throw new Error(POINTS_NUMBER_ERROR_MSG)
  }

  for (const point of points) {
    if (point.getSRS() !== srs) {
      throw new Error(DIFFERENT_SRS_ERROR_MSG)
    }
  }
}

class LineString extends Geometry {
  constructor(points, srs) {
    srs = srs || SpatialReferenceSystem.DEFAULT
    points = points || []

    super(srs)

    validate(points, srs)
    this.points = points
  }

  getPoints() {
    return this.points
  }

  setPoints(points) {
    validate(points, this.srs)
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
}

export default LineString