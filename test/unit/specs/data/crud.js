import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest, Utils } from '../../helpers/sandbox'

function getTestObject() {
  return {
    str : 'test-1',
    num : 123,
    bool: true
  }
}

function getTestObjectWithId() {
  return {
    ...getTestObject(),
    objectId: Utils.objectId()
  }
}

describe('<Data> CRUD', function() {

  forTest(this)

  const fakeResult = { foo: 123 }

  const tableName = 'Person'

  class ClassPerson {
  }

  describe('Save', () => {
    it('creates object', async () => {
      const newObject = getTestObject()
      const savedObject = getTestObjectWithId()

      const req1 = prepareMockRequest(savedObject)

      const result1 = await Backendless.Data.of(tableName).save(newObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : newObject
      })

      expect(result1).to.be.eql(savedObject)
      expect(result1).to.not.equal(newObject)
    })

    it('creates object instance', async () => {
      const newObject = getTestObject()
      const savedObject = getTestObjectWithId()

      const req1 = prepareMockRequest(savedObject)

      const result1 = await Backendless.Data.of(ClassPerson).save(newObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/ClassPerson`,
        headers: { 'Content-Type': 'application/json' },
        body   : newObject
      })

      expect(result1).to.not.equal(newObject)
      expect(result1).to.be.instanceof(ClassPerson)
      expect(result1).to.be.eql({
        objectId: savedObject.objectId,
        str     : 'test-1',
        num     : 123,
        bool    : true,
      })
    })

    it('resolve children', async () => {
      const newObject = getTestObject()
      const savedObject = getTestObjectWithId()

      class FooItems {
      }

      class BarItem {
      }

      Backendless.Data.mapTableToClass('FooItems', FooItems)
      Backendless.Data.mapTableToClass('BarItem', BarItem)

      const req1 = prepareMockRequest({
        ...savedObject,
        fooItems: [{ ___class: 'FooItems' }, { ___class: 'FooItems' }, { ___class: 'FooItems' }],
        barItem : { ___class: 'BarItem' },
      })

      const result1 = await Backendless.Data.of(ClassPerson).save(newObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/ClassPerson`,
        headers: { 'Content-Type': 'application/json' },
        body   : newObject
      })

      expect(result1).to.not.equal(newObject)
      expect(result1).to.deep.include(savedObject)
      expect(result1).to.be.instanceof(ClassPerson)
      expect(result1.barItem).to.be.instanceof(BarItem)
      expect(result1.fooItems[0]).to.be.instanceof(FooItems)
      expect(result1.fooItems[1]).to.be.instanceof(FooItems)
      expect(result1.fooItems[2]).to.be.instanceof(FooItems)
    })

    it('should process circular values', async () => {
      const child1 = { v: 1 }
      const child2 = { v: 2 }
      const child3 = { v: 3 }
      const child4 = { v: 4 }

      const obj1 = { child1, child2 }
      const obj2 = { child3, child4 }
      const obj3 = { child1, child4 }
      const obj4 = { child1, child2 }

      obj1.obj2 = obj2
      obj2.obj3 = obj3
      obj3.obj4 = obj4
      obj4.obj1 = obj1
      obj4.obj2 = obj2
      obj4.obj3 = obj3

      const parent = { obj1, obj2, obj3, child2, child4 }

      const req1 = prepareMockRequest(fakeResult)

      await Backendless.Data.of(tableName).save(parent)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}`,
        headers: { 'Content-Type': 'application/json' }
      })

      const requestBody = req1.body

      const obj1__id = requestBody.obj1.__subID
      const obj2__id = requestBody.obj1.obj2.__subID
      const obj3__id = requestBody.obj1.obj2.obj3.__subID
      const child1__id = requestBody.obj1.child1.__subID
      const child2__id = requestBody.obj1.child2.__subID
      const child4__id = requestBody.obj1.obj2.child4.__subID

      expect(obj1__id).to.be.a('string')
      expect(obj2__id).to.be.a('string')
      expect(obj3__id).to.be.a('string')

      expect(child1__id).to.be.a('string')
      expect(child2__id).to.be.a('string')
      expect(child4__id).to.be.a('string')

      // obj4 is not a relation
      expect(requestBody.obj1.obj2.obj3.obj4).to.not.have.property('__subID')
      expect(requestBody.obj1.obj2.obj3.obj4).to.not.have.property('__originSubID')

      // child3 is not a relation
      expect(requestBody.obj1.obj2.child3).to.be.eql({ v: 3 })

      expect(requestBody).to.be.eql({
        'obj1'  : {
          'child1' : { 'v': 1, '__subID': child1__id },
          'child2' : { 'v': 2, '__subID': child2__id },
          'obj2'   : {
            'child3' : { 'v': 3 },
            'child4' : { 'v': 4, '__subID': child4__id },
            'obj3'   : {
              'child1' : { '__originSubID': child1__id },
              'child4' : { '__originSubID': child4__id },
              'obj4'   : {
                'child1': { '__originSubID': child1__id },
                'child2': { '__originSubID': child2__id },
                'obj1'  : { '__originSubID': obj1__id },
                'obj2'  : { '__originSubID': obj2__id },
                'obj3'  : { '__originSubID': obj3__id }
              },
              '__subID': obj3__id
            },
            '__subID': obj2__id
          },
          '__subID': obj1__id
        },
        'obj2'  : { '__originSubID': obj2__id },
        'obj3'  : { '__originSubID': obj3__id },
        'child2': { '__originSubID': child2__id },
        'child4': { '__originSubID': child4__id }
      })
    })

    it('should process Geometry instances', async () => {
      const point1 = new Backendless.Data.Point().setX(10).setY(20)
      const point2 = new Backendless.Data.Point().setX(30).setY(40)
      const point3 = new Backendless.Data.Point().setX(50).setY(60)
      const point4 = new Backendless.Data.Point().setX(70).setY(80)
      const point5 = new Backendless.Data.Point().setX(90).setY(100)

      const lineString1 = new Backendless.Data.LineString([point1, point2, point3, point4, point4, point5])
      const lineString2 = new Backendless.Data.LineString([point3, point4, point5])
      const lineString3 = new Backendless.Data.LineString([point4, point5, point1])

      const polygon1 = new Backendless.Data.Polygon(lineString1)
      const polygon2 = new Backendless.Data.Polygon(lineString2)
      const polygon3 = new Backendless.Data.Polygon(lineString3, [lineString1, lineString2])

      const parent = {
        point1,
        point2,
        point3,
        point4,
        point5,
        lineString1,
        lineString2,
        lineString3,
        polygon1,
        polygon2,
        polygon3,
      }

      const req1 = prepareMockRequest(fakeResult)

      await Backendless.Data.of(tableName).save(parent)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}`,
        headers: { 'Content-Type': 'application/json' }
      })

      const requestBody = req1.body

      expect(requestBody).to.be.eql({
        'point1'     : { 'type': 'Point', 'coordinates': [10, 20] },
        'point2'     : { 'type': 'Point', 'coordinates': [30, 40] },
        'point3'     : { 'type': 'Point', 'coordinates': [50, 60] },
        'point4'     : { 'type': 'Point', 'coordinates': [70, 80] },
        'point5'     : { 'type': 'Point', 'coordinates': [90, 100] },
        'lineString1': {
          'type'       : 'LineString',
          'coordinates': [[10, 20], [30, 40], [50, 60], [70, 80], [70, 80], [90, 100]]
        },
        'lineString2': {
          'type'       : 'LineString',
          'coordinates': [[50, 60], [70, 80], [90, 100]]
        },
        'lineString3': {
          'type'       : 'LineString',
          'coordinates': [[70, 80], [90, 100], [10, 20]]
        },
        'polygon1'   : {
          'type'       : 'Polygon',
          'coordinates': [[[10, 20], [30, 40], [50, 60], [70, 80], [70, 80], [90, 100]]]
        },
        'polygon2'   : {
          'type'       : 'Polygon',
          'coordinates': [[[50, 60], [70, 80], [90, 100]]]
        },
        'polygon3'   : {
          'type'       : 'Polygon',
          'coordinates': [[[70, 80], [90, 100], [10, 20]], [[10, 20], [30, 40], [50, 60], [70, 80], [70, 80], [90, 100]], [[50, 60], [70, 80], [90, 100]]]
        }
      })
    })

    it('should convert Date into timestamp', async () => {
      const date1 = new Date()
      const date2 = new Date()
      const date3 = new Date()
      const date4 = new Date()

      const newObject = {
        date  : date1,
        sub   : {
          date  : date2,
          dates1: [date1, date2]
        },
        dates2: [date1, date2],
        dates3: {
          values: [date3, date4]
        },
      }

      const req1 = prepareMockRequest({})

      await Backendless.Data.of(tableName).save(newObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          date  : date1.getTime(),
          sub   : {
            date  : date2.getTime(),
            dates1: [date1.getTime(), date2.getTime()]
          },
          dates2: [date1.getTime(), date2.getTime()],
          dates3: {
            values: [date3.getTime(), date4.getTime()]
          }
        }
      })
    })
  })

  describe('Update', () => {
    it('updates object', async () => {
      const savedObject = getTestObjectWithId()
      savedObject.updatedProp = 'new-value'

      const req1 = prepareMockRequest({ ...savedObject })

      const result1 = await Backendless.Data.of(tableName).save(savedObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : savedObject
      })

      expect(result1).to.be.eql(savedObject)
      expect(result1).to.not.equal(savedObject)
    })

    it('creates object instance', async () => {
      const savedObject = getTestObjectWithId()
      savedObject.updatedProp = 'new-value'

      const req1 = prepareMockRequest({ ...savedObject })

      const result1 = await Backendless.Data.of(ClassPerson).save(savedObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/ClassPerson`,
        headers: { 'Content-Type': 'application/json' },
        body   : savedObject
      })

      expect(result1).to.be.eql(savedObject)
      expect(result1).to.be.instanceof(ClassPerson)
      expect(result1).to.not.equal(savedObject)
    })
  })

  describe('Remove', () => {
    it('removes object', async () => {
      const savedObject = getTestObjectWithId()

      const req1 = prepareMockRequest(fakeResult)

      const result1 = await Backendless.Data.of(tableName).remove(savedObject)

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/data/${tableName}/${savedObject.objectId}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('removes object by its id', async () => {
      const savedObject = getTestObjectWithId()

      const req1 = prepareMockRequest(fakeResult)

      const result1 = await Backendless.Data.of(tableName).remove(savedObject.objectId)

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/data/${tableName}/${savedObject.objectId}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('fails when objectId is invalid', async () => {
      const errorMsg = 'Object Id must be provided and must be a string.'

      const dataStore = Backendless.Data.of(tableName)

      await expect(dataStore.remove()).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

})
