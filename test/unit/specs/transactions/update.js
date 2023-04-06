import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite } from '../../helpers/sandbox'
import { prepareSuccessResponse } from './utils'

const PERSONS_TABLE_NAME = 'Person'

class Person {
  constructor(data) {
    data = data || {}

    if (data.objectId) {
      this.objectId = data.objectId
    }

    if (data.name) {
      this.name = data.name
    }

    if (data.age) {
      this.age = data.age
    }
  }
}

describe('<Transactions> Update Operation', function() {

  forSuite(this)

  let uow

  beforeEach(() => {
    uow = new Backendless.UnitOfWork()
  })

  it('updates one map-object', async () => {
    const obj = { objectId: 'test-objectId', name: 'p-name' }

    const results = {
      updatePerson1: {
        operationType: 'UPDATE',
        result       : obj
      }
    }

    const req1 = prepareSuccessResponse(results)

    const opResult = uow.update(PERSONS_TABLE_NAME, obj)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'updatePerson1',
          operationType: 'UPDATE',
          table        : 'Person',
          payload      : obj,
        }
      ]
    })

    expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.updatePerson1.result)
  })

  it('updates one map-object with expression', async () => {
    const obj = {
      objectId: 'test-objectId',
      name    : 'p-name',
      age     : new Backendless.Expression('age + 1')
    }

    const results = {
      updatePerson1: {
        operationType: 'UPDATE',
        result       : obj
      }
    }

    const req1 = prepareSuccessResponse(results)

    const opResult = uow.update(PERSONS_TABLE_NAME, obj)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'updatePerson1',
          operationType: 'UPDATE',
          table        : 'Person',
          payload      : {
            objectId: 'test-objectId',
            name    : 'p-name',
            age     : {
              ___class: 'BackendlessExpression',
              value   : 'age + 1',
            }
          },
        }
      ]
    })

    expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.updatePerson1.result)
  })

  it('updates one instance-object', async () => {
    const obj = new Person({ objectId: 'test-objectId', name: 'p-name' })

    const results = {
      updatePerson1: {
        operationType: 'UPDATE',
        result       : obj
      }
    }

    const req1 = prepareSuccessResponse(results)

    const opResult = uow.update(obj)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'updatePerson1',
          operationType: 'UPDATE',
          table        : 'Person',
          payload      : JSON.parse(JSON.stringify(obj)),
        }
      ]
    })

    expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.updatePerson1.result)
  })

  it('updates several objects', async () => {
    const obj1 = { objectId: 'test-objectId-1', name: 'p-1' }
    const obj2 = { objectId: 'test-objectId-2', name: 'p-2' }
    const obj3 = { objectId: 'test-objectId-3', name: 'p-3' }

    const results = {
      updatePerson1: {
        operationType: 'UPDATE',
        result       : obj1
      },
      updatePerson2: {
        operationType: 'UPDATE',
        result       : obj2
      },
      updatePerson3: {
        operationType: 'UPDATE',
        result       : obj3
      }
    }

    const req1 = prepareSuccessResponse(results)

    const opResult1 = uow.update(PERSONS_TABLE_NAME, obj1)
    const opResult2 = uow.update(PERSONS_TABLE_NAME, obj2)
    const opResult3 = uow.update(PERSONS_TABLE_NAME, obj3)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'updatePerson1',
          operationType: 'UPDATE',
          table        : 'Person',
          payload      : obj1,
        },
        {
          opResultId   : 'updatePerson2',
          operationType: 'UPDATE',
          table        : 'Person',
          payload      : obj2,
        },
        {
          opResultId   : 'updatePerson3',
          operationType: 'UPDATE',
          table        : 'Person',
          payload      : obj3,
        }
      ]
    })

    expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.updatePerson1.result)
    expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.updatePerson2.result)
    expect(opResult3.result).to.equal(opResult3.getResult()).to.equal(results.updatePerson3.result)
  })

  it('creates object and updates using OpResult and propertyName', async () => {
    const newPerson = new Person({ name: 'p-1', age: 777 })

    const results = {
      createPerson1: {
        operationType: 'CREATE',
        result       : { name: 'p-1', age: 777 }
      },
      updatePerson1: {
        operationType: 'UPDATE',
        result       : { name: 'p-1', age: 123 }
      }
    }

    const req1 = prepareSuccessResponse(results)

    const createOpResult = uow.create(newPerson)
    const updateOpResult = uow.update(createOpResult, 'age', 123)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'createPerson1',
          operationType: 'CREATE',
          table        : 'Person',
          payload      : {
            age : 777,
            name: 'p-1'
          }
        },
        {
          opResultId   : 'updatePerson1',
          operationType: 'UPDATE',
          table        : 'Person',
          payload      : {
            age     : 123,
            objectId: {
              ___ref    : true,
              opResultId: 'createPerson1',
              propName  : 'objectId',
            }
          }
        }
      ]
    })

    expect(createOpResult.result).to.equal(createOpResult.getResult()).to.equal(results.createPerson1.result)
    expect(updateOpResult.result).to.equal(updateOpResult.getResult()).to.equal(results.updatePerson1.result)
  })

  it('creates object and updates using OpResult and changes object', async () => {
    const newPerson = new Person({ name: 'p-1', age: 777 })

    const results = {
      createPerson1: {
        operationType: 'CREATE',
        result       : { name: 'p-1', age: 777 }
      },
      updatePerson1: {
        operationType: 'UPDATE',
        result       : { name: 'p-1', age: 123 }
      }
    }

    const req1 = prepareSuccessResponse(results)

    const createOpResult = uow.create(newPerson)
    const updateOpResult = uow.update(createOpResult, { age: 123 })

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'createPerson1',
          operationType: 'CREATE',
          table        : 'Person',
          payload      : {
            age : 777,
            name: 'p-1'
          }
        },
        {
          opResultId   : 'updatePerson1',
          operationType: 'UPDATE',
          table        : 'Person',
          payload      : {
            age     : 123,
            objectId: {
              ___ref    : true,
              opResultId: 'createPerson1',
              propName  : 'objectId',
            }
          }
        }
      ]
    })

    expect(createOpResult.result).to.equal(createOpResult.getResult()).to.equal(results.createPerson1.result)
    expect(updateOpResult.result).to.equal(updateOpResult.getResult()).to.equal(results.updatePerson1.result)
  })

  describe('Signatures', () => {

    it('update(object: object): OpResult', async () => {
      const obj1 = { ___class: PERSONS_TABLE_NAME, objectId: 'test-objectId', name: 'p-name' }
      const obj2 = new Person({ objectId: 'test-objectId', name: 'p-name' })

      const results = {
        updatePerson1: {
          operationType: 'UPDATE',
          result       : obj1
        },
        updatePerson2: {
          operationType: 'UPDATE',
          result       : obj2
        }
      }

      const req1 = prepareSuccessResponse(results)

      const opResult1 = uow.update(obj1)
      const opResult2 = uow.update(obj2)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'updatePerson1',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : obj1,
          },
          {
            opResultId   : 'updatePerson2',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : obj2,
          }
        ]
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.updatePerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.updatePerson2.result)
    })

    it('update(tableName: string, object: object): OpResult', async () => {
      const obj1 = { objectId: 'test-objectId', name: 'p-name' }
      const obj2 = new Person({ objectId: 'test-objectId', name: 'p-name' })

      const results = {
        updatePerson1: {
          operationType: 'UPDATE',
          result       : obj1
        },
        updatePerson2: {
          operationType: 'UPDATE',
          result       : obj2
        }
      }

      const req1 = prepareSuccessResponse(results)

      const opResult1 = uow.update(PERSONS_TABLE_NAME, obj1)
      const opResult2 = uow.update(PERSONS_TABLE_NAME, obj2)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'updatePerson1',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : obj1,
          },
          {
            opResultId   : 'updatePerson2',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : obj2,
          }
        ]
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.updatePerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.updatePerson2.result)
    })

    it('update(opResult: OpResult | OpResultValueReference, object: object): OpResult', async () => {
      const newPerson = new Person({ name: 'p-1', age: 777 })

      const results = {
        findPerson1  : {
          operationType: 'FIND',
          result       : []
        },
        createPerson1: {
          operationType: 'CREATE',
          result       : {}
        },
        updatePerson1: {
          operationType: 'UPDATE',
          result       : {}
        },
        updatePerson2: {
          operationType: 'UPDATE',
          result       : {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const findOpResult = uow.find(PERSONS_TABLE_NAME, {})
      const createOpResult = uow.create(newPerson)
      const updateOpResult1 = uow.update(findOpResult.resolveTo(1), { age: 111 })
      const updateOpResult2 = uow.update(createOpResult, { age: 222 })

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'findPerson1',
            operationType: 'FIND',
            table        : 'Person',
            payload      : {
              queryOptions: {}
            },
          },
          {
            opResultId   : 'createPerson1',
            operationType: 'CREATE',
            table        : 'Person',
            payload      : {
              age : 777,
              name: 'p-1'
            }
          },
          {
            opResultId   : 'updatePerson1',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : {
              age     : 111,
              objectId: {
                ___ref     : true,
                opResultId : 'findPerson1',
                propName   : 'objectId',
                resultIndex: 1,
              }
            },
          },
          {
            opResultId   : 'updatePerson2',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : {
              age     : 222,
              objectId: {
                ___ref    : true,
                opResultId: 'createPerson1',
                propName  : 'objectId',
              }
            }
          }
        ]
      })

      expect(updateOpResult1.result).to.equal(updateOpResult1.getResult()).to.equal(results.updatePerson1.result)
      expect(updateOpResult2.result).to.equal(updateOpResult2.getResult()).to.equal(results.updatePerson2.result)
    })

    it('update(opResult: OpResult | OpResultValueReference, propertyName: string, propertyValue: number | string | boolean): OpResult', async () => {
      const newPerson = new Person({ name: 'p-1', age: 777 })

      const results = {
        findPerson1  : {
          operationType: 'FIND',
          result       : []
        },
        createPerson1: {
          operationType: 'CREATE',
          result       : {}
        },
        updatePerson1: {
          operationType: 'UPDATE',
          result       : {}
        },
        updatePerson2: {
          operationType: 'UPDATE',
          result       : {}
        },
        updatePerson3: {
          operationType: 'UPDATE',
          result       : {}
        },
        updatePerson4: {
          operationType: 'UPDATE',
          result       : {}
        },
        updatePerson5: {
          operationType: 'UPDATE',
          result       : {}
        },
        updatePerson6: {
          operationType: 'UPDATE',
          result       : {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const findOpResult = uow.find(PERSONS_TABLE_NAME, {})
      const createOpResult = uow.create(newPerson)
      const updateOpResult1 = uow.update(findOpResult.resolveTo(1), 'age', 111)
      const updateOpResult2 = uow.update(createOpResult, 'age', 222)
      const updateOpResult3 = uow.update(findOpResult.resolveTo(1), 'age', 'str')
      const updateOpResult4 = uow.update(createOpResult, 'age', 'str')
      const updateOpResult5 = uow.update(findOpResult.resolveTo(1), 'age', true)
      const updateOpResult6 = uow.update(createOpResult, 'age', true)

      await uow.execute()

      expect(req1.body.operations).to.have.length(8)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'findPerson1',
        operationType: 'FIND',
        table        : 'Person',
        payload      : {
          queryOptions: {}
        },
      })

      expect(req1.body.operations[1]).to.deep.include({
        opResultId   : 'createPerson1',
        operationType: 'CREATE',
        table        : 'Person',
        payload      : {
          age : 777,
          name: 'p-1'
        }
      })

      expect(req1.body.operations[2]).to.deep.include({
        opResultId   : 'updatePerson1',
        operationType: 'UPDATE',
        table        : 'Person',
        payload      : {
          age     : 111,
          objectId: {
            ___ref     : true,
            opResultId : 'findPerson1',
            propName   : 'objectId',
            resultIndex: 1,
          }
        },
      })

      expect(req1.body.operations[3]).to.deep.include({
        opResultId   : 'updatePerson2',
        operationType: 'UPDATE',
        table        : 'Person',
        payload      : {
          age     : 222,
          objectId: {
            ___ref    : true,
            opResultId: 'createPerson1',
            propName  : 'objectId',
          }
        }
      })

      expect(req1.body.operations[4]).to.deep.include({
        opResultId   : 'updatePerson3',
        operationType: 'UPDATE',
        table        : 'Person',
        payload      : {
          age     : 'str',
          objectId: {
            ___ref     : true,
            opResultId : 'findPerson1',
            propName   : 'objectId',
            resultIndex: 1,
          }
        },
      })

      expect(req1.body.operations[5]).to.deep.include({
        opResultId   : 'updatePerson4',
        operationType: 'UPDATE',
        table        : 'Person',
        payload      : {
          age     : 'str',
          objectId: {
            ___ref    : true,
            opResultId: 'createPerson1',
            propName  : 'objectId',
          },
        }
      })

      expect(req1.body.operations[6]).to.deep.include({
        opResultId   : 'updatePerson5',
        operationType: 'UPDATE',
        table        : 'Person',
        payload      : {
          age     : true,
          objectId: {
            ___ref     : true,
            opResultId : 'findPerson1',
            propName   : 'objectId',
            resultIndex: 1
          },
        }
      })

      expect(req1.body.operations[7]).to.deep.include({
        opResultId   : 'updatePerson6',
        operationType: 'UPDATE',
        table        : 'Person',
        payload      : {
          age     : true,
          objectId: {
            ___ref    : true,
            opResultId: 'createPerson1',
            propName  : 'objectId',
          },
        }
      })

      expect(updateOpResult1.result).to.equal(updateOpResult1.getResult()).to.equal(results.updatePerson1.result)
      expect(updateOpResult2.result).to.equal(updateOpResult2.getResult()).to.equal(results.updatePerson2.result)
      expect(updateOpResult3.result).to.equal(updateOpResult3.getResult()).to.equal(results.updatePerson3.result)
      expect(updateOpResult4.result).to.equal(updateOpResult4.getResult()).to.equal(results.updatePerson4.result)
      expect(updateOpResult5.result).to.equal(updateOpResult5.getResult()).to.equal(results.updatePerson5.result)
      expect(updateOpResult6.result).to.equal(updateOpResult6.getResult()).to.equal(results.updatePerson6.result)
    })

    it('update(opResult: OpResult | OpResultValueReference, propertyName: string, propertyValue: OpResultValueReference): OpResult', async () => {
      const newPerson = new Person({ name: 'p-1', age: 777 })

      const results = {
        findPerson1  : {
          operationType: 'FIND',
          result       : []
        },
        createPerson1: {
          operationType: 'CREATE',
          result       : {}
        },
        updatePerson1: {
          operationType: 'UPDATE',
          result       : {}
        },
        updatePerson2: {
          operationType: 'UPDATE',
          result       : {}
        },
        updatePerson3: {
          operationType: 'UPDATE',
          result       : {}
        },
        updatePerson4: {
          operationType: 'UPDATE',
          result       : {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const findOpResult = uow.find(PERSONS_TABLE_NAME, {})
      const createOpResult = uow.create(newPerson)
      const updateOpResult1 = uow.update(findOpResult.resolveTo(1), 'age', 111)
      const updateOpResult2 = uow.update(createOpResult, 'age', 222)
      const updateOpResult3 = uow.update(createOpResult, 'sub', findOpResult.resolveTo(1, 'subProp'))
      const updateOpResult4 = uow.update(createOpResult, 'sub2', createOpResult.resolveTo('subProp2'))

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'findPerson1',
            operationType: 'FIND',
            table        : 'Person',
            payload      : {
              queryOptions: {}
            },
          },
          {
            opResultId   : 'createPerson1',
            operationType: 'CREATE',
            table        : 'Person',
            payload      : {
              age : 777,
              name: 'p-1'
            }
          },
          {
            opResultId   : 'updatePerson1',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : {
              age     : 111,
              objectId: {
                ___ref     : true,
                opResultId : 'findPerson1',
                propName   : 'objectId',
                resultIndex: 1,
              }
            },
          },
          {
            opResultId   : 'updatePerson2',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : {
              age     : 222,
              objectId: {
                ___ref    : true,
                opResultId: 'createPerson1',
                propName  : 'objectId',
              }
            }
          },
          {
            opResultId   : 'updatePerson3',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : {
              objectId: {
                ___ref    : true,
                opResultId: 'createPerson1',
                propName  : 'objectId',
              },
              sub     : {
                ___ref     : true,
                opResultId : 'findPerson1',
                propName   : 'subProp',
                resultIndex: 1,
              }
            }
          },
          {
            opResultId   : 'updatePerson4',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : {
              objectId: {
                ___ref    : true,
                opResultId: 'createPerson1',
                propName  : 'objectId',
              },
              sub2    : {
                ___ref    : true,
                opResultId: 'createPerson1',
                propName  : 'subProp2',
              }
            }
          }
        ]
      })

      expect(updateOpResult1.result).to.equal(updateOpResult1.getResult()).to.equal(results.updatePerson1.result)
      expect(updateOpResult2.result).to.equal(updateOpResult2.getResult()).to.equal(results.updatePerson2.result)
      expect(updateOpResult3.result).to.equal(updateOpResult3.getResult()).to.equal(results.updatePerson3.result)
      expect(updateOpResult4.result).to.equal(updateOpResult4.getResult()).to.equal(results.updatePerson4.result)
    })

  })

  describe('Fails', () => {
    const invalidArgsError = 'Invalid arguments'

    it('when there is invalid parameters count', async () => {
      const createOpResult = uow.create(PERSONS_TABLE_NAME, {})

      expect(() => uow.update('tableName', {}, {})).to.throw(invalidArgsError)
      expect(() => uow.update(createOpResult, {}, {})).to.throw(invalidArgsError)
      expect(() => uow.update(createOpResult, 'propertyName', {}, {})).to.throw(invalidArgsError)
    })

    it('table name is not a string', async () => {
      expect(() => uow.update()).to.throw(invalidArgsError)
      expect(() => uow.update(null)).to.throw(invalidArgsError)
      expect(() => uow.update(true)).to.throw(invalidArgsError)
      expect(() => uow.update(123)).to.throw(invalidArgsError)
      expect(() => uow.update({})).to.throw(invalidArgsError)
      expect(() => uow.update([])).to.throw(invalidArgsError)
      expect(() => uow.update(() => ({}))).to.throw(invalidArgsError)
    })

  })

})
