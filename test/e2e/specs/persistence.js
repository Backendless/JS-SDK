import '../helpers/global'
import sandbox from '../helpers/sandbox'
import Backendless from '../../../libs/backendless'

function Foo() {
}

describe('Backendless.Persistence', function() {

  sandbox.forSuite({
    app: {
      data: {
        Users    : [
          {
            email   : 'john@lennon.co',
            name    : 'John Lennon',
            password: 'beatlesforever'
          }, {
            email   : 'paul@mccartney.co',
            name    : 'Paul Mccartney',
            password: 'beatlesforever'
          }, {
            email   : 'george@harrison.co',
            name    : 'George Harrison',
            password: 'beatlesforever'
          }
        ],
        Blackstar: [
          {
            numericCol: 1,
            boolCol: false
          }
        ]
      }
    }
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
    function TestRemove() {
    }

    const db = Backendless.Persistence.of(TestRemove);
    let toRemove

    return Promise.resolve()
      .then(() => db.save({ name: 'First' }))
      .then(() => db.save({ name: 'Second' }).then(second => toRemove = second))
      .then(() => db.save({ name: 'Third' }))
      .then(() => db.remove(toRemove))
      .then(() => db.find())
      .then(result => {
        expect(result.length).to.be.equal(2)
        expect(result[0].objectId).not.to.be.equal(toRemove.objectId)
        expect(result[1].objectId).not.to.be.equal(toRemove.objectId)
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
        result.forEach(object => expect(result).to.be.an.instanceof(Backendless.User))
      })
  })

  it('Update table record with invalid data type for properties', function() {
    const db = Backendless.Persistence.of('Blackstar')
    const expectedError = 'Unable to save object - invalid data type for properties - numericCol, boolCol. ' +
      'You can change the property type in developer console.'

    return Promise.resolve()
      .then(() => db.findFirst())
      .then(result => {
        result.numericCol = 'String value'
        result.boolCol = 'String value'

        return result
      })
      .then(result => db.save(result))
      .catch(error => {
        expect(error.message).to.be.equal(expectedError)
      })
  })
})