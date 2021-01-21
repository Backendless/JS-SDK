import sandbox from '../helpers/sandbox'

import { sortByProperty } from '../helpers/utils'

const Backendless = sandbox.Backendless

describe('Data - GroupBy', function() {
  let personTableStore

  let queryBuilder

  sandbox.forSuite()

  const PERSON_TABLE_NAME = 'Person'

  before(async function() {
    personTableStore = Backendless.Data.of(PERSON_TABLE_NAME)

    await personTableStore.save({ name: 'name1', age: 10 })
    await personTableStore.save({ name: 'name2', age: 20 })
    await personTableStore.save({ name: 'name2', age: 30 })
  })

  beforeEach(async function() {
    queryBuilder = Backendless.DataQueryBuilder.create().addProperties('age', 'name')
  })

  it('with valid args', async () => {
    queryBuilder
      .setProperties( 'Avg(age) as avgAge')
      .setGroupBy('name')

    const result = await personTableStore.find(queryBuilder)

    result.sort(sortByProperty('avgAge'))

    const expected = [
      {
        "___class": "Person",
        "avgAge": 10
      },
      {
        "___class": "Person",
        "avgAge": 25
      }
    ]

    expect(result).to.eql(expected)
  })

  it('without args', async () => {
    queryBuilder
      .setProperties( 'Avg(age) as avgAge')
      .setGroupBy()

    const result = await personTableStore.find(queryBuilder)

    result.sort(sortByProperty('avgAge'))

    const expected = [
      {
        "___class": "Person",
        "avgAge": 20
      }
    ]

    expect(result).to.eql(expected)
  })

})
