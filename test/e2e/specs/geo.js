import '../helpers/global'
import sandbox from '../helpers/sandbox'
import Backendless from '../../../libs/backendless'

describe('Backendless.Geo', function() {

  describe('categories', function() {
    sandbox.forSuite({})

    it('add/remove category', function() {
      return Backendless.Geo.addCategory('Foo').then(category => {
        expect(category).to.have.property('name', 'Foo')
        expect(category).to.have.property('objectId')
      })
    })

    it('add category twice', function() {
      let firstCreationResult
      let secondCreationResult

      return Promise.resolve()
        .then(() => Backendless.Geo.addCategory('ToBeCreatedTwice'))
        .then(category => firstCreationResult = category)
        .then(() => Backendless.Geo.addCategory('ToBeCreatedTwice'))
        .then(category => secondCreationResult = category)
        .then(() => {
          expect(firstCreationResult).to.deep.eql(secondCreationResult)
        })
    })

    it('add/delete category without name', function() {
      return Promise.resolve()
        .then(() => expect(Backendless.Geo.addCategory()).to.eventually.be.rejected)
        .then(() => expect(Backendless.Geo.addCategory(null)).to.eventually.be.rejected)
        .then(() => expect(Backendless.Geo.addCategory('')).to.eventually.be.rejected)
        .then(() => expect(Backendless.Geo.deleteCategory()).to.eventually.be.rejected)
        .then(() => expect(Backendless.Geo.deleteCategory(null)).to.eventually.be.rejected)
        .then(() => expect(Backendless.Geo.deleteCategory('')).to.eventually.be.rejected)
    })

    it('add/delete default category', function() {
      return Promise.resolve()
        .then(() => expect(Backendless.Geo.addCategory('default')).to.eventually.be.rejected)
        .then(() => expect(Backendless.Geo.deleteCategory('default')).to.eventually.be.rejected)
    })

    it('remove non existing category', function() {
      return expect(Backendless.Geo.deleteCategory('unexisting')).to.eventually.be.rejected
    })

    it('retrieving a list of categories', function() {
      const addCategory = name => this.consoleApi.geo.addCategory(this.app.id, name)
      const deleteCategory = category => this.consoleApi.geo.deleteCategory(this.app.id, category.name)
      const deleteAllCategories = () => this.consoleApi.geo.getCategories(this.app.id)
        .then(categories => Promise.all(categories.map(deleteCategory)))

      const testCategories = ['One', 'Two', 'Three'].sort()

      return deleteAllCategories()
        .then(() => Promise.all(testCategories.map(addCategory)))
        .then(() => Backendless.Geo.getCategories())
        .then(categories => expect(categories.map(category => category.name)).to.eql(testCategories))
    })
  })

  describe('points', function() {
    sandbox.forSuite({})

    describe('add', function() {
      it('simple valid')
      it('with collection')
      it('with invalid coordinates')
      it('with empty/null category')
      it('to multiple categories')
      it('with invalid metadata')
      it('add points with null key in meta')
      it('add points with cyclic related point')
      it('add points with cyclic related object')
    })

    describe('remove', function() {

    })

    describe('find', function() {
      it('simple')
      it('with 100% metadata threshod coincidence')
      it('by radius')
      it('by rectangle')
      it('by metadata')
      it('by category')
      it('with metadata included')
      it('with metadata excluded')
      it('by non existing related object property')

      describe('clusters', function() {
        it('simple')
        it('by radius')
        it('by rectangle')
        it('by metadata')
        it('by category')
        it('with metadata included')
        it('with metadata excluded')
        it('by non existing related object property')
      })
    })
  })

  describe('fences', function() {
    sandbox.forSuite({})

    it('find fence points')
    it('run actions')
  })

})