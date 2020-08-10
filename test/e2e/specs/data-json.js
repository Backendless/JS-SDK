import { expect } from 'chai'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Data - JSON', function() {
  let TestTable

  let savedObj

  let JsonUpdateBuilder

  sandbox.forSuite()

  const TABLE_NAME = 'TestTableWithJSON'

  before(async function() {
    TestTable = Backendless.Data.of(TABLE_NAME)

    await this.tablesAPI.createTable(TABLE_NAME)
    await this.tablesAPI.createColumn(TABLE_NAME, 'myJson', this.tablesAPI.DataTypes.JSON)
  })

  beforeEach(async function() {
    JsonUpdateBuilder = Backendless.JSONUpdateBuilder

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
    const jsonUpdateSet = JsonUpdateBuilder.SET()
      .addArgument('$.letter', 'b')
      .addArgument('$.number', 36)
      .addArgument('$.state', true)
      .addArgument('$.colours[0]', null)
      .addArgument('$.innerObject', { a: 'b' })
      .addArgument('$.innerArray', [4, 3, 2])

    const newValues = { myJson: jsonUpdateSet, objectId: savedObj.objectId }

    const updateResult = await TestTable.save(newValues)

    const expectedJson = {
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

    expect(updateResult.myJson).to.deep.include(expectedJson)

    const getResult = await TestTable.findById(savedObj.objectId)

    expect(getResult.myJson).to.deep.include(expectedJson)
  })

  it('insert', async () => {
    const jsonUpdateInsert = JsonUpdateBuilder.INSERT()
      .addArgument('$.decimals[2]', 20)
      .addArgument('$.decimals[3]', 25)
      .addArgument('$.state', 'on')
      .addArgument('$.number', 11)

    const newValues = { myJson: jsonUpdateInsert, objectId: savedObj.objectId }

    const updateResult = await TestTable.save(newValues)

    const expectedJson = {
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
    }

    expect(updateResult.myJson).to.deep.include(expectedJson)

    const getResult = await TestTable.findById(savedObj.objectId)

    expect(getResult.myJson).to.deep.include(expectedJson)
  })

  it('replace', async () => {
    const jsonUpdateReplace = JsonUpdateBuilder.REPLACE()
      .addArgument('$.decimals[2]', 20)
      .addArgument('$.decimals[3]', 25)
      .addArgument('$.state', 'on')
      .addArgument('$.number', 11)

    const newValues = { myJson: jsonUpdateReplace, objectId: savedObj.objectId }

    const updateResult = await TestTable.save(newValues)

    const expectedJson = {
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
    }

    expect(updateResult.myJson).to.deep.include(expectedJson)

    const getResult = await TestTable.findById(savedObj.objectId)

    expect(getResult.myJson).to.deep.include(expectedJson)
  })

  it('remove', async () => {
    const jsonUpdateRemove = JsonUpdateBuilder.REMOVE()
      .addArgument('$.timeMarks.date')
      .addArgument('$.number')
      .addArgument('$.colours[1]')

    const newValues = { myJson: jsonUpdateRemove, objectId: savedObj.objectId }

    const updateResult = await TestTable.save(newValues)

    const expectedJson = {
      'letter'     : 'a',
      'colours'    : ['red', 'blue'],
      'decimals'   : [12.3, 43.28, 56.89],
      'description': 'It is an "Example".',
      'timeMarks'  : {
        'time'     : '12:18:29.000000',
        'date_time': '2015-07-29 12:18:29.000000'
      }
    }

    expect(updateResult.myJson).to.deep.include(expectedJson)

    const getResult = await TestTable.findById(savedObj.objectId)

    expect(getResult.myJson).to.deep.include(expectedJson)
  })

  it('array_append', async () => {
    const jsonUpdateArrayAppend = JsonUpdateBuilder.ARRAY_APPEND()
      .addArgument('$.decimals', 432.0)
      .addArgument('$.colours', 'yellow')

    const newValues = { myJson: jsonUpdateArrayAppend, objectId: savedObj.objectId }

    const updateResult = await TestTable.save(newValues)

    const expectedJson = {
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
    }

    expect(updateResult.myJson).to.deep.include(expectedJson)

    const getResult = await TestTable.findById(savedObj.objectId)

    expect(getResult.myJson).to.deep.include(expectedJson)
  })

  it('array_insert', async () => {
    const jsonUpdateArrayInsert = JsonUpdateBuilder.ARRAY_INSERT()
      .addArgument('$.decimals[2]', 60)
      .addArgument('$.colours[1]', 'cyan')

    const newValues = { myJson: jsonUpdateArrayInsert, objectId: savedObj.objectId }

    const updateResult = await TestTable.save(newValues)

    const expectedJson = {
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
    }

    expect(updateResult.myJson).to.deep.include(expectedJson)

    const getResult = await TestTable.findById(savedObj.objectId)

    expect(getResult.myJson).to.deep.include(expectedJson)
  })

  it('check toJSON() returns the same object as create()', async () => {
    const jsonUpdateSet = JsonUpdateBuilder.SET()
      .addArgument('$.letter', 'b')
      .addArgument('$.number', 36)
      .addArgument('$.state', true)
      .addArgument('$.colours[0]', null)
      .addArgument('$.innerObject', { a: 'b' })
      .addArgument('$.innerArray', [4, 3, 2])

    expect(jsonUpdateSet.toJSON()).to.deep.eql(jsonUpdateSet.create())
  })
})