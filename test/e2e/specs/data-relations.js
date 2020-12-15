import sandbox, { Utils } from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Data - Relations', function() {

  let parentTableStore
  let childTableStore
  let grandChildTableStore

  let testCaseMarker
  let savedParent

  sandbox.forSuite()

  const PARENT_TABLE_NAME = 'Parent'
  const CHILD_TABLE_NAME = 'Child'
  const GRAND_CHILD_TABLE_NAME = 'GrandChild'

  before(async function() {
    parentTableStore = Backendless.Data.of(PARENT_TABLE_NAME)
    childTableStore = Backendless.Data.of(CHILD_TABLE_NAME)
    grandChildTableStore = Backendless.Data.of(GRAND_CHILD_TABLE_NAME)

    await this.tablesAPI.createTable(PARENT_TABLE_NAME)
    await this.tablesAPI.createTable(CHILD_TABLE_NAME)
    await this.tablesAPI.createTable(GRAND_CHILD_TABLE_NAME)

    await this.tablesAPI.createColumn(PARENT_TABLE_NAME, 'name', this.tablesAPI.DataTypes.STRING)
    await this.tablesAPI.createColumn(CHILD_TABLE_NAME, 'name', this.tablesAPI.DataTypes.STRING)
    await this.tablesAPI.createColumn(GRAND_CHILD_TABLE_NAME, 'name', this.tablesAPI.DataTypes.STRING)

    await this.tablesAPI.createRelationColumn(PARENT_TABLE_NAME, 'child', CHILD_TABLE_NAME, this.tablesAPI.RelationTypes.ONE_TO_ONE)
    await this.tablesAPI.createRelationColumn(PARENT_TABLE_NAME, 'children', CHILD_TABLE_NAME, this.tablesAPI.RelationTypes.ONE_TO_MANY)
    await this.tablesAPI.createRelationColumn(CHILD_TABLE_NAME, 'grandChild', GRAND_CHILD_TABLE_NAME, this.tablesAPI.RelationTypes.ONE_TO_ONE)
  })

  beforeEach(async function() {
    testCaseMarker = Utils.uidShort()

    await parentTableStore.bulkDelete('name like \'test-%\'')

    savedParent = await parentTableStore.save({ name: `test-${testCaseMarker}` })
  })

  describe('Load with Relation Depth', function() {
    const queryWithRelationDepth = depth => {
      return Backendless.DataQueryBuilder.create()
        .setRelationsDepth(depth)
    }

    let savedChild
    let savedGrandChild

    beforeEach(async function() {
      const result = await Promise.all([
        childTableStore.save({ name: `load-rel-depth-${testCaseMarker}` }),
        grandChildTableStore.save({ name: `load-rel-depth-${testCaseMarker}` }),
      ])

      savedChild = result[0]
      savedGrandChild = result[1]

      await Promise.all([
        parentTableStore.addRelation(savedParent, 'child', [savedChild]),
        childTableStore.addRelation(savedChild, 'grandChild', [savedGrandChild]),
      ])
    })

    it('Find with relations depth 0', function() {
      const query = queryWithRelationDepth(0)

      return Promise.resolve()
        .then(() => parentTableStore.findById(savedParent.objectId, query))
        .then(result => {
          expect(result).to.not.have.property('child')
        })
    })

    it('Find with relations depth 1', function() {
      const query = queryWithRelationDepth(1)

      return Promise.resolve()
        .then(() => parentTableStore.findById(savedParent.objectId, query))
        .then(result => {
          expect(result).to.have.property('child').that.have.to.be.not.null
          expect(result.child).to.not.have.property('grandChild')
        })
    })

    it('Find with relations depth 2', function() {
      const query = queryWithRelationDepth(2)

      return Promise.resolve()
        .then(() => parentTableStore.findById(savedParent.objectId, query))
        .then(result => {
          expect(result).to.have.property('child').that.have.to.be.not.null
          expect(result.child).to.have.property('grandChild').that.have.to.be.not.null
        })
    })
  })

  it('Set relations', async function() {
    const joeThePlumber = {
      name    : 'Joe',
      age     : 27,
      phone   : '1-972-5551212',
      title   : 'Plumber',
      ___class: 'Contact'
    }

    const address = {
      street  : '123 Main St.',
      city    : 'Denver',
      state   : 'Colorado',
      ___class: 'Address'
    }

    const contactStore = Backendless.Data.of('Contact')
    const addressStore = Backendless.Data.of('Address')

    const [savedContact, savedAddress] = await Promise.all([
      contactStore.save(joeThePlumber),
      addressStore.save(address)
    ])

    await this.tablesAPI.createRelationColumn('Contact', 'address_Address', 'Address', this.tablesAPI.RelationTypes.ONE_TO_ONE)

    await contactStore.setRelation(savedContact, 'address_Address', [savedAddress])
  })

  describe('Load ONE_TO_MANY', async function() {

    beforeEach(async function() {
      const children = []

      for (let i = 0; i < 20; i++) {
        children.push({ name: `load-one-to-many-${testCaseMarker}-${i}` })
      }

      const savedChildrenIds = await childTableStore.bulkCreate(children)

      await parentTableStore.addRelation(savedParent, 'children', savedChildrenIds)
    })

    it('Find with default relations size', function() {
      const query = Backendless.DataQueryBuilder.create()
        .setRelationsDepth(1)

      return Promise.resolve()
        .then(() => parentTableStore.findById(savedParent.objectId, query))
        .then(result => {
          expect(result.children).to.be.an('array')
          expect(result.children.length).to.equal(10)
        })
    })

    it('Find when relations size is less than default', function() {
      const query = Backendless.DataQueryBuilder.create()
        .setRelationsDepth(1)
        .setRelationsPageSize(5)

      return Promise.resolve()
        .then(() => parentTableStore.findById(savedParent.objectId, query))
        .then(result => {
          expect(result.children).to.be.an('array')
          expect(result.children.length).to.equal(5)
        })
    })

    it('Find when relations size is more than default', function() {
      const query = Backendless.DataQueryBuilder.create()
        .setRelationsDepth(1)
        .setRelationsPageSize(20)

      return Promise.resolve()
        .then(() => parentTableStore.findById(savedParent.objectId, query))
        .then(result => {
          expect(result.children).to.be.an('array')
          expect(result.children.length).to.equal(20)
        })
    })

    it('Find the first object with relations size', function() {
      const query = Backendless.DataQueryBuilder.create()
        .setSortBy('created desc')
        .setRelationsDepth(1)
        .setRelationsPageSize(20)

      return Promise.resolve()
        .then(() => parentTableStore.findFirst(query))
        .then(result => {
          expect(result.children).to.be.an('array')
          expect(result.children.length).to.equal(20)
        })
    })

    it('Find the last object with relations size', function() {
      const query = Backendless.DataQueryBuilder.create()
        .setSortBy('created desc')
        .setRelationsDepth(1)
        .setRelationsPageSize(20)

      return Promise.resolve()
        .then(() => parentTableStore.findLast(query))
        .then(result => {
          expect(result.children).to.be.an('array')
          expect(result.children.length).to.equal(20)
        })
    })

    it('Find objects with relations size', function() {
      const query = Backendless.DataQueryBuilder.create()
        .setRelationsDepth(1)
        .setRelationsPageSize(20)

      return Promise.resolve()
        .then(() => parentTableStore.find(query))
        .then(result => {
          expect(result[0].children).to.be.an('array')
          expect(result[0].children.length).to.equal(20)
        })
    })
  })
})
