import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Data - Distinct', function() {
  let personTableStore

  let queryBuilder

  sandbox.forSuite()

  function sortByName(a, b) {
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

  it('load distinct objects by single property', async () => {
    const result = await personTableStore.find(queryBuilder.addProperty('name').setDistinct(true))

    result.sort(sortByName)

    expect(result.sort(sortByName)).to.eql(
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

  it('load not distinct objects by single property', async () => {
    const result = await personTableStore.find(queryBuilder.addProperty('name').setDistinct(false))

    result.sort(sortByName)

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

  it('load distinct objects by few properties', async () => {
    const result = await personTableStore.find(queryBuilder.addProperties('name', 'age').setDistinct(true))

    result.sort(sortByName)

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

  it('load distinct objects by property with group by some property', async () => {
    const result = await personTableStore.find(queryBuilder.addProperty('name').setGroupBy('objectId').setDistinct(true))

    result.sort(sortByName)

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
