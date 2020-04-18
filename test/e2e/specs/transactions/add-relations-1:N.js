import sandbox, { Utils } from '../../helpers/sandbox'

const Backendless = sandbox.Backendless

const PERSONS_TABLE_NAME = 'Person'
const ADDRESSES_TABLE_NAME = 'Address'

const ADDRESSES_COLUMN = 'addresses'

class Person {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.name = data.name
    this.age = data.age
  }
}

class Address {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.address = data.address
  }
}

describe('Transactions - Add 1:N Relations Operations', function() {

  let tablesAPI

  let personsStore
  let addressesStore

  let uow

  sandbox.forSuite()

  before(async function() {
    tablesAPI = this.tablesAPI

    personsStore = Backendless.Data.of(Person)
    addressesStore = Backendless.Data.of(Address)

    await Promise.all([
      personsStore.save({ name: 'initial-1', age: 5 }),
      personsStore.save({ name: 'initial-2', age: 10 }),
      personsStore.save({ name: 'initial-3', age: 22 }),
      personsStore.save({ name: 'initial-4', age: 25 }),
      personsStore.save({ name: 'initial-5', age: 30 }),

      addressesStore.save({ address: 'initial-1' }),
      addressesStore.save({ address: 'initial-2' }),
      addressesStore.save({ address: 'initial-3' }),
      addressesStore.save({ address: 'initial-4' }),
      addressesStore.save({ address: 'initial-5' }),
    ])

    await tablesAPI.createRelationColumn(PERSONS_TABLE_NAME, ADDRESSES_COLUMN, ADDRESSES_TABLE_NAME, tablesAPI.RelationTypes.ONE_TO_MANY)
  })

  beforeEach(function() {
    uow = new Backendless.UnitOfWork()
  })

  describe('API Signatures', function() {

    describe('3 arguments;', function() {
      let personName
      let address1
      let address2
      let savedAddress1
      let savedAddress2

      beforeEach(async function() {
        personName = `parent:3 arguments-${Utils.uid()}`
        address1 = `children:1:${personName}`
        address2 = `children:2:${personName}`

        savedAddress1 = await addressesStore.save({ address: address1 })
        savedAddress2 = await addressesStore.save({ address: address2 })
      })

      describe('parent:<Create.OpResult>', function() {
        let createPersonOperation

        beforeEach(async function() {
          createPersonOperation = uow.create(PERSONS_TABLE_NAME, { name: personName })
        })

        async function checkResult(children) {
          const setRelationOp = uow.addToRelation(createPersonOperation, ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.add_relationPerson1.operationType).to.equal('ADD_RELATION')
          expect(uowResult.results.add_relationPerson1.result).to.equal(2)

          expect(setRelationOp.result).to.equal(2)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personName}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0][ADDRESSES_COLUMN]).to.be.a('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(2)

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`address = '${address1}' OR address = '${address2}'`)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedAddress1.objectId, savedAddress2.objectId])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Class>', async function() {
          expect(savedAddress1 instanceof Address).to.equal(true)
          expect(savedAddress2 instanceof Address).to.equal(true)

          const person = await checkResult([savedAddress1, savedAddress2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([
            { objectId: savedAddress1.objectId },
            { objectId: savedAddress2.objectId },
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Create.OpResult>', async function() {
          const address1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const address2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const createAddressOperation1 = uow.create(ADDRESSES_TABLE_NAME, { address: address1 })
          const createAddressOperation2 = uow.create(ADDRESSES_TABLE_NAME, { address: address2 })

          const person = await checkResult([createAddressOperation1, createAddressOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const newAddress2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress2.objectId,
            address : newAddress2
          })

          const person = await checkResult([updateOperation1, updateOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([newAddress1, newAddress2].sort())
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult([
            findOperation.resolveTo(1),
            findOperation.resolveTo(3)
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql(['initial-2', 'initial-4'].sort())
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Address({ address: `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:3:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:4:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:5:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([
            bulkCreateOperation.resolveTo(1),
            bulkCreateOperation.resolveTo(3),
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql([objects[1].address, objects[3].address].sort())
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')
            .setPageSize(2)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult(findOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql(['initial-1', 'initial-2'].sort())
        })

        it('children:<BulkCreate.OpResult>', async function() {
          const address1 = `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}`
          const address2 = `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}`

          const objects = [
            new Address({ address: address1 }),
            new Address({ address: address2 }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

      })

      describe('parent:<Update.OpResult>', function() {
        let updatePersonOperation
        let savedPerson
        let newPersonName

        beforeEach(async function() {
          newPersonName = `new:${personName}`

          savedPerson = await personsStore.save({ name: personName })

          updatePersonOperation = uow.update(PERSONS_TABLE_NAME, {
            objectId: savedPerson.objectId,
            name    : newPersonName
          })
        })

        async function checkResult(children) {
          const setRelationOp = uow.addToRelation(updatePersonOperation, ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.add_relationPerson1.operationType).to.equal('ADD_RELATION')
          expect(uowResult.results.add_relationPerson1.result).to.equal(2)

          expect(setRelationOp.result).to.equal(2)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${newPersonName}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0][ADDRESSES_COLUMN]).to.be.a('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(2)

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`address = '${address1}' OR address = '${address2}'`)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedAddress1.objectId, savedAddress2.objectId])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Class>', async function() {
          expect(savedAddress1 instanceof Address).to.equal(true)
          expect(savedAddress2 instanceof Address).to.equal(true)

          const person = await checkResult([savedAddress1, savedAddress2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([
            { objectId: savedAddress1.objectId },
            { objectId: savedAddress2.objectId },
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Create.OpResult>', async function() {
          const address1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const address2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const createAddressOperation1 = uow.create(ADDRESSES_TABLE_NAME, { address: address1 })
          const createAddressOperation2 = uow.create(ADDRESSES_TABLE_NAME, { address: address2 })

          const person = await checkResult([createAddressOperation1, createAddressOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const newAddress2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress2.objectId,
            address : newAddress2
          })

          const person = await checkResult([updateOperation1, updateOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([newAddress1, newAddress2].sort())
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult([
            findOperation.resolveTo(1),
            findOperation.resolveTo(3)
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql(['initial-2', 'initial-4'].sort())
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Address({ address: `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:3:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:4:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:5:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([
            bulkCreateOperation.resolveTo(1),
            bulkCreateOperation.resolveTo(3),
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql([objects[1].address, objects[3].address].sort())
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')
            .setPageSize(2)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult(findOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql(['initial-1', 'initial-2'].sort())
        })

        it('children:<BulkCreate.OpResult>', async function() {
          const address1 = `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}`
          const address2 = `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}`

          const objects = [
            new Address({ address: address1 }),
            new Address({ address: address2 }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

      })

      describe('parent:<Find.OpResultValue>', function() {
        let findPersonsOperation
        let savedPerson

        beforeEach(async function() {
          savedPerson = await personsStore.save({ name: personName })

          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause(`name = '${personName}'`)

          findPersonsOperation = uow.find(PERSONS_TABLE_NAME, query)
        })

        async function checkResult(children) {
          const setRelationOp = uow.addToRelation(findPersonsOperation.resolveTo(0), ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.add_relationPerson1.operationType).to.equal('ADD_RELATION')
          expect(uowResult.results.add_relationPerson1.result).to.equal(2)

          expect(setRelationOp.result).to.equal(2)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personName}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(savedPerson.objectId)
          expect(persons[0][ADDRESSES_COLUMN]).to.be.a('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(2)

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`address = '${address1}' OR address = '${address2}'`)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedAddress1.objectId, savedAddress2.objectId])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Class>', async function() {
          expect(savedAddress1 instanceof Address).to.equal(true)
          expect(savedAddress2 instanceof Address).to.equal(true)

          const person = await checkResult([savedAddress1, savedAddress2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([
            { objectId: savedAddress1.objectId },
            { objectId: savedAddress2.objectId },
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Create.OpResult>', async function() {
          const address1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const address2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const createAddressOperation1 = uow.create(ADDRESSES_TABLE_NAME, { address: address1 })
          const createAddressOperation2 = uow.create(ADDRESSES_TABLE_NAME, { address: address2 })

          const person = await checkResult([createAddressOperation1, createAddressOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const newAddress2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress2.objectId,
            address : newAddress2
          })

          const person = await checkResult([updateOperation1, updateOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([newAddress1, newAddress2].sort())
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult([
            findOperation.resolveTo(1),
            findOperation.resolveTo(3)
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql(['initial-2', 'initial-4'].sort())
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Address({ address: `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:3:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:4:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:5:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([
            bulkCreateOperation.resolveTo(1),
            bulkCreateOperation.resolveTo(3),
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql([objects[1].address, objects[3].address].sort())
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')
            .setPageSize(2)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult(findOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql(['initial-1', 'initial-2'].sort())
        })

        it('children:<BulkCreate.OpResult>', async function() {
          const address1 = `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}`
          const address2 = `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}`

          const objects = [
            new Address({ address: address1 }),
            new Address({ address: address2 }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

      })

      describe('parent:<BulkCreate.OpResultValue>', function() {
        let bulkCreateOperation
        let personObjects

        beforeEach(async function() {
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
          const setRelationOp = uow.addToRelation(bulkCreateOperation.resolveTo(0), ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.add_relationPerson1.operationType).to.equal('ADD_RELATION')
          expect(uowResult.results.add_relationPerson1.result).to.equal(2)

          expect(setRelationOp.result).to.equal(2)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personObjects[0].name}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0][ADDRESSES_COLUMN]).to.be.a('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(2)

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`address = '${address1}' OR address = '${address2}'`)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedAddress1.objectId, savedAddress2.objectId])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Class>', async function() {
          expect(savedAddress1 instanceof Address).to.equal(true)
          expect(savedAddress2 instanceof Address).to.equal(true)

          const person = await checkResult([savedAddress1, savedAddress2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([
            { objectId: savedAddress1.objectId },
            { objectId: savedAddress2.objectId },
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Create.OpResult>', async function() {
          const address1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const address2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const createAddressOperation1 = uow.create(ADDRESSES_TABLE_NAME, { address: address1 })
          const createAddressOperation2 = uow.create(ADDRESSES_TABLE_NAME, { address: address2 })

          const person = await checkResult([createAddressOperation1, createAddressOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const newAddress2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress2.objectId,
            address : newAddress2
          })

          const person = await checkResult([updateOperation1, updateOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([newAddress1, newAddress2].sort())
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult([
            findOperation.resolveTo(1),
            findOperation.resolveTo(3)
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql(['initial-2', 'initial-4'].sort())
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Address({ address: `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:3:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:4:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:5:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([
            bulkCreateOperation.resolveTo(1),
            bulkCreateOperation.resolveTo(3),
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql([objects[1].address, objects[3].address].sort())
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')
            .setPageSize(2)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult(findOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql(['initial-1', 'initial-2'].sort())
        })

        it('children:<BulkCreate.OpResult>', async function() {
          const address1 = `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}`
          const address2 = `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}`

          const objects = [
            new Address({ address: address1 }),
            new Address({ address: address2 }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

      })

      describe('parent:<Class>', function() {
        let savedPerson

        beforeEach(async function() {
          savedPerson = await personsStore.save({ name: personName })
        })

        async function checkResult(children) {
          expect(savedPerson instanceof Person).to.equal(true)

          const setRelationOp = uow.addToRelation(savedPerson, ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.add_relationPerson1.operationType).to.equal('ADD_RELATION')
          expect(uowResult.results.add_relationPerson1.result).to.equal(2)

          expect(setRelationOp.result).to.equal(2)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personName}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(savedPerson.objectId)
          expect(persons[0][ADDRESSES_COLUMN]).to.be.a('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(2)

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`address = '${address1}' OR address = '${address2}'`)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedAddress1.objectId, savedAddress2.objectId])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Class>', async function() {
          expect(savedAddress1 instanceof Address).to.equal(true)
          expect(savedAddress2 instanceof Address).to.equal(true)

          const person = await checkResult([savedAddress1, savedAddress2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([
            { objectId: savedAddress1.objectId },
            { objectId: savedAddress2.objectId },
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Create.OpResult>', async function() {
          const address1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const address2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const createAddressOperation1 = uow.create(ADDRESSES_TABLE_NAME, { address: address1 })
          const createAddressOperation2 = uow.create(ADDRESSES_TABLE_NAME, { address: address2 })

          const person = await checkResult([createAddressOperation1, createAddressOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const newAddress2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress2.objectId,
            address : newAddress2
          })

          const person = await checkResult([updateOperation1, updateOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([newAddress1, newAddress2].sort())
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult([
            findOperation.resolveTo(1),
            findOperation.resolveTo(3)
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql(['initial-2', 'initial-4'].sort())
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Address({ address: `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:3:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:4:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:5:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([
            bulkCreateOperation.resolveTo(1),
            bulkCreateOperation.resolveTo(3),
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql([objects[1].address, objects[3].address].sort())
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')
            .setPageSize(2)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult(findOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql(['initial-1', 'initial-2'].sort())
        })

        it('children:<BulkCreate.OpResult>', async function() {
          const address1 = `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}`
          const address2 = `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}`

          const objects = [
            new Address({ address: address1 }),
            new Address({ address: address2 }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

      })
    })

    describe('4 arguments;', function() {
      let personName
      let address1
      let address2
      let savedPerson
      let savedAddress1
      let savedAddress2

      beforeEach(async function() {
        personName = `parent:3 arguments-${Utils.uid()}`
        address1 = `children:1:${personName}`
        address2 = `children:2:${personName}`

        savedPerson = await personsStore.save({ name: personName })
        savedAddress1 = await addressesStore.save({ address: address1 })
        savedAddress2 = await addressesStore.save({ address: address2 })
      })

      describe('parent:<ObjectId>', function() {
        async function checkResult(children) {
          const setRelationOp = uow.addToRelation(PERSONS_TABLE_NAME, savedPerson.objectId, ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.add_relationPerson1.operationType).to.equal('ADD_RELATION')
          expect(uowResult.results.add_relationPerson1.result).to.equal(2)

          expect(setRelationOp.result).to.equal(2)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personName}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(savedPerson.objectId)
          expect(persons[0][ADDRESSES_COLUMN]).to.be.a('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(2)

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`address = '${address1}' OR address = '${address2}'`)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedAddress1.objectId, savedAddress2.objectId])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Class>', async function() {
          expect(savedAddress1 instanceof Address).to.equal(true)
          expect(savedAddress2 instanceof Address).to.equal(true)

          const person = await checkResult([savedAddress1, savedAddress2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([
            { objectId: savedAddress1.objectId },
            { objectId: savedAddress2.objectId },
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Create.OpResult>', async function() {
          const address1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const address2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const createAddressOperation1 = uow.create(ADDRESSES_TABLE_NAME, { address: address1 })
          const createAddressOperation2 = uow.create(ADDRESSES_TABLE_NAME, { address: address2 })

          const person = await checkResult([createAddressOperation1, createAddressOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const newAddress2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress2.objectId,
            address : newAddress2
          })

          const person = await checkResult([updateOperation1, updateOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([newAddress1, newAddress2].sort())
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult([
            findOperation.resolveTo(1),
            findOperation.resolveTo(3)
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql(['initial-2', 'initial-4'].sort())
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Address({ address: `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:3:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:4:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:5:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([
            bulkCreateOperation.resolveTo(1),
            bulkCreateOperation.resolveTo(3),
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql([objects[1].address, objects[3].address].sort())
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')
            .setPageSize(2)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult(findOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql(['initial-1', 'initial-2'].sort())
        })

        it('children:<BulkCreate.OpResult>', async function() {
          const address1 = `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}`
          const address2 = `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}`

          const objects = [
            new Address({ address: address1 }),
            new Address({ address: address2 }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

      })

      describe('parent:<Class>', function() {

        async function checkResult(children) {
          expect(savedPerson instanceof Person).to.equal(true)

          const setRelationOp = uow.addToRelation(PERSONS_TABLE_NAME, savedPerson, ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.add_relationPerson1.operationType).to.equal('ADD_RELATION')
          expect(uowResult.results.add_relationPerson1.result).to.equal(2)

          expect(setRelationOp.result).to.equal(2)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personName}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(savedPerson.objectId)
          expect(persons[0][ADDRESSES_COLUMN]).to.be.a('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(2)

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`address = '${address1}' OR address = '${address2}'`)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedAddress1.objectId, savedAddress2.objectId])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Class>', async function() {
          expect(savedAddress1 instanceof Address).to.equal(true)
          expect(savedAddress2 instanceof Address).to.equal(true)

          const person = await checkResult([savedAddress1, savedAddress2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([
            { objectId: savedAddress1.objectId },
            { objectId: savedAddress2.objectId },
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Create.OpResult>', async function() {
          const address1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const address2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const createAddressOperation1 = uow.create(ADDRESSES_TABLE_NAME, { address: address1 })
          const createAddressOperation2 = uow.create(ADDRESSES_TABLE_NAME, { address: address2 })

          const person = await checkResult([createAddressOperation1, createAddressOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const newAddress2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress2.objectId,
            address : newAddress2
          })

          const person = await checkResult([updateOperation1, updateOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([newAddress1, newAddress2].sort())
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult([
            findOperation.resolveTo(1),
            findOperation.resolveTo(3)
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql(['initial-2', 'initial-4'].sort())
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Address({ address: `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:3:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:4:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:5:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([
            bulkCreateOperation.resolveTo(1),
            bulkCreateOperation.resolveTo(3),
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql([objects[1].address, objects[3].address].sort())
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')
            .setPageSize(2)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult(findOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql(['initial-1', 'initial-2'].sort())
        })

        it('children:<BulkCreate.OpResult>', async function() {
          const address1 = `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}`
          const address2 = `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}`

          const objects = [
            new Address({ address: address1 }),
            new Address({ address: address2 }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

      })

      describe('parent:<HashMap>', function() {

        async function checkResult(children) {
          const setRelationOp = uow.addToRelation(PERSONS_TABLE_NAME, { objectId: savedPerson.objectId }, ADDRESSES_COLUMN, children)

          const uowResult = await uow.execute()

          expect(uowResult.error).to.equal(null)
          expect(uowResult.success).to.equal(true)

          expect(uowResult.results.add_relationPerson1.operationType).to.equal('ADD_RELATION')
          expect(uowResult.results.add_relationPerson1.result).to.equal(2)

          expect(setRelationOp.result).to.equal(2)

          const query = Backendless.Data.QueryBuilder
            .create()
            .setWhereClause(`name = '${personName}'`)
            .setRelated(ADDRESSES_COLUMN)

          const persons = await personsStore.find(query)

          expect(persons).to.have.length(1)

          expect(persons[0].objectId).to.equal(savedPerson.objectId)
          expect(persons[0][ADDRESSES_COLUMN]).to.be.a('array')
          expect(persons[0][ADDRESSES_COLUMN]).to.have.length(2)

          return persons[0]
        }

        it('children:String ', async function() {
          const person = await checkResult(`address = '${address1}' OR address = '${address2}'`)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<String>', async function() {
          const person = await checkResult([savedAddress1.objectId, savedAddress2.objectId])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Class>', async function() {
          expect(savedAddress1 instanceof Address).to.equal(true)
          expect(savedAddress2 instanceof Address).to.equal(true)

          const person = await checkResult([savedAddress1, savedAddress2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<HashMap>', async function() {
          const person = await checkResult([
            { objectId: savedAddress1.objectId },
            { objectId: savedAddress2.objectId },
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Create.OpResult>', async function() {
          const address1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const address2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const createAddressOperation1 = uow.create(ADDRESSES_TABLE_NAME, { address: address1 })
          const createAddressOperation2 = uow.create(ADDRESSES_TABLE_NAME, { address: address2 })

          const person = await checkResult([createAddressOperation1, createAddressOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

        it('children:List<Update.OpResult>', async function() {
          const newAddress1 = `children:1:List<Create.OpResult>-${Utils.uid()}`
          const newAddress2 = `children:2:List<Create.OpResult>-${Utils.uid()}`

          const updateOperation1 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress1.objectId,
            address : newAddress1
          })

          const updateOperation2 = uow.update(ADDRESSES_TABLE_NAME, {
            objectId: savedAddress2.objectId,
            address : newAddress2
          })

          const person = await checkResult([updateOperation1, updateOperation2])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([newAddress1, newAddress2].sort())
        })

        it('children:List<Find.OpResultValue>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult([
            findOperation.resolveTo(1),
            findOperation.resolveTo(3)
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql(['initial-2', 'initial-4'].sort())
        })

        it('children:List<BulkCreate.OpResultValue>', async function() {
          const objects = [
            new Address({ address: `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:3:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:4:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
            new Address({ address: `children:5:List<BulkCreate.OpResultValue>-${Utils.uid()}` }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult([
            bulkCreateOperation.resolveTo(1),
            bulkCreateOperation.resolveTo(3),
          ])

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql([objects[1].address, objects[3].address].sort())
        })

        it('children:<Find.OpResult>', async function() {
          const query = Backendless.Data.QueryBuilder.create()
            .setWhereClause('address like \'initial-%\'')
            .setSortBy('address asc')
            .setPageSize(2)

          const findOperation = uow.find(ADDRESSES_TABLE_NAME, query)

          const person = await checkResult(findOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort())
            .to.eql(['initial-1', 'initial-2'].sort())
        })

        it('children:<BulkCreate.OpResult>', async function() {
          const address1 = `children:1:List<BulkCreate.OpResultValue>-${Utils.uid()}`
          const address2 = `children:2:List<BulkCreate.OpResultValue>-${Utils.uid()}`

          const objects = [
            new Address({ address: address1 }),
            new Address({ address: address2 }),
          ]

          const bulkCreateOperation = uow.bulkCreate(objects)

          const person = await checkResult(bulkCreateOperation)

          expect(person[ADDRESSES_COLUMN].map(o => o.address).sort()).to.eql([address1, address2].sort())
        })

      })
    })
  })

  describe('Fails', function() {

  })
})
