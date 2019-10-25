import Point from './point'
import LineString from './linestring'
import Polygon from './polygon'
import { GeoTypes } from './constants'
import SpatialReferenceSystem from './spatial-reference-system'

const pointConstructor = (coordinates, srs) => {
  const [x, y] = coordinates

  return new Point(srs).setX(x).setY(y)
}

const lineStringConstructor = (coordinates, srs) => {
  const points = coordinates.map(coordsPair => pointConstructor(coordsPair, srs))

  return new LineString(points, srs)
}

const polygonConstructor = (coordinates, srs) => {
  const lineStrings = coordinates.map(lineString => lineStringConstructor(lineString, srs))
  const [boundary, ...holes] = lineStrings

  return new Polygon(boundary, holes, srs)
}

const Constructors = {
  [GeoTypes.POINT]      : pointConstructor,
  [GeoTypes.LINE_STRING]: lineStringConstructor,
  [GeoTypes.POLYGON]    : polygonConstructor,
}

export default function (geoObject, srs) {
  const constructor = Constructors[geoObject.type]
  srs = srs || SpatialReferenceSystem.valueBySRSId(geoObject.srsId)

  if (constructor) {
    return constructor(geoObject.coordinates, srs)
  }

  throw new Error(`There is no constructor for ${ geoObject.type }`)
}