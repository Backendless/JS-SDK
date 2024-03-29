import sandbox from '../helpers/sandbox'
import { generateLongString, createComparator } from '../helpers/utils'

const Backendless = sandbox.Backendless

describe('Data - Where Clause', function() {
  let personTableStore

  let queryBuilder

  function generateLongString(length = 1000){
    return new Array(length).fill('a').join('')
  }

  sandbox.forSuite()

  const PERSON_TABLE_NAME = 'Person'

  before(async function() {
    personTableStore = Backendless.Data.of(PERSON_TABLE_NAME)

    await personTableStore.save({ name: 'name1', age: 10 })
    await personTableStore.save({ name: 'name2', age: 20 })
    await personTableStore.save({ name: 'name3', age: 30 })
  })

  beforeEach(async function() {
    queryBuilder = Backendless.DataQueryBuilder.create().addProperties('age', 'name')
  })

  it('load all objects by default', async () => {
    queryBuilder
      .addProperties('age', 'name')

    const result = await personTableStore.find(queryBuilder)

    const expected = [
      {
        "___class": "Person",
        "age"     : 10,
        "name"    : "name1",
      },
      {
        "___class": "Person",
        "age"     : 20,
        "name"    : "name2",
      },
      {
        "___class": "Person",
        "age"     : 30,
        "name"    : "name3",
      }
    ]

    if (Array.isArray(result)) {
      result.sort(createComparator('name'))
    }

    expect(result).to.eql(expected)
  })

  it('without arg', async () => {
    queryBuilder
      .addProperties('age', 'name')
      .setWhereClause()

    const result = await personTableStore.find(queryBuilder)

    const expected = [
      {
        "___class": "Person",
        "age"     : 10,
        "name"    : "name1",
      },
      {
        "___class": "Person",
        "age"     : 20,
        "name"    : "name2",
      },
      {
        "___class": "Person",
        "age"     : 30,
        "name"    : "name3",
      }
    ]

    if (Array.isArray(result)) {
      result.sort(createComparator('name'))
    }

    expect(result).to.eql(expected)
  })

  it('with valid args', async () => {
    queryBuilder
      .addProperties('age', 'name')
      .setWhereClause("name = 'name1'")

    const result = await personTableStore.find(queryBuilder)

    const expected = [
      {
        "___class": "Person",
        "age"     : 10,
        "name"    : "name1",
      },
    ]

    if (Array.isArray(result)) {
      result.sort(createComparator('name'))
    }

    expect(result).to.eql(expected)
  })

  it('should work with huge query', async () => {
    const where = `name = '${generateLongString(3000)}'`

    queryBuilder
      .setWhereClause(where)

    const result = await personTableStore.find(queryBuilder)

    if (Array.isArray(result)) {
      result.sort(createComparator('name'))
    }

    expect(result).to.eql([])
  })

})
