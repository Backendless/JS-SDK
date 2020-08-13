import Backendless, { prepareMockRequest, forTest } from '../../helpers/sandbox'
import { expect } from 'chai'

describe('<Data> JSON Update Builder', function() {
  let JSONUpdateBuilder

  forTest(this)

  beforeEach(async function() {
    JSONUpdateBuilder = Backendless.JSONUpdateBuilder
  })

  it('should have default values', async () => {
    const jsonUpdateBuilder = new JSONUpdateBuilder()

    expect(jsonUpdateBuilder.args).to.be.eql({})
    expect(jsonUpdateBuilder.operationName).to.be.equal(undefined)
  })

  describe('General Operations', function() {

    it('JSON_SET', async () => {
      const updateBuilder = JSONUpdateBuilder.SET()

      expect(updateBuilder).to.be.an.instanceof(JSONUpdateBuilder)
      expect(updateBuilder.args).to.be.eql({})
      expect(updateBuilder.operationName).to.be.equal('JSON_SET')

      updateBuilder
        .addArgument('$.letter', 'b')
        .addArgument('$.number', 36)
        .addArgument('$.state', true)
        .addArgument('$.colours[0]', null)
        .addArgument('$.innerObject', { a: 'b' })
        .addArgument('$.innerArray', [4, 3, 2])
        .addArgument('$.timeMarks.date', '2016-07-29')
        .addArgument('$.timeMarks.date_time', '2016-07-29 12:18:29.000000')

      expect(updateBuilder.args).to.eql({
        '$.letter'             : 'b',
        '$.number'             : 36,
        '$.state'              : true,
        '$.colours[0]'         : null,
        '$.innerObject'        : { a: 'b' },
        '$.innerArray'         : [4, 3, 2],
        '$.timeMarks.date'     : '2016-07-29',
        '$.timeMarks.date_time': '2016-07-29 12:18:29.000000'
      })

      expect(updateBuilder.operationName).to.be.equal('JSON_SET')
    })

    it('JSON_INSERT', async () => {
      const updateBuilder = JSONUpdateBuilder.INSERT()

      expect(updateBuilder).to.be.an.instanceof(JSONUpdateBuilder)
      expect(updateBuilder.args).to.be.eql({})
      expect(updateBuilder.operationName).to.be.equal('JSON_INSERT')

      updateBuilder
        .addArgument('$.letter', 'b')
        .addArgument('$.number', 36)
        .addArgument('$.state', true)
        .addArgument('$.colours[0]', null)
        .addArgument('$.innerObject', { a: 'b' })
        .addArgument('$.innerArray', [4, 3, 2])
        .addArgument('$.timeMarks.date', '2016-07-29')
        .addArgument('$.timeMarks.date_time', '2016-07-29 12:18:29.000000')

      expect(updateBuilder.args).to.eql({
        '$.letter'             : 'b',
        '$.number'             : 36,
        '$.state'              : true,
        '$.colours[0]'         : null,
        '$.innerObject'        : { a: 'b' },
        '$.innerArray'         : [4, 3, 2],
        '$.timeMarks.date'     : '2016-07-29',
        '$.timeMarks.date_time': '2016-07-29 12:18:29.000000'
      })

      expect(updateBuilder.operationName).to.be.equal('JSON_INSERT')
    })

    it('JSON_REPLACE', async () => {
      const updateBuilder = JSONUpdateBuilder.REPLACE()

      expect(updateBuilder).to.be.an.instanceof(JSONUpdateBuilder)
      expect(updateBuilder.args).to.be.eql({})
      expect(updateBuilder.operationName).to.be.equal('JSON_REPLACE')

      updateBuilder
        .addArgument('$.letter', 'b')
        .addArgument('$.number', 36)
        .addArgument('$.state', true)
        .addArgument('$.colours[0]', null)
        .addArgument('$.innerObject', { a: 'b' })
        .addArgument('$.innerArray', [4, 3, 2])
        .addArgument('$.timeMarks.date', '2016-07-29')
        .addArgument('$.timeMarks.date_time', '2016-07-29 12:18:29.000000')

      expect(updateBuilder.args).to.eql({
        '$.letter'             : 'b',
        '$.number'             : 36,
        '$.state'              : true,
        '$.colours[0]'         : null,
        '$.innerObject'        : { a: 'b' },
        '$.innerArray'         : [4, 3, 2],
        '$.timeMarks.date'     : '2016-07-29',
        '$.timeMarks.date_time': '2016-07-29 12:18:29.000000'
      })

      expect(updateBuilder.operationName).to.be.equal('JSON_REPLACE')
    })

    it('JSON_ARRAY_APPEND', async () => {
      const updateBuilder = JSONUpdateBuilder.ARRAY_APPEND()

      expect(updateBuilder).to.be.an.instanceof(JSONUpdateBuilder)
      expect(updateBuilder.args).to.be.eql({})
      expect(updateBuilder.operationName).to.be.equal('JSON_ARRAY_APPEND')

      updateBuilder
        .addArgument('$.letter', 'b')
        .addArgument('$.number', 36)
        .addArgument('$.state', true)
        .addArgument('$.colours[0]', null)
        .addArgument('$.innerObject', { a: 'b' })
        .addArgument('$.innerArray', [4, 3, 2])
        .addArgument('$.timeMarks.date', '2016-07-29')
        .addArgument('$.timeMarks.date_time', '2016-07-29 12:18:29.000000')

      expect(updateBuilder.args).to.eql({
        '$.letter'             : 'b',
        '$.number'             : 36,
        '$.state'              : true,
        '$.colours[0]'         : null,
        '$.innerObject'        : { a: 'b' },
        '$.innerArray'         : [4, 3, 2],
        '$.timeMarks.date'     : '2016-07-29',
        '$.timeMarks.date_time': '2016-07-29 12:18:29.000000'
      })

      expect(updateBuilder.operationName).to.be.equal('JSON_ARRAY_APPEND')
    })

    it('JSON_ARRAY_INSERT', async () => {
      const updateBuilder = JSONUpdateBuilder.ARRAY_INSERT()

      expect(updateBuilder).to.be.an.instanceof(JSONUpdateBuilder)
      expect(updateBuilder.args).to.be.eql({})
      expect(updateBuilder.operationName).to.be.equal('JSON_ARRAY_INSERT')

      updateBuilder
        .addArgument('$.letter', 'b')
        .addArgument('$.number', 36)
        .addArgument('$.state', true)
        .addArgument('$.colours[0]', null)
        .addArgument('$.innerObject', { a: 'b' })
        .addArgument('$.innerArray', [4, 3, 2])
        .addArgument('$.timeMarks.date', '2016-07-29')
        .addArgument('$.timeMarks.date_time', '2016-07-29 12:18:29.000000')

      expect(updateBuilder.args).to.eql({
        '$.letter'             : 'b',
        '$.number'             : 36,
        '$.state'              : true,
        '$.colours[0]'         : null,
        '$.innerObject'        : { a: 'b' },
        '$.innerArray'         : [4, 3, 2],
        '$.timeMarks.date'     : '2016-07-29',
        '$.timeMarks.date_time': '2016-07-29 12:18:29.000000'
      })

      expect(updateBuilder.operationName).to.be.equal('JSON_ARRAY_INSERT')
    })
  })

  describe('Special Operations', function() {

    it('JSON_REMOVE', async () => {
      const updateBuilder = JSONUpdateBuilder.REMOVE()

      expect(updateBuilder).to.be.an.instanceof(JSONUpdateBuilder)
      expect(updateBuilder.args).to.be.eql([])
      expect(updateBuilder.operationName).to.be.equal('JSON_REMOVE')

      updateBuilder
        .addArgument('$.letter')
        .addArgument('$.number')
        .addArgument('$.state')

      expect(updateBuilder.args).to.eql([
        '$.letter',
        '$.number',
        '$.state',
      ])

      expect(updateBuilder.operationName).to.be.equal('JSON_REMOVE')
    })
  })

  it('should return the same data for both "create" and "toJSON" methods', async () => {
    const jsonUpdateSet = JSONUpdateBuilder.SET()
      .addArgument('$.letter', 'b')
      .addArgument('$.number', 36)
      .addArgument('$.state', true)
      .addArgument('$.colours[0]', null)
      .addArgument('$.innerObject', { a: 'b' })
      .addArgument('$.innerArray', [4, 3, 2])
      .addArgument('$.timeMarks.date', '2016-07-29')
      .addArgument('$.timeMarks.date_time', '2016-07-29 12:18:29.000000')

    expect(jsonUpdateSet.create()).to.eql(jsonUpdateSet.toJSON()).to.eql({
      ___operation: 'JSON_SET',
      args        : {
        '$.letter'             : 'b',
        '$.number'             : 36,
        '$.state'              : true,
        '$.colours[0]'         : null,
        '$.innerObject'        : { a: 'b' },
        '$.innerArray'         : [4, 3, 2],
        '$.timeMarks.date'     : '2016-07-29',
        '$.timeMarks.date_time': '2016-07-29 12:18:29.000000'
      }
    })
  })

  it('should fail when there is only argument', async () => {
    const expectedError = 'You have to specify function\'s second argument'

    expect(() => JSONUpdateBuilder.SET().addArgument('p')).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.INSERT().addArgument('p')).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.REPLACE().addArgument('p')).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.ARRAY_APPEND().addArgument('p')).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.ARRAY_INSERT().addArgument('p')).to.throw(expectedError)
  })

  it('should fail when there are no arguments', async () => {
    const expectedError = 'You have to add at least one argument'

    expect(() => JSONUpdateBuilder.SET().toJSON()).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.INSERT().toJSON()).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.REPLACE().toJSON()).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.REMOVE().toJSON()).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.ARRAY_APPEND().toJSON()).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.ARRAY_INSERT().toJSON()).to.throw(expectedError)

    expect(() => JSONUpdateBuilder.SET().create()).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.INSERT().create()).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.REPLACE().create()).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.REMOVE().create()).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.ARRAY_APPEND().create()).to.throw(expectedError)
    expect(() => JSONUpdateBuilder.ARRAY_INSERT().create()).to.throw(expectedError)
  })

  it('should send a right request body on save', async () => {
    const req = prepareMockRequest()

    class Person {
      constructor(name, age) {
        this.name = name
        this.age = age
      }
    }

    const TestTable = Backendless.Data.of('TestTableWithJSON')

    const jsonUpdateSet = JSONUpdateBuilder.SET()
      .addArgument('$.letter', 'b')
      .addArgument('$.number', 36)
      .addArgument('$.state', true)
      .addArgument('$.persons', [new Person('bob', 33), new Person('jack', 75)])
      .addArgument('$.date', new Date(1597305713621))
      .addArgument('$.colours[0]', null)
      .addArgument('$.innerObject', { a: 'b' })
      .addArgument('$.innerArray', [4, 3, 2])
      .addArgument('$.innerArray2', [{ foo: 'bar', c: { sub: 123 } }, 'test', [1, 2, [3, 4, [5]]]])

    const newValues = { myJson: jsonUpdateSet, objectId: 'test-object-id' }

    await TestTable.save(newValues)

    expect(req.body).to.be.eql({
      objectId: 'test-object-id',
      myJson  : {
        ___operation: 'JSON_SET',
        args        : {
          '$.letter'     : 'b',
          '$.number'     : 36,
          '$.persons'    : [{ 'age': 33, 'name': 'bob' }, { 'age': 75, 'name': 'jack' }],
          '$.date'       : '2020-08-13T08:01:53.621Z',
          '$.state'      : true,
          '$.colours[0]' : null,
          '$.innerObject': { 'a': 'b' },
          '$.innerArray' : [4, 3, 2],
          '$.innerArray2': [{ foo: 'bar', c: { sub: 123 } }, 'test', [1, 2, [3, 4, [5]]]],
        }
      },
    })
  })
})