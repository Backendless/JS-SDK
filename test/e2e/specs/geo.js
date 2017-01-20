import '../helpers/global'
import sandbox from '../helpers/sandbox'
import Backendless from '../../../libs/backendless'

const createPoint = (metadata, categories = [], lat, lon) => ({
  metadata,
  categories,
  latitude : lat != null ? lat : Math.random() * 80,
  longitude: lon != null ? lon : Math.random() * 170
})

describe('Backendless.Geo', function() {

  sandbox.forSuite({})

  beforeEach(function() {
    return this.consoleApi.geo.reset(this.app.id)
  })

  describe('categories', function() {
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

      return Promise.all(testCategories.map(addCategory))
        .then(() => Backendless.Geo.getCategories())
        .then(categories => expect(categories.map(category => category.name)).to.eql(testCategories))
    })
  })

  describe('points', function() {

    describe('add', function() {
      it('valid', function() {
        const point = createPoint()

        return Backendless.Geo.addPoint(point).then(serverPoint => {
          expect(serverPoint).to.be.instanceof(Backendless.GeoPoint)
          expect(serverPoint).to.have.property('objectId')
          expect(serverPoint).to.have.property('latitude', point.latitude)
          expect(serverPoint).to.have.property('longitude', point.longitude)
          expect(serverPoint).to.have.property('categories')
            .and.eql(['Default'])

          return this.consoleApi.geo.getPoints(this.app.id).then(result => {
            expect(result.data).to.have.lengthOf(1)
          })
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
        const point = createPoint(null, ['Custom'])

        return Backendless.Geo.addPoint(point).then(serverPoint => {
          expect(serverPoint).to.have.property('categories')
            .and.eql(['Custom'])
        })
      })

      it('with multiple categories', function() {
        const point = createPoint(null, ['Foo', 'Bar'])

        return Backendless.Geo.addPoint(point).then(serverPoint => {
          expect(serverPoint).to.have.property('categories')
            .and.eql(['Bar', 'Foo'])
        })
      })

      it('with metadata', function() {
        const point = createPoint({
          name   : 'Starbucks',
          city   : 'Honolulu',
          parking: 'true',
          updated: `${new Date().getTime()}`
        })

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

        const point = createPoint({ relation: testCustomer })

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

        const point = createPoint({
          customers: [customerOne, customerTwo]
        })

        return Backendless.Geo.addPoint(point).then(serverPoint => {
          expect(serverPoint.metadata).to.have.property('customers')
          expect(serverPoint.metadata.customers[0]).to.deep.include(customerOne)
          expect(serverPoint.metadata.customers[1]).to.deep.include(customerTwo)
        })
      })
    })

    it('remove', function() {
      const p = createPoint()

      return this.consoleApi.geo.addPoint(this.app.id, p.latitude, p.longitude)
        .then(point => Backendless.Geo.deletePoint(point))
        .then(() => this.consoleApi.geo.getPoints(this.app.id))
        .then(points => expect(points.data).to.be.empty)
    })

    describe('find', function() {
      it('simple', function() {
        const p = createPoint()

        return this.consoleApi.geo.addPoint(this.app.id, p.latitude, p.longitude)
          .then(() => Backendless.Geo.find({}))
          .then(points => expect(points).to.have.lengthOf(1))
      })

      it('with 100% metadata threshod coincidence')

      it('by radius', function() {
        const metersPerDegree = 111319.9
        const degreesToMeters = degrees => degrees * metersPerDegree

        const findByRadius = (radius, units, latitude, longitude) =>
          Backendless.Geo.find({ radius, latitude, longitude, units })

        return Promise.resolve()
          .then(() => Backendless.Geo.addPoint(createPoint(null, null, 0, 0)))
          .then(() => Backendless.Geo.addPoint(createPoint(null, null, 1, 0)))
          .then(() => Backendless.Geo.addPoint(createPoint(null, null, 2, 0)))
          .then(() => Backendless.Geo.addPoint(createPoint(null, null, 3, 0)))
          .then(() => expect(findByRadius(degreesToMeters(1), 'METERS', 0, 0)).to.eventually.have.length(2))
          .then(() => expect(findByRadius(degreesToMeters(3), 'METERS', 0, 0)).to.eventually.have.length(4))
          .then(() => expect(findByRadius(degreesToMeters(2), 'METERS', 2, 0)).to.eventually.have.length(4))
          .then(() => expect(findByRadius(degreesToMeters(2), 'METERS', 3, 0)).to.eventually.have.length(3))
      })

      it('by rectangle', function() {
        const findByRectangle = searchRectangle => Backendless.Geo.find({ searchRectangle })

        return Promise.resolve()
          .then(() => Backendless.Geo.addPoint(createPoint(null, null, 0, 0)))
          .then(() => Backendless.Geo.addPoint(createPoint(null, null, 1, 1)))
          .then(() => Backendless.Geo.addPoint(createPoint(null, null, 2, 2)))
          .then(() => Backendless.Geo.addPoint(createPoint(null, null, 3, 3)))
          .then(() => expect(findByRectangle([1, 0, 0, 1])).to.eventually.have.length(2))
          .then(() => expect(findByRectangle([2, 0, 0, 2])).to.eventually.have.length(3))
          .then(() => expect(findByRectangle([3, 1, 0, 2])).to.eventually.have.length(2))
          .then(() => expect(findByRectangle([3, 0, 0, 3])).to.eventually.have.length(4))
      })

      it('by metadata', function() {
        return Promise.resolve()
          .then(() => Backendless.Geo.addPoint(createPoint({ city: 'Dallas' })))
          .then(() => Backendless.Geo.addPoint(createPoint({ city: 'Dallas' })))
          .then(() => Backendless.Geo.addPoint(createPoint({ city: 'Bongo' })))
          .then(() => expect(Backendless.Geo.find({ metadata: { city: 'Dallas' } }))
            .to.eventually.have.lengthOf(2))
          .then(() => expect(Backendless.Geo.find({ metadata: { city: 'Bongo' } }))
            .to.eventually.have.lengthOf(1))
      })

      it('by category', function() {
        return Promise.resolve()
          .then(() => Backendless.Geo.addPoint(createPoint(null, ['A'])))
          .then(() => Backendless.Geo.addPoint(createPoint(null, ['B'])))
          .then(() => Backendless.Geo.addPoint(createPoint(null, ['C', 'C', 'C'])))
          .then(() => Backendless.Geo.addPoint(createPoint(null, ['A', 'B'])))
          .then(() => Backendless.Geo.addPoint(createPoint(null, ['C', 'B'])))
          .then(() => expect(Backendless.Geo.find({ categories: ['A'] }))
            .to.eventually.have.lengthOf(2))
          .then(() => expect(Backendless.Geo.find({ categories: ['B'] }))
            .to.eventually.have.lengthOf(3))
          .then(() => expect(Backendless.Geo.find({ categories: ['C'] }))
            .to.eventually.have.lengthOf(2))
          .then(() => expect(Backendless.Geo.find({ categories: ['A', 'C'] }))
            .to.eventually.have.lengthOf(4))
          .then(() => expect(Backendless.Geo.find({ categories: ['A', 'B'] }))
            .to.eventually.have.lengthOf(4))
      })

      it('with metadata included', function() {
        return Promise.resolve()
          .then(() => Backendless.Geo.addPoint(createPoint({ city: 'Dallas' })))
          .then(() => Backendless.Geo.addPoint(createPoint({ city: 'Bongo' })))
          .then(() => Backendless.Geo.find({ includeMetadata: true }))
          .then(points => {
            expect(points[0].metadata).to.have.property('city')
            expect(points[1].metadata).to.have.property('city')
          })
      })

      it('with metadata excluded', function() {
        return Promise.resolve()
          .then(() => Backendless.Geo.addPoint(createPoint({ city: 'Dallas' })))
          .then(() => Backendless.Geo.addPoint(createPoint(({ city: 'Bongo' }))))
          .then(() => Backendless.Geo.find({ includeMetadata: false }))
          .then(points => {
            expect(points[0].metadata).to.be.empty
            expect(points[1].metadata).to.be.empty
          })
      })

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

    it('find fence points')
    it('run actions')
  })

})