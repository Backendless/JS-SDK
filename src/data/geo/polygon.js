import Geometry from './geometry'
import LineString from './linestring'
import SpatialReferenceSystem from './spatial-reference-system'
import { GeoTypes } from './constants'

const GEOJSON_TYPE = GeoTypes.POLYGON
const WKT_TYPE = GEOJSON_TYPE.toUpperCase()

const DIFFERENT_SRS_ERROR_MSG = (
  'Some of the \'lineStrings\' were created in the Spatial Reference System (SRS) ' +
  'that differs from the current polygon \'srs\'.'
)

const INVALID_POINTS_NUMBER_ERROR_MSG = 'Invalid number of points in LineString, must me > 3'

const NOT_CLOSED_LINESTRING_MSG = 'Some of the \'LineStrings\' aren\'t closed (first and last points must be equal).'

const checkConsistence = (lineString, srs) => {
  const points = lineString.getPoints()

  if (lineString.getSRS() !== srs) {
    throw new Error(DIFFERENT_SRS_ERROR_MSG)
  }

  if (points.length < 4) {
    throw new Error(INVALID_POINTS_NUMBER_ERROR_MSG)
  }

  if (!points[0].equals(points[points.length - 1])) {
    throw new Error(NOT_CLOSED_LINESTRING_MSG)
  }
}

class Polygon extends Geometry {
  constructor(boundary, holes, srs) {
    srs = srs || arguments.length > 2 ? null : SpatialReferenceSystem.DEFAULT

    super(srs)

    this.setBoundary(boundary)
    this.setHoles(holes)
  }

  validate() {
    checkConsistence(this.boundary, this.srs)

    for (const hole of this.holes) {
      checkConsistence(hole, this.srs)
    }
  }

  getBoundary() {
    return this.boundary
  }

  setBoundary(boundary) {
    if (!boundary) {
      throw new Error('The \'boundary\' argument is required.')
    }

    if (!(boundary instanceof LineString)) {
      boundary = new LineString(boundary, this.srs)
    }

    checkConsistence(boundary, this.srs)

    this.boundary = boundary

    return this
  }

  getHoles() {
    return this.holes
  }

  setHoles(holes) {
    if (holes && holes.length > 0) {
      for (const hole of holes) {
        checkConsistence(hole, this.srs)
      }

      this.holes = holes
    } else {
      this.holes = []
    }

    return this
  }

  getGeojsonType() {
    return GEOJSON_TYPE
  }

  getWktType() {
    return WKT_TYPE
  }

  jsonCoordinatePairs() {
    const boundariesList = []

    this.getBoundary().getPoints().forEach(point => {
      boundariesList.push([point.getX(), point.getY()])
    })

    this.holes.forEach(hole => {
      const holeBoundaries = []

      hole.getPoints().forEach(point => holeBoundaries.push([point.getX(), point.getY()]))

      boundariesList.push(holeBoundaries)
    })

    return JSON.stringify(boundariesList)
  }

  wktCoordinatePairs() {
    const wktPairsListCollection = [this.getBoundary().wktCoordinatePairs()]

    this.holes.forEach(hole => wktPairsListCollection.push(hole.wktCoordinatePairs()))

    const wrapParens = str => '(' + str + ')'

    return wktPairsListCollection
      .map(wrapParens)
      .join(',')
  }
}

export default Polygon