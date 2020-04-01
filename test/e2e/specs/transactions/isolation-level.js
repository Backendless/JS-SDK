import '../../helpers/global'
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

describe('Isolation Levels', function() {

  let tablesAPI

  let personsStore

  let uow

  sandbox.forSuite()

  before(async function() {
    tablesAPI = this.tablesAPI

    await Promise.all([
      tablesAPI.createTable(PERSONS_TABLE_NAME),
    ])

    await tablesAPI.createColumn(PERSONS_TABLE_NAME, 'tag', tablesAPI.DataTypes.STRING)
    await tablesAPI.createColumn(PERSONS_TABLE_NAME, 'name', tablesAPI.DataTypes.STRING)
    await tablesAPI.createColumn(PERSONS_TABLE_NAME, 'age', tablesAPI.DataTypes.INT)

    personsStore = Backendless.Data.of(Person)
  })

  beforeEach(function() {
    uow = new Backendless.UnitOfWork()
  })

  it('sets IsolationLevel', async function() {
    expect(uow.payload.isolationLevelEnum).to.equal(undefined)

    uow.setIsolationLevel(Backendless.UnitOfWork.IsolationLevelEnum.READ_UNCOMMITTED)
    expect(uow.payload.isolationLevelEnum).to.equal('READ_UNCOMMITTED')

    uow.setIsolationLevel(Backendless.UnitOfWork.IsolationLevelEnum.READ_COMMITTED)
    expect(uow.payload.isolationLevelEnum).to.equal('READ_COMMITTED')

    uow.setIsolationLevel(Backendless.UnitOfWork.IsolationLevelEnum.REPEATABLE_READ)
    expect(uow.payload.isolationLevelEnum).to.equal('REPEATABLE_READ')

    uow.setIsolationLevel(Backendless.UnitOfWork.IsolationLevelEnum.SERIALIZABLE)
    expect(uow.payload.isolationLevelEnum).to.equal('SERIALIZABLE')
  })

})
