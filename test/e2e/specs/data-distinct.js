import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Data - Distinct', function() {
  let parentTableStore

  let queryBuilder

  sandbox.forSuite()

  const PARENT_TABLE_NAME = 'Parent'

  before(async function() {
    parentTableStore = Backendless.Data.of(PARENT_TABLE_NAME)

    const guy1 = await parentTableStore.save({ name: 'test1', age: 35, blocked: false, })
    const guy2 = await parentTableStore.save({ name: 'test1', age: 35, blocked: false, })
    const guy3 = await parentTableStore.save({ name: 'test3', age: 36, blocked: false, })
    const guy4 = await parentTableStore.save({ name: 'test4', age: 37, blocked: false, })

  })

  beforeEach(async function() {
    queryBuilder = Backendless.DataQueryBuilder.create()
  })

  it('load all properties by default', async () => {
    const result = await parentTableStore.find(queryBuilder.setDistinct(true))

    expect(Object.keys(result))
      .to.eql([])
  })
})
