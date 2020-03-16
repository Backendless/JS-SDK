import '../helpers/global'
import sandbox from '../helpers/sandbox'
import * as Utils from '../helpers/utils'

const Backendless = sandbox.Backendless

class Foo {
  constructor(data) {
    data = data || {}

    this.firstName = data.firstName
    this.lastName = data.lastName
  }
}

class Order {
  constructor(data) {
    data = data || {}

    this.title = data.title
    this.price = data.price
    this.ordered = data.ordered
    this.delivered = data.delivered
    this.discount = data.discount
  }
}

describe('Data', function() {
  let fooDataStore
  let usersDataStore
  let ordersDataStore
  let contactsDataStore

  let testCaseMarker

  const FOO_TABLE_NAME = 'Foo'
  const ORDERS_TABLE_NAME = 'Order'
  const CONTACTS_TABLE_NAME = 'Contact'

  sandbox.forSuite()

  before(async function() {
    fooDataStore = Backendless.Data.of(Foo)
    usersDataStore = Backendless.Data.of(Backendless.User)
    ordersDataStore = Backendless.Data.of(Order)
    contactsDataStore = Backendless.Data.of(CONTACTS_TABLE_NAME)

    await this.tablesAPI.createTable(FOO_TABLE_NAME)
    await this.tablesAPI.createTable(ORDERS_TABLE_NAME)
    await this.tablesAPI.createTable(CONTACTS_TABLE_NAME)

    await this.tablesAPI.createColumn(FOO_TABLE_NAME, 'firstName', this.tablesAPI.DataTypes.STRING)
    await this.tablesAPI.createColumn(FOO_TABLE_NAME, 'lastName', this.tablesAPI.DataTypes.STRING)

    await this.tablesAPI.createColumn(ORDERS_TABLE_NAME, 'title', this.tablesAPI.DataTypes.STRING)
    await this.tablesAPI.createColumn(ORDERS_TABLE_NAME, 'price', this.tablesAPI.DataTypes.INT)
    await this.tablesAPI.createColumn(ORDERS_TABLE_NAME, 'discount', this.tablesAPI.DataTypes.DOUBLE)
    await this.tablesAPI.createColumn(ORDERS_TABLE_NAME, 'ordered', this.tablesAPI.DataTypes.DATETIME)
    await this.tablesAPI.createColumn(ORDERS_TABLE_NAME, 'delivered', this.tablesAPI.DataTypes.BOOLEAN)

    await this.tablesAPI.createColumn(CONTACTS_TABLE_NAME, 'name', this.tablesAPI.DataTypes.STRING)
    await this.tablesAPI.createColumn(CONTACTS_TABLE_NAME, 'counter', this.tablesAPI.DataTypes.INT)

    const paginationTestData = [...Array(100).keys()].map(i => ({ counter: i + 1, name: 'John ' + (i + 1) }))

    await contactsDataStore.bulkCreate(paginationTestData)
  })

  beforeEach(async function() {
    testCaseMarker = Utils.uidShort()
  })

  describe('CRUD', function() {
    it('Create new table', async () => {
      const entity = new Foo({
        firstName: 'First',
        lastName : 'Last',
      })

      const result = await fooDataStore.save(entity)

      expect(result).to.be.instanceof(Foo)
      expect(result.objectId).to.be.a('string')
      expect(result.firstName).to.be.equal(entity.firstName)
      expect(result.lastName).to.be.equal(entity.lastName)
    })

    it('Update record', async () => {
      const entity = new Foo({
        firstName: 'Bill',
        lastName : 'Gates',
      })

      await fooDataStore.save(entity)

      entity.firstName = 'Ron'

      const updated = await fooDataStore.save(entity)

      expect(updated.firstName).to.be.equal(entity.firstName)
      expect(updated.lastName).to.be.equal(entity.lastName)
    })

    it('Remove record', async () => {
      const entity = new Foo({
        firstName: 'First',
        lastName : 'Last',
      })

      const createdResult = await fooDataStore.save(entity)

      const findResult = await fooDataStore.findById(createdResult.objectId)

      expect(findResult).to.be.instanceof(Foo)
      expect(findResult.objectId).to.be.equal(createdResult.objectId)
      expect(findResult.firstName).to.be.equal(entity.firstName)
      expect(findResult.lastName).to.be.equal(entity.lastName)

      const deleteResult = await fooDataStore.remove(findResult.objectId)

      expect(deleteResult.deletionTime).to.be.a('number')

      let error

      try {
        await fooDataStore.findById(findResult.objectId)
      } catch (e) {
        error = e
      }

      expect(error.message).to.be.equal(`Entity with ID ${findResult.objectId} not found`)
    })
  })

  describe('Users', function() {
    it('Add record to Users table', async () => {
      const user = {
        email   : `ringo${testCaseMarker}@starr.co`,
        name    : 'Ringo Starr',
        password: 'beatlesforever'
      }

      const result = await usersDataStore.save(user)

      expect(result).to.be.an.instanceof(Backendless.User)
      expect(result).to.have.property('email').that.equal(user.email)
      expect(result).to.have.property('name').that.equal(user.name)
      expect(result).to.not.have.property('password')
    })

    it('Possible to get persistence of Users using string signature and instances', async () => {
      await usersDataStore.bulkCreate([
        { email: `ringo${testCaseMarker}-${Utils.uid()}@starr.co`, name: 'test', password: 'test' },
        { email: `ringo${testCaseMarker}-${Utils.uid()}@starr.co`, name: 'test', password: 'test' },
        { email: `ringo${testCaseMarker}-${Utils.uid()}@starr.co`, name: 'test', password: 'test' },
        { email: `ringo${testCaseMarker}-${Utils.uid()}@starr.co`, name: 'test', password: 'test' },
      ])

      const check = async store => {
        const users = await store.find()

        users.forEach(user => {
          expect(user).to.be.an.instanceof(Backendless.User)
          expect(user).to.have.property('email').that.equal(user.email)
          expect(user).to.have.property('name').that.equal(user.name)
          expect(user).to.not.have.property('password')
        })
      }

      await check(Backendless.Data.of('Users'))
      await check(usersDataStore)
    })
  })

  describe('Data Types', function() {
    it('Update table record with invalid data type for properties', async () => {
      const savedOrder = await ordersDataStore.save({
        title    : `test-${testCaseMarker}`,
        price    : 1234,
        discount : Math.random() * 10,
        ordered  : Date.now(),
        delivered: true,
      })

      expect(typeof savedOrder.title === 'string').to.be.equal(true)
      expect(typeof savedOrder.price === 'number').to.be.equal(true)
      expect(typeof savedOrder.discount === 'number').to.be.equal(true)
      expect(typeof savedOrder.ordered === 'number').to.be.equal(true)
      expect(typeof savedOrder.delivered === 'boolean').to.be.equal(true)

      const check = async (prop, value, errorMessage) => {
        let error

        try {
          await ordersDataStore.save({ ...savedOrder, [prop]: value })
        } catch (e) {
          error = e
        }

        expect(error.message).to.equal(errorMessage)
      }

      await check('price', 'invalid number', 'Unable to save object - invalid data type for properties - price. You can change the property type in developer console.')
      await check('discount', 'invalid number', 'Unable to save object - invalid data type for properties - discount. You can change the property type in developer console.')
      await check('ordered', 'invalid number', 'Invalid date format for property ordered')
      await check('delivered', 'invalid number', 'Unable to save object - invalid data type for properties - delivered. You can change the property type in developer console.')
    })

    it('Remove object with wrong type of objectId', async () => {
      let error

      try {
        await ordersDataStore.remove(9999)
      } catch (e) {
        error = e
      }

      expect(error.message).to.be.equal('Invalid value for the "value" argument. The argument must contain only string or object values')
    })

  })

  describe('Retrieving', function() {
    it('Find Record By objectId', async () => {
      const entity = new Foo({
        firstName: 'test',
        lastName : 'test',
      })

      const createdResult = await fooDataStore.save(entity)

      const findResult = await fooDataStore.findById(createdResult.objectId)

      expect(findResult).to.be.instanceof(Foo)
      expect(findResult.objectId).to.be.equal(createdResult.objectId)
      expect(findResult.firstName).to.be.equal(entity.firstName)
      expect(findResult.lastName).to.be.equal(entity.lastName)
    })

    it('Find Record By Non Existing objectId', async () => {
      let error

      try {
        await fooDataStore.findById('NonExistingObjectId')
      } catch (e) {
        error = e
      }

      expect(error.message).to.be.equal('Entity with ID NonExistingObjectId not found')
    })

    it('Find with Where clause', async () => {
      await fooDataStore.bulkCreate([
        { firstName: `${Utils.uid()}-find-where-bar-${Utils.uid()}` },
        { firstName: `${Utils.uid()}-find-where-bar-${Utils.uid()}` },
        { firstName: `${Utils.uid()}-find-where-bar-${Utils.uid()}` },
        { firstName: `${Utils.uid()}-find-where-foo-${Utils.uid()}` },
      ])

      const query = Backendless.DataQueryBuilder.create()
        .setWhereClause('firstName like \'%find-where-bar%\'')

      const result = await fooDataStore.find(query)

      expect(result.length).to.be.equal(3)
      expect(result[0].firstName).to.match(/find-where-bar/)
      expect(result[1].firstName).to.match(/find-where-bar/)
      expect(result[2].firstName).to.match(/find-where-bar/)
    })

    it('Find with properties', async function() {
      let query
      let result

      query = Backendless.DataQueryBuilder.create()
        .setProperties(['name'])

      result = await contactsDataStore.find(query)

      expect(result[0]).to.not.have.property('counter')
      expect(result[0]).to.have.property('name')

      query = Backendless.DataQueryBuilder.create()
        .addProperties('name', 'created')

      result = await contactsDataStore.find(query)

      expect(result[0]).to.not.have.property('counter')
      expect(result[0]).to.not.have.property('updated')
      expect(result[0]).to.have.property('name')
      expect(result[0]).to.have.property('created')

      query = Backendless.DataQueryBuilder.create()
        .addProperties(['name', 'created'])

      result = await contactsDataStore.find(query)

      expect(result[0]).to.not.have.property('counter')
      expect(result[0]).to.not.have.property('updated')
      expect(result[0]).to.have.property('name')
      expect(result[0]).to.have.property('created')

      query = Backendless.DataQueryBuilder.create()
        .addProperties('name')
        .addProperties('created')

      result = await contactsDataStore.find(query)

      expect(result[0]).to.not.have.property('counter')
      expect(result[0]).to.not.have.property('updated')
      expect(result[0]).to.have.property('name')
      expect(result[0]).to.have.property('created')
    })

    it('Find with non existing properties', async () => {
      let error

      try {
        const query = Backendless.DataQueryBuilder.create()
          .setProperties(['nonExistingProp'])

        await contactsDataStore.find(query)
      } catch (e) {
        error = e
      }

      expect(error.message).to.be.equal('Column \'nonExistingProp\' does not exist in table \'Contact\'')
    })

    it('Find First and Last', async () => {
      const db = Backendless.Data.of('TestFindFirst')

      await db.save({ counter: 0, name: 'First' })
      await db.save({ counter: 1, name: 'Last' })

      const [first, last] = await Promise.all([
        db.findFirst(),
        db.findLast(),
      ])

      expect(first.counter).to.be.equal(0)
      expect(first.name).to.be.equal('First')

      expect(last.counter).to.be.equal(1)
      expect(last.name).to.be.equal('Last')
    })

    it('Find first in not existed table', async () => {
      let error

      try {
        await Backendless.Data.of('EmptyTable').findFirst()
      } catch (e) {
        error = e
      }

      expect(error.code).to.be.equal(1009)
      expect(error.message).to.be.equal(
        'Table not found by name \'Table not found by name \'EmptyTable\'. ' +
        'Make sure the client class referenced in the API call ' +
        'has the same literal name as the table in Backendless console\''
      )
    })

    it('Find with offset greater than the max number of records', async () => {
      const query = Backendless.DataQueryBuilder.create()
        .setOffset(500)

      const result = await contactsDataStore.find(query)

      expect(result).to.be.an('Array')
      expect(result.length).to.be.equal(0)
    })

    it('max page size', async () => {
      const query = Backendless.DataQueryBuilder.create()
        .setPageSize(100)

      const result = await contactsDataStore.find(query)

      expect(result).to.have.lengthOf(100)
    })

    it('sorting', async () => {
      const check = async (sorting, expected) => {
        const query = Backendless.DataQueryBuilder.create()
          .setSortBy(sorting)
          .setPageSize(5)

        const result = await contactsDataStore.find(query)
        const counters = result.map(o => o.counter)

        expect(counters).to.have.lengthOf(5)

        expect(counters).to.eql(expected)
      }

      await check('counter', [1, 2, 3, 4, 5])
      await check('counter asc', [1, 2, 3, 4, 5])
      await check('counter desc', [100, 99, 98, 97, 96])
    })

    it('Retrieving nextPage', async () => {
      const query = Backendless.DataQueryBuilder.create()
        .setSortBy('counter')

      let result

      result = await contactsDataStore.find(query)

      expect(result).to.have.lengthOf(10)
      expect(result.map(o => o.counter)).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

      query.prepareNextPage()

      result = await contactsDataStore.find(query)

      expect(result).to.have.lengthOf(10)
      expect(result.map(o => o.counter)).to.eql([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    })

    it('Retrieve object count', async () => {
      let count

      const query = Backendless.DataQueryBuilder.create()
        .setWhereClause('counter <= 50')

      count = await contactsDataStore.getObjectCount(query)

      expect(count).to.be.equal(50)

      count = await contactsDataStore.getObjectCount()

      expect(count).to.be.equal(100)
    })
  })

  describe('Schema', function() {
    it('Retrieves Properties of table', async () => {
      const result = await Backendless.Data.describe(ORDERS_TABLE_NAME)

      expect(result.map(o => o.name).sort())
        .to.eql(['title', 'ownerId', 'delivered', 'updated', 'discount', 'objectId', 'ordered', 'created', 'price'].sort())

      result.forEach(schemaObject => {
        expect(schemaObject).to.have.all.keys([
          'name', 'required', 'type', 'defaultValue', 'expression', 'relatedTable', 'customRegex', 'autoLoad', 'isPrimaryKey'
        ])
      })
    })

    it('Retrieves Properties of non existing table', async () => {
      let error

      try {
        await Backendless.Data.describe('NonExistingTable')
      } catch (e) {
        error = e
      }

      expect(error.code).to.be.equal(1009)
      expect(error.message).to.be.equal(
        'Table not found by name \'Table not found by name \'NonExistingTable\'. ' +
        'Make sure the client class referenced in the API call ' +
        'has the same literal name as the table in Backendless console\''
      )
    })
  })

})
