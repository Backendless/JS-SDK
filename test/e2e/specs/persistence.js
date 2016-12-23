import '../helpers/global'
import sandbox from '../helpers/sandbox'
import Backendless from '../../../libs/backendless'

function Foo() {
}

describe('Backendless.Persistence', function() {

  sandbox.forSuite({})

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
    var entity = new Foo()
    entity.firstName = 'Bill'
    entity.lastName = 'Gates'

    var db = Backendless.Persistence.of(Foo)

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
})