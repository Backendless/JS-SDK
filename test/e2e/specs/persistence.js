import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

function Foo() {
}

const users = {
  john  : {
    email   : 'john@lennon.co',
    name    : 'John Lennon',
    password: 'beatlesforever'
  },
  paul  : {
    email   : 'paul@mccartney.co',
    name    : 'Paul Mccartney',
    password: 'beatlesforever'
  },
  george: {
    email   : 'george@harrison.co',
    name    : 'George Harrison',
    password: 'beatlesforever'
  }
}

describe('Data', function() {
  let consoleApi
  let appId

  const insertRecord = (tableName, record) =>
    consoleApi.tables.createRecord(appId, { name: tableName }, record)

  const insertUsers = () =>
    Promise.resolve()
      .then(() => insertRecord('Users', users.john))
      .then(() => insertRecord('Users', users.paul))
      .then(() => insertRecord('Users', users.george))

  const createBigTable = () => {
    const paginationTestData = [...Array(100).keys()].map(i => ({ counter: i + 1, name: 'John ' + (i + 1) }))

    return Promise.resolve()
      .then(() => insertRecord('TableWithPagination', { counter: 0, name: 'Initial' }))
      .then(() => Promise.all(paginationTestData.map(record => insertRecord('TableWithPagination', record))))
  }

  sandbox.forTest()

  beforeEach(function() {
    consoleApi = this.consoleApi
    appId = this.app.id
  })

  it('Create new table', function() {
    const entity = new Foo()
    entity.firstName = 'First'
    entity.lastName = 'Last'

    return Backendless.Data.of(Foo).save(entity).then(result => {
      expect(result).to.be.instanceof(Foo)
      expect(result.objectId).to.be.a('string')
      expect(result.firstName).to.be.equal(entity.firstName)
      expect(result.lastName).to.be.equal(entity.lastName)
    })
  })

  it('Update record', function() {
    const entity = new Foo()
    entity.firstName = 'Bill'
    entity.lastName = 'Gates'

    const db = Backendless.Data.of(Foo)

    return db.save(entity)
      .then(() => entity.firstName = 'Ron')
      .then(() => db.save(entity))
      .then(updated => {
        expect(updated.firstName).to.be.equal(entity.firstName)
        expect(updated.lastName).to.be.equal(entity.lastName)
      })
  })

  it('Remove record', function() {
    const db = Backendless.Data.of('TableToTestDeletion')
    let toRemove

    return Promise.resolve()
      .then(() => insertRecord('TableToTestDeletion', { evil: 'Justin Bieber' })) // let destroy the evil
      .then(() => db.findFirst())
      .then(result => {
        toRemove = result

        return db.remove(result.objectId)
      })
      .then(() => db.findById(toRemove.objectId))
      .catch(error => {
        expect(error.message).to.be.equal(`Entity with ID ${toRemove.objectId} not found`)
      })
      .then(() => db.find())
      .then(result => {
        expect(result.length).to.be.equal(0) // the world is saved
      })
  })

  it('Add record to Users table', function() {
    const db = Backendless.Data.of(Backendless.User)

    const user = {
      email   : 'ringo@starr.co',
      name    : 'Ringo Starr',
      password: 'beatlesforever'
    }

    return Promise.resolve()
      .then(insertUsers)
      .then(() => db.save(user))
      .then(result => {
        expect(result).to.be.an.instanceof(Backendless.User)
        expect(result).to.have.property('email').that.equal(user.email)
        expect(result).to.have.property('name').that.equal(user.name)
        expect(result).to.not.have.property('password')
      })
  })

  it('Possible to get persistence of Users using string signature', function() {
    const db = Backendless.Data.of('Users')

    return Promise.resolve()
      .then(insertUsers)
      .then(() => db.find())
      .then(users => {
        users.forEach(object => {
          expect(object).to.be.an.instanceof(Backendless.User)
        })
      })
  })

  it('Check instance of objects from Users table', function() {
    const db = Backendless.Data.of(Backendless.User)

    return Promise.resolve()
      .then(insertUsers)
      .then(() => db.find())
      .then(result => {
        result.forEach(object => expect(object).to.be.an.instanceof(Backendless.User))
      })
  })

  it('Update table record with invalid data type for properties', function() {
    const db = Backendless.Data.of('Blackstar')

    return Promise.resolve()
      .then(() => insertRecord('Blackstar', { integerCol: 1, boolCol: false }))
      .then(() => db.findFirst())
      .then(result => {
        result.integerCol = 'String value' // column type is Number
        result.boolCol = 'String value' // column type is Boolean

        return result
      })
      .then(result => db.save(result))
      .catch(error => {
        expect(error.message).to.match(/Unable to save object - invalid data type for properties/)
      })
  })

  it('Remove object with wrong type of objectId', function() {
    const db = Backendless.Data.of('Blackstar')
    const expectedError = 'Invalid value for the "value" argument. ' +
      'The argument must contain only string or object values'

    return Promise.resolve()
      .then(() => insertRecord('Blackstar', { integerCol: 1, boolCol: false }))
      .then(() => db.remove(9999)) // remove expect only string parameter
      .catch(error => expect(error.message).to.be.equal(expectedError))
  })

  it('Save object with Backendless.Data.save() notation', function() {
    const record = {
      name : 'David',
      email: 'david@bowie.co.ua'
    }

    return Promise.resolve()
      .then(() => insertRecord('Blackstar', { integerCol: 1, boolCol: false }))
      .then(() => Backendless.Data.save('Blackstar', record))
      .then(result => {
        expect(result.name).to.be.equal(record.name)
        expect(result.email).to.be.equal(record.email)
        expect(result.___class).to.be.equal('Blackstar')
      })
  })

  it('Save object with boolean property', function() {
    const db = Backendless.Data.of('Blackstar')
    const record = {
      boolCol: true
    }

    return Promise.resolve()
      .then(() => insertRecord('Blackstar', { integerCol: 1, boolCol: false }))
      .then(() => db.save(record))
      .then(result => {
        expect(result.boolCol).to.be.a('boolean')
        expect(result.boolCol).to.be.true
      })
  })

  it('Save object with int property', function() {
    const db = Backendless.Data.of('Blackstar')
    const record = {
      integerCol: 42
    }

    return Promise.resolve()
      .then(() => insertRecord('Blackstar', { integerCol: 1, boolCol: false }))
      .then(() => db.save(record))
      .then(result => {
        expect(result.integerCol).to.be.a('number')
        expect(result.integerCol).to.be.equal(record.integerCol)
      })
  })

  it('Save object with double property', function() {
    const db = Backendless.Data.of('Blackstar')
    const record = {
      doubleCol: Math.random() * 10
    }

    return Promise.resolve()
      .then(() => insertRecord('Blackstar', { integerCol: 1, boolCol: false }))
      .then(() => db.save(record))
      .then(result => {
        expect(result.doubleCol).to.be.a('number')
        expect(result.doubleCol).to.be.equal(record.doubleCol)
      })
  })

  it('Save object with String property', function() {
    const db = Backendless.Data.of('Blackstar')
    const record = {
      stringCol: 'string value'
    }

    return Promise.resolve()
      .then(() => insertRecord('Blackstar', { integerCol: 1, boolCol: false }))
      .then(() => db.save(record))
      .then(result => {
        expect(result.stringCol).to.be.a('string')
        expect(result.stringCol).to.be.equal(record.stringCol)
      })
  })

  it('Find Record By objectId', function() {
    let entity = new Foo()
    entity.firstName = 'Bill'
    entity.lastName = 'Gates'

    const db = Backendless.Data.of(Foo)

    return db.save(entity)
      .then(result => entity = result)
      .then(() => db.findById(entity.objectId))
      .then(serverEntity => {
        expect(serverEntity.objectId).to.be.equal(entity.objectId)
        expect(serverEntity.firstName).to.be.equal(entity.firstName)
        expect(serverEntity.lastName).to.be.equal(entity.lastName)
      })
  })

  it('Find Record By Non Existing objectId', function() {
    const db = Backendless.Data.of('Blackstar')

    return Promise.resolve()
      .then(() => insertRecord('Blackstar', { integerCol: 1, boolCol: false }))
      .then(() => db.findById('NonExistingObjectId'))
      .catch(error => {
        expect(error.message).to.be.equal('Entity with ID NonExistingObjectId not found')
      })
  })

  it('Find with Where clause', function() {
    const db = Backendless.Data.of(Backendless.User)
    const query = Backendless.DataQueryBuilder.create().setWhereClause('name like \'%Lennon%\'')

    return Promise.resolve()
      .then(insertUsers)
      .then(() => db.find(query))
      .then(result => {
        expect(result.length).to.be.equal(1)
        expect(result[0].name).to.match(/Lennon/)
      })
  })

  it('Find with properties', async function() {
    const db = Backendless.Data.of('TableWithPagination')

    await createBigTable()

    let query
    let result

    query = Backendless.DataQueryBuilder.create()
    query.setProperties(['name'])

    result = await db.find(query)

    expect(result[0]).to.not.have.property('counter')
    expect(result[0]).to.have.property('name')

    query = Backendless.DataQueryBuilder.create()
    query.addProperties('name', 'created')

    result = await db.find(query)

    expect(result[0]).to.not.have.property('counter')
    expect(result[0]).to.not.have.property('updated')
    expect(result[0]).to.have.property('name')
    expect(result[0]).to.have.property('created')

    query = Backendless.DataQueryBuilder.create()
    query.addProperties(['name', 'created'])

    result = await db.find(query)

    expect(result[0]).to.not.have.property('counter')
    expect(result[0]).to.not.have.property('updated')
    expect(result[0]).to.have.property('name')
    expect(result[0]).to.have.property('created')

    query = Backendless.DataQueryBuilder.create()
    query.addProperties('name')
    query.addProperties( 'created')

    result = await db.find(query)

    expect(result[0]).to.not.have.property('counter')
    expect(result[0]).to.not.have.property('updated')
    expect(result[0]).to.have.property('name')
    expect(result[0]).to.have.property('created')
  })

  it('Find with non existing properties', function() {
    const db = Backendless.Data.of('TableWithPagination')
    const query = Backendless.DataQueryBuilder.create().setProperties(['nonExistingProp']) //.setSortBy('counter').setPageSize(50)

    return Promise.resolve()
      .then(createBigTable)
      .then(() => db.find(query))
      .catch(error => {
        expect(error.message).to.be.equal('Column \'nonExistingProp\' does not exist in table \'TableWithPagination\'')
      })
  })

  it('Find First', function() {
    const db = Backendless.Data.of('TestFindFirst')

    return Promise.resolve()
      .then(() => insertRecord('TestFindFirst', { counter: 0, name: 'First' }))
      .then(() => insertRecord('TestFindFirst', { counter: 1, name: 'Last' }))
      .then(() => db.findFirst())
      .then(result => {
        expect(result.counter).to.be.equal(0)
        expect(result.name).to.be.equal('First')
      })
  })

  it('Find Last', function() {
    const db = Backendless.Data.of('TestFindLast')

    return Promise.resolve()
      .then(() => insertRecord('TestFindLast', { counter: 0, name: 'First' }))
      .then(() => insertRecord('TestFindLast', { counter: 1, name: 'Last' }))
      .then(() => db.findLast())
      .then(result => {
        expect(result.counter).to.be.equal(1)
        expect(result.name).to.be.equal('Last')
      })
  })

  it('Find first/last on empty table', function() {
    const db = Backendless.Data.of('EmptyTable')

    return Promise.resolve()
      .then(() => db.findFirst())
      .catch(error => {
        expect(error.code).to.be.equal(1009)
      })
  })

  it('Find with offset greater than the max number of records', function() {
    const db = Backendless.Data.of('TableWithPagination')
    const query = Backendless.DataQueryBuilder.create().setOffset(500)

    return Promise.resolve()
      .then(createBigTable)
      .then(() => db.find(query))
      .then(result => {
        expect(result).to.be.an('Array')
        expect(result.length).to.be.equal(0)
      })
  })

  it('Retrieves Properties of table', function() {
    return Promise.resolve()
      .then(() => insertRecord('Blackstar', { integerCol: 1, boolCol: false }))
      .then(() => Backendless.Data.describe('Blackstar'))
      .then(schema => {
        schema.forEach(schemaObject => expect(schemaObject).to.have.all.keys([
          'name', 'required', 'type', 'defaultValue', 'relatedTable', 'customRegex', 'autoLoad', 'isPrimaryKey'
        ]))
      })
  })

  it('Retrieves Properties of non existing table', function() {
    return expect(Backendless.Data.describe('NonExistingTable'))
      .to.eventually.be.rejected
      .and.eventually.to.have.property('code', 1009)
  })

  it('Sort by', function() {
    const db = Backendless.Data.of('TableWithPagination')
    const query = Backendless.DataQueryBuilder.create().setSortBy('counter').setPageSize(100)

    return Promise.resolve()
      .then(createBigTable)
      .then(() => db.find(query))
      .then(result => {
        expect(result).to.have.lengthOf(100)
        result.forEach((record, idx) => {
          expect(result[idx]).to.have.property('counter').that.equal(idx)
        })
      })
  })

  it('Retrieve object count', function() {
    const db = Backendless.Data.of('TableWithPagination')
    const whereClause = Backendless.DataQueryBuilder.create().setWhereClause('counter < 50')

    return Promise.resolve()
      .then(createBigTable)
      .then(() => db.getObjectCount())
      .then(count => expect(count).to.be.equal(101))
      .then(() => db.getObjectCount(whereClause))
      .then(count => expect(count).to.be.equal(50))
  })

  it('Retrieving nextPage', function() {
    const db = Backendless.Data.of('TableWithPagination')
    const query = Backendless.DataQueryBuilder.create().setSortBy('counter')

    return Promise.resolve()
      .then(createBigTable)
      .then(() => db.find(query))
      .then(result => {
        expect(result).to.have.lengthOf(10)
        expect(result[9]).to.have.property('counter').that.equal(9)
      })
      .then(() => query.prepareNextPage())
      .then(() => db.find(query))
      .then(result => {
        expect(result).to.have.lengthOf(10)
        expect(result[9]).to.have.property('counter').that.equal(19)
      })
  })


})
