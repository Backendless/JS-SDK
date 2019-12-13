import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

function createRandomCoordinate() {
  return (Math.random() * 100).toPrecision(8)
}

function createPoint(srs) {
  const x = createRandomCoordinate()
  const y = createRandomCoordinate()

  return new Backendless.Data.Point(srs)
    .setX(x)
    .setY(y)
}

function createLineString(srs) {
  const point1 = createPoint()
  const point2 = createPoint()
  const point3 = createPoint()
  const point4 = createPoint()

  return new Backendless.Data.LineString([point1, point2, point3, point4], srs)
}

describe('Backendless.Data.Point', function () {

  it('coordinates of point should be same as during creation', function () {
    const x = createRandomCoordinate()
    const y = createRandomCoordinate()

    const point = new Backendless.Data.Point(Backendless.Data.SpatialReferenceSystem.WGS84)
      .setX(x)
      .setY(y)

    expect(point.getX()).to.be.equal(x)
    expect(point.getY()).to.be.equal(y)
  })

  it('two same points should be equal', function () {
    const x = createRandomCoordinate()
    const y = createRandomCoordinate()

    const point1 = new Backendless.Data.Point(Backendless.Data.SpatialReferenceSystem.WGS84)
      .setX(x)
      .setY(y)

    const point2 = new Backendless.Data.Point(Backendless.Data.SpatialReferenceSystem.WGS84)
      .setX(x)
      .setY(y)

    expect(point1.equals(point2)).to.equal(true)
  })

  it('two different points should not be equal', function () {
    const point1 = createPoint()
    const point2 = createPoint()

    expect(point1.equals(point2)).to.equal(false)
  })

  it('should return correct wkt coordinates pair', function () {
    const point = createPoint()
    const x = point.getX()
    const y = point.getY()

    expect(point.wktCoordinatePairs()).to.equal(`${ x } ${ y }`)
  })

  it('should return correct json coordinates pair', function () {
    const point = createPoint()
    const x = point.getX()
    const y = point.getY()

    expect(point.jsonCoordinatePairs()).to.eql([x, y])
  })

  it('should return correct srs', function () {
    const point = createPoint(Backendless.Data.SpatialReferenceSystem.CARTESIAN)

    expect(point.getSRS()).to.equal(Backendless.Data.SpatialReferenceSystem.CARTESIAN)
  })

  it('should return correct WKT presentation', function () {
    const point = createPoint()

    expect(point.asWKT()).to.equal(`POINT(${ point.getX() } ${ point.getY() })`)
  })
})

describe('Backendless.Data.LineString', function () {

  it('two same linestrings should be equal', function () {
    const point1 = createPoint()
    const point2 = createPoint()
    const point3 = createPoint()

    const lineString1 = new Backendless.Data.LineString([point1, point2, point3])
    const lineString2 = new Backendless.Data.LineString([point1, point2, point3])

    expect(lineString1).to.eql(lineString2)
  })

  it('two different linestrings should not be equal', function () {
    const point1 = createPoint()
    const point2 = createPoint()
    const point3 = createPoint()

    const lineString1 = new Backendless.Data.LineString([point1, point2, point3])
    const lineString2 = new Backendless.Data.LineString([point1, point2])

    expect(lineString1).to.not.eql(lineString2)

    const lineString3 = new Backendless.Data.LineString([point1, point2, point3], Backendless.Data.SpatialReferenceSystem.CARTESIAN)  // eslint-disable-line
    const lineString4 = new Backendless.Data.LineString([point1, point2, point3], Backendless.Data.SpatialReferenceSystem.WGS84)  // eslint-disable-line

    expect(lineString3).to.not.eql(lineString4)
  })

  it('points of the linestring should be same as during creation', function () {
    const point1 = createPoint()
    const point2 = createPoint()

    const lineString = new Backendless.Data.LineString([point1, point2])

    expect(lineString.getPoints()).to.eql([point1, point2])

    lineString.setPoints([point2, point1])

    expect(lineString.getPoints()).to.eql([point2, point1])
  })

  it('should return correct json coordinates pair', function () {
    const point1 = createPoint()
    const point2 = createPoint()

    const lineString = new Backendless.Data.LineString([point1, point2])
    const expectedCoordinatePairs = [point1, point2].map(point => [point.getX(), point.getY()])

    expect(lineString.jsonCoordinatePairs()).to.eql(expectedCoordinatePairs)
  })

  it('should return correct srs', function () {
    const point1 = createPoint()
    const point2 = createPoint()

    const lineString = new Backendless.Data.LineString([point1, point2])

    expect(lineString.getSRS()).to.eql(Backendless.Data.SpatialReferenceSystem.DEFAULT)

    const lineString2 = new Backendless.Data.LineString([point1, point2], Backendless.Data.SpatialReferenceSystem.CARTESIAN) // eslint-disable-line

    expect(lineString2.getSRS()).to.eql(Backendless.Data.SpatialReferenceSystem.CARTESIAN)
  })

  it('should return correct wkt presentation', function () {
    const point1 = createPoint()
    const point2 = createPoint()

    const x1 = point1.getX()
    const y1 = point1.getY()
    const x2 = point2.getX()
    const y2 = point2.getY()

    const lineString = new Backendless.Data.LineString([point1, point2])

    expect(lineString.asWKT()).to.eql(`LINESTRING(${ x1 } ${ y1 },${ x2 } ${ y2 })`)
  })
})

