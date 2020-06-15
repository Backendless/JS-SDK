import sandbox from '../../helpers/sandbox'

const Backendless = sandbox.Backendless

const PERSONS_TABLE_NAME = 'Person'

class Person {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.name = data.name
    this.age = data.age
  }
}

describe('Transactions - Find Operation', function() {

  let personsStore

  let uow

  sandbox.forSuite()

  before(async function() {
    personsStore = Backendless.Data.of(Person)

    await personsStore.save({ name: 'p-1', age: 10 })
    await personsStore.save({ name: 'p-2', age: 10 })
    await personsStore.save({ name: 'p-3', age: 22 })
    await personsStore.save({ name: 'p-4', age: 25 })
    await personsStore.save({ name: 'p-5', age: 30 })
  })

  beforeEach(function() {
    uow = new Backendless.UnitOfWork()
  })

  it('loads a list of objects', async function() {
    const query = Backendless.Data.QueryBuilder.create()
      .setWhereClause('age >= 25')

    uow.find(PERSONS_TABLE_NAME, query)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.findPerson1.operationType).to.equal('FIND')
    expect(uowResult.results.findPerson1.result).to.have.length(2)

    uowResult.results.findPerson1.result.forEach(result => {
      expect(result).to.have.property('___class', 'Person')
      expect(result).to.have.property('name').to.be.a('string')
      expect(result).to.have.property('age').to.be.a('number')
      expect(result).to.have.property('created').to.be.a('number')
      expect(result).to.have.property('objectId').to.be.a('string')
      expect(result).to.have.property('updated', null)
      expect(result).to.have.property('ownerId', null)
    })
  })

  it('loads a sorted list of objects', async function() {
    const query = Backendless.Data.QueryBuilder.create()
      .setSortBy('age asc')

    uow.find(PERSONS_TABLE_NAME, query)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.findPerson1.operationType).to.equal('FIND')
    expect(uowResult.results.findPerson1.result).to.have.length(5)

    const personAges = uowResult.results.findPerson1.result.map(o => o.age)

    expect(personAges).to.eql([10, 10, 22, 25, 30])
  })

  it('loads a single object', async function() {
    const query = Backendless.Data.QueryBuilder.create()
      .setWhereClause('age >= 15')
      .setPageSize(1)
      .setSortBy('age asc')

    uow.find(PERSONS_TABLE_NAME, query)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.findPerson1.operationType).to.equal('FIND')

    expect(uowResult.results.findPerson1.result).to.have.length(1)
    expect(uowResult.results.findPerson1.result[0]).to.have.property('___class', 'Person')
    expect(uowResult.results.findPerson1.result[0]).to.have.property('name', 'p-3')
    expect(uowResult.results.findPerson1.result[0]).to.have.property('age', 22)
    expect(uowResult.results.findPerson1.result[0]).to.have.property('created').to.be.a('number')
    expect(uowResult.results.findPerson1.result[0]).to.have.property('objectId').to.be.a('string')
    expect(uowResult.results.findPerson1.result[0]).to.have.property('updated', null)
    expect(uowResult.results.findPerson1.result[0]).to.have.property('ownerId', null)
  })

  describe('Fails', function() {

  })
})
