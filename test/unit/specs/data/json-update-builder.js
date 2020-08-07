import { describe, it } from 'mocha'

import Backendless from '../../helpers/sandbox'
import { expect } from 'chai'

describe('<Data> JSON Update Builder', function() {
  let JsonUpdateBuilder

  beforeEach(() => {
    JsonUpdateBuilder = Backendless.Data.JSONUpdateBuilder
  })

  it('check default values', async () => {
    const jsonUpdateBuilder = new JsonUpdateBuilder()

    expect(jsonUpdateBuilder.args).to.be.eql({})
    expect(jsonUpdateBuilder.operationName).to.be.equal(undefined)
  })

  it('set', async () => {
    const jsonUpdateSet = JsonUpdateBuilder.SET()

    expect(jsonUpdateSet.args).to.be.eql({})
    expect(jsonUpdateSet.operationName).to.be.equal('JSON_SET')
  })

  it('set with args', async () => {
    const jsonUpdateSet = JsonUpdateBuilder.SET()
      .addArgument('$.letter', 'b')
      .addArgument('$.number', 36)
      .addArgument('$.state', true)
      .addArgument('$.colours[0]', null)
      .addArgument('$.innerObject', { a: 'b' })
      .addArgument('$.innerArray', [4, 3, 2])
      .addArgument('$.timeMarks.date', '2016-07-29')
      .addArgument('$.timeMarks.date_time', '2016-07-29 12:18:29.000000')

    expect(jsonUpdateSet.args).to.eql({
      '$.letter'             : 'b',
      '$.number'             : 36,
      '$.state'              : true,
      '$.colours[0]'         : null,
      '$.innerObject'        : { a: 'b' },
      '$.innerArray'         : [4, 3, 2],
      '$.timeMarks.date'     : '2016-07-29',
      '$.timeMarks.date_time': '2016-07-29 12:18:29.000000'
    })
    expect(jsonUpdateSet.operationName).to.be.equal('JSON_SET')
  })

  it('set with args and run toJSON()', async () => {
    const jsonUpdateSet = JsonUpdateBuilder.SET()
      .addArgument('$.letter', 'b')
      .addArgument('$.number', 36)
      .addArgument('$.state', true)
      .addArgument('$.colours[0]', null)
      .addArgument('$.innerObject', { a: 'b' })
      .addArgument('$.innerArray', [4, 3, 2])
      .toJSON()

    expect(jsonUpdateSet).to.eql({
      '___operation': 'JSON_SET',
      args          : {
        '$.letter'     : 'b',
        '$.number'     : 36,
        '$.state'      : true,
        '$.colours[0]' : null,
        '$.innerObject': { a: 'b' },
        '$.innerArray' : [4, 3, 2]
      }
    })
  })

  it('insert', async () => {
    const jsonUpdateInsert = JsonUpdateBuilder.INSERT()

    expect(jsonUpdateInsert instanceof Backendless.JSONUpdateBuilder).to.equal(true)
    expect(jsonUpdateInsert.args).to.be.eql({})
    expect(jsonUpdateInsert.operationName).to.be.equal('JSON_INSERT')
  })

  it('replace', async () => {
    const jsonUpdateReplace = JsonUpdateBuilder.REPLACE()

    expect(jsonUpdateReplace instanceof Backendless.JSONUpdateBuilder).to.equal(true)
    expect(jsonUpdateReplace.args).to.be.eql({})
    expect(jsonUpdateReplace.operationName).to.be.equal('JSON_REPLACE')
  })

  it('remove', async () => {
    const jsonUpdateRemove = JsonUpdateBuilder.REMOVE()

    expect(jsonUpdateRemove instanceof Backendless.JSONUpdateBuilder).to.equal(true)
    expect(jsonUpdateRemove.args).to.be.eql([])
    expect(jsonUpdateRemove.operationName).to.be.equal('JSON_REMOVE')
  })

  it('remove with args and run create()', async () => {
    const jsonUpdateRemove = JsonUpdateBuilder.REMOVE()
      .addArgument('$.timeMarks.date')
      .addArgument('$.number')
      .addArgument('$.colours[1]')
      .create()

    expect(jsonUpdateRemove).to.eql({
      '___operation': 'JSON_REMOVE',
      args          : ['$.timeMarks.date', '$.number', '$.colours[1]']
    })
  })

  it('array_append', async () => {
    const jsonUpdateArrayAppend = JsonUpdateBuilder.ARRAY_APPEND()

    expect(jsonUpdateArrayAppend instanceof Backendless.JSONUpdateBuilder).to.equal(true)
    expect(jsonUpdateArrayAppend.args).to.be.eql({})
    expect(jsonUpdateArrayAppend.operationName).to.be.equal('JSON_ARRAY_APPEND')
  })

  it('array_insert', async () => {
    const jsonUpdateArrayInsert = JsonUpdateBuilder.ARRAY_INSERT()

    expect(jsonUpdateArrayInsert instanceof Backendless.JSONUpdateBuilder).to.equal(true)
    expect(jsonUpdateArrayInsert.args).to.be.eql({})
    expect(jsonUpdateArrayInsert.operationName).to.be.equal('JSON_ARRAY_INSERT')
  })

  it('adding argument with a single value when (key,value) pair is expected for all operations except REMOVE',
    async () => {
      let error

      try {
        JsonUpdateBuilder.SET()
          .addArgument('$.letter')
      } catch (e) {
        error = e
      }

      expect(error.message).to.be.equal('You have to specify function\'s second argument')
    }
  )

  const NoArgumentsErrorMessage = 'You have to add at least one argument'

  it('should add at least one argument', async () => {
    let errorSet, errorRemove

    try {
      JsonUpdateBuilder.SET().toJSON()
    } catch (e) {
      errorSet = e
    }

    expect(errorSet.message).to.be.equal(NoArgumentsErrorMessage)

    try {
      JsonUpdateBuilder.REMOVE().toJSON()
    } catch (e) {
      errorRemove = e
    }

    expect(errorRemove.message).to.be.equal(NoArgumentsErrorMessage)
  })
})