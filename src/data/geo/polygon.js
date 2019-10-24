import Geometry from './geometry'
import LineString from './linestring'
import { GeoTypes } from './constants'

const GEOJSON_TYPE = GeoTypes.POLYGON
const WKT_TYPE = GEOJSON_TYPE.toUpperCase()

class Polygon extends Geometry {
  constructor(boundary, holes, srs) {
    super(srs)

    this.setBoundary(boundary)
    this.setHoles(holes)
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

    this.boundary = boundary

    return this
  }

  getHoles() {
    return this.holes
  }

  setHoles(holes) {
    this.holes = holes || []

    return this
  }

  getGeojsonType() {
    return GEOJSON_TYPE
  }

  getWktType() {
    return WKT_TYPE
  }

  jsonCoordinatePairs() {
    const outerBoundaries = []
    const innerBoundaries = []

    this.getBoundary().getPoints().forEach(point => {
      outerBoundaries.push([point.getX(), point.getY()])
    })

    this.holes.forEach(hole => {
      const holeBoundaries = []

      hole.getPoints().forEach(point => holeBoundaries.push([point.getX(), point.getY()]))

      innerBoundaries.push(holeBoundaries)
    })

    return [outerBoundaries, ...innerBoundaries]
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