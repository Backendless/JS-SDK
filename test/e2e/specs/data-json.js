import { expect } from 'chai'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Data - JSON', function() {
  let TestTable

  let savedObj

  let jsonUpdateBuilder

  sandbox.forSuite()

  const TABLE_NAME = 'TestTableWithJSON'

  before(async function() {
    TestTable = Backendless.Data.of(TABLE_NAME)

    await this.tablesAPI.createTable(TABLE_NAME)
    await this.tablesAPI.createColumn(TABLE_NAME, 'myJson', this.tablesAPI.DataTypes.JSON)
  })

  beforeEach(async function() {
    jsonUpdateBuilder = Backendless.JSONUpdateBuilder

    savedObj = await TestTable.save({
      name: 'test', age: 30, myJson: {
        'letter'     : 'a',
        'number'     : 10,
        'decimals'   : [12.3, 43.28, 56.89],
        'colours'    : ['red', 'green', 'blue'],
        'description': 'It is an "Example".',
        'timeMarks'  : {
          'time'     : '12:18:29.000000',
          'date'     : '2015-07-29',
          'date_time': '2015-07-29 12:18:29.000000'
        }
      }
    })
  })

  it('set', async () => {
    const jsonUpdateSet = jsonUpdateBuilder.SET()
      .addArgument('$.letter', 'b')
      .addArgument('$.number', 36)
      .addArgument('$.state', true)
      .addArgument('$.colours[0]', null)
      .addArgument('$.innerObject', { a: 'b' })
      .addArgument('$.innerArray', [4, 3, 2])
      .create()

    const newValues = { myJson: jsonUpdateSet, objectId: savedObj.objectId }

    const result = await TestTable.save(newValues)

    expect(result.myJson).to.deep.include({
        'letter'     : 'b',
        'number'     : 36,
        'state'      : true,
        'decimals'   : [12.3, 43.28, 56.89],
        'colours'    : [null, 'green', 'blue'],
        'description': 'It is an "Example".',
        'timeMarks'  : {
          'time'     : '12:18:29.000000',
          'date'     : '2015-07-29',
          'date_time': '2015-07-29 12:18:29.000000'
        },
        'innerObject': { 'a': 'b' },
        'innerArray' : [4, 3, 2]
      }
    )
  })

  it('insert', async () => {
    const jsonUpdateInsert = jsonUpdateBuilder.INSERT()
      .addArgument('$.decimals[2]', 20)
      .addArgument('$.decimals[3]', 25)
      .addArgument('$.state', 'on')
      .addArgument('$.number', 11)
      .create()

    const newValues = { myJson: jsonUpdateInsert, objectId: savedObj.objectId }

    const result = await TestTable.save(newValues)

    expect(result.myJson).to.deep.include({
      'state'      : 'on',
      'letter'     : 'a',
      'number'     : 10,
      'colours'    : ['red', 'green', 'blue'],
      'decimals'   : [12.3, 43.28, 56.89, 25],
      'timeMarks'  : {
        'date'     : '2015-07-29',
        'time'     : '12:18:29.000000',
        'date_time': '2015-07-29 12:18:29.000000'
      },
      'description': 'It is an "Example".'
    })
  })

  it('replace', async () => {
    const jsonUpdateReplace = jsonUpdateBuilder.REPLACE()
      .addArgument('$.decimals[2]', 20)
      .addArgument('$.decimals[3]', 25)
      .addArgument('$.state', 'on')
      .addArgument('$.number', 11)
      .create()

    const newValues = { myJson: jsonUpdateReplace, objectId: savedObj.objectId }

    const result = await TestTable.save(newValues)

    expect(result.myJson).to.deep.include({
      'letter'     : 'a',
      'number'     : 11,
      'decimals'   : [12.3, 43.28, 20],
      'colours'    : ['red', 'green', 'blue'],
      'description': 'It is an "Example".',
      'timeMarks'  : {
        'time'     : '12:18:29.000000',
        'date'     : '2015-07-29',
        'date_time': '2015-07-29 12:18:29.000000'
      }
    })
  })

  it('remove', async () => {
    const jsonUpdateRemove = jsonUpdateBuilder.REMOVE()
      .addArgument('$.timeMarks.date')
      .addArgument('$.number')
      .addArgument('$.colours[1]')
      .create()

    const newValues = { myJson: jsonUpdateRemove, objectId: savedObj.objectId }

    const result = await TestTable.save(newValues)

    expect(result.myJson).to.deep.include({
      'letter'     : 'a',
      'colours'    : ['red', 'blue'],
      'decimals'   : [12.3, 43.28, 56.89],
      'description': 'It is an "Example".',
      'timeMarks'  : {
        'time'     : '12:18:29.000000',
        'date_time': '2015-07-29 12:18:29.000000'
      }
    })
  })

  it('array_append', async () => {
    const jsonUpdateArrayAppend = jsonUpdateBuilder.ARRAY_APPEND()
      .addArgument('$.decimals', 432.0)
      .addArgument('$.colours', 'yellow')
      .create()

    const newValues = { myJson: jsonUpdateArrayAppend, objectId: savedObj.objectId }

    const result = await TestTable.save(newValues)

    expect(result.myJson).to.deep.include({
        'letter': 'a',
        'number': 10,
        'decimals': [12.3, 43.28, 56.89, 432.0],
        'colours': ['red', 'green', 'blue', 'yellow'],
        'description': 'It is an "Example".',
        'timeMarks': {
          'time': '12:18:29.000000',
          'date': '2015-07-29',
          'date_time': '2015-07-29 12:18:29.000000'
        }
      })
  })

  it('array_insert', async () => {
    const jsonUpdateArrayInsert = jsonUpdateBuilder.ARRAY_INSERT()
      .addArgument('$.decimals[2]', 60)
      .addArgument('$.colours[1]', 'cyan')
      .create()

    const newValues = { myJson: jsonUpdateArrayInsert, objectId: savedObj.objectId }

    const result = await TestTable.save(newValues)

    expect(result.myJson).to.deep.include({
        'letter': 'a',
        'number': 10,
        'decimals': [12.3, 43.28, 60, 56.89],
        'colours': ['red', 'cyan', 'green', 'blue'],
        'description': 'It is an "Example".',
        'timeMarks': {
          'time': '12:18:29.000000',
          'date': '2015-07-29',
          'date_time': '2015-07-29 12:18:29.000000'
        }
      })
  })

  it('add no arguments and create', async () => {
    let error

    try {
      jsonUpdateBuilder.INSERT().create()
    } catch (e) {
      error = e
    }

    expect(error.message).to.equal('You have to add at least one argument')
  })

  it('adding arguments without setting an operation', async () => {
    let error

    try {
      jsonUpdateBuilder
        .addArgument('$.decimals[2]', 20)
        .addArgument('$.decimals[3]', 25)
        .create()
    } catch (e) {
      error = e
    }

    expect(error.message).to.equal('jsonUpdateBuilder.addArgument is not a function')
  })

  it('adding argument with a single value when (key,value) pair is expected', async () => {
    let error

    try {
      jsonUpdateBuilder.SET()
        .addArgument('$.letter', 'b')
        .addArgument('$.number')
        .create()
    } catch (e) {
      error = e
    }

    expect(error.message).to.equal('You have to specify function\'s second argument')
  })
})