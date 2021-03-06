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

describe('<Data> Deep Save', function() {

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

      const result1 = await Backendless.Data.of(tableName).deepSave(newObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}/deep-save`,
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

      const result1 = await Backendless.Data.of(ClassPerson).deepSave(newObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/ClassPerson/deep-save`,
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

      const result1 = await Backendless.Data.of(ClassPerson).deepSave(newObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/ClassPerson/deep-save`,
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

      await Backendless.Data.of(tableName).deepSave(parent)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}/deep-save`,
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
  })
})
