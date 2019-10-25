import Geometry from './geometry'
import { GeoTypes } from './constants'

const GEOJSON_TYPE = GeoTypes.LINE_STRING
const WKT_TYPE = GEOJSON_TYPE.toUpperCase()

class LineString extends Geometry {
  constructor(points, srs) {
    super(srs)

    this.points = points || []
  }

  getPoints() {
    return this.points
  }

  setPoints(points) {
    this.points = points

    return this
  }

  /**
   * @override
   */
  getGeojsonType() {
    return GEOJSON_TYPE
  }

  /**
   * @override
   */
  getWktType() {
    return WKT_TYPE
  }

  /**
   * @override
   */
  jsonCoordinatePairs() {
    const pointsArray = []

    this.getPoints().forEach(point => {
      pointsArray.push([point.getX(), point.getY()])
    })

    return pointsArray
  }

  /**
   * @override
   */
  wktCoordinatePairs() {
    return this.getPoints()
      .map(point => `${ point.getX() } ${ point.getY() }`)
      .join(',')
  }
}

export default LineString