import { GeoTypes } from './constants'

const numberRegexp = /[-+]?([0-9]*\.[0-9]+|[0-9]+)([eE][-+]?[0-9]+)?/

// Matches sequences like '100 100' or '100 100 100'.
const tuples = new RegExp('^' + numberRegexp.source + '(\\s' + numberRegexp.source + '){1,}')

const wktToGeoJSON = wktString => {
  let i = 0

  const matches = re => {
    const match = wktString.substring(i).match(re)

    if (!match) {
      return null
    } else {
      i += match[0].length

      return match[0]
    }
  }

  const white = () => matches(/^\s*/)

  const getMultiCoordinates = () => {
    white()

    let depth = 0
    const rings = []
    const stack = [rings]
    let pointer = rings
    let elem

    while (elem = matches(/^(\()/) || matches(/^(\))/) || matches(/^(,)/) || matches(tuples)) {
      if (elem === '(') {
        stack.push(pointer)
        pointer = []
        stack[stack.length - 1].push(pointer)
        depth++
      } else if (elem === ')') {
        // For the case: Polygon(), ...
        if (pointer.length === 0) {
          return null
        }

        pointer = stack.pop()

        // the stack was empty, wkt string was malformed
        if (!pointer) {
          return null
        }

        depth--

        if (depth === 0) {
          break
        }
      } else if (elem === ',') {
        pointer = []
        stack[stack.length - 1].push(pointer)
      } else if (!elem.split(/\s/g).some(isNaN)) {
        Array.prototype.push.apply(pointer, elem.split(/\s/g).map(parseFloat))
      } else {
        return null
      }

      white()
    }

    if (depth !== 0) {
      return null
    }

    return rings
  }

  const getCoordinates = () => {
    const list = []
    let item
    let pt

    while (pt = matches(tuples) || matches(/^(,)/)) {
      if (pt === ',') {
        list.push(item)
        item = []
      } else if (!pt.split(/\s/g).some(isNaN)) {
        if (!item) {
          item = []
        }

        item = [...item, ...pt.split(/\s/g).map(parseFloat)]
      }

      white()
    }

    if (item) {
      list.push(item)
    } else {
      return null
    }

    return list.length ? list : null
  }

  const point = () => {
    if (!matches(/^(point(\sz)?)/i)) {
      return null
    }

    white()

    if (!matches(/^(\()/)) {
      return null
    }

    white()

    const coordinates = getCoordinates()

    if (!coordinates) {
      return null
    }

    if (!matches(/^(\))/)) {
      return null
    }

    return {
      type       : GeoTypes.POINT,
      coordinates: coordinates[0]
    }
  }

  const linestring = () => {
    if (!matches(/^(linestring(\sz)?)/i)) {
      return null
    }

    white()

    if (!matches(/^(\()/)) {
      return null
    }

    const coordinates = getCoordinates()

    if (!coordinates) {
      return null
    }

    if (!matches(/^(\))/)) {
      return null
    }

    return {
      type       : GeoTypes.LINE_STRING,
      coordinates
    }
  }

  const polygon = () => {
    if (!matches(/^(polygon(\sz)?)/i)) {
      return null
    }

    white()

    const coordinates = getMultiCoordinates()

    if (!coordinates) {
      return null
    }

    return {
      type       : GeoTypes.POLYGON,
      coordinates
    }
  }

  return point() || linestring() || polygon()
}

export default wktToGeoJSON