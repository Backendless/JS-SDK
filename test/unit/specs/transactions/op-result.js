import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite } from '../../helpers/sandbox'

const PERSONS_TABLE_NAME = 'Person'

describe('<Transactions> OpResult', function() {

  let uow
  let opResult

  forSuite(this)

  beforeEach(() => {
    uow = new Backendless.UnitOfWork()
    opResult = uow.create(PERSONS_TABLE_NAME, {})
  })

  it('has operation type', async () => {
    expect(opResult.getType()).to.equal(opResult.operationType).to.equal('CREATE')
  })

  it('sets opResultId', async () => {
    const result = opResult.setOpResultId('MY_CUSTOM_OP_RESULT_ID')

    expect(result).to.equal(opResult)
    expect(opResult.getOpResultId()).to.equal(opResult.opResultId).to.be.equal('MY_CUSTOM_OP_RESULT_ID')
  })

  it('has opResultId by default', async () => {
    expect(opResult.getOpResultId()).to.equal(opResult.opResultId).to.be.equal('createPerson1')
  })

  it('increments opResultId for each operation type separately', async () => {
    const updateOpResult1 = uow.update(PERSONS_TABLE_NAME, {})
    const updateOpResult2 = uow.update(PERSONS_TABLE_NAME, {})
    const updateOpResult3 = uow.update(PERSONS_TABLE_NAME, {})

    const deleteOpResult1 = uow.delete(PERSONS_TABLE_NAME, {})
    const deleteOpResult2 = uow.delete(PERSONS_TABLE_NAME, {})
    const deleteOpResult3 = uow.delete(PERSONS_TABLE_NAME, {})
    const deleteOpResult4 = uow.delete(PERSONS_TABLE_NAME, {})
    const deleteOpResult5 = uow.delete(PERSONS_TABLE_NAME, {})

    expect(updateOpResult1.getOpResultId()).to.be.equal('updatePerson1')
    expect(updateOpResult2.getOpResultId()).to.be.equal('updatePerson2')
    expect(updateOpResult3.getOpResultId()).to.be.equal('updatePerson3')

    expect(deleteOpResult1.getOpResultId()).to.be.equal('deletePerson1')
    expect(deleteOpResult2.getOpResultId()).to.be.equal('deletePerson2')
    expect(deleteOpResult3.getOpResultId()).to.be.equal('deletePerson3')
    expect(deleteOpResult4.getOpResultId()).to.be.equal('deletePerson4')
    expect(deleteOpResult5.getOpResultId()).to.be.equal('deletePerson5')
  })

  it('increments opResultId with custom id', async () => {
    const updateOpResult1 = uow.update(PERSONS_TABLE_NAME, {})
    const updateOpResult2 = uow.update(PERSONS_TABLE_NAME, {})
    const updateOpResult3 = uow.update(PERSONS_TABLE_NAME, {})
    const updateOpResult4 = uow.update(PERSONS_TABLE_NAME, {})

    updateOpResult2.setOpResultId('MY_CUSTOM_OP_RESULT_ID_2')
    updateOpResult3.setOpResultId('MY_CUSTOM_OP_RESULT_ID_3')

    const updateOpResult5 = uow.update(PERSONS_TABLE_NAME, {})
    const updateOpResult6 = uow.update(PERSONS_TABLE_NAME, {})

    expect(updateOpResult1.getOpResultId()).to.be.equal('updatePerson1')
    expect(updateOpResult2.getOpResultId()).to.be.equal('MY_CUSTOM_OP_RESULT_ID_2')
    expect(updateOpResult3.getOpResultId()).to.be.equal('MY_CUSTOM_OP_RESULT_ID_3')
    expect(updateOpResult4.getOpResultId()).to.be.equal('updatePerson4')
    expect(updateOpResult5.getOpResultId()).to.be.equal('updatePerson5')
    expect(updateOpResult6.getOpResultId()).to.be.equal('updatePerson6')

  })

})
