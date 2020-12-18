import sandbox from '../helpers/sandbox'
import { expect } from 'chai'

const Backendless = sandbox.Backendless

describe('Data - Deep Save', function() {

  let parentTableStore
  let childTableStore

  sandbox.forSuite()

  const PARENT_TABLE_NAME = 'Person'
  const CHILD_TABLE_NAME = 'People'

  before(async function() {
    parentTableStore = Backendless.Data.of(PARENT_TABLE_NAME)
    childTableStore = Backendless.Data.of(CHILD_TABLE_NAME)

    await this.tablesAPI.createTable(PARENT_TABLE_NAME)
    await this.tablesAPI.createTable(CHILD_TABLE_NAME)

    await this.tablesAPI.createColumn(PARENT_TABLE_NAME, 'name', this.tablesAPI.DataTypes.STRING)
    await this.tablesAPI.createColumn(PARENT_TABLE_NAME, 'age', this.tablesAPI.DataTypes.INT)
    await this.tablesAPI.createColumn(CHILD_TABLE_NAME, 'name', this.tablesAPI.DataTypes.STRING)
    await this.tablesAPI.createColumn(CHILD_TABLE_NAME, 'age', this.tablesAPI.DataTypes.INT)

    await this.tablesAPI.createRelationColumn(PARENT_TABLE_NAME, 'friend', CHILD_TABLE_NAME, this.tablesAPI.RelationTypes.ONE_TO_ONE)
    await this.tablesAPI.createRelationColumn(PARENT_TABLE_NAME, 'family', CHILD_TABLE_NAME, this.tablesAPI.RelationTypes.ONE_TO_MANY)
  })

  beforeEach(async function() {
    await childTableStore.bulkDelete('objectId is not null')

    await childTableStore.bulkCreate([{ name: 'Bob', age: 20, objectId: '1' }])
  })

  it('create object 1:1 (create relation with existed object)', function() {
    return Promise.resolve()
      .then(() => parentTableStore.deepSave({
        name  : 'Joe',
        age   : 30,
        friend: { objectId: '1' }
      }))
      .then(result => {
        expect(result).to.have.property('name', 'Joe')
        expect(result).to.have.property('age', 30)
        expect(result).to.have.property('friend')
        expect(result.friend).to.have.property('name', 'Bob')
        expect(result.friend).to.have.property('age', 20)
      })
  })

  it('update object 1:1 (update relation)', function() {
    return Promise.resolve()
      .then(() => parentTableStore.deepSave({
        name  : 'Joe',
        age   : 30,
        friend: { objectId: '1' }
      }))
      .then(result => parentTableStore.deepSave({
        age     : 25,
        objectId: result.objectId,
        friend  : { name: 'Suzi', age: 20 }
      }))
      .then(result => {
        expect(result).to.have.property('name', 'Joe')
        expect(result).to.have.property('age', 25)
        expect(result).to.have.property('friend')
        expect(result.friend).to.have.property('name', 'Suzi')
        expect(result.friend).to.have.property('age', 20)
      })
  })

  it('1:1 (delete relation)', function() {
    return Promise.resolve()
      .then(() => parentTableStore.deepSave({
        name  : 'Joe',
        age   : 25,
        friend: { objectId: '1' }
      }))
      .then(result => parentTableStore.deepSave({
        objectId: result.objectId,
        friend  : null
      }))
      .then(result => {
        expect(result).to.have.property('name', 'Joe')
        expect(result).to.have.property('age', 25)
        expect(result).to.not.have.property('friend')
      })
  })

  it('create new object 1:N (update - one, create - one)', function() {
    return Promise.resolve()
      .then(() => parentTableStore.deepSave({
        name  : 'Bob',
        age   : null,
        family: [
          { age: 15, objectId: '1' },
          { name: 'Jack', age: 20 }
        ]
      }))
      .then(result => {
        expect(result).to.have.property('name', 'Bob')
        expect(result).to.have.property('age', null)
        expect(result).to.have.property('family')
        expect(result.family[0]).to.have.property('name', 'Jack')
        expect(result.family[0]).to.have.property('age', 20)
        expect(result.family[1]).to.have.property('age', 15)
        expect(result.family[1]).to.have.property('objectId', '1')
      })
  })

  it('update object 1:N (update relation)', function() {
    return Promise.resolve()
      .then(() => parentTableStore.deepSave({
        name  : 'Bob',
        age   : null,
        family: [
          { age: 15, objectId: '1' },
          { name: 'Jack', age: 20 }
        ]
      }))
      .then(result => parentTableStore.deepSave({
        age     : 50,
        objectId: result.objectId,
        family  : [{ objectId: '1' }]
      }))
      .then(result => {
        expect(result).to.have.property('name', 'Bob')
        expect(result).to.have.property('age', 50)
        expect(result).to.have.property('family')
        expect(result.family).to.be.lengthOf(1)
        expect(result.family[0]).to.have.property('name', 'Bob')
        expect(result.family[0]).to.have.property('age', 15)
        expect(result.family[0]).to.have.property('objectId', '1')
      })
  })

  it('update object 1:N (delete relation)', function() {
    return Promise.resolve()
      .then(() => parentTableStore.deepSave({
        name  : 'Bob',
        age   : null,
        family: [
          { age: 15, objectId: '1' },
          { name: 'Jack', age: 20 }
        ]
      }))
      .then(result => parentTableStore.deepSave({
        age     : null,
        objectId: result.objectId,
        family  : []
      }))
      .then(result => {
        expect(result).to.have.property('name', 'Bob')
        expect(result).to.have.property('age', null)
        expect(result).to.not.have.property('family')
      })
  })

  it('create object 1:1 (create new) + 1:N (create new, update one)', function() {
    return Promise.resolve()
      .then(() => parentTableStore.deepSave({
        name  : 'Liza',
        age   : 10,
        friend: { name: 'Brother', age: 20 },
        family: [
          { objectId: '1', name: 'Anna' }, { name: 'Dad', age: 20 }
        ]
      }))
      .then(result => {
        expect(result).to.have.property('name', 'Liza')
        expect(result).to.have.property('age', 10)
        expect(result).to.have.property('friend')
        expect(result.friend).to.have.property('name', 'Brother')
        expect(result.friend).to.have.property('age', 20)
        expect(result).to.have.property('family')
        expect(result.family).to.be.lengthOf(2)
        expect(result.family[0]).to.have.property('name', 'Dad')
        expect(result.family[0]).to.have.property('age', 20)
        expect(result.family[1]).to.have.property('name', 'Anna')
        expect(result.family[1]).to.have.property('age', 20)
      })
  })

  it('update object 1:1 (delete relation) + 1:N (update object)', function() {
    return Promise.resolve()
      .then(() => parentTableStore.deepSave({
        name  : 'Liza',
        age   : 10,
        friend: { name: 'Brother', age: 20 },
        family: [
          { objectId: '1', name: 'Anna' }, { name: 'Dad', age: 20 }
        ]
      }))
      .then(result => parentTableStore.deepSave({
        age     : 100,
        objectId: result.objectId,
        friend  : null,
        family  : [
          { objectId: '1', age: 10 }
        ]
      }))
      .then(result => {
        expect(result).to.have.property('name', 'Liza')
        expect(result).to.have.property('age', 100)
        expect(result).to.not.have.property('friend')
        expect(result).to.have.property('family')
        expect(result.family).to.be.lengthOf(1)
        expect(result.family[0]).to.have.property('name', 'Anna')
        expect(result.family[0]).to.have.property('age', 10)
      })
  })

  it('1:1 (create relation) + 1:N (delete relation)', function() {
    return Promise.resolve()
      .then(() => parentTableStore.deepSave({
        name  : 'Liza',
        age   : 10,
        friend: { name: 'Brother', age: 20 },
        family: [
          { objectId: '1', name: 'Anna' }, { name: 'Dad', age: 20 }
        ]
      }))
      .then(result => parentTableStore.deepSave({
        objectId: result.objectId,
        friend  : { name: 'Lolla', age: null },
        family  : []
      }))
      .then(result => {
        expect(result).to.have.property('name', 'Liza')
        expect(result).to.have.property('age', 10)
        expect(result).to.not.have.property('family')
        expect(result).to.have.property('friend')
        expect(result.friend).to.have.property('name', 'Lolla')
        expect(result.friend).to.have.property('age', null)
      })
  })
})
