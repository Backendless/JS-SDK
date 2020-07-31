import { describe, it } from 'mocha'

import Backendless from '../../helpers/sandbox'
import { expect } from 'chai'

describe('<Data> JSON Update Builder', function() {
  let jsonUpdateBuilder

  beforeEach(() => {
    jsonUpdateBuilder = Backendless.Data.JSONUpdateBuilder
  })

  it('should have null as default values', async () => {
    const jsonUpdateBuilderInstance = new jsonUpdateBuilder()

    expect(jsonUpdateBuilderInstance.args).to.be.equal(null)
    expect(jsonUpdateBuilderInstance.operationName).to.be.equal(null)
  })

  it('set', async () => {
    const jsonUpdateSet = jsonUpdateBuilder.SET()

    expect(jsonUpdateSet.args).to.be.eql({})
    expect(jsonUpdateSet.operationName).to.be.equal('JSON_SET')
  })

  it('set with args', async () => {
    const jsonUpdateSet = jsonUpdateBuilder.SET()
      .addArgument('$.letter', 'b')
      .addArgument('$.number', 36)
      .addArgument('$.state', true)
      .addArgument('$.colours[0]', null)
      .addArgument('$.innerObject', { a: 'b' })
      .addArgument('$.innerArray', [4, 3, 2])

    expect(jsonUpdateSet.args).to.eql({
      '$.letter'     : 'b',
      '$.number'     : 36,
      '$.state'      : true,
      '$.colours[0]' : null,
      '$.innerObject': { a: 'b' },
      '$.innerArray' : [4, 3, 2]
    })
    expect(jsonUpdateSet.operationName).to.be.equal('JSON_SET')
  })

  it('set with args and create', async () => {
    const jsonUpdateSet = jsonUpdateBuilder.SET()
      .addArgument('$.letter', 'b')
      .addArgument('$.number', 36)
      .addArgument('$.state', true)
      .addArgument('$.colours[0]', null)
      .addArgument('$.innerObject', { a: 'b' })
      .addArgument('$.innerArray', [4, 3, 2])
      .create()

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
    const jsonUpdateInsert = jsonUpdateBuilder.INSERT()

    expect(jsonUpdateInsert.args).to.be.eql({})
    expect(jsonUpdateInsert.operationName).to.be.equal('JSON_INSERT')
  })

  it('replace', async () => {
    const jsonUpdateReplace = jsonUpdateBuilder.REPLACE()

    expect(jsonUpdateReplace.args).to.be.eql({})
    expect(jsonUpdateReplace.operationName).to.be.equal('JSON_REPLACE')
  })

  it('remove', async () => {
    const jsonUpdateRemove = jsonUpdateBuilder.REMOVE()

    expect(jsonUpdateRemove.args).to.be.eql([])
    expect(jsonUpdateRemove.operationName).to.be.equal('JSON_REMOVE')
  })

  it('remove with args and create', async () => {
    const jsonUpdateRemove = jsonUpdateBuilder.REMOVE()
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
    const jsonUpdateArrayAppend = jsonUpdateBuilder.ARRAY_APPEND()

    expect(jsonUpdateArrayAppend.args).to.be.eql({})
    expect(jsonUpdateArrayAppend.operationName).to.be.equal('JSON_ARRAY_APPEND')
  })

  it('array_insert', async () => {
    const jsonUpdateArrayInsert = jsonUpdateBuilder.ARRAY_INSERT()

    expect(jsonUpdateArrayInsert.args).to.be.eql({})
    expect(jsonUpdateArrayInsert.operationName).to.be.equal('JSON_ARRAY_INSERT')
  })

  const ChooseOperationErrorMessage = 'You have to choose an operation type. ' +
    'Use one of [\'SET\', \'INSERT\', \'REPLACE\', \'REMOVE\', \'ARRAY_APPEND\', \'ARRAY_INSERT\']'

  it('should choose an operation type', async () => {
    let error1, error2

    const jsonUpdateBuilderInstance = new jsonUpdateBuilder()

    try {
      jsonUpdateBuilderInstance.addArgument('$.letter', 'b')
    } catch (e) {
      error1 = e
    }

    expect(error1.message).to.be.equal(ChooseOperationErrorMessage)
    expect(jsonUpdateBuilderInstance.args).to.be.equal(null)
    expect(jsonUpdateBuilderInstance.operationName).to.be.equal(null)

    try {
      jsonUpdateBuilderInstance.create()
    } catch (e) {
      error2 = e
    }

    expect(error2.message).to.be.equal(ChooseOperationErrorMessage)

  })

  it('adding argument with a single value when (key,value) pair is expected for all operations except REMOVE',
    async () => {
      let error

      try {
        jsonUpdateBuilder.SET()
          .addArgument('$.letter')
          .addArgument('$.number', 36)
          .create()
      } catch (e) {
        error = e
      }

      expect(error.message).to.be.equal('You have to specify function\'s second argument')
    }
  )

  it('should add at least one argument', async () => {
    let error

    try {
      jsonUpdateBuilder.SET().create()
    } catch (e) {
      error = e
    }

    expect(error.message).to.be.equal('You have to add at least one argument')
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

    expect(error.message).to.be.equal('jsonUpdateBuilder.addArgument is not a function')
  })
})