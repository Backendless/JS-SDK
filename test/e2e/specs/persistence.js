import expect from 'expect.js'

import { createClient } from '../../../node_modules/backendless-console-sdk'
import { createSandbox, createSuiteSandbox } from '../helpers/sandbox'
import Backendless from '../../../libs/backendless'

const serverUrl = 'http://localhost:9000'

function Foo() {
}

describe('Backendless.Persistence', function() {

  createSuiteSandbox('http://localhost:9000', {}, this)
  // before(function() {
  //   this.timeout(15000)
  //   this.consoleApi = createClient(serverUrl)
  //
  //   return createSandbox(this.consoleApi)
  //     .then(sandbox => {
  //       this.sandbox = sandbox
  //       this.app = sandbox.app
  //       this.dev = sandbox.dev
  //     })
  //     .then(() => Backendless.serverURL = serverUrl)
  //     .then(() => Backendless.initApp(this.app.id, this.app.devices.JS))
  // })
  //
  // after(function() {
  //   this.timeout(5000)
  //
  //   return this.sandbox && this.sandbox.destroy()
  // })

  it('Create new table', function() {
    const entity = new Foo();
    entity.firstName = 'First'
    entity.lastName = 'Last'

    return Backendless.Persistence.of(Foo).save(entity).then(result => {
      expect(result).to.be.a(Foo)
      expect(result.objectId).to.be.a('string')
      expect(result.firstName).to.be(entity.firstName)
      expect(result.lastName).to.be(entity.lastName)
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
        expect(serverEntity.objectId).to.be(entity.objectId)
        expect(serverEntity.firstName).to.be(entity.firstName)
        expect(serverEntity.lastName).to.be(entity.lastName)
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
        expect(updated.firstName).to.be(entity.firstName);
        expect(updated.lastName).to.be(entity.lastName);
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
        expect(result.length).to.be(2)
        expect(result[0].objectId).not.to.be(toRemove.objectId)
        expect(result[1].objectId).not.to.be(toRemove.objectId)
      })
  })
})