describe('Backendless.Data.Polygon', function () {
  it('two same polygons should be equal', function () {
    const lineString1 = createLineString()
    const lineString2 = createLineString()

    const polygon1 = new Backendless.Data.Polygon(lineString1)
    const polygon2 = new Backendless.Data.Polygon(lineString1)

    expect(polygon1).to.eql(polygon2)

    const polygon3 = new Backendless.Data.Polygon(lineString1, [lineString1, lineString2])
    const polygon4 = new Backendless.Data.Polygon(lineString1, [lineString1, lineString2])

    expect(polygon3).to.eql(polygon4)
  })

  it('two different polygons should not be equal', function () {
    const lineString1 = createLineString()
    const lineString2 = createLineString()

    const polygon1 = new Backendless.Data.Polygon(lineString1)
    const polygon2 = new Backendless.Data.Polygon(lineString2)

    expect(polygon1).to.not.eql(polygon2)

    const polygon3 = new Backendless.Data.Polygon(lineString1, [lineString1, lineString2])
    const polygon4 = new Backendless.Data.Polygon(lineString1, [lineString2, lineString1])

    expect(polygon3).to.not.eql(polygon4)
  })

  it('boundary of the polygon should be same as during creation', function () {
    const lineString1 = createLineString()
    const lineString2 = createLineString()

    const polygon = new Backendless.Data.Polygon(lineString1)

    expect(polygon.getBoundary()).to.eql(lineString1)

    polygon.setBoundary(lineString2)

    expect(polygon.getBoundary()).to.eql(lineString2)
  })

  it('holes of the polygon should be same as during creation', function () {
    const lineString1 = createLineString()
    const lineString2 = createLineString()

    const polygon = new Backendless.Data.Polygon(lineString1, [lineString1, lineString2])

    expect(polygon.getHoles()).to.eql([lineString1, lineString2])

    polygon.setHoles([lineString2, lineString1])

    expect(polygon.getHoles()).to.eql([lineString2, lineString1])
  })

  it('should return correct json coordinates pairs', function () {
    const lineString = createLineString()

    const polygon = new Backendless.Data.Polygon(lineString)

    const expectedJsonCoordinatesPairs = lineString.getPoints().map(point => {
      return [point.getX(), point.getY()]
    })

    expect(polygon.jsonCoordinatePairs()).to.eql([expectedJsonCoordinatesPairs])
  })

  it('should return correct wkt presentation', function () {
    const x1 = createRandomCoordinate()
    const y1 = createRandomCoordinate()
    const x2 = createRandomCoordinate()
    const y2 = createRandomCoordinate()
    const x3 = createRandomCoordinate()
    const y3 = createRandomCoordinate()
    const x4 = createRandomCoordinate()
    const y4 = createRandomCoordinate()

    const points = [[x1, y1], [x2, y2], [x3, y3], [x4, y4]].map(([x, y]) => {
      return new Backendless.Data.Point()
        .setX(x)
        .setY(y)
    })

    const lineString = new Backendless.Data.LineString(points)

    const polygon = new Backendless.Data.Polygon(lineString)

    const expectedWKT = `POLYGON((${ x1 } ${ y1 },${ x2 } ${ y2 },${ x3 } ${ y3 },${ x4 } ${ y4 }))`

    expect(polygon.asWKT()).to.eql(expectedWKT)
  })
})

