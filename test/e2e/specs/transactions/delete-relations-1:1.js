import '../../helpers/global'
import sandbox from '../../helpers/sandbox'
import * as Utils from '../../helpers/utils'

const Backendless = sandbox.Backendless

const PERSONS_TABLE_NAME = 'Person'
const ORDERS_TABLE_NAME = 'Order'

const ORDER_COLUMN = 'order'

class Person {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.name = data.name
  }
}

class Order {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.label = data.label
  }
}

describe('Transactions - Delete 1:1 Relations Operations', function() {

  let tablesAPI

  let personsStore
  let ordersStore

  let uow

  let order1
  let person1

  sandbox.forSuite()

  before(async function() {
    tablesAPI = this.tablesAPI

    await tablesAPI.createTable(PERSONS_TABLE_NAME)
    await tablesAPI.createTable(ORDERS_TABLE_NAME)

    await tablesAPI.createColumn(PERSONS_TABLE_NAME, 'name', tablesAPI.DataTypes.STRING)
    await tablesAPI.createColumn(ORDERS_TABLE_NAME, 'label', tablesAPI.DataTypes.STRING)

    await tablesAPI.createRelationColumn(PERSONS_TABLE_NAME, ORDER_COLUMN, ORDERS_TABLE_NAME, tablesAPI.RelationTypes.ONE_TO_ONE)

    personsStore = Backendless.Data.of(Person)
    ordersStore = Backendless.Data.of(Order)
  })

  beforeEach(async function() {
    const result = await Promise.all([
      personsStore.save({ name: `p:1:${Utils.uid()}` }),
      ordersStore.save({ label: `p:1:${Utils.uid()}` }),
    ])

    person1 = result[0]
    order1 = result[1]

    await personsStore.addRelation(person1, ORDER_COLUMN, [order1])

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
          const operation = uow.deleteRelation(updatePersonOperation, ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.delete_relationPerson1.operationType).to.equal('DELETE_RELATION')
          expect(uowResult.results.delete_relationPerson1.result).to.equal(1)

          expect(operation.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${newPersonName}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(person1.objectId)
          expect(persons[0].name).to.equal(newPersonName)
          expect(persons[0][ORDER_COLUMN]).to.equal(null)

          return persons[0]
        }

        it('children:String ', async function() {
          await checkResult(`label = '${order1.label}'`)
        })

        it('children:Class ', async function() {
          expect(order1 instanceof Order).to.equal(true)

          await checkResult(order1)
        })

        it('children:HashMap ', async function() {
          await checkResult({ objectId: order1.objectId })
        })

        it('children:List<String>', async function() {
          await checkResult([order1.objectId])
        })

        it('children:List<Class>', async function() {
          expect(order1 instanceof Order).to.equal(true)

          await checkResult([order1])
        })

        it('children:List<HashMap>', async function() {
          await checkResult([{ objectId: order1.objectId }])
        })

        it('children:List<Update.OpResult>', async function() {
          const newOrderLabel = `new-label-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: order1.objectId,
            label   : newOrderLabel
          })

          await checkResult([updateOrderOperation])
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`label = '${order1.label}'`)

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          await checkResult([findOrdersOperation.resolveTo(0)])
        })

        it('children:<Update.OpResult>', async function() {
          const newOrderLabel = `new-label-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: order1.objectId,
            label   : newOrderLabel
          })

          await checkResult(updateOrderOperation)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`label = '${order1.label}'`)

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          await checkResult(findOrdersOperation.resolveTo(0))
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
          const operation = uow.deleteRelation(findPersonsOperation.resolveTo(0), ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.delete_relationPerson1.operationType).to.equal('DELETE_RELATION')
          expect(uowResult.results.delete_relationPerson1.result).to.equal(1)

          expect(operation.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${person1.name}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(person1.objectId)
          expect(persons[0].name).to.equal(person1.name)
          expect(persons[0][ORDER_COLUMN]).to.equal(null)

          return persons[0]
        }

        it('children:String ', async function() {
          await checkResult(`label = '${order1.label}'`)
        })

        it('children:Class ', async function() {
          expect(order1 instanceof Order).to.equal(true)

          await checkResult(order1)
        })

        it('children:HashMap ', async function() {
          await checkResult({ objectId: order1.objectId })
        })

        it('children:List<String>', async function() {
          await checkResult([order1.objectId])
        })

        it('children:List<Class>', async function() {
          expect(order1 instanceof Order).to.equal(true)

          await checkResult([order1])
        })

        it('children:List<HashMap>', async function() {
          await checkResult([{ objectId: order1.objectId }])
        })

        it('children:List<Update.OpResult>', async function() {
          const newOrderLabel = `new-label-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: order1.objectId,
            label   : newOrderLabel
          })

          await checkResult([updateOrderOperation])
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`label = '${order1.label}'`)

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          await checkResult([findOrdersOperation.resolveTo(0)])
        })

        it('children:<Update.OpResult>', async function() {
          const newOrderLabel = `new-label-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: order1.objectId,
            label   : newOrderLabel
          })

          await checkResult(updateOrderOperation)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`label = '${order1.label}'`)

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          await checkResult(findOrdersOperation.resolveTo(0))
        })
      })

      describe('parent:<Class>', function() {

        async function checkResult(children) {
          expect(person1 instanceof Person).to.equal(true)

          const operation = uow.deleteRelation(person1, ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.delete_relationPerson1.operationType).to.equal('DELETE_RELATION')
          expect(uowResult.results.delete_relationPerson1.result).to.equal(1)

          expect(operation.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${person1.name}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(person1.objectId)
          expect(persons[0].name).to.equal(person1.name)
          expect(persons[0][ORDER_COLUMN]).to.equal(null)

          return persons[0]
        }

        it('children:String ', async function() {
          await checkResult(`label = '${order1.label}'`)
        })

        it('children:Class ', async function() {
          expect(order1 instanceof Order).to.equal(true)

          await checkResult(order1)
        })

        it('children:HashMap ', async function() {
          await checkResult({ objectId: order1.objectId })
        })

        it('children:List<String>', async function() {
          await checkResult([order1.objectId])
        })

        it('children:List<Class>', async function() {
          expect(order1 instanceof Order).to.equal(true)

          await checkResult([order1])
        })

        it('children:List<HashMap>', async function() {
          await checkResult([{ objectId: order1.objectId }])
        })

        it('children:List<Update.OpResult>', async function() {
          const newOrderLabel = `new-label-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: order1.objectId,
            label   : newOrderLabel
          })

          await checkResult([updateOrderOperation])
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`label = '${order1.label}'`)

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          await checkResult([findOrdersOperation.resolveTo(0)])
        })

        it('children:<Update.OpResult>', async function() {
          const newOrderLabel = `new-label-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: order1.objectId,
            label   : newOrderLabel
          })

          await checkResult(updateOrderOperation)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`label = '${order1.label}'`)

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          await checkResult(findOrdersOperation.resolveTo(0))
        })
      })
    })

    describe('4 arguments;', function() {

      describe('parent:<ObjectId>', function() {

        async function checkResult(children) {
          const setRelationOp = uow.deleteRelation(PERSONS_TABLE_NAME, person1.objectId, ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.delete_relationPerson1.operationType).to.equal('DELETE_RELATION')
          expect(uowResult.results.delete_relationPerson1.result).to.equal(1)

          expect(setRelationOp.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${person1.name}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(person1.objectId)
          expect(persons[0][ORDER_COLUMN]).to.equal(null)

          return persons[0]
        }

        it('children:String ', async function() {
          await checkResult(`label = '${order1.label}'`)
        })

        it('children:Class ', async function() {
          expect(order1 instanceof Order).to.equal(true)

          await checkResult(order1)
        })

        it('children:HashMap ', async function() {
          await checkResult({ objectId: order1.objectId })
        })

        it('children:List<String>', async function() {
          await checkResult([order1.objectId])
        })

        it('children:List<Class>', async function() {
          expect(order1 instanceof Order).to.equal(true)

          await checkResult([order1])
        })

        it('children:List<HashMap>', async function() {
          await checkResult([{ objectId: order1.objectId }])
        })

        it('children:List<Update.OpResult>', async function() {
          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: order1.objectId,
            label   : `new-label-${Utils.uid()}`
          })

          await checkResult([updateOrderOperation])
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`label = '${order1.label}'`)

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          await checkResult([findOrdersOperation.resolveTo(0)])
        })

        it('children:<Update.OpResult>', async function() {
          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: order1.objectId,
            label   : `new-label-${Utils.uid()}`
          })

          await checkResult(updateOrderOperation)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`label = '${order1.label}'`)

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          await checkResult(findOrdersOperation.resolveTo(0))
        })

      })

      describe('parent:<Class>', function() {

        async function checkResult(children) {
          expect(person1 instanceof Person).to.equal(true)

          const setRelationOp = uow.deleteRelation(PERSONS_TABLE_NAME, person1, ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.delete_relationPerson1.operationType).to.equal('DELETE_RELATION')
          expect(uowResult.results.delete_relationPerson1.result).to.equal(1)

          expect(setRelationOp.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${person1.name}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(person1.objectId)
          expect(persons[0][ORDER_COLUMN]).to.equal(null)

          return persons[0]
        }

        it('children:String ', async function() {
          await checkResult(`label = '${order1.label}'`)
        })

        it('children:Class ', async function() {
          expect(order1 instanceof Order).to.equal(true)

          await checkResult(order1)
        })

        it('children:HashMap ', async function() {
          await checkResult({ objectId: order1.objectId })
        })

        it('children:List<String>', async function() {
          await checkResult([order1.objectId])
        })

        it('children:List<Class>', async function() {
          expect(order1 instanceof Order).to.equal(true)

          await checkResult([order1])
        })

        it('children:List<HashMap>', async function() {
          await checkResult([{ objectId: order1.objectId }])
        })

        it('children:List<Update.OpResult>', async function() {
          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: order1.objectId,
            label   : `new-label-${Utils.uid()}`
          })

          await checkResult([updateOrderOperation])
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`label = '${order1.label}'`)

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          await checkResult([findOrdersOperation.resolveTo(0)])
        })

        it('children:<Update.OpResult>', async function() {
          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: order1.objectId,
            label   : `new-label-${Utils.uid()}`
          })

          await checkResult(updateOrderOperation)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`label = '${order1.label}'`)

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          await checkResult(findOrdersOperation.resolveTo(0))
        })

      })

    })
  })

  describe('Fails', function() {

  })
})
