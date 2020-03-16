import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Data - Properties', function() {
  let parentTableStore
  let childTableStore

  let queryBuilder

  sandbox.forSuite()

  const PARENT_TABLE_NAME = 'Parent'
  const CHILD_TABLE_NAME = 'Child'

  before(async function() {
    parentTableStore = Backendless.Data.of(PARENT_TABLE_NAME)
    childTableStore = Backendless.Data.of(CHILD_TABLE_NAME)

    const parent = await parentTableStore.save({ name: 'test', age: 35, blocked: false, })

    const child1 = await childTableStore.save({ name: 'child1', age: 10 })
    const child2 = await childTableStore.save({ name: 'child2', age: 20 })
    const child3 = await childTableStore.save({ name: 'child3', age: 30 })

    await this.tablesAPI.createRelationColumn(PARENT_TABLE_NAME, 'child', CHILD_TABLE_NAME, this.tablesAPI.RelationTypes.ONE_TO_ONE)
    await this.tablesAPI.createRelationColumn(PARENT_TABLE_NAME, 'children', CHILD_TABLE_NAME, this.tablesAPI.RelationTypes.ONE_TO_MANY)

    await parentTableStore.setRelation(parent, 'child', [child1])
    await parentTableStore.setRelation(parent, 'children', [child1, child2, child3])
  })

  after(async function() {
    await this.tablesAPI.removeTable(PARENT_TABLE_NAME)
    await this.tablesAPI.removeTable(CHILD_TABLE_NAME)
  })

  beforeEach(async function() {
    queryBuilder = Backendless.DataQueryBuilder.create()
  })

  it('load all properties by default', async () => {
    const result = await parentTableStore.find()

    expect(Object.keys(result[0]).sort())
      .to.eql(['___class', 'age', 'blocked', 'created', 'name', 'objectId', 'ownerId', 'updated'].sort())
  })

  it('objectId property must be presented always', async () => {
    queryBuilder
      .addProperty('blocked')

    const result = await parentTableStore.find(queryBuilder)

    expect(Object.keys(result[0]).sort())
      .to.eql(['___class', 'blocked', 'objectId'].sort())
  })

  it('load with a single properties', async () => {
    queryBuilder
      .addProperty('blocked')

    const result = await parentTableStore.find(queryBuilder)

    expect(Object.keys(result[0]).sort())
      .to.eql(['___class', 'blocked', 'objectId'].sort())
  })

  it('load with a few properties', async () => {
    queryBuilder
      .addProperties('age', 'name')
      .addProperty('blocked')

    const result = await parentTableStore.find(queryBuilder)

    expect(Object.keys(result[0]).sort())
      .to.eql(['___class', 'age', 'blocked', 'name', 'objectId'].sort())
  })

  it('reset specified properties', async () => {
    queryBuilder
      .addProperties('age', 'name')
      .addProperty('blocked')

    queryBuilder
      .setProperties('name')

    const result = await parentTableStore.find(queryBuilder)

    expect(Object.keys(result[0]).sort())
      .to.eql(['___class', 'name', 'objectId'].sort())
  })

  it('exclude one property', async () => {
    queryBuilder
      .excludeProperty('blocked')

    const result = await parentTableStore.find(queryBuilder)

    expect(Object.keys(result[0]).sort())
      .to.eql(['___class', 'age', 'created', 'name', 'objectId', 'ownerId', 'updated'].sort())
  })

  it('exclude several properties', async () => {
    queryBuilder
      .excludeProperties('blocked', 'name', 'age')

    const result = await parentTableStore.find(queryBuilder)

    expect(Object.keys(result[0]).sort())
      .to.eql(['___class', 'created', 'objectId', 'ownerId', 'updated'].sort())
  })

  it('exclude all properties', async () => {
    queryBuilder
      .excludeProperties(['age', 'blocked', 'created', 'name', 'ownerId', 'updated'])

    const result = await parentTableStore.find(queryBuilder)

    expect(Object.keys(result[0]).sort())
      .to.eql(['___class', 'objectId'].sort())
  })

  it('add AS properties', async () => {
    queryBuilder
      .addProperty('age as Age')
      .addProperty('blocked as Blocked')

    const result = await parentTableStore.find(queryBuilder)

    expect(Object.keys(result[0]).sort())
      .to.eql(['Age', 'Blocked', '___class', 'objectId'].sort())
  })

  it('add ALL properties to Find API', async () => {
    queryBuilder
      .addProperty('age as Age')
      .addProperty('blocked as Blocked')
      .addAllProperties()

    const result = await parentTableStore.find(queryBuilder)

    expect(Object.keys(result[0]).sort())
      .to.eql(['Age', 'Blocked', '___class', 'age', 'blocked', 'created', 'name', 'objectId', 'ownerId', 'updated'].sort())
  })

  it('add ALL properties to FindFirst API', async () => {
    queryBuilder
      .addProperty('age as Age')
      .addProperty('blocked as Blocked')
      .addAllProperties()

    const result = await parentTableStore.findFirst(queryBuilder)

    expect(Object.keys(result).sort())
      .to.eql(['Age', 'Blocked', '___class', 'age', 'blocked', 'created', 'name', 'objectId', 'ownerId', 'updated'].sort())
  })

  it('add ALL properties to FindLast API', async () => {
    queryBuilder
      .addProperty('age as Age')
      .addProperty('blocked as Blocked')
      .addAllProperties()

    const result = await parentTableStore.findLast(queryBuilder)

    expect(Object.keys(result).sort())
      .to.eql(['Age', 'Blocked', '___class', 'age', 'blocked', 'created', 'name', 'objectId', 'ownerId', 'updated'].sort())
  })

  describe('Relations', function() {
    it('loads properties in relations', async () => {
      queryBuilder
        .addRelated('child')
        .addRelated('children')
        .addProperties(['name', 'child.name', 'children.name'])

      const result = await parentTableStore.find(queryBuilder)

      expect(Object.keys(result[0]).sort())
        .to.eql(['___class', 'name', 'child', 'children', 'objectId'].sort())

      expect(Object.keys(result[0].child).sort())
        .to.eql(['___class', 'name', 'objectId'].sort())

      expect(Object.keys(result[0].children[0]).sort())
        .to.eql(['___class', 'name', 'objectId'].sort())
    })

    it('excludes properties in relations', async () => {
      queryBuilder
        .addRelated('child')
        .addRelated('children')
        .excludeProperties(['name', 'child.name', 'children.name'])

      const result = await parentTableStore.find(queryBuilder)

      expect(Object.keys(result[0]).sort())
        .to.eql(['___class', 'age', 'blocked', 'child', 'children', 'created', 'objectId', 'ownerId', 'updated'].sort())

      expect(Object.keys(result[0].child).sort())
        .to.eql(['___class', 'age', 'created', 'objectId', 'ownerId', 'updated'].sort())

      expect(Object.keys(result[0].children[0]).sort())
        .to.eql(['___class', 'age', 'created', 'objectId', 'ownerId', 'updated'].sort())
    })
  })

})
