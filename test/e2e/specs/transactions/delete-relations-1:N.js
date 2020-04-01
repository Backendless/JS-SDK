import '../../helpers/global'
import sandbox from '../../helpers/sandbox'
import * as Utils from '../../helpers/utils'

const Backendless = sandbox.Backendless

const PERSONS_TABLE_NAME = 'Person'
const ADDRESSES_TABLE_NAME = 'Address'

const ADDRESSES_COLUMN = 'addresses'

class Person {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.name = data.name
  }
}

class Address {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.address = data.address
  }
}

describe('Transactions - Delete 1:N Relations Operations', function() {

  let tablesAPI

  let personsStore
  let addressesStore

  let uow

  let person1
  let address1
  let address2
  let address3

  sandbox.forSuite()

  before(async function() {
    tablesAPI = this.tablesAPI

    await tablesAPI.createTable(PERSONS_TABLE_NAME)
    await tablesAPI.createTable(ADDRESSES_TABLE_NAME)

    await tablesAPI.createColumn(PERSONS_TABLE_NAME, 'name', tablesAPI.DataTypes.STRING)
    await tablesAPI.createColumn(ADDRESSES_TABLE_NAME, 'address', tablesAPI.DataTypes.STRING)

    await tablesAPI.createRelationColumn(PERSONS_TABLE_NAME, ADDRESSES_COLUMN, ADDRESSES_TABLE_NAME, tablesAPI.RelationTypes.ONE_TO_MANY)

    personsStore = Backendless.Data.of(Person)
    addressesStore = Backendless.Data.of(Address)
  })

  beforeEach(async function() {
    const result = await Promise.all([
      personsStore.save({ name: `p:1:${Utils.uid()}` }),
      addressesStore.save({ address: `p:1:${Utils.uid()}` }),
      addressesStore.save({ address: `p:2:${Utils.uid()}` }),
      addressesStore.save({ address: `p:3:${Utils.uid()}` }),
    ])

    person1 = result[0]
    address1 = result[1]
    address2 = result[2]
    address3 = result[3]

    await personsStore.addRelation(person1, ADDRESSES_COLUMN, [address1, address2, address3])

    uow = new Backendless.UnitOfWork()
  })

  describe('API Signatures', function() {

    describe('3 arguments;', function() {

      describe('parent:<Update.OpResult>', function() {
        let updatePersonOperation
        let newPersonName

        beforeEach(async function() {
          newPersonName = `new:${person1.name}`

          updatePersonOperation = uow.update(PERSONS_TABLE_NAME, {
            objectId: person1.objectId,
            name    : newPersonName
          })
        })

        async function checkResult(children) {
          const operation = uow.deleteRelation(updatePersonOperation, ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.delete_relationPerson1.operationType).to.equal('DELETE_RELATION')
          expect(uowResult.results.delete_relationPerson1.result).to.equal(3)

          expect(operation.result).to.equal(3)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${newPersonName}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(person1.objectId)
          expect(persons[0].name).to.equal(newPersonName)
          expect(persons[0][ADDRESSES_COLUMN]).to.be.an('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(0)

          return persons[0]
        }

        it('children:String ', async function() {
          await checkResult(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)
        })

        it('children:List<String>', async function() {
          await checkResult([address1.objectId, address2.objectId, address3.objectId])
        })

        it('children:List<Class>', async function() {
          expect(address1 instanceof Address).to.equal(true)
          expect(address2 instanceof Address).to.equal(true)
          expect(address3 instanceof Address).to.equal(true)

          await checkResult([address1, address2, address3])
        })

        it('children:List<HashMap>', async function() {
          await checkResult([
            { objectId: address1.objectId },
            { objectId: address2.objectId },
            { objectId: address3.objectId },
          ])
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `new-value-${Utils.uid()}`
          const newAddress2 = `new-value-${Utils.uid()}`
          const newAddress3 = `new-value-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address2.objectId,
            address : newAddress2
          })

          const updateOperation3 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address3.objectId,
            address : newAddress3
          })

          await checkResult([updateOperation1, updateOperation2, updateOperation3])
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          await checkResult([
            findOperation.resolvedTo(0),
            findOperation.resolvedTo(1),
            findOperation.resolvedTo(2)
          ])
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          await checkResult(findOperation)
        })

      })

      describe('parent:<Find.OpResultValue>', function() {
        let findPersonsOperation

        beforeEach(async function() {

          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`name = '${person1.name}'`)

          findPersonsOperation = uow.find(PERSONS_TABLE_NAME, query)
        })

        async function checkResult(children) {
          const operation = uow.deleteRelation(findPersonsOperation.resolvedTo(0), ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.delete_relationPerson1.operationType).to.equal('DELETE_RELATION')
          expect(uowResult.results.delete_relationPerson1.result).to.equal(3)

          expect(operation.result).to.equal(3)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${person1.name}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(person1.objectId)
          expect(persons[0].name).to.equal(person1.name)
          expect(persons[0][ADDRESSES_COLUMN]).to.be.an('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(0)

          return persons[0]
        }

        it('children:String ', async function() {
          await checkResult(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)
        })

        it('children:List<String>', async function() {
          await checkResult([address1.objectId, address2.objectId, address3.objectId])
        })

        it('children:List<Class>', async function() {
          expect(address1 instanceof Address).to.equal(true)
          expect(address2 instanceof Address).to.equal(true)
          expect(address3 instanceof Address).to.equal(true)

          await checkResult([address1, address2, address3])
        })

        it('children:List<HashMap>', async function() {
          await checkResult([
            { objectId: address1.objectId },
            { objectId: address2.objectId },
            { objectId: address3.objectId },
          ])
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `new-value-${Utils.uid()}`
          const newAddress2 = `new-value-${Utils.uid()}`
          const newAddress3 = `new-value-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address2.objectId,
            address : newAddress2
          })

          const updateOperation3 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address3.objectId,
            address : newAddress3
          })

          await checkResult([updateOperation1, updateOperation2, updateOperation3])
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          await checkResult([
            findOperation.resolvedTo(0),
            findOperation.resolvedTo(1),
            findOperation.resolvedTo(2)
          ])
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          await checkResult(findOperation)
        })

      })

      describe('parent:<Class>', function() {

        async function checkResult(children) {
          expect(person1 instanceof Person).to.equal(true)

          const operation = uow.deleteRelation(person1, ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.delete_relationPerson1.operationType).to.equal('DELETE_RELATION')
          expect(uowResult.results.delete_relationPerson1.result).to.equal(3)

          expect(operation.result).to.equal(3)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${person1.name}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(person1.objectId)
          expect(persons[0].name).to.equal(person1.name)
          expect(persons[0][ADDRESSES_COLUMN]).to.be.an('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(0)

          return persons[0]
        }

        it('children:String ', async function() {
          await checkResult(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)
        })

        it('children:List<String>', async function() {
          await checkResult([address1.objectId, address2.objectId, address3.objectId])
        })

        it('children:List<Class>', async function() {
          expect(address1 instanceof Address).to.equal(true)
          expect(address2 instanceof Address).to.equal(true)
          expect(address3 instanceof Address).to.equal(true)

          await checkResult([address1, address2, address3])
        })

        it('children:List<HashMap>', async function() {
          await checkResult([
            { objectId: address1.objectId },
            { objectId: address2.objectId },
            { objectId: address3.objectId },
          ])
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `new-value-${Utils.uid()}`
          const newAddress2 = `new-value-${Utils.uid()}`
          const newAddress3 = `new-value-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address2.objectId,
            address : newAddress2
          })

          const updateOperation3 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address3.objectId,
            address : newAddress3
          })

          await checkResult([updateOperation1, updateOperation2, updateOperation3])
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          await checkResult([
            findOperation.resolvedTo(0),
            findOperation.resolvedTo(1),
            findOperation.resolvedTo(2)
          ])
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          await checkResult(findOperation)
        })

      })
    })

    describe('4 arguments;', function() {

      describe('parent:<ObjectId>', function() {

        async function checkResult(children) {
          expect(person1 instanceof Person).to.equal(true)

          const operation = uow.deleteRelation(PERSONS_TABLE_NAME, person1.objectId, ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.delete_relationPerson1.operationType).to.equal('DELETE_RELATION')
          expect(uowResult.results.delete_relationPerson1.result).to.equal(3)

          expect(operation.result).to.equal(3)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${person1.name}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(person1.objectId)
          expect(persons[0].name).to.equal(person1.name)
          expect(persons[0][ADDRESSES_COLUMN]).to.be.an('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(0)

          return persons[0]
        }

        it('children:String ', async function() {
          await checkResult(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)
        })

        it('children:List<String>', async function() {
          await checkResult([address1.objectId, address2.objectId, address3.objectId])
        })

        it('children:List<Class>', async function() {
          expect(address1 instanceof Address).to.equal(true)
          expect(address2 instanceof Address).to.equal(true)
          expect(address3 instanceof Address).to.equal(true)

          await checkResult([address1, address2, address3])
        })

        it('children:List<HashMap>', async function() {
          await checkResult([
            { objectId: address1.objectId },
            { objectId: address2.objectId },
            { objectId: address3.objectId },
          ])
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `children:1-${Utils.uid()}`
          const newAddress2 = `children:2-${Utils.uid()}`
          const newAddress3 = `children:3-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address2.objectId,
            address : newAddress2
          })

          const updateOperation3 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address3.objectId,
            address : newAddress3
          })

          await checkResult([updateOperation1, updateOperation2, updateOperation3])
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          await checkResult([
            findOperation.resolvedTo(0),
            findOperation.resolvedTo(1),
            findOperation.resolvedTo(2)
          ])
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          await checkResult(findOperation)
        })

      })

      describe('parent:<Class>', function() {

        async function checkResult(children) {
          expect(person1 instanceof Person).to.equal(true)

          const operation = uow.deleteRelation(PERSONS_TABLE_NAME, person1, ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.delete_relationPerson1.operationType).to.equal('DELETE_RELATION')
          expect(uowResult.results.delete_relationPerson1.result).to.equal(3)

          expect(operation.result).to.equal(3)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${person1.name}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(person1.objectId)
          expect(persons[0].name).to.equal(person1.name)
          expect(persons[0][ADDRESSES_COLUMN]).to.be.an('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(0)

          return persons[0]
        }

        it('children:String ', async function() {
          await checkResult(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)
        })

        it('children:List<String>', async function() {
          await checkResult([address1.objectId, address2.objectId, address3.objectId])
        })

        it('children:List<Class>', async function() {
          expect(address1 instanceof Address).to.equal(true)
          expect(address2 instanceof Address).to.equal(true)
          expect(address3 instanceof Address).to.equal(true)

          await checkResult([address1, address2, address3])
        })

        it('children:List<HashMap>', async function() {
          await checkResult([
            { objectId: address1.objectId },
            { objectId: address2.objectId },
            { objectId: address3.objectId },
          ])
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `children:1-${Utils.uid()}`
          const newAddress2 = `children:2-${Utils.uid()}`
          const newAddress3 = `children:3-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address2.objectId,
            address : newAddress2
          })

          const updateOperation3 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: address3.objectId,
            address : newAddress3
          })

          await checkResult([updateOperation1, updateOperation2, updateOperation3])
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          await checkResult([
            findOperation.resolvedTo(0),
            findOperation.resolvedTo(1),
            findOperation.resolvedTo(2)
          ])
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`address IN ('${address1.address}','${address2.address}','${address3.address}')`)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          await checkResult(findOperation)
        })

      })

    })
  })

  describe('Fails', function() {

  })
})
