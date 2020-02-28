import wktToGeoJSON from './wkt-to-geojson'
import geoConstructor from './geo-constructor'

export class WKTParser {
  constructor(srs) {
    this.srs = srs
  }

  read(wktString) {
    const geoObject = wktToGeoJSON(wktString)

    if (!geoObject) {
      throw new Error('WKT string is invalid')
    }

    return geoConstructor(geoObject, this.srs)
  }
}

export default WKTParser