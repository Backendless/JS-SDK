import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Data - Distinct', function() {
  let personTableStore

  let queryBuilder

  sandbox.forSuite()

  function sortArrayWithObjByPropsValue(a, b) {
    if (a.name > b.name) {
      return 1
    }
    if (a.name < b.name) {
      return -1
    }

    return 0
  }

  const PERSON_TABLE_NAME = 'Person'

  before(async function() {
    personTableStore = Backendless.Data.of(PERSON_TABLE_NAME)

    await personTableStore.save({ name: 'name1', age: 10 })
    await personTableStore.save({ name: 'name2', age: 20 })
    await personTableStore.save({ name: 'name2', age: 20 })
  })

  beforeEach(async function() {
    queryBuilder = Backendless.DataQueryBuilder.create()
  })

  it('load', async () => {
    let result = await personTableStore.find(queryBuilder.addProperty('name').setDistinct(true))

    result = result.sort(sortArrayWithObjByPropsValue)

    expect(result.sort(sortArrayWithObjByPropsValue)).to.eql(
      [
        {
          "___class": "Person",
          "name"    : "name1",
        },
        {
          "___class": "Person",
          "name"    : "name2",
        }
      ]
    )
  })

  it('load1', async () => {
    let result = await personTableStore.find(queryBuilder.addProperty('name').setDistinct(false))

    result = result.sort(sortArrayWithObjByPropsValue)

    expect(result).to.eql(
      [
        {
          "___class": "Person",
          "name"    : "name1",
        },
        {
          "___class": "Person",
          "name"    : "name2",
        },
        {
          "___class": "Person",
          "name"    : "name2",
        }
      ]
    )
  })

  it('load2', async () => {
    let result = await personTableStore.find(queryBuilder.addProperties('name', 'age').setDistinct(true))

    result = result.sort(sortArrayWithObjByPropsValue)

    expect(result).to.eql(
      [
        {
          "___class": "Person",
          "age"     : 10,
          "name"    : "name1",
        },
        {
          "___class": "Person",
          "age"     : 20,
          "name"    : "name2",
        }
      ]
    )
  })

  it('load3', async () => {
    let result = await personTableStore.find(queryBuilder.addProperty('name').setGroupBy('objectId').setDistinct(true))

    result = result.sort(sortArrayWithObjByPropsValue)

    expect(result).to.eql(
      [
        {
          "___class": "Person",
          "name"    : "name1",
        },
        {
          "___class": "Person",
          "name"    : "name2",
        }
      ]
    )
  })
})
