import '../helpers/global'
import sandbox from '../helpers/sandbox'

if (process.env.TEST_ENV !== 'node') {
  describe.skip('Persistence.Persistence (sync)', function() {

    sandbox.forSuite({})

    it('Create new table', function () {
      function FooSync() {
      }

      var entity = new FooSync();
      entity.firstName = 'Bill'
      entity.lastName = 'Gates'

      var db = Backendless.Persistence.of(FooSync);
      Backendless.serverURL = 'http://localhost:9000'
      var entityPath = Backendless.appPath + '/data/FooSync';
      expect(db.restUrl).to.be(entityPath);

      var result = db.saveSync(entity);
      expect(result).to.be.instanceof(FooSync)
      expect(result.objectId).to.be.a('string')
      expect(result.firstName).to.be(entity.firstName)
      expect(result.lastName).to.be(entity.lastName)
    });

  })
}