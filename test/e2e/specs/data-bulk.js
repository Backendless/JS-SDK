import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

const TEST_TABLE_NAME = 'MovieAnimal'
const TEST_DATA = [
  {
    name: 'Beethoven',
    kind: 'dog'
  },
  {
    name: 'Rex',
    kind: 'dog'
  },
  {
    name: 'Lessie',
    kind: 'dog'
  },
  {
    name: 'Garfield',
    kind: 'cat'
  }
]

describe('Data - Bulk Operations', function() {

  let testDataItems
  let TestTable

  sandbox.forTest()

  beforeEach(() => {
    TestTable = Backendless.Data.of(TEST_TABLE_NAME)
  })

  describe('Create Operation', function() {

    describe('should save successful when', function() {
      it('passed non empty objects in array', function() {
        return TestTable.bulkCreate(TEST_DATA)
          .then(result => {
            expect(result).to.be.an('array')

            TEST_DATA.forEach((item, index) => {
              expect(result[index]).to.be.an('string')
            })
          })
          .then(() => TestTable.find())
          .then(result => {
            expect(result.length).to.be.equal(TEST_DATA.length)
          })
      })

      it('passed a few empty objects in array', function() {
        return TestTable.bulkCreate([TEST_DATA[1], {}, TEST_DATA[2], {}])
          .then(result => {
            expect(result).to.be.an('array')

            expect(result[0]).to.be.an('string')
            expect(result[1]).to.be.an('string')
            expect(result[2]).to.be.an('string')
            expect(result[3]).to.be.an('string')
          })
          .then(() => TestTable.find())
          .then(result => {
            expect(result.length).to.be.equal(4)
          })
      })
    })

    describe('should throw an error when', function() {
      const errorMessage = (
        'Invalid bulkCreate argument. ' +
        'The first argument must contain only array of objects.'
      )

      it('not passed any arguments', function() {
        return TestTable.bulkCreate()
          .catch(error => {
            expect(error.message).to.be.equal(errorMessage)
          })
      })

      it('passed NULL in array', function() {
        return TestTable.bulkCreate([TEST_DATA[1], null, TEST_DATA[2]])
          .catch(error => {
            expect(error.message).to.be.equal(errorMessage)
          })
      })

      it('passed STRING in array', function() {
        return TestTable.bulkCreate([TEST_DATA[1], 'someString', TEST_DATA[2]])
          .catch(error => {
            expect(error.message).to.be.equal(errorMessage)
          })
      })

      it('passed BOOLEAN in array', function() {
        return TestTable.bulkCreate([TEST_DATA[1], true, TEST_DATA[2]])
          .catch(error => {
            expect(error.message).to.be.equal(errorMessage)
          })
      })

      it('passed NUMBER in array', function() {
        return TestTable.bulkCreate([TEST_DATA[1], 123, TEST_DATA[2]])
          .catch(error => {
            expect(error.message).to.be.equal(errorMessage)
          })
      })

      it('passed UNDEFINED in array', function() {
        return TestTable.bulkCreate([TEST_DATA[1], undefined, TEST_DATA[2]])
          .catch(error => {
            expect(error.message).to.be.equal(errorMessage)
          })
      })

      it('passed ARRAY in array', function() {
        return TestTable.bulkCreate([TEST_DATA[1], [], TEST_DATA[2]])
          .catch(error => {
            expect(error.message).to.be.equal(errorMessage)
          })
      })
    })

  })

  xdescribe('Delete Operation', function() {
    beforeEach(() => {
      testDataItems = []

      return TEST_DATA.reduce((promise, data) => {
        return promise.then(() => TestTable.save(data).then(item => testDataItems.push(item)))
      }, Promise.resolve())
    })

    describe('should delete successful when', function() {
      it('used where clause', function() {
        return TestTable.bulkDelete('kind=\'dog\'')
          .then(result => {
            expect(result).to.be.equal(3)
          })
      })

      it('used array of ids', function() {
        const ids = testDataItems
          .filter(item => item.kind === 'dog')
          .map(item => item.objectId)

        return TestTable.bulkDelete(ids)
          .then(result => {
            expect(result).to.be.equal(ids.length)
          })
      })

      it('used array of objects', function() {
        return TestTable.bulkDelete(testDataItems)
          .then(result => {
            expect(result).to.be.equal(testDataItems.length)
          })
      })
    })

    describe('should throw an error when', function() {
      it('not passed any arguments', function() {
        return TestTable.bulkDelete()
          .catch(error => {
            expect(error.message).to.be.equal(
              'Invalid bulkDelete argument. ' +
              'The first argument must contain array of objects or array of id or "whereClause" string.'
            )
          })
      })

      it('passed OBJECT as where clause', function() {
        return TestTable.bulkDelete({})
          .catch(error => {
            expect(error.message).to.be.equal(
              'Invalid bulkDelete argument. ' +
              'The first argument must contain array of objects or array of id or "whereClause" string.'
            )
          })
      })

      it('passed array of objects without objectId', function() {
        return TestTable.bulkDelete([{ objectId: 'xxx' }, { foo: 'bar' }])
          .catch(error => {
            expect(error.message).to.be.equal(
              'Can not transform "objects" to "whereClause". ' +
              'Item must be a string or an object with property "objectId" as string.'
            )
          })
      })

      it('passed array of NUMBERs', function() {
        return TestTable.bulkDelete([123])
          .catch(error => {
            expect(error.message).to.be.equal(
              'Can not transform "objects" to "whereClause". ' +
              'Item must be a string or an object with property "objectId" as string.'
            )
          })
      })

      it('passed array of BOOLEANs', function() {
        return TestTable.bulkDelete([true])
          .catch(error => {
            expect(error.message).to.be.equal(
              'Can not transform "objects" to "whereClause". ' +
              'Item must be a string or an object with property "objectId" as string.'
            )
          })
      })

      it('passed array of UNDEFINEDs', function() {
        return TestTable.bulkDelete([undefined])
          .catch(error => {
            expect(error.message).to.be.equal(
              'Can not transform "objects" to "whereClause". ' +
              'Item must be a string or an object with property "objectId" as string.'
            )
          })
      })

      it('passed array of ARRAYs', function() {
        return TestTable.bulkDelete([[]])
          .catch(error => {
            expect(error.message).to.be.equal(
              'Can not transform "objects" to "whereClause". ' +
              'Item must be a string or an object with property "objectId" as string.'
            )
          })
      })
    })
  })

  xdescribe('Update Operation', function() {
    beforeEach(() => {
      testDataItems = []

      return TEST_DATA.reduce((promise, data) => {
        return promise.then(() => TestTable.save(data).then(item => testDataItems.push(item)))
      }, Promise.resolve())
    })

    describe('should update successful when', function() {

      it('used where clause', function() {
        return TestTable.bulkUpdate('kind=\'dog\'', { kind: 'cat' })
          .then(result => {
            expect(result).to.be.equal(3)
          })
          .then(() => TestTable.find(Backendless.DataQueryBuilder.create().setWhereClause('kind=\'cat\'')))
          .then(result => {
            expect(result.length).to.be.equal(4)
          })
      })

    })

    describe('should throw an error when', function() {
      const invalidWhereClauseArgumentError = (
        'Invalid bulkUpdate argument. ' +
        'The first argument must be "whereClause" string.'
      )

      const invalidChangesArgumentError = (
        'Invalid bulkUpdate argument. ' +
        'The second argument must be object.'
      )

      it('not passed any arguments', function() {
        return TestTable.bulkUpdate()
          .catch(error => {
            expect(error.message).to.be.equal(invalidWhereClauseArgumentError)
          })
      })

      it('passed empty STRING as "whereClause" argument', function() {
        return TestTable.bulkUpdate('', { foo: 'bar' })
          .catch(error => {
            expect(error.message).to.be.equal(invalidWhereClauseArgumentError)
          })
      })

      it('passed OBJECT as "whereClause" argument', function() {
        return TestTable.bulkUpdate({}, { foo: 'bar' })
          .catch(error => {
            expect(error.message).to.be.equal(invalidWhereClauseArgumentError)
          })
      })

      it('passed NUMBER as "whereClause" argument', function() {
        return TestTable.bulkUpdate(123, { foo: 'bar' })
          .catch(error => {
            expect(error.message).to.be.equal(invalidWhereClauseArgumentError)
          })
      })

      it('passed BOOLEAN as "whereClause" argument', function() {
        return TestTable.bulkUpdate(true, { foo: 'bar' })
          .catch(error => {
            expect(error.message).to.be.equal(invalidWhereClauseArgumentError)
          })
      })

      it('passed UNDEFINED as "whereClause" argument', function() {
        return TestTable.bulkUpdate(undefined, { foo: 'bar' })
          .catch(error => {
            expect(error.message).to.be.equal(invalidWhereClauseArgumentError)
          })
      })

      it('passed NULL as "whereClause" argument', function() {
        return TestTable.bulkUpdate(null, { foo: 'bar' })
          .catch(error => {
            expect(error.message).to.be.equal(invalidWhereClauseArgumentError)
          })
      })

      it('passed ARRAY as "whereClause" argument', function() {
        return TestTable.bulkUpdate([], { foo: 'bar' })
          .catch(error => {
            expect(error.message).to.be.equal(invalidWhereClauseArgumentError)
          })
      })

      it('not passed "changes" argument', function() {
        return TestTable.bulkUpdate('kind=\'dog\'')
          .catch(error => {
            expect(error.message).to.be.equal(invalidChangesArgumentError)
          })
      })

      it('passed NUMBER as "changes" argument', function() {
        return TestTable.bulkUpdate('kind=\'dog\'', 123)
          .catch(error => {
            expect(error.message).to.be.equal(invalidChangesArgumentError)
          })
      })

      it('passed STRING as "changes" argument', function() {
        return TestTable.bulkUpdate('kind=\'dog\'', 'someString')
          .catch(error => {
            expect(error.message).to.be.equal(invalidChangesArgumentError)
          })
      })

      it('passed ARRAY as "changes" argument', function() {
        return TestTable.bulkUpdate('kind=\'dog\'', [])
          .catch(error => {
            expect(error.message).to.be.equal(invalidChangesArgumentError)
          })
      })

      it('passed BOOLEAN as "changes" argument', function() {
        return TestTable.bulkUpdate('kind=\'dog\'', true)
          .catch(error => {
            expect(error.message).to.be.equal(invalidChangesArgumentError)
          })
      })

      it('passed NULL as "changes" argument', function() {
        return TestTable.bulkUpdate('kind=\'dog\'', null)
          .catch(error => {
            expect(error.message).to.be.equal(invalidChangesArgumentError)
          })
      })

      it('passed UNDEFINED as "changes" argument', function() {
        return TestTable.bulkUpdate('kind=\'dog\'', undefined)
          .catch(error => {
            expect(error.message).to.be.equal(invalidChangesArgumentError)
          })
      })

    })
  })

})
