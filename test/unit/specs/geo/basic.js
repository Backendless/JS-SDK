import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('<GEO> (Deprecated)', function() {

  forTest(this)

  const fakeResult = { foo: 123 }

  const categoryName = 'TEST_CATEGORY'
  const fenceName = 'TEST_FENCE'

  describe('Category', () => {
    it('should load categories', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await Backendless.Geo.getCategories()

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/geo/categories`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('should create category', async () => {
      const req1 = prepareMockRequest({ result: fakeResult })

      const result1 = await Backendless.Geo.addCategory(categoryName)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/geo/categories/${categoryName}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql({ result: fakeResult })
    })

    it('should delete category', async () => {
      const req1 = prepareMockRequest({ result: fakeResult })

      const result1 = await Backendless.Geo.deleteCategory(categoryName)

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/geo/categories/${categoryName}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql({result: fakeResult})
    })
  })

  describe('Point', () => {
    it('should create a new point #1', async () => {
      const req1 = prepareMockRequest({
        geopoint: {
          categories: ['default'],
          latitude  : 111,
          longitude : 222,
          metadata  : {},
          objectId  : 'test-id',
        }
      })

      const result1 = await Backendless.Geo.savePoint({
        latitude : 111,
        longitude: 222,
      })

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/geo/points`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          categories: ['Default'],
          latitude  : 111,
          longitude : 222,
        }
      })

      expect(result1).to.be.eql({
        ___class  : 'GeoPoint',
        categories: ['default'],
        distance  : undefined,
        latitude  : 111,
        longitude : 222,
        metadata  : {},
        objectId  : 'test-id',
      })
    })

    it('should create a new point #2', async () => {
      const req1 = prepareMockRequest({
        geopoint: {
          categories: ['default'],
          latitude  : 111,
          longitude : 222,
          metadata  : {},
          objectId  : 'test-id',
        }
      })

      const result1 = await Backendless.Geo.addPoint({
        latitude : 111,
        longitude: 222,
      })

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/geo/points`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          categories: ['Default'],
          latitude  : 111,
          longitude : 222,
        }
      })

      expect(result1).to.be.eql({
        ___class  : 'GeoPoint',
        categories: ['default'],
        distance  : undefined,
        latitude  : 111,
        longitude : 222,
        metadata  : {},
        objectId  : 'test-id',
      })
    })

    it('should update point', async () => {
      const req1 = prepareMockRequest({
        geopoint: {
          categories: ['default'],
          latitude  : 111,
          longitude : 222,
          metadata  : {},
          objectId  : 'test-id',
        }
      })

      const result1 = await Backendless.Geo.savePoint({
        latitude : 111,
        longitude: 222,
        objectId : 'test-id',
      })

      expect(req1).to.deep.include({
        method : 'PATCH',
        path   : `${APP_PATH}/geo/points/test-id`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          categories: ['Default'],
          latitude  : 111,
          longitude : 222,
          objectId  : 'test-id'
        }
      })

      expect(result1).to.be.eql({
        ___class  : 'GeoPoint',
        categories: ['default'],
        distance  : undefined,
        latitude  : 111,
        longitude : 222,
        metadata  : {},
        objectId  : 'test-id',
      })
    })

    it('should delete point #1', async () => {
      const req1 = prepareMockRequest({ data: fakeResult })

      const result1 = await Backendless.Geo.deletePoint({
        latitude : 111,
        longitude: 222,
        objectId : 'test-id',
      })

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/geo/points/test-id`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql({ data: fakeResult })
    })

    it('should delete point #2', async () => {
      const req1 = prepareMockRequest({ data: fakeResult })

      const result1 = await Backendless.Geo.deletePoint('test-id')

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/geo/points/test-id`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql({ data: fakeResult })
    })
  })

  describe('Find', () => {
    let query
    let queryObject

    beforeEach(() => {
      query = new Backendless.Geo.Query()
      query.addCategory(categoryName)

      queryObject = {
        latitude  : 41.38,
        longitude : 2.15,
        radius    : 100000,
        units     : 'METERS',
        categories: [categoryName]
      }
    })

    it('should load points with minimal query', async () => {
      const req1 = prepareMockRequest([])

      const result1 = await Backendless.Geo.find(query)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/geo/points?categories=${categoryName}&includemetadata=true`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([])
    })

    it('should load points in radius', async () => {
      const req1 = prepareMockRequest([])

      const result1 = await Backendless.Geo.find(queryObject)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/geo/points?lat=41.38&lon=2.15&r=100000&units=METERS&categories=${categoryName}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([])
    })

    it('should load points in rectangle', async () => {
      const req1 = prepareMockRequest([])

      queryObject = {
        searchRectangle: [32.78, -96.8, 25.79, -80.22],
        categories     : [categoryName]
      }

      const result1 = await Backendless.Geo.find(queryObject)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/geo/rect?nwlat=32.78&nwlon=-96.8&selat=25.79&selon=-80.22&categories=${categoryName}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([])
    })

    it('should load fence points in rectangle', async () => {
      const req1 = prepareMockRequest([])

      queryObject = {
        searchRectangle: [32.78, -96.8, 25.79, -80.22],
        categories     : [categoryName]
      }

      const result1 = await Backendless.Geo.getFencePoints(fenceName, queryObject)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/geo/rect?nwlat=32.78&nwlon=-96.8&selat=25.79&selon=-80.22&categories=${categoryName}&geoFence=${fenceName}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([])
    })

    it('should load metadata', async () => {
      const req1 = prepareMockRequest([])

      const geoObject = new Backendless.Geo.Cluster()
      geoObject.objectId = 'test-id'
      geoObject.geoQuery = query

      const result1 = await Backendless.Geo.loadMetadata(geoObject)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/geo/points/test-id/metadata?&categories=${categoryName}&includemetadata=true`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([])
    })

    it('should load cluster points', async () => {
      const req1 = prepareMockRequest([])

      const geoObject = new Backendless.Geo.Cluster()
      geoObject.objectId = 'test-id'
      geoObject.geoQuery = query

      const result1 = await Backendless.Geo.getClusterPoints(geoObject)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/geo/clusters/test-id/points?&categories=${categoryName}&includemetadata=true`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([])
    })

    it('should load points count in rectangle', async () => {
      const req1 = prepareMockRequest(fakeResult)

      queryObject = {
        searchRectangle: [32.78, -96.8, 25.79, -80.22],
        categories     : [categoryName]
      }

      const result1 = await Backendless.Geo.getGeopointCount(queryObject)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/geo/count?nwlat=32.78&nwlon=-96.8&selat=25.79&selon=-80.22&categories=${categoryName}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(fakeResult)
    })
  })

})
