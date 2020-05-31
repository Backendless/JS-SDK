import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite, Utils } from '../../helpers/sandbox'
import { prepareSuccessResponse } from './utils'

const PERSONS_TABLE_NAME = 'Person'
const ORDERS_TABLE_NAME = 'Order'
const ORDER_COLUMN = 'order'

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

describe('<Transactions> Set Relations Operation', function() {

  forSuite(this)

  let uow

  beforeEach(() => {
    uow = new Backendless.UnitOfWork()
  })

  const commonSuiteRequestBody = {
    opResultId   : 'set_relationPerson1',
    operationType: 'SET_RELATION',
    table        : 'Person',
  }

  describe('Signatures', () => {
    describe('3 arguments;', () => {

      describe('parent:<Create.OpResult>', () => {
        let parentOpResult
        let results
        let req1

        const commonRequestBody = {
          ...commonSuiteRequestBody,

          payload: {
            relationColumn: ORDER_COLUMN,
            parentObject  : {
              ___ref    : true,
              opResultId: 'createPerson1',
              propName  : 'objectId',
            }
          }
        }

        beforeEach(() => {
          results = {
            set_relationPerson1: {
              result: {}
            }
          }

          req1 = prepareSuccessResponse(results)

          parentOpResult = uow.create(PERSONS_TABLE_NAME, { name: 'person' })
        })

        async function check(children) {
          const opResult = uow.setRelation(parentOpResult, ORDER_COLUMN, children)

          await uow.execute()

          return opResult
        }

        it('children:String', async () => {
          const opResult = await check('foo > 123')

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              conditional: 'foo > 123',
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:Class', async () => {
          const opResult = await check(new Person({ objectId: 'objectId-1' }))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:HashMap', async () => {
          const opResult = await check({ objectId: 'objectId-1' })

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<String>', async () => {
          const opResult = await check(['objectId-1'])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Class>', async () => {
          const opResult = await check([new Person({ objectId: 'objectId-1' })])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<HashMap>', async () => {
          const opResult = await check([{ objectId: 'objectId-1' }])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResult>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'findOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResult>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'create_bulkOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

      })

      describe('parent:<Update.OpResult>', () => {
        let parentOpResult
        let results
        let req1

        const commonRequestBody = {
          ...commonSuiteRequestBody,

          payload: {
            relationColumn: ORDER_COLUMN,
            parentObject  : {
              ___ref    : true,
              opResultId: 'updatePerson1',
              propName  : 'objectId',
            }
          }
        }

        beforeEach(() => {
          results = {
            set_relationPerson1: {
              result: {}
            }
          }

          req1 = prepareSuccessResponse(results)

          parentOpResult = uow.update(PERSONS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })
        })

        async function check(children) {
          const opResult = uow.setRelation(parentOpResult, ORDER_COLUMN, children)

          await uow.execute()

          return opResult
        }

        it('children:String', async () => {
          const opResult = await check('foo > 123')

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              conditional: 'foo > 123',
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:Class', async () => {
          const opResult = await check(new Person({ objectId: 'objectId-1' }))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:HashMap', async () => {
          const opResult = await check({ objectId: 'objectId-1' })

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<String>', async () => {
          const opResult = await check(['objectId-1'])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Class>', async () => {
          const opResult = await check([new Person({ objectId: 'objectId-1' })])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<HashMap>', async () => {
          const opResult = await check([{ objectId: 'objectId-1' }])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResult>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'findOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResult>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'create_bulkOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

      })

      describe('parent:<Find.OpResultValue>', () => {
        let parentOpResult
        let results
        let req1

        const commonRequestBody = {
          ...commonSuiteRequestBody,

          payload: {
            relationColumn: ORDER_COLUMN,
            parentObject  : {
              ___ref     : true,
              opResultId : 'findPerson1',
              propName   : 'objectId',
              resultIndex: 3,
            }
          }
        }

        beforeEach(() => {
          results = {
            set_relationPerson1: {
              result: {}
            }
          }

          req1 = prepareSuccessResponse(results)

          parentOpResult = uow.find(PERSONS_TABLE_NAME)
        })

        async function check(children) {
          const opResult = uow.setRelation(parentOpResult.resolveTo(3), ORDER_COLUMN, children)

          await uow.execute()

          return opResult
        }

        it('children:String', async () => {
          const opResult = await check('foo > 123')

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              conditional: 'foo > 123',
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:Class', async () => {
          const opResult = await check(new Person({ objectId: 'objectId-1' }))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:HashMap', async () => {
          const opResult = await check({ objectId: 'objectId-1' })

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<String>', async () => {
          const opResult = await check(['objectId-1'])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Class>', async () => {
          const opResult = await check([new Person({ objectId: 'objectId-1' })])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<HashMap>', async () => {
          const opResult = await check([{ objectId: 'objectId-1' }])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResult>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'findOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResult>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'create_bulkOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

      })

      describe('parent:<BulkCreate.OpResultValue>', () => {
        let parentOpResult
        let results
        let req1

        const commonRequestBody = {
          ...commonSuiteRequestBody,

          payload: {
            relationColumn: ORDER_COLUMN,
            parentObject  : {
              ___ref     : true,
              opResultId : 'create_bulkPerson1',
              resultIndex: 3,
            }
          }
        }

        beforeEach(() => {
          results = {
            set_relationPerson1: {
              result: {}
            }
          }

          req1 = prepareSuccessResponse(results)

          parentOpResult = uow.bulkCreate(PERSONS_TABLE_NAME, [{}])
        })

        async function check(children) {
          const opResult = uow.setRelation(parentOpResult.resolveTo(3), ORDER_COLUMN, children)

          await uow.execute()

          return opResult
        }

        it('children:String', async () => {
          const opResult = await check('foo > 123')

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              conditional: 'foo > 123',
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:Class', async () => {
          const opResult = await check(new Person({ objectId: 'objectId-1' }))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:HashMap', async () => {
          const opResult = await check({ objectId: 'objectId-1' })

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<String>', async () => {
          const opResult = await check(['objectId-1'])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Class>', async () => {
          const opResult = await check([new Person({ objectId: 'objectId-1' })])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<HashMap>', async () => {
          const opResult = await check([{ objectId: 'objectId-1' }])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResult>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'findOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResult>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'create_bulkOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

      })

      describe('parent:<Class>', () => {
        let parent
        let results
        let req1

        const commonRequestBody = {
          ...commonSuiteRequestBody,

          payload: {
            relationColumn: ORDER_COLUMN,
            parentObject  : 'parent-objectId',
          }
        }

        beforeEach(() => {
          results = {
            set_relationPerson1: {
              result: {}
            }
          }

          req1 = prepareSuccessResponse(results)

          parent = new Person({ objectId: 'parent-objectId' })
        })

        async function check(children) {
          const opResult = uow.setRelation(parent, ORDER_COLUMN, children)

          await uow.execute()

          return opResult
        }

        it('children:String', async () => {
          const opResult = await check('foo > 123')

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              conditional: 'foo > 123',
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:Class', async () => {
          const opResult = await check(new Person({ objectId: 'objectId-1' }))

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:HashMap', async () => {
          const opResult = await check({ objectId: 'objectId-1' })

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<String>', async () => {
          const opResult = await check(['objectId-1'])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Class>', async () => {
          const opResult = await check([new Person({ objectId: 'objectId-1' })])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<HashMap>', async () => {
          const opResult = await check([{ objectId: 'objectId-1' }])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResult>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'findOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResult>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'create_bulkOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

      })

      describe('parent:<HashMap>', () => {
        let parent
        let results
        let req1

        const commonRequestBody = {
          ...commonSuiteRequestBody,

          payload: {
            relationColumn: ORDER_COLUMN,
            parentObject  : 'parent-objectId',
          }
        }

        beforeEach(() => {
          results = {
            set_relationPerson1: {
              result: {}
            }
          }

          req1 = prepareSuccessResponse(results)

          parent = { ___class: PERSONS_TABLE_NAME, objectId: 'parent-objectId' }
        })

        async function check(children) {
          const opResult = uow.setRelation(parent, ORDER_COLUMN, children)

          await uow.execute()

          return opResult
        }

        it('children:String', async () => {
          const opResult = await check('foo > 123')

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              conditional: 'foo > 123',
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:Class', async () => {
          const opResult = await check(new Person({ objectId: 'objectId-1' }))

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:HashMap', async () => {
          const opResult = await check({ objectId: 'objectId-1' })

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<String>', async () => {
          const opResult = await check(['objectId-1'])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Class>', async () => {
          const opResult = await check([new Person({ objectId: 'objectId-1' })])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<HashMap>', async () => {
          const opResult = await check([{ objectId: 'objectId-1' }])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResult>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'findOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResult>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'create_bulkOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

      })

    })

    describe('4 arguments;', () => {
      describe('parent:<ObjectId>', () => {
        let parent
        let results
        let req1

        const commonRequestBody = {
          ...commonSuiteRequestBody,

          payload: {
            relationColumn: ORDER_COLUMN,
            parentObject  : 'parent-objectId',
          }
        }

        beforeEach(() => {
          results = {
            set_relationPerson1: {
              result: {}
            }
          }

          req1 = prepareSuccessResponse(results)

          parent = 'parent-objectId'
        })

        async function check(children) {
          const opResult = uow.setRelation(PERSONS_TABLE_NAME, parent, ORDER_COLUMN, children)

          await uow.execute()

          return opResult
        }

        it('children:String', async () => {
          const opResult = await check('foo > 123')

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              conditional: 'foo > 123',
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:Class', async () => {
          const opResult = await check(new Person({ objectId: 'objectId-1' }))

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:HashMap', async () => {
          const opResult = await check({ objectId: 'objectId-1' })

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<String>', async () => {
          const opResult = await check(['objectId-1'])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Class>', async () => {
          const opResult = await check([new Person({ objectId: 'objectId-1' })])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<HashMap>', async () => {
          const opResult = await check([{ objectId: 'objectId-1' }])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResult>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'findOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResult>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'create_bulkOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

      })

      describe('parent:<Class>', () => {
        let parent
        let results
        let req1

        const commonRequestBody = {
          ...commonSuiteRequestBody,

          payload: {
            relationColumn: ORDER_COLUMN,
            parentObject  : 'parent-objectId',
          }
        }

        beforeEach(() => {
          results = {
            set_relationPerson1: {
              result: {}
            }
          }

          req1 = prepareSuccessResponse(results)

          parent = new Person({ objectId: 'parent-objectId' })
        })

        async function check(children) {
          const opResult = uow.setRelation(PERSONS_TABLE_NAME, parent, ORDER_COLUMN, children)

          await uow.execute()

          return opResult
        }

        it('children:String', async () => {
          const opResult = await check('foo > 123')

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              conditional: 'foo > 123',
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:Class', async () => {
          const opResult = await check(new Person({ objectId: 'objectId-1' }))

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:HashMap', async () => {
          const opResult = await check({ objectId: 'objectId-1' })

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<String>', async () => {
          const opResult = await check(['objectId-1'])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Class>', async () => {
          const opResult = await check([new Person({ objectId: 'objectId-1' })])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<HashMap>', async () => {
          const opResult = await check([{ objectId: 'objectId-1' }])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResult>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'findOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResult>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'create_bulkOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

      })

      describe('parent:<HashMap>', () => {
        let parent
        let results
        let req1

        const commonRequestBody = {
          ...commonSuiteRequestBody,

          payload: {
            relationColumn: ORDER_COLUMN,
            parentObject  : 'parent-objectId',
          }
        }

        beforeEach(() => {
          results = {
            set_relationPerson1: {
              result: {}
            }
          }

          req1 = prepareSuccessResponse(results)

          parent = { objectId: 'parent-objectId' }
        })

        async function check(children) {
          const opResult = uow.setRelation(PERSONS_TABLE_NAME, parent, ORDER_COLUMN, children)

          await uow.execute()

          return opResult
        }

        it('children:String', async () => {
          const opResult = await check('foo > 123')

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              conditional: 'foo > 123',
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:Class', async () => {
          const opResult = await check(new Person({ objectId: 'objectId-1' }))

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:HashMap', async () => {
          const opResult = await check({ objectId: 'objectId-1' })

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<String>', async () => {
          const opResult = await check(['objectId-1'])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Class>', async () => {
          const opResult = await check([new Person({ objectId: 'objectId-1' })])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<HashMap>', async () => {
          const opResult = await check([{ objectId: 'objectId-1' }])

          expect(req1.body.operations).to.have.length(1)

          expect(req1.body.operations[0]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: ['objectId-1'],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check([childOpResult])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:List<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check([childOpResult.resolveTo(3)])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Create.OpResult>', async () => {
          const childOpResult = uow.create(ORDERS_TABLE_NAME, { label: 'order-1' })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Update.OpResult>', async () => {
          const childOpResult = uow.update(ORDERS_TABLE_NAME, {
            objectId: 'objectId-1',
            label   : 'person-2'
          })

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref    : true,
                opResultId: 'updateOrder1',
                propName  : 'objectId',
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResultValue>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResultValue>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult.resolveTo(3))

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: [{
                ___ref     : true,
                opResultId : 'create_bulkOrder1',
                resultIndex: 3,
              }],
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<Find.OpResult>', async () => {
          const childOpResult = uow.find(ORDERS_TABLE_NAME)

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'findOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

        it('children:<BulkCreate.OpResult>', async () => {
          const childOpResult = uow.bulkCreate(ORDERS_TABLE_NAME, [{}])

          const opResult = await check(childOpResult)

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'create_bulkOrder1',
              },
            }
          })

          expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.set_relationPerson1.result)
        })

      })
    })
  })

  describe('Fails', () => {
    const invalidArgsError = 'Invalid arguments'

    it('has invalid parameters count', async () => {
      expect(() => uow.setRelation()).to.throw(invalidArgsError)
      expect(() => uow.setRelation('str')).to.throw(invalidArgsError)
    })

    it('the first argument is not an instance of [OpResult|OpResultValueReference|Object]', async () => {
      const errorMsg = 'Invalid the first argument, it must be an instance of [OpResult|OpResultValueReference|Object]'

      expect(() => uow.setRelation(undefined, ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(null, ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(false, ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(true, ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(0, ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(123, ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation('str', ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(() => ({}), ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
    })

    it('the second argument is not either an Object or objectId', async () => {
      const errorMsg = 'Invalid the second argument, it must be an Object or objectId'

      expect(() => uow.setRelation(PERSONS_TABLE_NAME, undefined, ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, null, ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, false, ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, true, ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 0, ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 123, ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, () => ({}), ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
    })

    it('at least one child is invalid', async () => {
      const errorMsg = 'Invalid child argument, it must be an instance of [OpResult|OpResultValueReference|Object] or objectId'

      const validChild = {
        objectId: 'parent-id'
      }
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', ORDER_COLUMN, [validChild, {}])).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', ORDER_COLUMN, [validChild, []])).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', ORDER_COLUMN, [validChild, ''])).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', ORDER_COLUMN, [validChild, 0])).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', ORDER_COLUMN, [validChild, 123])).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', ORDER_COLUMN, [validChild, true])).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', ORDER_COLUMN, [validChild, false])).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', ORDER_COLUMN, [validChild, null])).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', ORDER_COLUMN, [validChild, undefined])).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', ORDER_COLUMN, [validChild, () => ({})])).to.throw(errorMsg)
    })

    it('table name is not a string', async () => {
      const errorMsg = 'Table Name must be a string.'

      expect(() => uow.setRelation(undefined, 'parent-id', ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(null, 'parent-id', ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(true, 'parent-id', ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(123, 'parent-id', ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation({}, 'parent-id', ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation([], 'parent-id', ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(() => ({}), 'parent-id', ORDER_COLUMN, 'child-id')).to.throw(errorMsg)
    })

    it('relation column is not valid', async () => {
      const errorMsg = 'Invalid "relationColumn" parameter, check passed arguments'

      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', undefined, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', null, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', false, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', true, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', 0, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', 123, 'child-id')).to.throw(errorMsg)
      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', () => ({}), 'child-id')).to.throw(errorMsg)
    })

    it('neither "unconditional" nor "conditional" parameter is specified', async () => {
      const errorMsg = 'Neither "unconditional" nor "conditional" parameter is specified, check passed arguments'

      expect(() => uow.setRelation(PERSONS_TABLE_NAME, 'parent-id', ORDER_COLUMN, '')).to.throw(errorMsg)
    })
  })
})