describe('Parse from WKT', function () {
  it('should correctly parse wkt point', function () {
    const pointWKT = 'POINT(10 20)'
    const pointObj = Backendless.Data.Geometry.fromWKT(pointWKT)

    expect(pointObj.getX()).to.eql(10)
    expect(pointObj.getY()).to.eql(20)
    expect(pointObj.asWKT()).to.eql(pointWKT)

    const constructedPoint = new Backendless.Data.Point().setX(10).setY(20)

    expect(constructedPoint).to.eql(pointObj)
  })

  it('should correctly parse wkt linestring', function () {
    const linestringWKT = 'LINESTRING(10 20,20 30,30 40)'
    const linestringObj = Backendless.Data.Geometry.fromWKT(linestringWKT)

    const point1 = new Backendless.Data.Point().setX(10).setY(20)
    const point2 = new Backendless.Data.Point().setX(20).setY(30)
    const point3 = new Backendless.Data.Point().setX(30).setY(40)

    expect(linestringObj.getPoints()).to.eql([point1, point2, point3])
    expect(linestringObj.asWKT()).to.eql(linestringWKT)

    const constructedLinestring = new Backendless.Data.LineString([point1, point2, point3])

    expect(constructedLinestring).to.eql(linestringObj)
  })

  it('should correctly parse wkt polygon', function () {
    const polygonWKT = 'POLYGON((10 20,20 30,30 10),(2 3,3 7,7 2))'
    const polygonObj = Backendless.Data.Geometry.fromWKT(polygonWKT)

    const outerPoint1 = new Backendless.Data.Point().setX(10).setY(20)
    const outerPoint2 = new Backendless.Data.Point().setX(20).setY(30)
    const outerPoint3 = new Backendless.Data.Point().setX(30).setY(10)
    const innerPoint1 = new Backendless.Data.Point().setX(2).setY(3)
    const innerPoint2 = new Backendless.Data.Point().setX(3).setY(7)
    const innerPoint3 = new Backendless.Data.Point().setX(7).setY(2)

    const expectedBoundary = new Backendless.Data.LineString([outerPoint1, outerPoint2, outerPoint3])
    const expectedHoles = new Backendless.Data.LineString([innerPoint1, innerPoint2, innerPoint3])

    expect(polygonObj.getBoundary()).to.eql(expectedBoundary)
    expect(polygonObj.getHoles()).to.eql([expectedHoles])

    const constructedPolygon = new Backendless.Data.Polygon(expectedBoundary, [expectedHoles])

    expect(constructedPolygon).to.eql(polygonObj)
  })
})

describe('Parse from GeoJSON', function () {
  it('should correctly parse point geoJSON', function () {
    const constructedPoint = new Backendless.Data.Point().setX(10).setY(20)

    const pointObj = Backendless.Data.Geometry.fromGeoJSON(constructedPoint.asGeoJSON())

    expect(pointObj.getX()).to.eql(10)
    expect(pointObj.getY()).to.eql(20)
    expect(pointObj.asGeoJSON()).to.eql(constructedPoint.asGeoJSON())
    expect(pointObj).to.eql(constructedPoint)
  })

  it('should correctly parse linestring geoJSON', function () {
    const point1 = new Backendless.Data.Point().setX(10).setY(20)
    const point2 = new Backendless.Data.Point().setX(20).setY(30)
    const point3 = new Backendless.Data.Point().setX(30).setY(40)

    const constructedLineString = new Backendless.Data.LineString([point1, point2, point3])

    const linestringObj = Backendless.Data.Geometry.fromGeoJSON(constructedLineString.asGeoJSON())

    expect(linestringObj.getPoints()).to.eql([point1, point2, point3])
    expect(linestringObj.asGeoJSON()).to.eql(constructedLineString.asGeoJSON())
    expect(linestringObj).to.eql(constructedLineString)
  })

  it('should correctly parse polygon geoJSON', function () {
    const outerPoint1 = new Backendless.Data.Point().setX(10).setY(20)
    const outerPoint2 = new Backendless.Data.Point().setX(20).setY(30)
    const outerPoint3 = new Backendless.Data.Point().setX(30).setY(10)
    const innerPoint1 = new Backendless.Data.Point().setX(2).setY(3)
    const innerPoint2 = new Backendless.Data.Point().setX(3).setY(7)
    const innerPoint3 = new Backendless.Data.Point().setX(7).setY(2)

    const boundary = new Backendless.Data.LineString([outerPoint1, outerPoint2, outerPoint3])
    const holes = new Backendless.Data.LineString([innerPoint1, innerPoint2, innerPoint3])

    const constructedPolygon = new Backendless.Data.Polygon(boundary, [holes])

    const polygonObj = Backendless.Data.Geometry.fromGeoJSON(constructedPolygon.asGeoJSON())

    expect(polygonObj.getBoundary()).to.eql(boundary)
    expect(polygonObj.getHoles()).to.eql([holes])
    expect(polygonObj.asGeoJSON()).to.eql(constructedPolygon.asGeoJSON())
    expect(constructedPolygon).to.eql(polygonObj)
  })
})

