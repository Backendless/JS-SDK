import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

const createPoint = (metadata, categories = [], lat, lon) => ({
  metadata,
  categories,
  latitude : lat != null ? lat : Math.random() * 80,
  longitude: lon != null ? lon : Math.random() * 170
})

describe('Backendless.Geo', function() {

  sandbox.forSuite()

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

        return Backendless.Geo.savePoint(point).then(serverPoint => {
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
        return expect(Backendless.Geo.savePoint({}))
          .to.be.eventually.rejected
      })

      it('with invalid coordinates', function() {
        return expect(Backendless.Geo.savePoint({ latitude: 100, longitude: 100 }))
          .to.be.eventually.rejected
      })

      it('with category', function() {
        const point = createPoint(null, ['Custom'])

        return Backendless.Geo.savePoint(point).then(serverPoint => {
          expect(serverPoint).to.have.property('categories')
            .and.eql(['Custom'])
        })
      })

      it('with multiple categories', function() {
        const point = createPoint(null, ['Foo', 'Bar'])

        return Backendless.Geo.savePoint(point).then(serverPoint => {
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

        return Backendless.Geo.savePoint(point).then(serverPoint => {
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

        return Backendless.Geo.savePoint(point).then(serverPoint => {
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

        return Backendless.Geo.savePoint(point).then(serverPoint => {
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

      it('with 100% metadata threshold coincidence')

      it('by radius', function() {
        const metersPerDegree = 111319.9
        const degreesToMeters = degrees => degrees * metersPerDegree

        const findByRadius = (radius, units, latitude, longitude) =>
          Backendless.Geo.find({ radius, latitude, longitude, units })

        return Promise.resolve()
          .then(() => Backendless.Geo.savePoint(createPoint(null, null, 0, 0)))
          .then(() => Backendless.Geo.savePoint(createPoint(null, null, 1, 0)))
          .then(() => Backendless.Geo.savePoint(createPoint(null, null, 2, 0)))
          .then(() => Backendless.Geo.savePoint(createPoint(null, null, 3, 0)))

          .then(() => expect(findByRadius(degreesToMeters(1), 'METERS', 0, 0)).to.eventually.have.length(2))
          .then(() => expect(findByRadius(degreesToMeters(3), 'METERS', 0, 0)).to.eventually.have.length(4))
          .then(() => expect(findByRadius(degreesToMeters(2), 'METERS', 2, 0)).to.eventually.have.length(4))
          .then(() => expect(findByRadius(degreesToMeters(2), 'METERS', 3, 0)).to.eventually.have.length(3))
      })

      it('by rectangle', function() {
        const findByRectangle = searchRectangle => Backendless.Geo.find({ searchRectangle })

        return Promise.resolve()
          .then(() => Backendless.Geo.savePoint(createPoint(null, null, 0, 0)))
          .then(() => Backendless.Geo.savePoint(createPoint(null, null, 1, 1)))
          .then(() => Backendless.Geo.savePoint(createPoint(null, null, 2, 2)))
          .then(() => Backendless.Geo.savePoint(createPoint(null, null, 3, 3)))

          .then(() => expect(findByRectangle([1, 0, 0, 1])).to.eventually.have.length(2))
          .then(() => expect(findByRectangle([2, 0, 0, 2])).to.eventually.have.length(3))
          .then(() => expect(findByRectangle([3, 1, 0, 2])).to.eventually.have.length(2))
          .then(() => expect(findByRectangle([3, 0, 0, 3])).to.eventually.have.length(4))
      })

      it('by metadata', function() {
        return Promise.resolve()
          .then(() => Backendless.Geo.savePoint(createPoint({ city: 'Dallas' })))
          .then(() => Backendless.Geo.savePoint(createPoint({ city: 'Dallas' })))
          .then(() => Backendless.Geo.savePoint(createPoint({ city: 'Bongo' })))

          .then(() => expect(Backendless.Geo.find({ metadata: { city: 'Dallas' } }))
            .to.eventually.have.lengthOf(2))
          .then(() => expect(Backendless.Geo.find({ metadata: { city: 'Bongo' } }))
            .to.eventually.have.lengthOf(1))
      })

      it('by category', function() {
        return Promise.resolve()
          .then(() => Backendless.Geo.savePoint(createPoint(null, ['A'])))
          .then(() => Backendless.Geo.savePoint(createPoint(null, ['B'])))
          .then(() => Backendless.Geo.savePoint(createPoint(null, ['C', 'C', 'C'])))
          .then(() => Backendless.Geo.savePoint(createPoint(null, ['A', 'B'])))
          .then(() => Backendless.Geo.savePoint(createPoint(null, ['C', 'B'])))

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
          .then(() => Backendless.Geo.savePoint(createPoint({ city: 'Dallas' })))
          .then(() => Backendless.Geo.savePoint(createPoint({ city: 'Bongo' })))
          .then(() => Backendless.Geo.find({ includeMetadata: true }))
          .then(points => {
            expect(points[0].metadata).to.have.property('city')
            expect(points[1].metadata).to.have.property('city')
          })
      })

      it('with metadata excluded', function() {
        return Promise.resolve()
          .then(() => Backendless.Geo.savePoint(createPoint({ city: 'Dallas' })))
          .then(() => Backendless.Geo.savePoint(createPoint(({ city: 'Bongo' }))))
          .then(() => Backendless.Geo.find({ includeMetadata: false }))
          .then(points => {
            expect(points[0].metadata).to.be.undefined
            expect(points[1].metadata).to.be.undefined
          })
      })

      describe('clusters', function() {
        it('simple', function() {
          return Promise.resolve()
            .then(() => Backendless.Geo.savePoint(createPoint(null, null, 30, 10)))
            .then(() => Backendless.Geo.savePoint(createPoint(null, null, 30, 50)))
            .then(() => Backendless.Geo.savePoint(createPoint(null, null, 30, 55)))

            .then(() => Backendless.Geo.find({ degreePerPixel: 1, clusterGridSize: 20 }))
            .then(result => {
              expect(result).to.have.lengthOf(2)
              expect(result[0]).to.be.instanceOf(Backendless.GeoPoint)
              expect(result[0].longitude).to.equal(10)
              expect(result[1]).to.be.instanceOf(Backendless.GeoCluster)
              expect(result[1].totalPoints).to.equal(2)
              expect(result[1].longitude).to.equal(52.5)
            })

            .then(() => Backendless.Geo.find({ degreePerPixel: 1, clusterGridSize: 1 }))
            .then(result => {
              expect(result).to.have.lengthOf(3)
              expect(result[0]).to.be.instanceOf(Backendless.GeoPoint)
              expect(result[1]).to.be.instanceOf(Backendless.GeoPoint)
              expect(result[2]).to.be.instanceOf(Backendless.GeoPoint)
            })
        })

        it('by category', function() {
          const lat = 30, lon = 10
          let createPoints = Promise.resolve()

          const points = [...Array(10).keys()].map(i => {
            const category = i % 2 ? 'even' : 'odd'
            const point = createPoint(null, [category], lat, lon + i)

            createPoints = createPoints.then(() =>
              Backendless.Geo.savePoint(point))
          })

          const geoQuery = (categories, mapWidth, clusterGridSize) => {
            const query = new Backendless.GeoQuery()
            query.categories = categories
            query.setClusteringParams(lon, lon + points.length, mapWidth, clusterGridSize)

            return query
          }

          return createPoints
            .then(() => Backendless.Geo.find(geoQuery(['even'], 1000, 500)))
            .then(result => {
              expect(result).to.have.nested.property('[0].latitude', 30)
              expect(result).to.have.nested.property('[0].longitude', 12)
              expect(result).to.have.nested.property('[0].totalPoints', 2)
              expect(result).to.have.nested.property('[0].categories.length', 1)
              expect(result).to.have.nested.property('[0].categories[0]', 'even')
              expect(result).to.have.nested.property('[1].latitude', 30)
              expect(result).to.have.nested.property('[1].longitude', 17)
              expect(result).to.have.nested.property('[1].totalPoints', 3)
              expect(result).to.have.nested.property('[1].categories.length', 1)
              expect(result).to.have.nested.property('[1].categories[0]', 'even')
            })
            .then(() => Backendless.Geo.find(geoQuery(['even', 'odd'], 100, 100)))
            .then(result => {
              expect(result).to.have.nested.property('[0].latitude', 30)
              expect(result).to.have.nested.property('[0].longitude', 14.5)
              expect(result).to.have.nested.property('[0].totalPoints', 10)
              expect(result).to.have.nested.property('[0].categories.length', 2)
              expect(result).to.have.nested.property('[0].categories[0]', 'even')
              expect(result).to.have.nested.property('[0].categories[1]', 'odd')
            })
        })

        it('with metadata included', function() {
          const query = {
            degreePerPixel : 1,
            clusterGridSize: 180,
            includeMetadata: true
          }

          return Promise.resolve()
            .then(() => Backendless.Geo.savePoint(createPoint({ city: 'Dallas' })))
            .then(() => Backendless.Geo.savePoint(createPoint({ city: 'Dallas' })))
            .then(() => Backendless.Geo.savePoint(createPoint({ city: 'Bongo', country: 'Dongo' })))

            .then(() => Backendless.Geo.find(query))
            .then(result => {
              expect(result).to.have.lengthOf(1)
              expect(result[0].totalPoints).to.equal(3)
              expect(result[0].metadata.country).to.equal('Dongo')
              expect(result[0].metadata.city).to.have.members(['Dallas', 'Bongo'])
            })
        })

        it('with metadata excluded', function() {
          const query = {
            degreePerPixel : 1,
            clusterGridSize: 180,
            includeMetadata: false
          }

          return Promise.resolve()
            .then(() => Backendless.Geo.savePoint(createPoint({ city: 'Dallas' })))
            .then(() => Backendless.Geo.savePoint(createPoint({ city: 'Dallas' })))
            .then(() => Backendless.Geo.savePoint(createPoint({ city: 'Bongo', country: 'Dongo' })))

            .then(() => Backendless.Geo.find(query))
            .then(result => {
              expect(result).to.have.lengthOf(1)
              expect(result[0].totalPoints).to.equal(3)
              expect(result[0].metadata).to.be.undefined
            })
        })
      })
    })
  })

  describe('fences', function() {
    let fence

    beforeEach(function() {
      fence = {
        name        : 'colorado',
        qualCriteria: '',
        type        : 'RECT',
        nodes       : [
          { latitude: 40.979898069620134, longitude: -109.072265625 },
          { latitude: 37.02009820136811, longitude: -101.953125 }
        ]
      }

      const fenceAction = {
        type     : 'EVENT',
        eventname: 'colorado'
      }

      return Promise.resolve()
        .then(() => this.consoleApi.geo.addPoint(this.app.id, 20, 20))  //out of fence
        .then(() => this.consoleApi.geo.addPoint(this.app.id, 39, -108)) //in fence
        .then(() => this.consoleApi.geo.addPoint(this.app.id, 38, -105)) //in fence
        .then(() => this.consoleApi.geo.saveFence(this.app.id, fence).then(f => fence = f))
        .then(() => this.consoleApi.geo.saveFenceAction(this.app.id, fence.objectId, 'onenter', fenceAction))
        .then(() => this.consoleApi.geo.activateFence(this.app.id, fence.objectId))
    })

    afterEach(function() {
      return this.consoleApi.geo.deleteFence(this.app.id, fence.objectId)
    })

    it('find fence points', function() {
      return Backendless.Geo.getFencePoints(fence.name, {}).then(result => {
        expect(result).to.have.lengthOf(2)
      })
    })

    it('run actions', function() {
      const point = new Backendless.GeoPoint({ latitude: 39, longitude: -105 })

      return Promise.resolve()
        .then(() => expect(Backendless.Geo.runOnEnterAction('colorado', point))
          .to.eventually.be.fulfilled)
        .then(() => expect(Backendless.Geo.runOnStayAction('colorado', point))
          .to.eventually.be.rejected
          .and.eventually.have.property('code', 4063))
        .then(() => expect(Backendless.Geo.runOnExitAction('colorado', point))
          .to.eventually.be.rejected
          .and.eventually.have.property('code', 4063))
        .then(() => expect(Backendless.Geo.runOnExitAction('colorado2', point))
          .to.eventually.be.rejected
          .and.eventually.have.property('code', 4061))
    })
  })

})