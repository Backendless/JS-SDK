import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('<Data> Store', function() {

  forTest(this)

  const tableName = 'Person'

  it('creates store from string', async () => {
    const dataStore = Backendless.Data.of(tableName)

    expect(dataStore.className).to.be.eql(tableName)
  })

  it('creates store from class', async () => {
    class ClassPersons {
    }

    const dataStore = Backendless.Data.of(ClassPersons)

    expect(dataStore.className).to.be.eql('ClassPersons')
  })

  it('creates store from function', () => {
    function FuncPersons() {
    }

    const dataStore = Backendless.Data.of(FuncPersons)

    expect(dataStore.className).to.be.eql('FuncPersons')
  })

  it('creates store from variable', async () => {
    const VarPersons = function() {
    }

    const dataStore = Backendless.Data.of(VarPersons)

    expect(dataStore.className).to.be.eql('VarPersons')
  })

  it('fails when className is invalid', async () => {
    const errorMsg = 'Class name should be specified'

    expect(() => Backendless.Data.of()).to.throw(errorMsg)
    expect(() => Backendless.Data.of('')).to.throw(errorMsg)
    expect(() => Backendless.Data.of(false)).to.throw(errorMsg)
    expect(() => Backendless.Data.of(true)).to.throw(errorMsg)
    expect(() => Backendless.Data.of(null)).to.throw(errorMsg)
    expect(() => Backendless.Data.of(undefined)).to.throw(errorMsg)
    expect(() => Backendless.Data.of(0)).to.throw(errorMsg)
    expect(() => Backendless.Data.of(123)).to.throw(errorMsg)
    expect(() => Backendless.Data.of({})).to.throw(errorMsg)
    expect(() => Backendless.Data.of([])).to.throw(errorMsg)
    expect(() => Backendless.Data.of(() => ({}))).to.throw(errorMsg)
  })

  describe('Describe', () => {
    let req1

    const fakeResult = { foo: 123 }

    beforeEach(() => {
      req1 = prepareMockRequest(fakeResult)

    })

    it('describes table from string', async () => {
      const result = await Backendless.Data.describe(tableName)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/Person/properties`,
        headers: {},
        body   : undefined
      })

      expect(result).to.be.eql(fakeResult)
    })

    it('describes table from class', async () => {
      class ClassPersons {
      }

      const result = await Backendless.Data.describe(ClassPersons)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/ClassPersons/properties`,
        headers: {},
        body   : undefined
      })

      expect(result).to.be.eql(fakeResult)
    })

    it('describes table from function', async () => {
      class FuncPersons {
      }

      const result = await Backendless.Data.describe(FuncPersons)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/FuncPersons/properties`,
        headers: {},
        body   : undefined
      })

      expect(result).to.be.eql(fakeResult)
    })

    it('describes table from expression', async () => {
      const VarPersons = function() {
      }

      const result = await Backendless.Data.describe(VarPersons)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/VarPersons/properties`,
        headers: {},
        body   : undefined
      })

      expect(result).to.be.eql(fakeResult)
    })
  })

  describe('Classes Map', () => {

    it('uses class on initializing a data store', async () => {
      class Foo {
      }

      Backendless.Data.mapTableToClass('bar', Foo)

      const dataStore = Backendless.Data.of('bar')

      expect(dataStore.className).to.be.equal('bar')
      expect(dataStore.model).to.be.equal(Foo)
    })

    it('initialize a data model without className', async () => {
      class Foo {
      }

      Backendless.Data.mapTableToClass(Foo)

      const dataStore = Backendless.Data.of('Foo')

      expect(dataStore.className).to.be.equal('Foo')
      expect(dataStore.model).to.be.equal(Foo)
    })

    it('fails when tableName is invalid', async () => {
      const errorMsg = 'Table Name must be provided and must be a string.'

      expect(() => Backendless.Data.mapTableToClass()).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass('')).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass(false)).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass(true)).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass(null)).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass(undefined)).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass(0)).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass(123)).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass({})).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass([])).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass(() => ({}))).to.throw(errorMsg)
    })

    it('fails when clientClass is invalid', async () => {
      const errorMsg = 'Class must be provided and must be a constructor function.'

      expect(() => Backendless.Data.mapTableToClass('foo')).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass('foo', '')).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass('foo', false)).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass('foo', true)).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass('foo', null)).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass('foo', undefined)).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass('foo', 0)).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass('foo', 123)).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass('foo', {})).to.throw(errorMsg)
      expect(() => Backendless.Data.mapTableToClass('foo', [])).to.throw(errorMsg)
    })
  })

  describe('Table Name By Id', () => {
    it('table id from string', async () => {
      const fakeResult = 'tableName'
      const tableId = '123'

      const req1 = prepareMockRequest(fakeResult)

      const result = await Backendless.Data.getTableNameById(tableId)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableId}/table-name`,
        headers: {},
        body   : undefined
      })

      expect(result).to.be.eql(fakeResult)
    })
  })

})
