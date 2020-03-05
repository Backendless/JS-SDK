import '../../helpers/global'
import sandbox from '../../helpers/sandbox'

const Backendless = sandbox.Backendless

const PERSONS_TABLE_NAME = 'Person'
const ADDRESSES_TABLE_NAME = 'Address'
const ORDERS_TABLE_NAME = 'Order'
const MOVIES_TABLE_NAME = 'Movie'

class Person {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.name = data.name
    this.age = data.age
  }
}

class Order {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.price = data.price
  }
}

class Movie {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.title = data.title
  }
}

describe('Transactions - Composed Operations', function() {

  let tablesAPI

  let personsStore
  let ordersStore
  let moviesStore

  let uow

  sandbox.forSuite()

  before(async function() {
    tablesAPI = this.tablesAPI

    await Promise.all([
      tablesAPI.createTable(PERSONS_TABLE_NAME),
      tablesAPI.createTable(ADDRESSES_TABLE_NAME),
      tablesAPI.createTable(ORDERS_TABLE_NAME),
      tablesAPI.createTable(MOVIES_TABLE_NAME),
    ])

    await Promise.all([
      tablesAPI.createColumn(PERSONS_TABLE_NAME, 'name', tablesAPI.DataTypes.STRING),
      tablesAPI.createColumn(PERSONS_TABLE_NAME, 'age', tablesAPI.DataTypes.INT),
      tablesAPI.createColumn(ADDRESSES_TABLE_NAME, 'address', tablesAPI.DataTypes.STRING),
      tablesAPI.createColumn(ORDERS_TABLE_NAME, 'price', tablesAPI.DataTypes.INT),
      tablesAPI.createColumn(MOVIES_TABLE_NAME, 'title', tablesAPI.DataTypes.STRING),
    ])

    personsStore = Backendless.Data.of(Person)
    ordersStore = Backendless.Data.of(Order)
    moviesStore = Backendless.Data.of(Movie)
  })

  beforeEach(function() {
    uow = new Backendless.UnitOfWork()
  })

  it('does not use any of the previous results in operations', async function() {
    const [order1, order2, movie1, movie2] = await Promise.all([
      ordersStore.save({ price: 100 }),
      ordersStore.save({ price: 500 }),
      moviesStore.save({ title: 'Movie 1' }),
      moviesStore.save({ title: 'Movie 2' }),
    ])

    order2.price = 700

    uow.create(PERSONS_TABLE_NAME, { name: 'Bob', age: 22 })

    uow.create(new Person({ name: 'Jack', age: 35 }))

    uow.bulkCreate([
      new Person({ name: 'Nick-1', age: 41 }),
      new Person({ name: 'Nick-2', age: 42 }),
      new Person({ name: 'Nick-3', age: 43 })
    ])

    uow.update(ORDERS_TABLE_NAME, { objectId: order1.objectId, price: 200 })

    uow.update(order2)

    uow.delete(MOVIES_TABLE_NAME, movie1)

    uow.delete(MOVIES_TABLE_NAME, movie2)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.createPerson1.type).to.equal('CREATE')
    expect(uowResult.results.createPerson1.result).to.have.property('name', 'Bob')
    expect(uowResult.results.createPerson1.result).to.have.property('age', 22)
    expect(uowResult.results.createPerson1.result).to.have.property('___class', 'Person')
    expect(uowResult.results.createPerson1.result).to.have.property('created').to.be.a('number')
    expect(uowResult.results.createPerson1.result).to.have.property('objectId').to.be.a('string')
    expect(uowResult.results.createPerson1.result).to.have.property('updated', null)
    expect(uowResult.results.createPerson1.result).to.have.property('ownerId', null)

    expect(uowResult.results.createPerson2.type).to.equal('CREATE')
    expect(uowResult.results.createPerson2.result).to.have.property('name', 'Jack')
    expect(uowResult.results.createPerson2.result).to.have.property('age', 35)
    expect(uowResult.results.createPerson2.result).to.have.property('___class', 'Person')
    expect(uowResult.results.createPerson2.result).to.have.property('created').to.be.a('number')
    expect(uowResult.results.createPerson2.result).to.have.property('objectId').to.be.a('string')
    expect(uowResult.results.createPerson2.result).to.have.property('updated', null)
    expect(uowResult.results.createPerson2.result).to.have.property('ownerId', null)

    expect(uowResult.results.create_bulkPerson1.type).to.equal('CREATE_BULK')
    expect(uowResult.results.create_bulkPerson1.result).to.be.an('array')
    expect(uowResult.results.create_bulkPerson1.result).to.have.length(3)

    expect(uowResult.results.updateOrder1.type).to.equal('UPDATE')
    expect(uowResult.results.updateOrder1.result).to.have.property('price', 200)
    expect(uowResult.results.updateOrder1.result).to.have.property('___class', 'Order')
    expect(uowResult.results.updateOrder1.result).to.have.property('created').to.be.a('number')
    expect(uowResult.results.updateOrder1.result).to.have.property('updated').to.be.a('number')
    expect(uowResult.results.updateOrder1.result).to.have.property('objectId', order1.objectId)
    expect(uowResult.results.updateOrder1.result).to.have.property('ownerId', null)

    expect(uowResult.results.updateOrder2.type).to.equal('UPDATE')
    expect(uowResult.results.updateOrder2.result).to.have.property('price', 700)
    expect(uowResult.results.updateOrder2.result).to.have.property('___class', 'Order')
    expect(uowResult.results.updateOrder2.result).to.have.property('created').to.be.a('number')
    expect(uowResult.results.updateOrder2.result).to.have.property('updated').to.be.a('number')
    expect(uowResult.results.updateOrder2.result).to.have.property('objectId', order2.objectId)
    expect(uowResult.results.updateOrder2.result).to.have.property('ownerId', null)

    expect(uowResult.results.deleteMovie1.type).to.equal('DELETE')
    expect(uowResult.results.deleteMovie1.result).to.be.a('number')

    expect(uowResult.results.deleteMovie2.type).to.equal('DELETE')
    expect(uowResult.results.deleteMovie2.result).to.be.a('number')
  })

  it('demonstrates creation of an object and subsequent update of the object.', async function() {
    const createObjectResult = uow.create(new Person({ name: 'Bob-22', age: 22 }))

    uow.update(createObjectResult, { age: 30 })

    await uow.execute()

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name = \'Bob-22\'')

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(1)
    expect(persons[0].age).to.equal(30)
  })

  describe('Fails', function() {

  })
})
