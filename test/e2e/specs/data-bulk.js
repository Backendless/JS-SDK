import sandbox, { Utils } from '../helpers/sandbox'

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
  let testCaseMarker

  sandbox.forSuite()

  before(async function() {
    TestTable = Backendless.Data.of(TEST_TABLE_NAME)

    await this.tablesAPI.createTable(TEST_TABLE_NAME)
    await this.tablesAPI.createColumn(TEST_TABLE_NAME, 'name', this.tablesAPI.DataTypes.STRING)
    await this.tablesAPI.createColumn(TEST_TABLE_NAME, 'kind', this.tablesAPI.DataTypes.STRING)
  })

  beforeEach(async () => {
    testCaseMarker = Utils.uidShort()
  })

  describe('Create Operation', function() {

    describe('should save successful when', function() {

      it('passed non empty objects in array', async function() {
        const sourceItems = [
          { name: `non-empty-${Utils.uid()}`, kind: 'dog' },
          { name: `non-empty-${Utils.uid()}`, kind: 'dog' },
          { name: `non-empty-${Utils.uid()}`, kind: 'dog' },
          { name: `non-empty-${Utils.uid()}`, kind: 'cat' }
        ]

        const result = await TestTable.bulkCreate(sourceItems)

        expect(result).to.be.an('array')
        expect(result).to.have.length(4)

        expect(result[0]).to.be.an('string')
        expect(result[1]).to.be.an('string')
        expect(result[2]).to.be.an('string')
        expect(result[3]).to.be.an('string')

        const query = Backendless.Data.QueryBuilder.create()
          .setWhereClause('name like \'non-empty-%\'')

        const savedItems = await TestTable.find(query)

        expect(savedItems).to.be.an('array')
        expect(savedItems).to.have.length(4)
      })

      it('passed a few empty objects in array', async function() {
        const sourceItems = [
          { name: `few-empty-${Utils.uid()}`, kind: 'dog' },
          {},
          { name: `few-empty-${Utils.uid()}`, kind: 'dog' },
          {}
        ]

        const result = await TestTable.bulkCreate(sourceItems)

        expect(result).to.be.an('array')
        expect(result).to.have.length(4)

        const query = Backendless.Data.QueryBuilder.create()
          .setWhereClause(`objectId in (${result.map(o => `'${o}'`).join(',')})`)

        const savedItems = await TestTable.find(query)

        expect(savedItems).to.be.an('array')
        expect(savedItems).to.have.length(4)
      })
    })

    describe('should throw an error when', function() {
      const errorMessage = 'Objects must be provided and must be an array of objects.'

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

  describe('Delete Operation', function() {

    beforeEach(async () => {
      testDataItems = await Promise.all([
        TestTable.save({ name: `update-operation-${testCaseMarker}-${Utils.uid()}`, kind: 'dog' }),
        TestTable.save({ name: `update-operation-${testCaseMarker}-${Utils.uid()}`, kind: 'dog' }),
        TestTable.save({ name: `update-operation-${testCaseMarker}-${Utils.uid()}`, kind: 'dog' }),
        TestTable.save({ name: `update-operation-${testCaseMarker}-${Utils.uid()}`, kind: 'cat' }),
      ])
    })

    describe('should delete successful when', function() {
      it('used where clause', function() {
        return TestTable.bulkDelete(`name like '%${testCaseMarker}%' and kind='dog'`)
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
              'Condition must be provided and must be a string or a list of objects.'
            )
          })
      })

      it('passed OBJECT as where clause', function() {
        return TestTable.bulkDelete({})
          .catch(error => {
            expect(error.message).to.be.equal(
              'Condition must be provided and must be a string or a list of objects.'
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

  describe('Update Operation', function() {

    beforeEach(async () => {
      testDataItems = await Promise.all([
        TestTable.save({ name: `delete-operation-${testCaseMarker}-${Utils.uid()}`, kind: 'dog' }),
        TestTable.save({ name: `delete-operation-${testCaseMarker}-${Utils.uid()}`, kind: 'dog' }),
        TestTable.save({ name: `delete-operation-${testCaseMarker}-${Utils.uid()}`, kind: 'dog' }),
        TestTable.save({ name: `delete-operation-${testCaseMarker}-${Utils.uid()}`, kind: 'cat' }),
      ])
    })

    describe('should update successful when', function() {

      it('used where clause', async function() {
        const result = await TestTable.bulkUpdate(`name like '%${testCaseMarker}%' and kind='dog'`, { kind: 'cat' })

        expect(result).to.be.equal(3)

        const query = Backendless.DataQueryBuilder.create()
          .setWhereClause(`name like '%${testCaseMarker}%' and kind='cat'`)

        const savedItems = await TestTable.find(query)

        expect(savedItems).to.be.an('array')
        expect(savedItems.length).to.be.equal(4)
      })

    })

    describe('should throw an error when', function() {
      const invalidWhereClauseArgumentError = 'Condition must be provided and must be a string.'
      const invalidChangesArgumentError = 'Changes must be provided and must be an object.'

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
