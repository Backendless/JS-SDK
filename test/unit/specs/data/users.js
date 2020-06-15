import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('<Data> Users', function() {

  forTest(this)

  const fakeResult = { foo: 123 }

  const tableName = 'Users'

  let dataStore
  let query

  beforeEach(() => {
    dataStore = Backendless.Data.of(tableName)

    query = Backendless.Data.QueryBuilder.create()
  })

  describe('Find', () => {
    it('should return User instance', async () => {
      prepareMockRequest(fakeResult)

      const result1 = await dataStore.find()

      expect(result1).to.be.instanceof(Backendless.User)
      expect(result1).to.be.eql({
        ___class: 'Users',
        ...fakeResult,
      })
    })

  })

  describe('FindById', () => {
    it('should return User instance', async () => {
      prepareMockRequest(fakeResult)

      const result1 = await dataStore.findById('test-id')

      expect(result1).to.be.instanceof(Backendless.User)
      expect(result1).to.be.eql({
        ___class: 'Users',
        ...fakeResult,
      })
    })
  })

  describe('FindFirst', () => {
    it('should return User instance', async () => {
      prepareMockRequest(fakeResult)

      const result1 = await dataStore.findFirst()

      expect(result1).to.be.instanceof(Backendless.User)
      expect(result1).to.be.eql({
        ___class: 'Users',
        ...fakeResult,
      })
    })
  })

  describe('FindLast', () => {
    it('should return User instance', async () => {
      prepareMockRequest(fakeResult)

      const result1 = await dataStore.findLast()

      expect(result1).to.be.instanceof(Backendless.User)
      expect(result1).to.be.eql({
        ___class: 'Users',
        ...fakeResult,
      })
    })

  })

  describe('As Relations', () => {
    const relationName = 'testChildColumn'

    const parent = { objectId: 'parent-id' }

    it('loads User instances', async () => {
      prepareMockRequest([
        { ___class: 'Users', foo: 1 },
        { ___class: 'Users', foo: 2 },
        { ___class: 'Users', foo: 3 }
      ])

      const result1 = await dataStore.loadRelations(parent, { relationName })

      expect(result1[0]).to.be.instanceof(Backendless.User)
      expect(result1[1]).to.be.instanceof(Backendless.User)
      expect(result1[2]).to.be.instanceof(Backendless.User)

      expect(result1).to.be.eql([
        { ___class: 'Users', foo: 1 },
        { ___class: 'Users', foo: 2 },
        { ___class: 'Users', foo: 3 }
      ])
    })

  })

})
