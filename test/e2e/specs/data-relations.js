import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Data - Relations', function() {
  let consoleApi
  let appId

  let parent
  let child
  let grandchild
  let ParentTable
  let ChildTable

  sandbox.forTest()

  const save = name => Backendless.Data.of(name).save({})
  const queryWithRelationDepth = depth => Backendless.DataQueryBuilder.create().setRelationsDepth(depth).build()

  const createRelationColumn = (tableName, columnName, toTableName, relationshipType) => {
    return consoleApi.tables.createColumn(appId, { name: tableName }, {
      dataType: 'DATA_REF',
      name    : columnName,
      toTableName,
      relationshipType
    })
  }

  beforeEach(function() {
    consoleApi = this.consoleApi
    appId = this.app.id

    ParentTable = Backendless.Data.of('Parent')
    ChildTable = Backendless.Data.of('Child')

    return Promise.resolve()
      .then(() => save('Parent').then(result => parent = result))
      .then(() => save('Child').then(result => child = result))
      .then(() => save('GrandChild').then(result => grandchild = result))
      .then(() => createRelationColumn('Parent', 'child', 'Child', 'ONE_TO_ONE'))
      .then(() => createRelationColumn('Child', 'grandChild', 'GrandChild', 'ONE_TO_ONE'))
      .then(() => ParentTable.addRelation(parent.objectId, 'child', [child]))
      .then(() => ChildTable.addRelation(child.objectId, 'grandChild', [grandchild]))
  })

  it('Find with relations depth 0', function() {
    const query = queryWithRelationDepth(0)

    return Promise.resolve()
      .then(() => ParentTable.findById(parent.objectId, query))
      .then(result => {
        expect(result).to.have.property('child').that.have.to.be.null
      })
  })

  it('Find with relations depth 1', function() {
    const query = queryWithRelationDepth(1)

    return Promise.resolve()
      .then(() => ParentTable.findById(parent.objectId, query))
      .then(result => {
        expect(result).to.have.property('child').that.have.to.be.not.null
        expect(result.child).to.have.property('grandChild').that.have.to.be.null
      })
  })

  it('Find with relations depth 2', function() {
    const query = queryWithRelationDepth(2)

    return Promise.resolve()
      .then(() => ParentTable.findById(parent.objectId, query))
      .then(result => {
        expect(result).to.have.property('child').that.have.to.be.not.null
        expect(result.child).to.have.property('grandChild').that.have.to.be.not.null
      })
  })

  it('Set relations', function() {
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

    return Promise.all([
      contactStore.save(joeThePlumber),
      addressStore.save(address)
    ])
      .then(([savedContact, savedAddress]) => {
        return createRelationColumn('Contact', 'address_Address', 'Address', 'ONE_TO_ONE')
          .then(() => contactStore.setRelation(savedContact, 'address_Address', [savedAddress]))
      })
      .then(result => {
        console.log(result)
      })
  })

})