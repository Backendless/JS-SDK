import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forSuite } from '../../helpers/sandbox'
import { prepareSuccessResponse, prepareErrorResponse } from './utils'

const PERSONS_TABLE_NAME = 'Person'

describe('<Transactions> Basic', function() {

  let uow

  forSuite(this)

  beforeEach(() => {
    uow = new Backendless.UnitOfWork()
  })

  it('has correct request data', async () => {
    const req1 = prepareSuccessResponse()

    uow.create(PERSONS_TABLE_NAME, {})

    await uow.execute()

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/transaction/unit-of-work`,
      headers: { 'Content-Type': 'application/json' },
    })
  })

  it('has operation type', async () => {
    const opResult = uow.create(PERSONS_TABLE_NAME, {})

    expect(opResult.getType()).to.equal(opResult.operationType).to.equal('CREATE')
  })

  it('returns UnitOfWorkResult', async () => {
    const results = {
      createPerson1: {
        operationType: 'CREATE',
        result       : {
          objectId: 'objectId'
        }
      }
    }

    prepareSuccessResponse(results)

    const obj = { name: 'p-name' }

    const createOpResult = uow.create(PERSONS_TABLE_NAME, obj)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(uowResult.getError()).to.equal(null)
    expect(uowResult.success).to.equal(uowResult.isSuccess()).to.equal(true)
    expect(uowResult.results).to.equal(uowResult.getResults()).to.equal(results)

    expect(createOpResult.result).to.equal(createOpResult.getResult()).to.equal(results.createPerson1.result)
  })

  it('returns TransactionOperationError', async () => {
    const obj = { name: 'p-name' }

    prepareErrorResponse('Error message', {
      table        : PERSONS_TABLE_NAME,
      opResultId   : 'createPerson1',
      operationType: 'CREATE',
      payload      : obj,
    })

    const createOpResult = uow.create(PERSONS_TABLE_NAME, obj)

    const uowResult = await uow.execute()

    expect(uowResult.results).to.equal(uowResult.getResults()).to.equal(null)
    expect(uowResult.success).to.equal(uowResult.isSuccess()).to.equal(false)
    expect(uowResult.error).to.equal(uowResult.getError())

    expect(uowResult.error instanceof Error).to.equal(true)

    expect(createOpResult.error).to.equal(createOpResult.getError())

    expect(uowResult.error.operation).to.equal(createOpResult)
  })

  it('sets OpResultId', async () => {
    const req1 = prepareSuccessResponse()

    const createOpResult = uow.create(PERSONS_TABLE_NAME, { name: 'p-name' })

    createOpResult.setOpResultId('MY_CUSTOM_OP_RESULT_ID')

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'MY_CUSTOM_OP_RESULT_ID',
          operationType: 'CREATE',
          table        : 'Person',
          payload      : {
            name: 'p-name'
          }
        }
      ]
    })
  })

  it('sets IsolationLevel', async () => {
    let req

    req = prepareSuccessResponse()
    await uow.execute()

    expect(req.body.isolationLevelEnum).to.equal(undefined)

    uow.setIsolationLevel(Backendless.UnitOfWork.IsolationLevelEnum.READ_UNCOMMITTED)

    req = prepareSuccessResponse()
    await uow.execute()

    expect(req.body.isolationLevelEnum).to.equal('READ_UNCOMMITTED')

    uow.setIsolationLevel(Backendless.UnitOfWork.IsolationLevelEnum.READ_COMMITTED)

    req = prepareSuccessResponse()
    await uow.execute()

    expect(req.body.isolationLevelEnum).to.equal('READ_COMMITTED')

    uow.setIsolationLevel(Backendless.UnitOfWork.IsolationLevelEnum.REPEATABLE_READ)

    req = prepareSuccessResponse()
    await uow.execute()

    expect(req.body.isolationLevelEnum).to.equal('REPEATABLE_READ')

    uow.setIsolationLevel(Backendless.UnitOfWork.IsolationLevelEnum.SERIALIZABLE)

    req = prepareSuccessResponse()
    await uow.execute()

    expect(req.body.isolationLevelEnum).to.equal('SERIALIZABLE')
  })
})
