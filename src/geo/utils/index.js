import { EARTH_RADIUS } from '../constants'

//TODO: refactor me
const GeoUtils = {

  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const deltaLon = ((lon1 - lon2) * Math.PI) / 180

    lat1 = (lat1 * Math.PI) / 180
    lat2 = (lat2 * Math.PI) / 180

    const lat1Sin = Math.sin(lat1)
    const lat1Cos = Math.cos(lat1)
    const lat2Sin = Math.sin(lat2)
    const lat2Cos = Math.cos(lat2)

    return EARTH_RADIUS * Math.acos(lat1Sin * lat2Sin + lat1Cos * lat2Cos * Math.cos(deltaLon))
  },

  updateDegree: degree => {
    degree += 180

    while (degree < 0) {
      degree += 360
    }

    return degree === 0 ? 180 : degree % 360 - 180
  },

  countLittleRadius: latitude => {
    const h = Math.abs(latitude) / 180 * EARTH_RADIUS
    const diameter = 2 * EARTH_RADIUS
    const l_2 = (Math.pow(diameter, 2) - diameter * Math.sqrt(Math.pow(diameter, 2) - 4 * Math.pow(h, 2))) / 2

    return diameter / 2 - Math.sqrt(l_2 - Math.pow(h, 2))
  },

  isPointInCircle: (currentPosition, center, radius) => {
    const lat1 = currentPosition.latitude
    const lon1 = currentPosition.longitude
    const lat2 = center.latitude
    const lon2 = center.longitude

    return GeoUtils.calculateDistance(lat1, lon1, lat2, lon2) <= radius
  },

  isMobileDevice: () => {
    let check = false;
    (function(a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) { // eslint-disable-line max-len
        check = true
      }
    })(navigator.userAgent || navigator.vendor || window.opera)

    return check
  },

  isPointInRectangular: (currentPosition, nwPoint, sePoint) => {
    if (currentPosition.latitude > nwPoint.latitude || currentPosition.latitude < sePoint.latitude) {
      return false
    }

    if (nwPoint.longitude > sePoint.longitude) {
      return currentPosition.longitude >= nwPoint.longitude || currentPosition.longitude <= sePoint.longitude
    } else {
      return currentPosition.longitude >= nwPoint.longitude && currentPosition.longitude <= sePoint.longitude
    }
  },

  getPointPosition: (point, first, second) => {
    const delta = second.longitude - first.longitude

    if (delta < 0 && delta > -180 || delta > 180) {
      const tmp = first
      first = second
      second = tmp
    }

    if (point.latitude < first.latitude === point.latitude < second.latitude) {
      return 'NO_INTERSECT'
    }

    let x = point.longitude - first.longitude

    if (x < 0 && x > -180 || x > 180) {
      x = (x - 360) % 360
    }

    const x2 = (second.longitude - first.longitude + 360) % 360
    const result = x2 * (point.latitude - first.latitude) / (second.latitude - first.latitude) - x

    if (result > 0) {
      return 'INTERSECT'
    }

    return 'NO_INTERSECT'
  },

  isPointInShape: (point, shape) => {
    let count = 0

    function getIndex(i, shape) {
      return (i + 1) % shape.length
    }

    for (let i = 0; i < shape.length; i++) {
      const position = GeoUtils.getPointPosition(point, shape[i], shape[getIndex(i, shape)])
      switch (position) {
        case 'INTERSECT': {
          count++
          break
        }
        case 'ON_LINE':
        case 'NO_INTERSECT':
        default:
          break
      }
    }

    return count % 2 === 1
  },

  isPointInFence: (geoPoint, geoFence) => {
    return GeoUtils.isPointInRectangular(geoPoint, geoFence.nwPoint, geoFence.sePoint) ||
      geoFence.type === 'CIRCLE' && GeoUtils.isPointInCircle(geoPoint, geoFence.nodes[0],
        GeoUtils.calculateDistance(geoFence.nodes[0].latitude, geoFence.nodes[0].longitude, geoFence.nodes[1].latitude,
          geoFence.nodes[1].longitude)) ||
      geoFence.type === 'SHAPE' && GeoUtils.isPointInShape(geoPoint, geoFence.nodes)
  },

  getOutRectangleNodes: geoPoints => {
    let nwLat = geoPoints[0].latitude
    let nwLon = geoPoints[0].longitude
    let seLat = geoPoints[0].latitude
    let seLon = geoPoints[0].longitude
    let minLon = 0, maxLon = 0, lon = 0

    for (let i = 1; i < geoPoints.length; i++) {
      if (geoPoints[i].latitude > nwLat) {
        nwLat = geoPoints[i].latitude
      }

      if (geoPoints[i].latitude < seLat) {
        seLat = geoPoints[i].latitude
      }

      let deltaLon = geoPoints[i].latitude - geoPoints[i - 1].latitude

      if (deltaLon < 0 && deltaLon > -180 || deltaLon > 270) {
        if (deltaLon > 270) {
          deltaLon -= 360
        }

        lon += deltaLon

        if (lon < minLon) {
          minLon = lon
        }
      } else if (deltaLon > 0 && deltaLon <= 180 || deltaLon <= -270) {
        if (deltaLon <= -270) {
          deltaLon += 360
        }

        lon += deltaLon

        if (lon > maxLon) {
          maxLon = lon
        }
      }
    }

    nwLon += minLon
    seLon += maxLon

    if (seLon - nwLon >= 360) {
      seLon = 180
      nwLon = -180
    } else {
      seLon = GeoUtils.updateDegree(seLon)
      nwLon = GeoUtils.updateDegree(nwLon)
    }

    return [nwLat, nwLon, seLat, seLon]
  },

  getOutRectangleCircle: (center, bounded) => {
    const radius = GeoUtils.calculateDistance(center.latitude, center.longitude, bounded.latitude, bounded.longitude)
    const boundLat = center.latitude + (180 * radius) / (Math.PI * EARTH_RADIUS) * (center.latitude > 0 ? 1 : -1)
    const littleRadius = GeoUtils.countLittleRadius(boundLat)
    let westLong, eastLong, northLat, southLat

    if (littleRadius > radius) {
      westLong = center.longitude - (180 * radius) / littleRadius
      eastLong = 2 * center.longitude - westLong
      westLong = GeoUtils.updateDegree(westLong)
      eastLong = eastLong % 360 === 180 ? 180 : GeoUtils.updateDegree(eastLong)
    } else {
      westLong = -180
      eastLong = 180
    }

    if (center.latitude > 0) {
      northLat = boundLat
      southLat = 2 * center.latitude - boundLat
    } else {
      southLat = boundLat
      northLat = 2 * center.latitude - boundLat
    }

    return [Math.min(northLat, 90), westLong, Math.max(southLat, -90), eastLong]
  },

  getOutRectangle: function() {
    return (arguments.length === 1)
      ? GeoUtils.getOutRectangleNodes(arguments[1])
      : GeoUtils.getOutRectangleCircle(arguments[0], arguments[1])
  },

}

export default GeoUtils