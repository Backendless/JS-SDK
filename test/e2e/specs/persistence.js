import '../helpers/global'
import sandbox from '../helpers/sandbox'
import Backendless from '../../../libs/backendless'

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

describe('Backendless.Persistence', function() {

  sandbox.forSuite()

  before(function() {
    const api = this.consoleApi
    const appId = this.app.id

    const paginationTestData = [...Array(100).keys()].map(i => ({ counter: i + 1, name: 'John ' + i + 1 }))

    const insertRecord = (tableName, record) =>
      api.tables.createRecord(appId, { name: tableName }, record)

    return Promise.resolve()
      .then(() => insertRecord('Users', users.john))
      .then(() => insertRecord('Users', users.paul))
      .then(() => insertRecord('Users', users.george))
      .then(() => insertRecord('Blackstar', { integerCol: 1, boolCol: false }))
      .then(() => insertRecord('TableToTestDeletion', { group: 'Pink Floyd' }))
      .then(() => insertRecord('TableWithPagination', { counter: 0, name: 'Initial' }))
      .then(() => Promise.all(paginationTestData.map(record => insertRecord('TableWithPagination', record))))
  })

  it('Create new table', function() {
    const entity = new Foo();
    entity.firstName = 'First'
    entity.lastName = 'Last'

    return Backendless.Persistence.of(Foo).save(entity).then(result => {
      expect(result).to.be.instanceof(Foo)
      expect(result.objectId).to.be.a('string')
      expect(result.firstName).to.be.equal(entity.firstName)
      expect(result.lastName).to.be.equal(entity.lastName)
    })
  });

  it('Update record', function() {
    const entity = new Foo();
    entity.firstName = 'Bill';
    entity.lastName = 'Gates';

    const db = Backendless.Persistence.of(Foo);

    return db.save(entity)
      .then(() => entity.firstName = 'Ron')
      .then(() => db.save(entity))
      .then(updated => {
        expect(updated.firstName).to.be.equal(entity.firstName);
        expect(updated.lastName).to.be.equal(entity.lastName);
      });
  })

  it('Remove record', function() {
    const db = Backendless.Persistence.of('TableToTestDeletion');
    let toRemove

    return Promise.resolve()
      .then(() => db.findFirst())
      .then(result => {
        toRemove = result

        return db.remove(result.objectId)
      })
      .then(() => db.findById(toRemove.objectId))
      .catch(error => {
        expect(error.message).to.be.equal(`Entity with name ${toRemove.objectId} cannot be found`)
      })
      .then(() => db.find())
      .then(result => {
        expect(result.length).to.be.equal(0)
      })
  })

  it('Add record to Users table', function() {
    const db = Backendless.Persistence.of(Backendless.User)

    const user = {
      email   : 'ringo@starr.co',
      name    : 'Ringo Starr',
      password: 'beatlesforever'
    }

    return Promise.resolve()
      .then(() => db.save(user))
      .then(result => {
        expect(result).to.be.an.instanceof(Backendless.User)
        expect(result).to.have.property('email').that.equal(user.email)
        expect(result).to.have.property('name').that.equal(user.name)
        expect(result).to.not.have.property('password')
      })
  })

  it('Impossible to get persistence of Users using string signature', function() {
    const db = () => Backendless.Persistence.of('Users')

    const expectedError = "Table 'Users' is not accessible through this signature. " +
      "Use Backendless.Data.of( Backendless.User ) instead"

    expect(db).to.throw(expectedError)
  })

  it('Check instance of objects from Users table', function() {
    const db = Backendless.Persistence.of(Backendless.User)

    return Promise.resolve()
      .then(() => db.find())
      .then(result => {
        result.forEach(object => expect(object).to.be.an.instanceof(Backendless.User))
      })
  })

  it('Update table record with invalid data type for properties', function() {
    const db = Backendless.Persistence.of('Blackstar')

    return Promise.resolve()
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
    const db = Backendless.Persistence.of('Blackstar')
    const expectedError = 'Invalid value for the "value" argument. ' +
      'The argument must contain only string or object values'

    return Promise.resolve()
      .then(() => db.remove(9999)) // remove expect only string parameter
      .catch(error => expect(error.message).to.be.equal(expectedError))
  })

  it('Save object with Backendless.Persistence.save() notation', function() {
    const db = Backendless.Persistence

    const record = {
      name : 'David',
      email: 'david@bowie.co.ua'
    }

    return Promise.resolve()
      .then(() => db.save('Blackstar', record))
      .then(result => {
        expect(result.name).to.be.equal(record.name)
        expect(result.email).to.be.equal(record.email)
        expect(result.___class).to.be.equal('Blackstar')
      })
  })

  it('Save object with boolean property', function() {
    const db = Backendless.Persistence.of('Blackstar')
    const record = {
      boolCol: true
    }

    return Promise.resolve()
      .then(() => db.save(record))
      .then(result => {
        expect(result.boolCol).to.be.a('boolean')
        expect(result.boolCol).to.be.true
      })
  })

  it('Save object with int property', function() {
    const db = Backendless.Persistence.of('Blackstar')
    const record = {
      integerCol: 42
    }

    return Promise.resolve()
      .then(() => db.save(record))
      .then(result => {
        expect(result.integerCol).to.be.a('number')
        expect(result.integerCol).to.be.equal(record.integerCol)
      })
  })

  it('Save object with double property', function() {
    const db = Backendless.Persistence.of('Blackstar')
    const record = {
      doubleCol: Math.random() * 10
    }

    return Promise.resolve()
      .then(() => db.save(record))
      .then(result => {
        expect(result.doubleCol).to.be.a('number')
        expect(result.doubleCol).to.be.equal(record.doubleCol)
      })
  })

  it('Save object with String property', function() {
    const db = Backendless.Persistence.of('Blackstar')
    const record = {
      stringCol: 'string value'
    }

    return Promise.resolve()
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

    const db = Backendless.Persistence.of(Foo)

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
    const db = Backendless.Persistence.of('Blackstar')

    return Promise.resolve()
      .then(() => db.findById('NonExistingObjectId'))
      .catch(error => {
        expect(error.message).to.be.equal('Entity with name NonExistingObjectId cannot be found')
      })
  })

  it('Find with Where clause', function() {
    const db = Backendless.Persistence.of(Backendless.User)
    const query = Backendless.DataQueryBuilder.create().setWhereClause('name like \'%Lennon%\'')

    return Promise.resolve()
      .then(() => db.find(query))
      .then(result => {
        expect(result.length).to.be.equal(1)
        expect(result[0].name).to.match(/Lennon/)
      })
  })

  it('Find with properties', function() {
    const db = Backendless.Persistence.of('TableWithPagination')
    const query = Backendless.DataQueryBuilder.create().setProperties(['name'])

    return Promise.resolve()
      .then(() => db.find(query))
      .then(result => {
        expect(result[0]).to.not.have.property('counter')
        expect(result[0]).to.have.property('name')
      })
  })

  it('Find with non existing properties', function() {
    const db = Backendless.Persistence.of('TableWithPagination')
    const query = Backendless.DataQueryBuilder.create().setProperties(['nonExistingProp']) //.setSortBy('counter').setPageSize(50)

    return Promise.resolve()
      .then(() => db.find(query))
      .catch(error => {
        expect(error.message).to.be.equal('Unable to retrieve data. Query contains invalid object properties.')
      })
  })

  it('Find first/last on empty table', function() {
    const db = Backendless.Persistence.of('EmptyTable')

    return Promise.resolve()
      .then(() => db.findFirst())
      .catch(error => {
        expect(error.code).to.be.equal(1009)
      })
  })

  it('Find with offset greater than the max number of records', function() {
    const db = Backendless.Persistence.of('TableWithPagination')
    const query = Backendless.DataQueryBuilder.create().setOffset(500)

    return Promise.resolve()
      .then(() => db.find(query))
      .then(result => {
        expect(result).to.be.an('Array')
        expect(result.length).to.be.equal(0)
      })
  })

  it('Retrieves Properties of table', function() {
    return expect(Backendless.Persistence.describe('Blackstar'))
      .to.eventually.include.deep.members([{
        name        : 'created',
        required    : false,
        type        : 'DATETIME',
        defaultValue: null,
        relatedTable: null,
        customRegex : null,
        autoLoad    : false,
        isPrimaryKey: false
      }, {
        name        : 'ownerId',
        required    : false,
        type        : 'STRING',
        defaultValue: null,
        relatedTable: null,
        customRegex : null,
        autoLoad    : false,
        isPrimaryKey: false
      }, {
        name        : 'boolCol',
        required    : false,
        type        : 'BOOLEAN',
        defaultValue: null,
        relatedTable: null,
        customRegex : null,
        autoLoad    : false,
        isPrimaryKey: false
      }, {
        name        : 'updated',
        required    : false,
        type        : 'DATETIME',
        defaultValue: null,
        relatedTable: null,
        customRegex : null,
        autoLoad    : false,
        isPrimaryKey: false
      }, {
        name        : 'integerCol',
        required    : false,
        type        : 'DOUBLE',
        defaultValue: null,
        relatedTable: null,
        customRegex : null,
        autoLoad    : false,
        isPrimaryKey: false
      }, {
        name        : 'objectId',
        required    : false,
        type        : 'STRING_ID',
        defaultValue: null,
        relatedTable: null,
        customRegex : null,
        autoLoad    : false,
        isPrimaryKey: true
      }])
  })

  it('Retrieves Properties of non existing table', function() {
    return expect(Backendless.Persistence.describe('NonExistingTable'))
      .to.eventually.be.rejected
      .and.eventually.to.have.property('code', 1009)
  })

  it('Sort by', function() {
    const db = Backendless.Persistence.of('TableWithPagination')
    const query = Backendless.DataQueryBuilder.create().setSortBy('counter').setPageSize(100)

    return Promise.resolve()
      .then(() => db.find(query))
      .then(result => {
        expect(result).to.have.lengthOf(100)
        result.forEach((record, idx) => {
          expect(result[idx]).to.have.property('counter').that.equal(idx)
        })
      })
  })

  it('Retrieving nextPage', function() {
    const db = Backendless.Persistence.of('TableWithPagination')
    const query = Backendless.DataQueryBuilder.create().setSortBy('counter')

    return Promise.resolve()
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

