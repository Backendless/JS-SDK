import '../helpers/global'
import sandbox from '../helpers/sandbox'
import Backendless from '../../../libs/backendless'

const randomPoint = () => ({
  latitude : Math.random() * 80,
  longitude: Math.random() * 170
})

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

      const testCategories = ['One', 'Two', 'Three'].sort()

      return this.console.geo.reset()
        .then(() => Promise.all(testCategories.map(addCategory)))
        .then(() => Backendless.Geo.getCategories())
        .then(categories => expect(categories.map(category => category.name)).to.eql(testCategories))
    })
  })

  describe('points', function() {
    sandbox.forSuite({})

    describe('add', function() {
      it('valid', function() {
        const point = randomPoint()

        return Backendless.Geo.addPoint(point).then(serverPoint => {
          expect(serverPoint).to.be.instanceof(Backendless.GeoPoint)
          expect(serverPoint).to.have.property('objectId')
          expect(serverPoint).to.have.property('latitude', point.latitude)
          expect(serverPoint).to.have.property('longitude', point.longitude)
          expect(serverPoint).to.have.property('categories')
            .and.eql(['Default'])

          return expect(this.consoleApi.geo.getPoints(this.app.id))
            .to.eventually.have.length(1)
        })
      })

      it('without coordinates', function() {
        return expect(Backendless.Geo.addPoint({}))
          .to.be.eventually.rejected
      })

      it('with invalid coordinates', function() {
        return expect(Backendless.Geo.addPoint({ latitude: 100, longitude: 100 }))
          .to.be.eventually.rejected
      })

      it('with category', function() {
        const point = { ...randomPoint(), categories: ['Custom'] }

        return Backendless.Geo.addPoint(point).then(serverPoint => {
          expect(serverPoint).to.have.property('categories')
            .and.eql(['Custom'])
        })
      })

      it('with multiple categories', function() {
        const point = { ...randomPoint(), categories: ['Foo', 'Bar'] }

        return Backendless.Geo.addPoint(point).then(serverPoint => {
          expect(serverPoint).to.have.property('categories')
            .and.eql(['Bar', 'Foo'])
        })
      })

      it('with metadata', function() {
        const point = {
          ...randomPoint(),
          metadata: {
            name   : 'Starbucks',
            city   : 'Honolulu',
            parking: 'true',
            updated: `${new Date().getTime()}`
          }
        }

        return Backendless.Geo.addPoint(point).then(serverPoint => {
          expect(serverPoint).to.have.property('metadata')
            .and.deep.include(point.metadata)
        })
      })

      it('with related object', function() {
        function Customer(name) {
          this.___class = 'Customer'
          this.name = name
        }

        const testCustomer = new Customer('test')

        const point = {
          ...randomPoint(),
          metadata: {
            relation: testCustomer
          }
        }

        return Backendless.Geo.addPoint(point).then(serverPoint => {
          expect(serverPoint.metadata).to.have.property('relation')
            .and.deep.include(testCustomer)
        })
      })

      it('with related collection', function() {
        function Customer(name) {
          this.___class = 'Customer'
          this.name = name
        }

        const customerOne = new Customer('one')
        const customerTwo = new Customer('two')

        const point = {
          ...randomPoint(),
          metadata: {
            customers: [customerOne, customerTwo]
          }
        }

        return Backendless.Geo.addPoint(point).then(serverPoint => {
          expect(serverPoint.metadata).to.have.property('customers')
          expect(serverPoint.metadata.customers[0]).to.deep.include(customerOne)
          expect(serverPoint.metadata.customers[1]).to.deep.include(customerTwo)
        })
      })
    })

    it('remove', function() {
      const p = randomPoint()

      return this.consoleApi.geo.reset(this.app.id)
        .then(() => this.consoleApi.geo.addPoint(this.app.id, p.latitude, p.longitude))
        .then(point => Backendless.Geo.deletePoint(point))
        .then(() => this.consoleApi.geo.getPoints(this.app.id))
        .then(points => expect(points.data).to.be.empty)
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