import sandbox, { Utils } from '../../helpers/sandbox'

const Backendless = sandbox.Backendless

const PERSONS_TABLE_NAME = 'Person'
const ORDERS_TABLE_NAME = 'Order'

const ORDER_COLUMN = 'order'

class Person {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.name = data.name
    this.age = data.age
  }
}

class Order {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.price = data.price
    this.label = data.label
  }
}

describe('Transactions - Set 1:1 Relations Operations', function() {

  let tablesAPI

  let personsStore
  let ordersStore

  let uow

  sandbox.forSuite()

  before(async function() {
    tablesAPI = this.tablesAPI

    personsStore = Backendless.Data.of(Person)
    ordersStore = Backendless.Data.of(Order)

    await personsStore.save({ name: 'initial-1', age: 5 })
    await personsStore.save({ name: 'initial-2', age: 10 })
    await personsStore.save({ name: 'initial-3', age: 22 })
    await personsStore.save({ name: 'initial-4', age: 25 })
    await personsStore.save({ name: 'initial-5', age: 30 })

    await ordersStore.save({ label: 'initial-1', price: 115 })
    await ordersStore.save({ label: 'initial-2', price: 120 })
    await ordersStore.save({ label: 'initial-3', price: 125 })
    await ordersStore.save({ label: 'initial-4', price: 130 })
    await ordersStore.save({ label: 'initial-5', price: 135 })

    await tablesAPI.createRelationColumn(PERSONS_TABLE_NAME, ORDER_COLUMN, ORDERS_TABLE_NAME, tablesAPI.RelationTypes.ONE_TO_ONE)
  })

  beforeEach(function() {
    uow = new Backendless.UnitOfWork()
  })

  it('creates two objects and set up relationship between them', async function() {
    const personName = `p-${Utils.uid()}`

    const createPersonOp = uow.create(PERSONS_TABLE_NAME, { name: personName })
    const createOrderOp = uow.create(ORDERS_TABLE_NAME, { price: 1234 })

    const setRelationOp = uow.setRelation(createPersonOp, ORDER_COLUMN, [createOrderOp])

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
    expect(uowResult.results.set_relationPerson1.result).to.equal(1)

    expect(setRelationOp.result).to.equal(1)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause(`name='${personName}'`)
      .setRelated(ORDER_COLUMN)

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(1)

    expect(persons[0].name).to.equal(personName)
    expect(persons[0].___class).to.equal('Person')
    expect(persons[0].objectId).to.be.a('string')
    expect(persons[0].created).to.be.a('number')

    expect(persons[0][ORDER_COLUMN].price).to.equal(1234)
    expect(persons[0][ORDER_COLUMN].___class).to.equal('Order')
    expect(persons[0][ORDER_COLUMN].objectId).to.be.a('string')
    expect(persons[0][ORDER_COLUMN].created).to.be.a('number')
  })

  it('creates relationship between two saved HashMaps', async function() {
    const personName = `p-${Utils.uid()}`

    const savedPerson = await personsStore.save({ name: personName })
    const savedOrder = await ordersStore.save({ price: 1234 })

    const simplePerson = { objectId: savedPerson.objectId }
    const simpleOrder = { objectId: savedOrder.objectId }

    const setRelationOp = uow.setRelation(PERSONS_TABLE_NAME, simplePerson, ORDER_COLUMN, [simpleOrder])

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
    expect(uowResult.results.set_relationPerson1.result).to.equal(1)

    expect(setRelationOp.result).to.equal(1)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause(`name='${personName}'`)
      .setRelated(ORDER_COLUMN)

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(1)

    expect(persons[0].name).to.equal(personName)
    expect(persons[0].___class).to.equal('Person')
    expect(persons[0].objectId).to.be.a('string')
    expect(persons[0].created).to.be.a('number')

    expect(persons[0][ORDER_COLUMN].price).to.equal(1234)
    expect(persons[0][ORDER_COLUMN].___class).to.equal('Order')
    expect(persons[0][ORDER_COLUMN].objectId).to.be.a('string')
    expect(persons[0][ORDER_COLUMN].created).to.be.a('number')
  })

  it('creates relationship between two saved instances', async function() {
    const personName = `p-${Utils.uid()}`

    const savedPerson = await personsStore.save({ name: personName })
    const savedOrder = await ordersStore.save({ price: 1234 })

    expect(savedPerson instanceof Person).to.equal(true)
    expect(savedOrder instanceof Order).to.equal(true)

    const setRelationOp = uow.setRelation(PERSONS_TABLE_NAME, savedPerson, ORDER_COLUMN, [savedOrder])

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
    expect(uowResult.results.set_relationPerson1.result).to.equal(1)

    expect(setRelationOp.result).to.equal(1)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause(`name='${personName}'`)
      .setRelated(ORDER_COLUMN)

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(1)

    expect(persons[0].name).to.equal(personName)
    expect(persons[0].___class).to.equal('Person')
    expect(persons[0].objectId).to.equal(savedPerson.objectId)
    expect(persons[0].created).to.be.a('number')

    expect(persons[0][ORDER_COLUMN].price).to.equal(1234)
    expect(persons[0][ORDER_COLUMN].___class).to.equal('Order')
    expect(persons[0][ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
    expect(persons[0][ORDER_COLUMN].created).to.be.a('number')
  })

  it('creates relationship between OpResult and saved instance', async function() {
    const personName = `p-${Utils.uid()}`

    const savedOrder = await ordersStore.save({ price: 1234 })

    expect(savedOrder instanceof Order).to.equal(true)

    const createPersonOp = uow.create(PERSONS_TABLE_NAME, { name: personName })

    const setRelationOp = uow.setRelation(createPersonOp, ORDER_COLUMN, [savedOrder])

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
    expect(uowResult.results.set_relationPerson1.result).to.equal(1)

    expect(setRelationOp.result).to.equal(1)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause(`name='${personName}'`)
      .setRelated(ORDER_COLUMN)

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(1)

    expect(persons[0].name).to.equal(personName)
    expect(persons[0].___class).to.equal('Person')
    expect(persons[0].objectId).to.be.a('string')
    expect(persons[0].created).to.be.a('number')

    expect(persons[0][ORDER_COLUMN].price).to.equal(1234)
    expect(persons[0][ORDER_COLUMN].___class).to.equal('Order')
    expect(persons[0][ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
    expect(persons[0][ORDER_COLUMN].created).to.be.a('number')
  })

  it('creates relationship between OpResult and saved HashMap', async function() {
    const personName = `p-${Utils.uid()}`

    const savedOrder = await ordersStore.save({ price: 1234 })
    const simpleOrder = { objectId: savedOrder.objectId }

    const createPersonOp = uow.create(PERSONS_TABLE_NAME, { name: personName })

    const setRelationOp = uow.setRelation(createPersonOp, ORDER_COLUMN, [simpleOrder])

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
    expect(uowResult.results.set_relationPerson1.result).to.equal(1)

    expect(setRelationOp.result).to.equal(1)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause(`name='${personName}'`)
      .setRelated(ORDER_COLUMN)

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(1)

    expect(persons[0].name).to.equal(personName)
    expect(persons[0].___class).to.equal('Person')
    expect(persons[0].objectId).to.be.a('string')
    expect(persons[0].created).to.be.a('number')

    expect(persons[0][ORDER_COLUMN].price).to.equal(1234)
    expect(persons[0][ORDER_COLUMN].___class).to.equal('Order')
    expect(persons[0][ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
    expect(persons[0][ORDER_COLUMN].created).to.be.a('number')
  })

  it('creates relationship between OpResult reference and saved HashMap', async function() {
    const savedOrder = await ordersStore.save({ price: 222 })
    const simpleOrder = { objectId: savedOrder.objectId }

    const query = Backendless.Data.QueryBuilder.create()
      .setWhereClause('name like \'initial-%\'')
      .setSortBy('age asc')

    const operation = uow.find(PERSONS_TABLE_NAME, query)

    const setRelationOp = uow.setRelation(operation.resolveTo(0), ORDER_COLUMN, [simpleOrder])

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
    expect(uowResult.results.set_relationPerson1.result).to.equal(1)

    expect(setRelationOp.result).to.equal(1)

    const query2 = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name=\'initial-1\'')
      .setRelated(ORDER_COLUMN)

    const persons = await personsStore.find(query2)

    expect(persons).to.have.length(1)

    expect(persons[0][ORDER_COLUMN].price).to.equal(222)
    expect(persons[0][ORDER_COLUMN].___class).to.equal('Order')
    expect(persons[0][ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
    expect(persons[0][ORDER_COLUMN].created).to.be.a('number')
  })

  describe('API Signatures', function() {

    describe('3 arguments;', function() {
      describe('parent:<Create.OpResult>', function() {
        let createPersonOperation
        let personName
        let orderLabel
        let savedOrder

        beforeEach(async function() {
          personName = `parent:<Create.OpResult>-${Utils.uid()}`
          orderLabel = `children:${personName}`

          savedOrder = await ordersStore.save({ price: 222, label: orderLabel })

          createPersonOperation = uow.create(PERSONS_TABLE_NAME, { name: personName })
        })

        async function checkResult(children) {
          const setRelationOp = uow.setRelation(createPersonOperation, ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
          expect(uowResult.results.set_relationPerson1.result).to.equal(1)

          expect(setRelationOp.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personName}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0][ORDER_COLUMN]).to.be.a('object')

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`label = '${orderLabel}'`)

          expect(person[ORDER_COLUMN].label).to.equal(orderLabel)
          expect(person[ORDER_COLUMN].price).to.equal(222)
        })

        it('children:Class ', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult(savedOrder)

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:HashMap ', async function() {
          const person = await checkResult({ objectId: savedOrder.objectId })

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedOrder.objectId])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Class>', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult([savedOrder])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([{ objectId: savedOrder.objectId }])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult([createOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult([updateOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult([findOrdersOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([bulkCreateOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

        it('children:<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult(createOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult(updateOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult(findOrdersOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

      })

      describe('parent:<Update.OpResult>', function() {
        let updatePersonOperation
        let orderLabel
        let savedPerson
        let savedOrder
        let personName
        let newPersonName

        beforeEach(async function() {
          personName = `parent:<Update.OpResult>-${Utils.uid()}`
          newPersonName = `new:${personName}`
          orderLabel = `children:${personName}`

          savedPerson = await personsStore.save({ name: personName })
          savedOrder = await ordersStore.save({ label: orderLabel, price: 222 })

          updatePersonOperation = uow.update(PERSONS_TABLE_NAME, {
            objectId: savedPerson.objectId,
            name    : newPersonName
          })
        })

        async function checkResult(children) {
          const setRelationOp = uow.setRelation(updatePersonOperation, ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
          expect(uowResult.results.set_relationPerson1.result).to.equal(1)

          expect(setRelationOp.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${newPersonName}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(savedPerson.objectId)
          expect(persons[0].name).to.equal(newPersonName)
          expect(persons[0][ORDER_COLUMN]).to.be.a('object')

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`label = '${orderLabel}'`)

          expect(person[ORDER_COLUMN].label).to.equal(orderLabel)
          expect(person[ORDER_COLUMN].price).to.equal(222)
        })

        it('children:Class ', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult(savedOrder)

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:HashMap ', async function() {
          const person = await checkResult({ objectId: savedOrder.objectId })

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedOrder.objectId])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Class>', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult([savedOrder])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([{ objectId: savedOrder.objectId }])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult([createOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult([updateOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult([findOrdersOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([bulkCreateOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

        it('children:<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult(createOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult(updateOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult(findOrdersOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

      })

      describe('parent:<Find.OpResultValue>', function() {
        let findPersonsOperation
        let orderLabel
        let savedPerson
        let savedOrder
        let personName

        beforeEach(async function() {
          personName = `parent:<Find.OpResultValue>-${Utils.uid()}`
          orderLabel = `children:${personName}`

          savedPerson = await personsStore.save({ name: personName })
          savedOrder = await ordersStore.save({ label: orderLabel, price: 222 })

          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`name = '${personName}'`)

          findPersonsOperation = uow.find(PERSONS_TABLE_NAME, query)
        })

        async function checkResult(children) {
          const setRelationOp = uow.setRelation(findPersonsOperation.resolveTo(0), ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
          expect(uowResult.results.set_relationPerson1.result).to.equal(1)

          expect(setRelationOp.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personName}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(savedPerson.objectId)
          expect(persons[0].name).to.equal(personName)
          expect(persons[0][ORDER_COLUMN]).to.be.a('object')

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`label = '${orderLabel}'`)

          expect(person[ORDER_COLUMN].label).to.equal(orderLabel)
          expect(person[ORDER_COLUMN].price).to.equal(222)
        })

        it('children:Class ', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult(savedOrder)

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:HashMap ', async function() {
          const person = await checkResult({ objectId: savedOrder.objectId })

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedOrder.objectId])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Class>', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult([savedOrder])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([{ objectId: savedOrder.objectId }])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult([createOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult([updateOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult([findOrdersOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([bulkCreateOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

        it('children:<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult(createOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult(updateOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult(findOrdersOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

      })

      describe('parent:<BulkCreate.OpResultValue>', function() {
        let bulkCreateOperation
        let orderLabel
        let savedOrder

        let personObjects

        beforeEach(async function() {
          orderLabel = `children:parent:<BulkCreate.OpResultValue>-${Utils.uid()}`

          savedOrder = await ordersStore.save({ label: orderLabel, price: 222 })

          personObjects = [
            new Person({ name: `parent:<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Person({ name: `parent:<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Person({ name: `parent:<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Person({ name: `parent:<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Person({ name: `parent:<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          bulkCreateOperation = uow.bulkCreate(personObjects)
        })

        async function checkResult(children) {
          const setRelationOp = uow.setRelation(bulkCreateOperation.resolveTo(0), ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
          expect(uowResult.results.set_relationPerson1.result).to.equal(1)

          expect(setRelationOp.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personObjects[0].name}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].name).to.equal(personObjects[0].name)
          expect(persons[0][ORDER_COLUMN]).to.be.a('object')

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`label = '${orderLabel}'`)

          expect(person[ORDER_COLUMN].label).to.equal(orderLabel)
          expect(person[ORDER_COLUMN].price).to.equal(222)
        })

        it('children:Class ', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult(savedOrder)

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:HashMap ', async function() {
          const person = await checkResult({ objectId: savedOrder.objectId })

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedOrder.objectId])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Class>', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult([savedOrder])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([{ objectId: savedOrder.objectId }])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult([createOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult([updateOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult([findOrdersOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([bulkCreateOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

        it('children:<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult(createOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult(updateOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult(findOrdersOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

      })

      describe('parent:<Class>', function() {
        let personName
        let orderLabel
        let savedPerson
        let savedOrder

        beforeEach(async function() {
          personName = `parent:<Class>-${Utils.uid()}`
          orderLabel = `children:${personName}`

          savedPerson = await personsStore.save({ name: personName })
          savedOrder = await ordersStore.save({ price: 222, label: orderLabel })
        })

        async function checkResult(children) {
          expect(savedPerson instanceof Person).to.equal(true)

          const setRelationOp = uow.setRelation(savedPerson, ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
          expect(uowResult.results.set_relationPerson1.result).to.equal(1)

          expect(setRelationOp.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personName}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0][ORDER_COLUMN]).to.be.a('object')

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`label = '${orderLabel}'`)

          expect(person[ORDER_COLUMN].label).to.equal(orderLabel)
          expect(person[ORDER_COLUMN].price).to.equal(222)
        })

        it('children:Class ', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult(savedOrder)

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:HashMap ', async function() {
          const person = await checkResult({ objectId: savedOrder.objectId })

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedOrder.objectId])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Class>', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult([savedOrder])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([{ objectId: savedOrder.objectId }])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult([createOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult([updateOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult([findOrdersOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([bulkCreateOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

        it('children:<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult(createOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult(updateOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult(findOrdersOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

      })
    })

    describe('4 arguments;', function() {
      describe('parent:<ObjectId>', function() {
        let personName
        let orderLabel
        let savedPerson
        let savedOrder

        beforeEach(async function() {
          personName = `parent:<Class>-${Utils.uid()}`
          orderLabel = `children:${personName}`

          savedPerson = await personsStore.save({ name: personName })
          savedOrder = await ordersStore.save({ price: 222, label: orderLabel })
        })

        async function checkResult(children) {
          const setRelationOp = uow.setRelation(PERSONS_TABLE_NAME, savedPerson.objectId, ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
          expect(uowResult.results.set_relationPerson1.result).to.equal(1)

          expect(setRelationOp.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personName}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(savedPerson.objectId)
          expect(persons[0][ORDER_COLUMN]).to.be.a('object')

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`label = '${orderLabel}'`)

          expect(person[ORDER_COLUMN].label).to.equal(orderLabel)
          expect(person[ORDER_COLUMN].price).to.equal(222)
        })

        it('children:Class ', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult(savedOrder)

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:HashMap ', async function() {
          const person = await checkResult({ objectId: savedOrder.objectId })

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedOrder.objectId])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Class>', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult([savedOrder])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([{ objectId: savedOrder.objectId }])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult([createOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult([updateOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult([findOrdersOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([bulkCreateOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

        it('children:<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult(createOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult(updateOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult(findOrdersOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

      })

      describe('parent:<Class>', function() {
        let personName
        let orderLabel
        let savedPerson
        let savedOrder

        beforeEach(async function() {
          personName = `parent:<Class>-${Utils.uid()}`
          orderLabel = `children:${personName}`

          savedPerson = await personsStore.save({ name: personName })
          savedOrder = await ordersStore.save({ price: 222, label: orderLabel })
        })

        async function checkResult(children) {
          expect(savedPerson instanceof Person).to.equal(true)

          const setRelationOp = uow.setRelation(PERSONS_TABLE_NAME, savedPerson, ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
          expect(uowResult.results.set_relationPerson1.result).to.equal(1)

          expect(setRelationOp.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personName}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(savedPerson.objectId)
          expect(persons[0][ORDER_COLUMN]).to.be.a('object')

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`label = '${orderLabel}'`)

          expect(person[ORDER_COLUMN].label).to.equal(orderLabel)
          expect(person[ORDER_COLUMN].price).to.equal(222)
        })

        it('children:Class ', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult(savedOrder)

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:HashMap ', async function() {
          const person = await checkResult({ objectId: savedOrder.objectId })

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedOrder.objectId])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Class>', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult([savedOrder])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([{ objectId: savedOrder.objectId }])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult([createOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult([updateOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult([findOrdersOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([bulkCreateOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

        it('children:<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult(createOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult(updateOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult(findOrdersOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

      })

      describe('parent:<HashMap>', function() {
        let personName
        let orderLabel
        let savedPerson
        let savedOrder

        beforeEach(async function() {
          personName = `parent:<HashMap>-${Utils.uid()}`
          orderLabel = `children:${personName}`

          savedOrder = await ordersStore.save({ price: 222, label: orderLabel })

          savedPerson = await personsStore.save({ name: personName })
          savedPerson = { objectId: savedPerson.objectId }
        })

        async function checkResult(children) {
          expect(savedOrder instanceof Order).to.equal(true)

          const setRelationOp = uow.setRelation(PERSONS_TABLE_NAME, savedPerson, ORDER_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.set_relationPerson1.operationType).to.equal('SET_RELATION')
          expect(uowResult.results.set_relationPerson1.result).to.equal(1)

          expect(setRelationOp.result).to.equal(1)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personName}'`)
            .setRelated(ORDER_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(savedPerson.objectId)
          expect(persons[0][ORDER_COLUMN]).to.be.a('object')

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`label = '${orderLabel}'`)

          expect(person[ORDER_COLUMN].label).to.equal(orderLabel)
          expect(person[ORDER_COLUMN].price).to.equal(222)
        })

        it('children:Class ', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult(savedOrder)

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:HashMap ', async function() {
          const person = await checkResult({ objectId: savedOrder.objectId })

          expect(person[ORDER_COLUMN].label).to.equal(savedOrder.label)
          expect(person[ORDER_COLUMN].price).to.equal(savedOrder.price)
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedOrder.objectId])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Class>', async function() {
          expect(savedOrder instanceof Order).to.equal(true)

          const person = await checkResult([savedOrder])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([{ objectId: savedOrder.objectId }])

          expect(person[ORDER_COLUMN].objectId).to.equal(savedOrder.objectId)
        })

        it('children:List<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult([createOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult([updateOrderOperation])

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult([findOrdersOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([bulkCreateOperation.resolveTo(3)])

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

        it('children:<Create.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const createOrderOperation = uow.create(ORDERS_TABLE_NAME, { label: newOrderLabel })

          const person = await checkResult(createOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Update.OpResult>', async function() {
          const newOrderLabel = `children:List<Create.OpResult>-${Utils.uid()}`

          const updateOrderOperation = uow.update(ORDERS_TABLE_NAME, {
            objectId: savedOrder.objectId,
            label   : newOrderLabel
          })

          const person = await checkResult(updateOrderOperation)

          expect(person[ORDER_COLUMN].label).to.equal(newOrderLabel)
        })

        it('children:<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('label like \'initial-%\'')
            .setSortBy('price asc')

          const findOrdersOperation = uow.find(ORDERS_TABLE_NAME, query)

          const person = await checkResult(findOrdersOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal('initial-4')
          expect(person[ORDER_COLUMN].price).to.equal(130)
        })

        it('children:<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Order({ price: 1, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 2, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 3, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 4, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Order({ price: 5, label: `children:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation.resolveTo(3))

          expect(person[ORDER_COLUMN].label).to.equal(objects[3].label)
          expect(person[ORDER_COLUMN].price).to.equal(objects[3].price)
        })

      })
    })
  })

  describe('Fails', function() {

  })
})
