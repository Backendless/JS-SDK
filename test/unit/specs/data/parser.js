import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('<Data> Parser', function() {

  forTest(this)

  const tableName = 'TEST_TABLE'

  let dataStore
  let query

  beforeEach(() => {
    dataStore = Backendless.Data.of(tableName)

    query = Backendless.Data.QueryBuilder.create()
  })

  describe('Related Methods', () => {
    let spy_parseResponse
    let spy_parseRelationsResponse

    beforeEach(() => {
      spy_parseResponse = dataStore.parseResponse = chai.spy()
      spy_parseRelationsResponse = dataStore.parseRelationsResponse = chai.spy()
    })

    it('is called with response only', async () => {
      const check = async (index, fakeResult, processor) => {
        prepareMockRequest(fakeResult)

        await processor()

        expect(spy_parseResponse).on.nth(index).be.called.with.exactly(fakeResult)
      }

      const checkFindFirstLast = async (index, fakeResult, processor) => {
        prepareMockRequest([fakeResult])

        await processor()

        expect(spy_parseResponse).on.nth(index).be.called.with.exactly(fakeResult)
      }

      await check(1, { resultType: 'save' }, () => dataStore.save({}))
      await check(2, { resultType: 'find' }, () => dataStore.find())
      await check(3, { resultType: 'findById' }, () => dataStore.findById('test'))
      await checkFindFirstLast(4, { resultType: 'findFirst' }, () => dataStore.findFirst())
      await checkFindFirstLast(5, { resultType: 'findLast' }, () => dataStore.findLast())

      expect(spy_parseResponse).to.have.been.called.exactly(5)
    })

    it('is called without relation model', async () => {
      prepareMockRequest({ result: 'test-1' })

      await dataStore.loadRelations('parent-id', { relationName: 'rel-1' })

      expect(spy_parseRelationsResponse).on.nth(1).be.called.with.exactly({ result: 'test-1' }, undefined)

      expect(spy_parseRelationsResponse).to.have.been.called.exactly(1)
    })

    it('is called with relation model', async () => {
      class FooClass1 {
      }

      class FooClass2 {
      }

      prepareMockRequest({ result: 'test-1' })
      prepareMockRequest({ result: 'test-2' })

      await dataStore.loadRelations('parent-id', { relationName: 'rel-1', relationModel: FooClass1 })
      await dataStore.loadRelations('parent-id', { relationName: 'rel-2', relationModel: FooClass2 })

      expect(spy_parseRelationsResponse).on.nth(1).be.called.with.exactly({ result: 'test-1' }, FooClass1)
      expect(spy_parseRelationsResponse).on.nth(2).be.called.with.exactly({ result: 'test-2' }, FooClass2)

      expect(spy_parseRelationsResponse).to.have.been.called.exactly(2)
    })
  })

  describe('Data Relations', () => {
    class Parent {
    }

    class Child {
    }

    it('circular relations #1', async () => {
      Backendless.Data.mapTableToClass('Child', Child)

      const result1 = dataStore.parseResponse([
        {
          created : 1589141341078,
          updated : 1589141357683,
          objectId: '1CA70A3A-A3C4-B454-FF43-2A0595AD0200',
          ownerId : null,
          key     : '111',
          ___class: 'Child',
          children: [
            {
              created : 1589141335441,
              updated : 1589141359837,
              objectId: 'C573DC58-F893-C42F-FF7D-E66ED6AB8C00',
              ownerId : null,
              key     : '333',
              ___class: 'Child',
              children: [
                {
                  created : 1589141337125,
                  updated : 1589141358968,
                  objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
                  ownerId : null,
                  key     : '222',
                  ___class: 'Child',
                  children: [
                    { __originSubID: 'child-222-rel' }
                  ],
                  __subID : 'child-222-rel'
                },
                { __originSubID: 'child-333-rel' },
                { __originSubID: 'child-111-rel' }
              ],
              __subID : 'child-333-rel'
            },
            { __originSubID: 'child-222-rel' }
          ],
          __subID : 'child-111-rel'
        },
        {
          created : 1589141337125,
          updated : 1589141358968,
          objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
          ownerId : null,
          key     : '222',
          ___class: 'Child',
          children: [
            { __originSubID: 'child-222-rel' }
          ],
          __subID : 'child-222-rel'
        },
        {
          created : 1589141335441,
          updated : 1589141359837,
          objectId: 'C573DC58-F893-C42F-FF7D-E66ED6AB8C00',
          ownerId : null,
          key     : '333',
          ___class: 'Child',
          children: [
            {
              created : 1589141337125,
              updated : 1589141358968,
              objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
              ownerId : null,
              key     : '222',
              ___class: 'Child',
              children: [
                { __originSubID: 'child-222-rel' }
              ],
              __subID : 'child-222-rel'
            },
            { __originSubID: 'child-333-rel' },
            { __originSubID: 'child-111-rel' }
          ],
          __subID : 'child-333-rel'
        }
      ])

      const child1 = result1[0] // not rel
      const child2 = result1[1] // not rel
      const child3 = result1[2] // not rel

      expect(result1.map(o => o.key)).to.be.eql(['111', '222', '333'])

      expect(child1).to.be.instanceof(Child)
      expect(child2).to.be.instanceof(Child)
      expect(child3).to.be.instanceof(Child)

      expect(child1).to.deep.include({
        created : 1589141341078,
        updated : 1589141357683,
        objectId: '1CA70A3A-A3C4-B454-FF43-2A0595AD0200',
        ownerId : null,
        key     : '111',
        ___class: 'Child',
      })

      expect(child2).to.deep.include({
        created : 1589141337125,
        updated : 1589141358968,
        objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
        ownerId : null,
        key     : '222',
        ___class: 'Child',
      })

      expect(child3).to.deep.include({
        created : 1589141335441,
        updated : 1589141359837,
        objectId: 'C573DC58-F893-C42F-FF7D-E66ED6AB8C00',
        ownerId : null,
        key     : '333',
        ___class: 'Child',
      })

      expect(child1.children.map(o => o.key)).to.be.eql(['333', '222'])
      expect(child2.children.map(o => o.key)).to.be.eql(['222'])
      expect(child3.children.map(o => o.key)).to.be.eql(['222', '333', '111'])

      const subChild1_1 = child1.children[0] // 333 rel to child3
      const subChild1_2 = child1.children[1] // 222 rel to child2

      const subChild2_1 = child2.children[0] // 222 rel to child2

      const subChild3_1 = child3.children[0] // 222 rel to child2
      const subChild3_2 = child3.children[1] // 333 rel to child3
      const subChild3_3 = child3.children[2] // 111 rel to child1

      expect(subChild1_1).to.deep.include({
        created : 1589141335441,
        updated : 1589141359837,
        objectId: 'C573DC58-F893-C42F-FF7D-E66ED6AB8C00',
        ownerId : null,
        key     : '333',
        ___class: 'Child',
      })

      expect(subChild1_2).to.deep.include({
        created : 1589141337125,
        updated : 1589141358968,
        objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
        ownerId : null,
        key     : '222',
        ___class: 'Child',
      })

      expect(subChild2_1).to.deep.include({
        created : 1589141337125,
        updated : 1589141358968,
        objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
        ownerId : null,
        key     : '222',
        ___class: 'Child',
      })

      expect(subChild3_1).to.deep.include({
        created : 1589141337125,
        updated : 1589141358968,
        objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
        ownerId : null,
        key     : '222',
        ___class: 'Child',
      })

      expect(subChild3_2).to.deep.include({
        created : 1589141335441,
        updated : 1589141359837,
        objectId: 'C573DC58-F893-C42F-FF7D-E66ED6AB8C00',
        ownerId : null,
        key     : '333',
        ___class: 'Child',
      })

      expect(subChild3_3).to.deep.include({
        created : 1589141341078,
        updated : 1589141357683,
        objectId: '1CA70A3A-A3C4-B454-FF43-2A0595AD0200',
        ownerId : null,
        key     : '111',
        ___class: 'Child',
      })

      expect(subChild1_1).to.be.equal(child3)
      expect(subChild1_2).to.be.equal(child2)

      expect(subChild2_1).to.be.equal(child2)

      expect(subChild3_1).to.be.equal(child2)
      expect(subChild3_2).to.be.equal(child3)
      expect(subChild3_3).to.be.equal(child1)

      expect(subChild1_1.children.map(o => o.key)).to.be.eql(['222', '333', '111'])
      expect(subChild1_2.children.map(o => o.key)).to.be.eql(['222'])

      expect(subChild2_1.children.map(o => o.key)).to.be.eql(['222'])

      expect(subChild3_1.children.map(o => o.key)).to.be.eql(['222'])
      expect(subChild3_2.children.map(o => o.key)).to.be.eql(['222', '333', '111'])
      expect(subChild3_3.children.map(o => o.key)).to.be.eql(['333', '222'])

      const subChild1_1_1 = subChild1_1.children[0] // 222 rel to child2
      const subChild1_1_2 = subChild1_1.children[1] // 333 rel to child2
      const subChild1_1_3 = subChild1_1.children[2] // 111 rel to child2

      const subChild1_2_1 = subChild1_2.children[0] // 222 rel to child2

      const subChild2_1_1 = subChild2_1.children[0] // 222 rel to child2

      const subChild3_1_1 = subChild3_1.children[0] // 222 rel to child2

      const subChild3_2_1 = subChild3_2.children[0] // 222 rel to child2
      const subChild3_2_2 = subChild3_2.children[1] // 333 rel to child2
      const subChild3_2_3 = subChild3_2.children[2] // 111 rel to child2

      const subChild3_3_1 = subChild3_3.children[0] // 333 rel to child2
      const subChild3_3_2 = subChild3_3.children[1] // 222 rel to child2

      expect(subChild1_1_1).to.be.equal(child2)
      expect(subChild1_1_2).to.be.equal(child3)
      expect(subChild1_1_3).to.be.equal(child1)

      expect(subChild1_2_1).to.be.equal(child2)

      expect(subChild2_1_1).to.be.equal(child2)

      expect(subChild3_1_1).to.be.equal(child2)

      expect(subChild3_2_1).to.be.equal(child2)
      expect(subChild3_2_2).to.be.equal(child3)
      expect(subChild3_2_3).to.be.equal(child1)

      expect(subChild3_3_1).to.be.equal(child3)
      expect(subChild3_3_2).to.be.equal(child2)
    })

    it('circular relations #2', async () => {
      Backendless.Data.mapTableToClass('Child', Child)

      const result1 = dataStore.parseResponse([
        {
          created : 1589141341078,
          updated : 1589141357683,
          objectId: '1CA70A3A-A3C4-B454-FF43-2A0595AD0200',
          ownerId : null,
          key     : '111',
          ___class: 'Child',
          children: [
            { __originSubID: 'child-222-rel' }
          ],
        },
        {
          created : 1589141337125,
          updated : 1589141358968,
          objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
          ownerId : null,
          key     : '222',
          ___class: 'Child',
          __subID : 'child-222-rel',
          children: []
        },
      ])

      const child1 = result1[0] // not rel
      const child2 = result1[1] // not rel

      expect(result1.map(o => o.key)).to.be.eql(['111', '222'])

      expect(child1).to.be.instanceof(Child)
      expect(child2).to.be.instanceof(Child)

      expect(child1).to.deep.include({
        created : 1589141341078,
        updated : 1589141357683,
        objectId: '1CA70A3A-A3C4-B454-FF43-2A0595AD0200',
        ownerId : null,
        key     : '111',
        ___class: 'Child',
      })

      expect(child2).to.deep.include({
        created : 1589141337125,
        updated : 1589141358968,
        objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
        ownerId : null,
        key     : '222',
        ___class: 'Child',
      })

      expect(child1.children.map(o => o.key)).to.be.eql(['222'])
      expect(child2.children.map(o => o.key)).to.be.eql([])

      const subChild1_1 = child1.children[0] // 222 rel to child2

      expect(subChild1_1).to.deep.include({
        created : 1589141337125,
        updated : 1589141358968,
        objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
        ownerId : null,
        key     : '222',
        ___class: 'Child',
      })

      expect(subChild1_1).to.be.equal(child2)
    })

    it('circular relations #3', async () => {
      Backendless.Data.mapTableToClass('Child', Child)

      const result1 = dataStore.parseResponse([
        {
          created : 1589141341078,
          updated : 1589141357683,
          objectId: '1CA70A3A-A3C4-B454-FF43-2A0595AD0200',
          ownerId : null,
          key     : '111',
          ___class: 'Child',
          children: [
            {
              created : 1589141335441,
              updated : 1589141359837,
              objectId: 'C573DC58-F893-C42F-FF7D-E66ED6AB8C00',
              ownerId : null,
              key     : '333',
              ___class: 'Child',
              children: [
                { __originSubID: 'child-333-rel' },
              ],
              __subID : 'child-333-rel'
            },
            { __originSubID: '79785C66-CA2D-86E7-FF38-5BA5BB4DE900' }
          ],
        },
        {
          created : 1589141337125,
          updated : 1589141358968,
          objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
          ownerId : null,
          key     : '222',
          ___class: 'Child',
          __subID : '79785C66-CA2D-86E7-FF38-5BA5BB4DE900',
          children: []
        },
      ])

      const child1 = result1[0] // not rel
      const child2 = result1[1] // not rel

      expect(result1.map(o => o.key)).to.be.eql(['111', '222'])

      expect(child1).to.be.instanceof(Child)
      expect(child2).to.be.instanceof(Child)

      expect(child1).to.deep.include({
        created : 1589141341078,
        updated : 1589141357683,
        objectId: '1CA70A3A-A3C4-B454-FF43-2A0595AD0200',
        ownerId : null,
        key     : '111',
        ___class: 'Child',
      })

      expect(child2).to.deep.include({
        created : 1589141337125,
        updated : 1589141358968,
        objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
        ownerId : null,
        key     : '222',
        ___class: 'Child',
      })

      expect(child1.children.map(o => o.key)).to.be.eql(['333', '222'])
      expect(child2.children.map(o => o.key)).to.be.eql([])

      const subChild1_1 = child1.children[0] // 333 not rel
      const subChild1_2 = child1.children[1] // 222 rel to child2

      expect(subChild1_1).to.deep.include({
        created : 1589141335441,
        updated : 1589141359837,
        objectId: 'C573DC58-F893-C42F-FF7D-E66ED6AB8C00',
        ownerId : null,
        key     : '333',
        ___class: 'Child',
      })

      expect(subChild1_2).to.be.equal(child2)

      expect(subChild1_1.children.map(o => o.key)).to.be.eql(['333'])

      const subChild1_1_1 = child1.children[0] // 333 rel to subChild1_1

      expect(subChild1_1_1).to.be.equal(subChild1_1)
    })

    it('circular relations #4', async () => {
      Backendless.Data.mapTableToClass('Child', Child)

      const result1 = dataStore.parseResponse([
        {
          created : 1589141341078,
          updated : 1589141357683,
          objectId: '1CA70A3A-A3C4-B454-FF43-2A0595AD0200',
          ownerId : null,
          key     : '111',
          ___class: 'Child',
          children: [
            {
              created : 1589141335441,
              updated : 1589141359837,
              objectId: 'C573DC58-F893-C42F-FF7D-E66ED6AB8C00',
              ownerId : null,
              key     : '333',
              ___class: 'Child',
              children: [
                {
                  created : 1589141337125,
                  updated : 1589141358968,
                  objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
                  ownerId : null,
                  key     : '222',
                  ___class: 'Child',
                  children: [
                    { __originSubID: '79785C66-CA2D-86E7-FF38-5BA5BB4DE900' }
                  ],
                  __subID : '79785C66-CA2D-86E7-FF38-5BA5BB4DE900'
                },
                { __originSubID: 'child-333-rel' },
                { __originSubID: 'D6DF05BF-158E-FE0F-FFE0-F245B8652000' }
              ],
              __subID : 'child-333-rel'
            },
            { __originSubID: '79785C66-CA2D-86E7-FF38-5BA5BB4DE900' }
          ],
          __subID : 'D6DF05BF-158E-FE0F-FFE0-F245B8652000'
        },
        {
          created : 1589141337125,
          updated : 1589141358968,
          objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
          ownerId : null,
          key     : '222',
          ___class: 'Child',
          children: [
            { __originSubID: '79785C66-CA2D-86E7-FF38-5BA5BB4DE900' }
          ],
          __subID : '79785C66-CA2D-86E7-FF38-5BA5BB4DE900'
        },
        {
          created : 1589141335441,
          updated : 1589141359837,
          objectId: 'C573DC58-F893-C42F-FF7D-E66ED6AB8C00',
          ownerId : null,
          key     : '333',
          ___class: 'Child',
          children: [
            {
              created : 1589141337125,
              updated : 1589141358968,
              objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
              ownerId : null,
              key     : '222',
              ___class: 'Child',
              children: [
                { __originSubID: '79785C66-CA2D-86E7-FF38-5BA5BB4DE900' }
              ],
              __subID : '79785C66-CA2D-86E7-FF38-5BA5BB4DE900'
            },
            { __originSubID: 'child-333-rel' },
            { __originSubID: 'D6DF05BF-158E-FE0F-FFE0-F245B8652000' }
          ],
          __subID : 'child-333-rel'
        }
      ])

      const child1 = result1[0]
      const child2 = result1[1]
      const child3 = result1[2]

      expect(child1).to.be.instanceof(Child)
      expect(child2).to.be.instanceof(Child)
      expect(child3).to.be.instanceof(Child)

      const subChild1_1 = child1.children[0]
      const subChild1_2 = child1.children[1]
      const subChild2_1 = child2.children[0]
      const subChild3_1 = child3.children[0]
      const subChild3_2 = child3.children[1]
      const subChild3_3 = child3.children[2]

      expect(subChild1_1).to.be.instanceof(Child)
      expect(subChild1_2).to.be.instanceof(Child)
      expect(subChild2_1).to.be.instanceof(Child)
      expect(subChild3_1).to.be.instanceof(Child)
      expect(subChild3_2).to.be.instanceof(Child)
      expect(subChild3_3).to.be.instanceof(Child)

      const subChild1_1_1 = subChild1_1.children[0]
      const subChild1_1_2 = subChild1_1.children[1]
      const subChild1_1_3 = subChild1_1.children[2]
      const subChild1_2_1 = subChild1_2.children[0]
      const subChild2_1_1 = subChild2_1.children[0]
      const subChild3_1_1 = subChild3_1.children[0]
      const subChild3_2_1 = subChild3_2.children[0]
      const subChild3_2_2 = subChild3_2.children[1]
      const subChild3_2_3 = subChild3_2.children[2]
      const subChild3_3_1 = subChild3_3.children[0]
      const subChild3_3_2 = subChild3_3.children[1]

      expect(subChild1_1_1).to.be.instanceof(Child)
      expect(subChild1_1_2).to.be.instanceof(Child)
      expect(subChild1_1_3).to.be.instanceof(Child)
      expect(subChild1_2_1).to.be.instanceof(Child)
      expect(subChild2_1_1).to.be.instanceof(Child)
      expect(subChild3_1_1).to.be.instanceof(Child)
      expect(subChild3_2_1).to.be.instanceof(Child)
      expect(subChild3_2_2).to.be.instanceof(Child)
      expect(subChild3_2_3).to.be.instanceof(Child)
      expect(subChild3_3_1).to.be.instanceof(Child)
      expect(subChild3_3_2).to.be.instanceof(Child)
    })

    it('circular relations #5', async () => {
      Backendless.Data.mapTableToClass('Child', Child)
      Backendless.Data.mapTableToClass('Parent', Parent)

      const result1 = dataStore.parseResponse([
        {
          'created'   : 1589194994102,
          'updated'   : null,
          'objectId'  : '1848E936-D340-5609-FFAC-8C1B84E4D000',
          'ownerId'   : null,
          'key'       : 'p3',
          '___class'  : 'Parent',
          'children'  : [
            {
              '__originSubID': 'rel-to-c3'
            }
          ],
          'sub_parent': {
            'created'   : 1589194991530,
            'updated'   : null,
            'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
            'ownerId'   : null,
            'key'       : 'p2',
            '___class'  : 'Parent',
            'children'  : [
              {
                '__originSubID': 'rel-to-c2'
              }
            ],
            'sub_parent': {
              '__originSubID': 'rel-to-p2'
            },
            '__subID'   : 'rel-to-p2'
          }
        },
        {
          'created'   : 1589194991530,
          'updated'   : null,
          'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
          'ownerId'   : null,
          'key'       : 'p2',
          '___class'  : 'Parent',
          'children'  : [
            {
              '__originSubID': 'rel-to-c2'
            }
          ],
          'sub_parent': {
            '__originSubID': 'rel-to-p2'
          },
          '__subID'   : 'rel-to-p2'
        },
        {
          'created'   : 1589194974763,
          'updated'   : 1589194988294,
          'objectId'  : 'E0D17A26-990E-8F08-FF85-F7A84091F500',
          'ownerId'   : null,
          'key'       : 'p1',
          '___class'  : 'Parent',
          'children'  : [
            {
              'created'     : 1589195080811,
              'updated'     : null,
              'objectId'    : '4F65139E-39D1-D815-FFA0-A71E04A57700',
              'ownerId'     : null,
              'key'         : 'c3',
              '___class'    : 'Child',
              'sub_children': [
                {
                  'created'     : 1589195078185,
                  'updated'     : null,
                  'objectId'    : '1D9FB559-2859-3388-FF3D-4F4C07346D00',
                  'ownerId'     : null,
                  'key'         : 'c2',
                  '___class'    : 'Child',
                  'sub_children': [
                    {
                      'created'     : 1589195075398,
                      'updated'     : null,
                      'objectId'    : '1D5E6AE0-C607-658A-FFFC-F212B731F800',
                      'ownerId'     : null,
                      'key'         : 'c1',
                      '___class'    : 'Child',
                      'sub_children': [],
                      '__subID'     : 'rel-to-c1'
                    }
                  ],
                  '__subID'     : 'rel-to-c2'
                },
                {
                  '__originSubID': 'rel-to-c3'
                }
              ],
              '__subID'     : 'rel-to-c3'
            },
            {
              '__originSubID': 'rel-to-c1'
            },
            {
              '__originSubID': 'rel-to-c2'
            }
          ],
          'sub_parent': {
            'created'   : 1589194994102,
            'updated'   : null,
            'objectId'  : '1848E936-D340-5609-FFAC-8C1B84E4D000',
            'ownerId'   : null,
            'key'       : 'p3',
            '___class'  : 'Parent',
            'children'  : [
              {
                '__originSubID': 'rel-to-c3'
              }
            ],
            'sub_parent': {
              'created'   : 1589194991530,
              'updated'   : null,
              'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
              'ownerId'   : null,
              'key'       : 'p2',
              '___class'  : 'Parent',
              'children'  : [
                {
                  '__originSubID': 'rel-to-c2'
                }
              ],
              'sub_parent': {
                '__originSubID': 'rel-to-p2'
              },
              '__subID'   : 'rel-to-p2'
            }
          }
        }
      ])

      expect(result1.map(o => o.key)).to.be.eql(['p3', 'p2', 'p1'])

      const parent1 = result1[2] // p1 not rel
      const parent2 = result1[1] // p2 not rel
      const parent3 = result1[0] // p3 not rel

      const child1 = parent3.children[0].sub_children[0].sub_children[0]  // c1 not rel
      const child2 = parent3.children[0].sub_children[0]                  // c2 not rel
      const child3 = parent3.children[0]                                  // c3 not rel

      expect(parent1).to.deep.include({
        'created' : 1589194974763,
        'updated' : 1589194988294,
        'objectId': 'E0D17A26-990E-8F08-FF85-F7A84091F500',
        'ownerId' : null,
        'key'     : 'p1',
        '___class': 'Parent',
      })

      expect(parent2).to.deep.include({
        'created' : 1589194991530,
        'updated' : null,
        'objectId': '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
        'ownerId' : null,
        'key'     : 'p2',
        '___class': 'Parent',
      })

      expect(parent3).to.deep.include({
        'created' : 1589194994102,
        'updated' : null,
        'objectId': '1848E936-D340-5609-FFAC-8C1B84E4D000',
        'ownerId' : null,
        'key'     : 'p3',
        '___class': 'Parent',
      })

      expect(child1).to.deep.include({
        'created' : 1589195075398,
        'updated' : null,
        'objectId': '1D5E6AE0-C607-658A-FFFC-F212B731F800',
        'ownerId' : null,
        'key'     : 'c1',
        '___class': 'Child',
      })

      expect(child2).to.deep.include({
        'created' : 1589195078185,
        'updated' : null,
        'objectId': '1D9FB559-2859-3388-FF3D-4F4C07346D00',
        'ownerId' : null,
        'key'     : 'c2',
        '___class': 'Child',
      })

      expect(child3).to.deep.include({
        'created' : 1589195080811,
        'updated' : null,
        'objectId': '4F65139E-39D1-D815-FFA0-A71E04A57700',
        'ownerId' : null,
        'key'     : 'c3',
        '___class': 'Child',
      })

      expect(parent1.sub_parent).to.deep.include({
        'created' : 1589194994102,
        'updated' : null,
        'objectId': '1848E936-D340-5609-FFAC-8C1B84E4D000',
        'ownerId' : null,
        'key'     : 'p3',
        '___class': 'Parent',
      })

      expect(parent1.sub_parent).to.be.not.equal(parent3)
      expect(parent1.sub_parent.children[0]).to.be.equal(child3)
      expect(parent1.sub_parent.sub_parent).to.be.equal(parent2)
      expect(parent1.children[0]).to.be.equal(child3)
      expect(parent1.children[0].sub_children[0]).to.be.equal(child2)
      expect(parent1.children[0].sub_children[1]).to.be.equal(child3)
      expect(parent1.children[1]).to.be.equal(child1)
      expect(parent1.children[2]).to.be.equal(child2)

      expect(parent2.sub_parent).to.be.equal(parent2)
      expect(parent2.children[0]).to.be.equal(child2)

      expect(parent3.sub_parent).to.be.equal(parent2)
      expect(parent3.children[0]).to.be.equal(child3)

      expect(child2.sub_children[0]).to.be.equal(child1)

      expect(child3.sub_children[0]).to.be.equal(child2)
      expect(child3.sub_children[1]).to.be.equal(child3)
    })

    it('circular relations #6', async () => {
      Backendless.Data.mapTableToClass('Child', Child)
      Backendless.Data.mapTableToClass('Parent', Parent)

      const result1 = dataStore.parseResponse([
        {
          'created'   : 1589194994102,
          'updated'   : null,
          'objectId'  : '1848E936-D340-5609-FFAC-8C1B84E4D000',
          'ownerId'   : null,
          'key'       : 'p3',
          '___class'  : 'Parent',
          'children'  : [
            {
              '__originSubID': 'rel-to-c3'
            }
          ],
          'sub_parent': {
            'created'   : 1589194991530,
            'updated'   : null,
            'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
            'ownerId'   : null,
            'key'       : 'p2',
            '___class'  : 'Parent',
            'children'  : [
              {
                '__originSubID': 'rel-to-c2'
              }
            ],
            'sub_parent': {
              '__originSubID': 'rel-to-p2'
            },
            '__subID'   : 'rel-to-p2'
          }
        },
        {
          'created'   : 1589194991530,
          'updated'   : null,
          'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
          'ownerId'   : null,
          'key'       : 'p2',
          '___class'  : 'Parent',
          'children'  : [
            {
              '__originSubID': 'rel-to-c2'
            }
          ],
          'sub_parent': {
            '__originSubID': 'rel-to-p2'
          },
          '__subID'   : 'rel-to-p2'
        },
        {
          'created'   : 1589194974763,
          'updated'   : 1589194988294,
          'objectId'  : 'E0D17A26-990E-8F08-FF85-F7A84091F500',
          'ownerId'   : null,
          'key'       : 'p1',
          '___class'  : 'Parent',
          'children'  : [
            {
              'created'     : 1589195080811,
              'updated'     : null,
              'objectId'    : '4F65139E-39D1-D815-FFA0-A71E04A57700',
              'ownerId'     : null,
              'key'         : 'c3',
              '___class'    : 'Child',
              'sub_children': [
                {
                  'created'     : 1589195078185,
                  'updated'     : null,
                  'objectId'    : '1D9FB559-2859-3388-FF3D-4F4C07346D00',
                  'ownerId'     : null,
                  'key'         : 'c2',
                  '___class'    : 'Child',
                  'sub_children': [
                    {
                      'created'     : 1589195075398,
                      'updated'     : null,
                      'objectId'    : '1D5E6AE0-C607-658A-FFFC-F212B731F800',
                      'ownerId'     : null,
                      'key'         : 'c1',
                      '___class'    : 'Child',
                      'sub_children': [],
                      '__subID'     : 'rel-to-c1'
                    }
                  ],
                  '__subID'     : 'rel-to-c2'
                },
                {
                  '__originSubID': 'rel-to-c3'
                }
              ],
              '__subID'     : 'rel-to-c3'
            },
            {
              '__originSubID': 'rel-to-c1'
            },
            {
              '__originSubID': 'rel-to-c2'
            }
          ],
          'sub_parent': {
            'created'   : 1589194994102,
            'updated'   : null,
            'objectId'  : '1848E936-D340-5609-FFAC-8C1B84E4D000',
            'ownerId'   : null,
            'key'       : 'p3',
            '___class'  : 'Parent',
            'children'  : [
              {
                '__originSubID': 'rel-to-c3'
              }
            ],
            'sub_parent': {
              'created'   : 1589194991530,
              'updated'   : null,
              'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
              'ownerId'   : null,
              'key'       : 'p2',
              '___class'  : 'Parent',
              'children'  : [
                {
                  '__originSubID': 'rel-to-c2'
                }
              ],
              'sub_parent': {
                '__originSubID': 'rel-to-p2'
              },
              '__subID'   : 'rel-to-p2'
            }
          }
        }
      ])

      const parent1 = result1[2] // p1 not rel
      const parent2 = result1[1] // p2 not rel
      const parent3 = result1[0] // p3 not rel

      const child1 = parent3.children[0].sub_children[0].sub_children[0]  // c1 not rel
      const child2 = parent3.children[0].sub_children[0]                  // c2 not rel
      const child3 = parent3.children[0]                                  // c3 not rel

      expect(parent1).to.be.instanceof(Parent)
      expect(parent2).to.be.instanceof(Parent)
      expect(parent3).to.be.instanceof(Parent)
      expect(child1).to.be.instanceof(Child)
      expect(child2).to.be.instanceof(Child)
      expect(child3).to.be.instanceof(Child)
    })

    it('circular relations #7', async () => {

      const result1 = dataStore.parseResponse([
        {
          'created'   : 1589194994102,
          'updated'   : null,
          'objectId'  : '1848E936-D340-5609-FFAC-8C1B84E4D000',
          'ownerId'   : null,
          'key'       : 'p3',
          '___class'  : 'Parent',
          'children'  : [
            {
              '__originSubID': 'rel-to-c3'
            }
          ],
          'sub_parent': {
            'created'   : 1589194991530,
            'updated'   : null,
            'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
            'ownerId'   : null,
            'key'       : 'p2',
            '___class'  : 'Parent',
            'children'  : [
              {
                '__originSubID': 'rel-to-c2'
              }
            ],
            'sub_parent': {
              '__originSubID': 'rel-to-p2'
            },
            '__subID'   : 'rel-to-p2'
          }
        },
        {
          'created'   : 1589194991530,
          'updated'   : null,
          'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
          'ownerId'   : null,
          'key'       : 'p2',
          '___class'  : 'Parent',
          'children'  : [
            {
              '__originSubID': 'rel-to-c2'
            }
          ],
          'sub_parent': {
            '__originSubID': 'rel-to-p2'
          },
          '__subID'   : 'rel-to-p2'
        },
        {
          'created'   : 1589194974763,
          'updated'   : 1589194988294,
          'objectId'  : 'E0D17A26-990E-8F08-FF85-F7A84091F500',
          'ownerId'   : null,
          'key'       : 'p1',
          '___class'  : 'Parent',
          'children'  : [
            {
              'created'     : 1589195080811,
              'updated'     : null,
              'objectId'    : '4F65139E-39D1-D815-FFA0-A71E04A57700',
              'ownerId'     : null,
              'key'         : 'c3',
              '___class'    : 'Child',
              'sub_children': [
                {
                  'created'     : 1589195078185,
                  'updated'     : null,
                  'objectId'    : '1D9FB559-2859-3388-FF3D-4F4C07346D00',
                  'ownerId'     : null,
                  'key'         : 'c2',
                  '___class'    : 'Child',
                  'sub_children': [
                    {
                      'created'     : 1589195075398,
                      'updated'     : null,
                      'objectId'    : '1D5E6AE0-C607-658A-FFFC-F212B731F800',
                      'ownerId'     : null,
                      'key'         : 'c1',
                      '___class'    : 'Child',
                      'sub_children': [],
                      '__subID'     : 'rel-to-c1'
                    }
                  ],
                  '__subID'     : 'rel-to-c2'
                },
                {
                  '__originSubID': 'rel-to-c3'
                }
              ],
              '__subID'     : 'rel-to-c3'
            },
            {
              '__originSubID': 'rel-to-c1'
            },
            {
              '__originSubID': 'rel-to-c2'
            }
          ],
          'sub_parent': {
            'created'   : 1589194994102,
            'updated'   : null,
            'objectId'  : '1848E936-D340-5609-FFAC-8C1B84E4D000',
            'ownerId'   : null,
            'key'       : 'p3',
            '___class'  : 'Parent',
            'children'  : [
              {
                '__originSubID': 'rel-to-c3'
              }
            ],
            'sub_parent': {
              'created'   : 1589194991530,
              'updated'   : null,
              'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
              'ownerId'   : null,
              'key'       : 'p2',
              '___class'  : 'Parent',
              'children'  : [
                {
                  '__originSubID': 'rel-to-c2'
                }
              ],
              'sub_parent': {
                '__originSubID': 'rel-to-p2'
              },
              '__subID'   : 'rel-to-p2'
            }
          }
        }
      ])

      expect(result1.map(o => o.key)).to.be.eql(['p3', 'p2', 'p1'])

      const parent1 = result1[2] // p1 not rel
      const parent2 = result1[1] // p2 not rel
      const parent3 = result1[0] // p3 not rel

      const child1 = parent3.children[0].sub_children[0].sub_children[0]  // c1 not rel
      const child2 = parent3.children[0].sub_children[0]                  // c2 not rel
      const child3 = parent3.children[0]                                  // c3 not rel

      expect(parent1).to.deep.include({
        'created' : 1589194974763,
        'updated' : 1589194988294,
        'objectId': 'E0D17A26-990E-8F08-FF85-F7A84091F500',
        'ownerId' : null,
        'key'     : 'p1',
        '___class': 'Parent',
      })

      expect(parent2).to.deep.include({
        'created' : 1589194991530,
        'updated' : null,
        'objectId': '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
        'ownerId' : null,
        'key'     : 'p2',
        '___class': 'Parent',
      })

      expect(parent3).to.deep.include({
        'created' : 1589194994102,
        'updated' : null,
        'objectId': '1848E936-D340-5609-FFAC-8C1B84E4D000',
        'ownerId' : null,
        'key'     : 'p3',
        '___class': 'Parent',
      })

      expect(child1).to.deep.include({
        'created' : 1589195075398,
        'updated' : null,
        'objectId': '1D5E6AE0-C607-658A-FFFC-F212B731F800',
        'ownerId' : null,
        'key'     : 'c1',
        '___class': 'Child',
      })

      expect(child2).to.deep.include({
        'created' : 1589195078185,
        'updated' : null,
        'objectId': '1D9FB559-2859-3388-FF3D-4F4C07346D00',
        'ownerId' : null,
        'key'     : 'c2',
        '___class': 'Child',
      })

      expect(child3).to.deep.include({
        'created' : 1589195080811,
        'updated' : null,
        'objectId': '4F65139E-39D1-D815-FFA0-A71E04A57700',
        'ownerId' : null,
        'key'     : 'c3',
        '___class': 'Child',
      })

      expect(parent1.sub_parent).to.deep.include({
        'created' : 1589194994102,
        'updated' : null,
        'objectId': '1848E936-D340-5609-FFAC-8C1B84E4D000',
        'ownerId' : null,
        'key'     : 'p3',
        '___class': 'Parent',
      })

      expect(parent1.sub_parent).to.be.not.equal(parent3)
      expect(parent1.sub_parent.children[0]).to.be.equal(child3)
      expect(parent1.sub_parent.sub_parent).to.be.equal(parent2)
      expect(parent1.children[0]).to.be.equal(child3)
      expect(parent1.children[0].sub_children[0]).to.be.equal(child2)
      expect(parent1.children[0].sub_children[1]).to.be.equal(child3)
      expect(parent1.children[1]).to.be.equal(child1)
      expect(parent1.children[2]).to.be.equal(child2)

      expect(parent2.sub_parent).to.be.equal(parent2)
      expect(parent2.children[0]).to.be.equal(child2)

      expect(parent3.sub_parent).to.be.equal(parent2)
      expect(parent3.children[0]).to.be.equal(child3)

      expect(child2.sub_children[0]).to.be.equal(child1)

      expect(child3.sub_children[0]).to.be.equal(child2)
      expect(child3.sub_children[1]).to.be.equal(child3)
    })

    it('circular relations #8', async () => {
      class Foo {
      }

      class Bar {
      }

      Backendless.Data.mapTableToClass('Parent', Foo)
      Backendless.Data.mapTableToClass('Child', Bar)

      const result1 = dataStore.parseResponse([
        {
          'created'   : 1589194994102,
          'updated'   : null,
          'objectId'  : '1848E936-D340-5609-FFAC-8C1B84E4D000',
          'ownerId'   : null,
          'key'       : 'p3',
          '___class'  : 'Parent',
          'children'  : [
            {
              '__originSubID': 'rel-to-c3'
            }
          ],
          'sub_parent': {
            'created'   : 1589194991530,
            'updated'   : null,
            'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
            'ownerId'   : null,
            'key'       : 'p2',
            '___class'  : 'Parent',
            'children'  : [
              {
                '__originSubID': 'rel-to-c2'
              }
            ],
            'sub_parent': {
              '__originSubID': 'rel-to-p2'
            },
            '__subID'   : 'rel-to-p2'
          }
        },
        {
          'created'   : 1589194991530,
          'updated'   : null,
          'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
          'ownerId'   : null,
          'key'       : 'p2',
          '___class'  : 'Parent',
          'children'  : [
            {
              '__originSubID': 'rel-to-c2'
            }
          ],
          'sub_parent': {
            '__originSubID': 'rel-to-p2'
          },
          '__subID'   : 'rel-to-p2'
        },
        {
          'created'   : 1589194974763,
          'updated'   : 1589194988294,
          'objectId'  : 'E0D17A26-990E-8F08-FF85-F7A84091F500',
          'ownerId'   : null,
          'key'       : 'p1',
          '___class'  : 'Parent',
          'children'  : [
            {
              'created'     : 1589195080811,
              'updated'     : null,
              'objectId'    : '4F65139E-39D1-D815-FFA0-A71E04A57700',
              'ownerId'     : null,
              'key'         : 'c3',
              '___class'    : 'Child',
              'sub_children': [
                {
                  'created'     : 1589195078185,
                  'updated'     : null,
                  'objectId'    : '1D9FB559-2859-3388-FF3D-4F4C07346D00',
                  'ownerId'     : null,
                  'key'         : 'c2',
                  '___class'    : 'Child',
                  'sub_children': [
                    {
                      'created'     : 1589195075398,
                      'updated'     : null,
                      'objectId'    : '1D5E6AE0-C607-658A-FFFC-F212B731F800',
                      'ownerId'     : null,
                      'key'         : 'c1',
                      '___class'    : 'Child',
                      'sub_children': [],
                      '__subID'     : 'rel-to-c1'
                    }
                  ],
                  '__subID'     : 'rel-to-c2'
                },
                {
                  '__originSubID': 'rel-to-c3'
                }
              ],
              '__subID'     : 'rel-to-c3'
            },
            {
              '__originSubID': 'rel-to-c1'
            },
            {
              '__originSubID': 'rel-to-c2'
            }
          ],
          'sub_parent': {
            'created'   : 1589194994102,
            'updated'   : null,
            'objectId'  : '1848E936-D340-5609-FFAC-8C1B84E4D000',
            'ownerId'   : null,
            'key'       : 'p3',
            '___class'  : 'Parent',
            'children'  : [
              {
                '__originSubID': 'rel-to-c3'
              }
            ],
            'sub_parent': {
              'created'   : 1589194991530,
              'updated'   : null,
              'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
              'ownerId'   : null,
              'key'       : 'p2',
              '___class'  : 'Parent',
              'children'  : [
                {
                  '__originSubID': 'rel-to-c2'
                }
              ],
              'sub_parent': {
                '__originSubID': 'rel-to-p2'
              },
              '__subID'   : 'rel-to-p2'
            }
          }
        }
      ])

      const parent1 = result1[2] // p1 not rel
      const parent2 = result1[1] // p2 not rel
      const parent3 = result1[0] // p3 not rel

      const child1 = parent3.children[0].sub_children[0].sub_children[0]  // c1 not rel
      const child2 = parent3.children[0].sub_children[0]                  // c2 not rel
      const child3 = parent3.children[0]                                  // c3 not rel

      expect(parent1).to.be.instanceof(Foo)
      expect(parent2).to.be.instanceof(Foo)
      expect(parent3).to.be.instanceof(Foo)
      expect(child1).to.be.instanceof(Bar)
      expect(child2).to.be.instanceof(Bar)
      expect(child3).to.be.instanceof(Bar)
    })

    it('circular relations #9', async () => {
      Backendless.Data.mapTableToClass('Parent', Parent)

      const result1 = dataStore.parseResponse([
        {
          'created'   : 1589194994102,
          'updated'   : null,
          'objectId'  : '1848E936-D340-5609-FFAC-8C1B84E4D000',
          'ownerId'   : null,
          'key'       : 'p3',
          '___class'  : 'Parent',
          'children'  : [
            {
              '__originSubID': 'rel-to-c3'
            }
          ],
          'sub_parent': {
            'created'   : 1589194991530,
            'updated'   : null,
            'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
            'ownerId'   : null,
            'key'       : 'p2',
            '___class'  : 'Parent',
            'children'  : [
              {
                '__originSubID': 'rel-to-c2'
              }
            ],
            'sub_parent': {
              '__originSubID': 'rel-to-p2'
            },
            '__subID'   : 'rel-to-p2'
          }
        },
        {
          'created'   : 1589194991530,
          'updated'   : null,
          'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
          'ownerId'   : null,
          'key'       : 'p2',
          '___class'  : 'Parent',
          'children'  : [
            {
              '__originSubID': 'rel-to-c2'
            }
          ],
          'sub_parent': {
            '__originSubID': 'rel-to-p2'
          },
          '__subID'   : 'rel-to-p2'
        },
        {
          'created'   : 1589194974763,
          'updated'   : 1589194988294,
          'objectId'  : 'E0D17A26-990E-8F08-FF85-F7A84091F500',
          'ownerId'   : null,
          'key'       : 'p1',
          '___class'  : 'Parent',
          'children'  : [
            {
              'created'     : 1589195080811,
              'updated'     : null,
              'objectId'    : '4F65139E-39D1-D815-FFA0-A71E04A57700',
              'ownerId'     : null,
              'key'         : 'c3',
              '___class'    : 'Child',
              'sub_children': [
                {
                  'created'     : 1589195078185,
                  'updated'     : null,
                  'objectId'    : '1D9FB559-2859-3388-FF3D-4F4C07346D00',
                  'ownerId'     : null,
                  'key'         : 'c2',
                  '___class'    : 'Child',
                  'sub_children': [
                    {
                      'created'     : 1589195075398,
                      'updated'     : null,
                      'objectId'    : '1D5E6AE0-C607-658A-FFFC-F212B731F800',
                      'ownerId'     : null,
                      'key'         : 'c1',
                      '___class'    : 'Child',
                      'sub_children': [],
                      '__subID'     : 'rel-to-c1'
                    }
                  ],
                  '__subID'     : 'rel-to-c2'
                },
                {
                  '__originSubID': 'rel-to-c3'
                }
              ],
              '__subID'     : 'rel-to-c3'
            },
            {
              '__originSubID': 'rel-to-c1'
            },
            {
              '__originSubID': 'rel-to-c2'
            }
          ],
          'sub_parent': {
            'created'   : 1589194994102,
            'updated'   : null,
            'objectId'  : '1848E936-D340-5609-FFAC-8C1B84E4D000',
            'ownerId'   : null,
            'key'       : 'p3',
            '___class'  : 'Parent',
            'children'  : [
              {
                '__originSubID': 'rel-to-c3'
              }
            ],
            'sub_parent': {
              'created'   : 1589194991530,
              'updated'   : null,
              'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
              'ownerId'   : null,
              'key'       : 'p2',
              '___class'  : 'Parent',
              'children'  : [
                {
                  '__originSubID': 'rel-to-c2'
                }
              ],
              'sub_parent': {
                '__originSubID': 'rel-to-p2'
              },
              '__subID'   : 'rel-to-p2'
            }
          }
        }
      ])

      const parent1 = result1[2] // p1 not rel
      const parent2 = result1[1] // p2 not rel
      const parent3 = result1[0] // p3 not rel

      const child1 = parent3.children[0].sub_children[0].sub_children[0]  // c1 not rel
      const child2 = parent3.children[0].sub_children[0]                  // c2 not rel
      const child3 = parent3.children[0]                                  // c3 not rel

      expect(parent1).to.be.instanceof(Parent)
      expect(parent2).to.be.instanceof(Parent)
      expect(parent3).to.be.instanceof(Parent)
      expect(child1).to.be.instanceof(Object)
      expect(child2).to.be.instanceof(Object)
      expect(child3).to.be.instanceof(Object)
    })

    it('circular relations #10', async () => {
      const result1 = dataStore.parseResponse([
        {
          'created'   : 1589194994102,
          'updated'   : null,
          'objectId'  : '1848E936-D340-5609-FFAC-8C1B84E4D000',
          'ownerId'   : null,
          'key'       : 'p3',
          '___class'  : 'Parent',
          'children'  : [
            {
              '__originSubID': 'rel-to-c3'
            }
          ],
          'sub_parent': {
            'created'   : 1589194991530,
            'updated'   : null,
            'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
            'ownerId'   : null,
            'key'       : 'p2',
            '___class'  : 'Parent',
            'children'  : [
              {
                '__originSubID': 'rel-to-c2'
              }
            ],
            'sub_parent': {
              '__originSubID': 'rel-to-p2'
            },
            '__subID'   : 'rel-to-p2'
          }
        },
        {
          'created'   : 1589194991530,
          'updated'   : null,
          'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
          'ownerId'   : null,
          'key'       : 'p2',
          '___class'  : 'Parent',
          'children'  : [
            {
              '__originSubID': 'rel-to-c2'
            }
          ],
          'sub_parent': {
            '__originSubID': 'rel-to-p2'
          },
          '__subID'   : 'rel-to-p2'
        },
        {
          'created'   : 1589194974763,
          'updated'   : 1589194988294,
          'objectId'  : 'E0D17A26-990E-8F08-FF85-F7A84091F500',
          'ownerId'   : null,
          'key'       : 'p1',
          '___class'  : 'Parent',
          'children'  : [
            {
              'created'     : 1589195080811,
              'updated'     : null,
              'objectId'    : '4F65139E-39D1-D815-FFA0-A71E04A57700',
              'ownerId'     : null,
              'key'         : 'c3',
              '___class'    : 'Child',
              'sub_children': [
                {
                  'created'     : 1589195078185,
                  'updated'     : null,
                  'objectId'    : '1D9FB559-2859-3388-FF3D-4F4C07346D00',
                  'ownerId'     : null,
                  'key'         : 'c2',
                  '___class'    : 'Child',
                  'sub_children': [
                    {
                      'created'     : 1589195075398,
                      'updated'     : null,
                      'objectId'    : '1D5E6AE0-C607-658A-FFFC-F212B731F800',
                      'ownerId'     : null,
                      'key'         : 'c1',
                      '___class'    : 'Child',
                      'sub_children': [],
                      '__subID'     : 'rel-to-c1'
                    }
                  ],
                  '__subID'     : 'rel-to-c2'
                },
                {
                  '__originSubID': 'rel-to-c3'
                }
              ],
              '__subID'     : 'rel-to-c3'
            },
            {
              '__originSubID': 'rel-to-c1'
            },
            {
              '__originSubID': 'rel-to-c2'
            }
          ],
          'sub_parent': {
            'created'   : 1589194994102,
            'updated'   : null,
            'objectId'  : '1848E936-D340-5609-FFAC-8C1B84E4D000',
            'ownerId'   : null,
            'key'       : 'p3',
            '___class'  : 'Parent',
            'children'  : [
              {
                '__originSubID': 'rel-to-c3'
              }
            ],
            'sub_parent': {
              'created'   : 1589194991530,
              'updated'   : null,
              'objectId'  : '5201EA2D-C7AD-79AD-FFEF-F73CC5074E00',
              'ownerId'   : null,
              'key'       : 'p2',
              '___class'  : 'Parent',
              'children'  : [
                {
                  '__originSubID': 'rel-to-c2'
                }
              ],
              'sub_parent': {
                '__originSubID': 'rel-to-p2'
              },
              '__subID'   : 'rel-to-p2'
            }
          }
        }
      ])

      const parent1 = result1[2] // p1 not rel
      const parent2 = result1[1] // p2 not rel
      const parent3 = result1[0] // p3 not rel

      const child1 = parent3.children[0].sub_children[0].sub_children[0]  // c1 not rel
      const child2 = parent3.children[0].sub_children[0]                  // c2 not rel
      const child3 = parent3.children[0]                                  // c3 not rel

      expect(parent1).to.be.instanceof(Object)
      expect(parent2).to.be.instanceof(Object)
      expect(parent3).to.be.instanceof(Object)
      expect(child1).to.be.instanceof(Object)
      expect(child2).to.be.instanceof(Object)
      expect(child3).to.be.instanceof(Object)
    })

    it('circular relations #11', async () => {
      Backendless.Data.mapTableToClass(Parent)
      Backendless.Data.mapTableToClass(Child)

      const result1 = dataStore.parseResponse([
        {
          '___class': 'Parent',
          'value'   : 1,
          'children': [
            { '__originSubID': 'rel-to-c1' }
          ],
        },
        {
          '___class': 'Parent',
          'value'   : 2,
          'children': [
            { '___class': 'Child', '__subID': 'rel-to-c1' }
          ],
        },
        {
          '___class': 'Parent',
          'value'   : 3,
          'children': [
            { '__originSubID': 'rel-to-c1' }
          ],
        },
      ])

      const parent1 = result1[0]
      const parent2 = result1[1]
      const parent3 = result1[2]

      const child1 = parent2.children[0]

      expect(parent1).to.be.instanceof(Parent)
      expect(parent2).to.be.instanceof(Parent)
      expect(parent3).to.be.instanceof(Parent)

      expect(parent1.value).to.be.equal(1)
      expect(parent2.value).to.be.equal(2)
      expect(parent3.value).to.be.equal(3)

      expect(child1).to.be.instanceof(Child)
    })

    it('circular relations #12', async () => {
      Backendless.Data.mapTableToClass(Parent)
      Backendless.Data.mapTableToClass(Child)

      const result1 = dataStore.parseResponse([
        {
          '___class': 'Parent',
          'value'   : 1,
          '__subID' : 'rel-to-p1',
          'child'   : {
            '___class': 'Child',
            'value'   : 2,
            'child'   : {
              '___class': 'Child',
              'value'   : 3,
              'parent'  : { '__originSubID': 'rel-to-p1' },
            },
          },
        },
      ])

      const parent1 = result1[0]

      const child1 = parent1.child
      const child2 = parent1.child.child

      expect(parent1).to.be.instanceof(Parent)

      expect(child1).to.be.instanceof(Child)
      expect(child2).to.be.instanceof(Child)

      expect(parent1).to.be.equal(child2.parent)
    })

  })

  describe('GEO Relations', () => {
    it('relations #1', async () => {
      const result1 = dataStore.parseResponse([
        {
          'created' : 1589203761669,
          'updated' : null,
          'objectId': '4902C5BF-3DD2-2F57-FF5E-C92610968900',
          'ownerId' : null,
          'key'     : 'p1',
          '___class': 'ParentGeo',
          'children': [
            {
              'created'   : 1589203701262,
              'updated'   : null,
              'objectId'  : '05A4CF86-AB2D-0ED4-FF15-2EE91D7EBA00',
              'ownerId'   : null,
              'key'       : 'g3',
              'polygon'   : null,
              'geometry'  : null,
              'linestring': null,
              'point'     : null,
              '___class'  : 'GeoItems'
            },
            {
              'created'   : 1589203424413,
              'updated'   : 1589203449977,
              'objectId'  : '62837712-49FA-36AA-FFD4-87B56C034C00',
              'ownerId'   : null,
              'key'       : 'g2',
              'polygon'   : {
                'type'       : 'Polygon',
                'coordinates': [
                  [
                    [-118.64011912, 40.09896049],
                    [-93.85496287, 51.77113916],
                    [-86.12058787, 33.78357869],
                    [-118.64011912, 40.09896049]
                  ]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Polygon'
              },
              'geometry'  : null,
              'linestring': {
                'type'       : 'LineString',
                'coordinates': [
                  [-113.54246287, 40.90093567],
                  [-81.90183787, 49.42873486],
                  [-81.90183787, 38.19057723]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.LineString'
              },
              'point'     : {
                'type'       : 'Point',
                'coordinates': [-112.66355662, 37.91373995],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Point'
              },
              '___class'  : 'GeoItems'
            }
          ],
          'child'   : {
            'created'   : 1589203300819,
            'updated'   : 1589203393862,
            'objectId'  : 'CAAC9DEF-4558-66EA-FF82-309B5C909000',
            'ownerId'   : null,
            'key'       : 'g1',
            'polygon'   : {
              'type'       : 'Polygon',
              'coordinates': [
                [
                  [-113.19090037, 43.88589996],
                  [-100.88621287, 46.96889771],
                  [-89.46043162, 40.23328849],
                  [-99.47996287, 29.74993057],
                  [-114.24558787, 34.36597728],
                  [-113.19090037, 43.88589996]
                ],
                [
                  [-102.68797069, 33.71049779],
                  [-95.83250194, 36.72554725],
                  [-107.96140819, 42.41117116],
                  [-107.78562694, 37.28703657],
                  [-102.68797069, 33.71049779]
                ]
              ],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.Polygon'
            },
            'geometry'  : {
              'type'       : 'Point',
              'coordinates': [-97.54636912, 40.23328849],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.Geometry'
            },
            'linestring': {
              'type'       : 'LineString',
              'coordinates': [
                [-112.13621287, 42.60554422],
                [-91.21824412, 38.46636627],
                [-100.35886912, 35.94675206],
                [-109.14793162, 34.58334196]
              ],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.LineString'
            },
            'point'     : {
              'type'       : 'Point',
              'coordinates': [-104.05027537, 36.23085088],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.Point'
            },
            '___class'  : 'GeoItems'
          }
        },
        {
          'created' : 1589203765288,
          'updated' : null,
          'objectId': '66DBB31D-898A-3DC9-FF4A-D6ACE3F6B300',
          'ownerId' : null,
          'key'     : 'p2',
          '___class': 'ParentGeo',
          'children': [
            {
              'created'   : 1589203424413,
              'updated'   : 1589203449977,
              'objectId'  : '62837712-49FA-36AA-FFD4-87B56C034C00',
              'ownerId'   : null,
              'key'       : 'g2',
              'polygon'   : {
                'type'       : 'Polygon',
                'coordinates': [
                  [
                    [-118.64011912, 40.09896049],
                    [-93.85496287, 51.77113916],
                    [-86.12058787, 33.78357869],
                    [-118.64011912, 40.09896049]
                  ]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Polygon'
              },
              'geometry'  : null,
              'linestring': {
                'type'       : 'LineString',
                'coordinates': [
                  [-113.54246287, 40.90093567],
                  [-81.90183787, 49.42873486],
                  [-81.90183787, 38.19057723]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.LineString'
              },
              'point'     : {
                'type'       : 'Point',
                'coordinates': [
                  -112.66355662,
                  37.91373995
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Point'
              },
              '___class'  : 'GeoItems'
            },
            {
              'created'   : 1589203300819,
              'updated'   : 1589203393862,
              'objectId'  : 'CAAC9DEF-4558-66EA-FF82-309B5C909000',
              'ownerId'   : null,
              'key'       : 'g1',
              'polygon'   : {
                'type'       : 'Polygon',
                'coordinates': [
                  [
                    [-113.19090037, 43.88589996],
                    [-100.88621287, 46.96889771],
                    [-89.46043162, 40.23328849],
                    [-99.47996287, 29.74993057],
                    [-114.24558787, 34.36597728],
                    [-113.19090037, 43.88589996]
                  ],
                  [
                    [-102.68797069, 33.71049779],
                    [-95.83250194, 36.72554725],
                    [-107.96140819, 42.41117116],
                    [-107.78562694, 37.28703657],
                    [-102.68797069, 33.71049779]
                  ]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Polygon'
              },
              'geometry'  : {
                'type'       : 'Point',
                'coordinates': [-97.54636912, 40.23328849],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Geometry'
              },
              'linestring': {
                'type'       : 'LineString',
                'coordinates': [
                  [-112.13621287, 42.60554422],
                  [-91.21824412, 38.46636627],
                  [-100.35886912, 35.94675206],
                  [-109.14793162, 34.58334196]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.LineString'
              },
              'point'     : {
                'type'       : 'Point',
                'coordinates': [
                  -104.05027537,
                  36.23085088
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Point'
              },
              '___class'  : 'GeoItems'
            }
          ],
          'child'   : {
            'created'   : 1589203424413,
            'updated'   : 1589203449977,
            'objectId'  : '62837712-49FA-36AA-FFD4-87B56C034C00',
            'ownerId'   : null,
            'key'       : 'g2',
            'polygon'   : {
              'type'       : 'Polygon',
              'coordinates': [
                [
                  [-118.64011912, 40.09896049],
                  [-93.85496287, 51.77113916],
                  [-86.12058787, 33.78357869],
                  [-118.64011912, 40.09896049]
                ]
              ],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.Polygon'
            },
            'geometry'  : null,
            'linestring': {
              'type'       : 'LineString',
              'coordinates': [
                [-113.54246287, 40.90093567],
                [-81.90183787, 49.42873486],
                [-81.90183787, 38.19057723]
              ],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.LineString'
            },
            'point'     : {
              'type'       : 'Point',
              'coordinates': [-112.66355662, 37.91373995],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.Point'
            },
            '___class'  : 'GeoItems'
          }
        },
        {
          'created' : 1589203768100,
          'updated' : null,
          'objectId': 'AA1F0D9A-0F72-65D9-FFC5-9C268A362200',
          'ownerId' : null,
          'key'     : 'p3',
          '___class': 'ParentGeo',
          'children': [
            {
              'created'   : 1589203701262,
              'updated'   : null,
              'objectId'  : '05A4CF86-AB2D-0ED4-FF15-2EE91D7EBA00',
              'ownerId'   : null,
              'key'       : 'g3',
              'polygon'   : null,
              'geometry'  : null,
              'linestring': null,
              'point'     : null,
              '___class'  : 'GeoItems'
            },
            {
              'created'   : 1589203300819,
              'updated'   : 1589203393862,
              'objectId'  : 'CAAC9DEF-4558-66EA-FF82-309B5C909000',
              'ownerId'   : null,
              'key'       : 'g1',
              'polygon'   : {
                'type'       : 'Polygon',
                'coordinates': [
                  [
                    [-113.19090037, 43.88589996],
                    [-100.88621287, 46.96889771],
                    [-89.46043162, 40.23328849],
                    [-99.47996287, 29.74993057],
                    [-114.24558787, 34.36597728],
                    [-113.19090037, 43.88589996]
                  ],
                  [
                    [-102.68797069, 33.71049779],
                    [-95.83250194, 36.72554725],
                    [-107.96140819, 42.41117116],
                    [-107.78562694, 37.28703657],
                    [-102.68797069, 33.71049779]
                  ]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Polygon'
              },
              'geometry'  : {
                'type'       : 'Point',
                'coordinates': [-97.54636912, 40.23328849],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Geometry'
              },
              'linestring': {
                'type'       : 'LineString',
                'coordinates': [
                  [-112.13621287, 42.60554422],
                  [-91.21824412, 38.46636627],
                  [-100.35886912, 35.94675206],
                  [-109.14793162, 34.58334196]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.LineString'
              },
              'point'     : {
                'type'       : 'Point',
                'coordinates': [-104.05027537, 36.23085088],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Point'
              },
              '___class'  : 'GeoItems'
            }
          ],
          'child'   : {
            'created'   : 1589203701262,
            'updated'   : null,
            'objectId'  : '05A4CF86-AB2D-0ED4-FF15-2EE91D7EBA00',
            'ownerId'   : null,
            'key'       : 'g3',
            'polygon'   : null,
            'geometry'  : null,
            'linestring': null,
            'point'     : null,
            '___class'  : 'GeoItems'
          }
        }
      ])

      const { Point, LineString, Polygon, Geometry } = Backendless.Data

      const parent1 = result1[0] // p1 not rel
      const parent2 = result1[1] // p2 not rel
      const parent3 = result1[2] // p3 not rel

      expect(parent1.key).to.be.equal('p1')
      expect(parent1.child.key).to.be.equal('g1')
      expect(parent1.children[0].key).to.be.equal('g3')
      expect(parent1.children[1].key).to.be.equal('g2')

      expect(parent2.key).to.be.equal('p2')
      expect(parent2.child.key).to.be.equal('g2')
      expect(parent2.children[0].key).to.be.equal('g2')
      expect(parent2.children[1].key).to.be.equal('g1')

      expect(parent3.key).to.be.equal('p3')
      expect(parent3.child.key).to.be.equal('g3')
      expect(parent3.children[0].key).to.be.equal('g3')
      expect(parent3.children[1].key).to.be.equal('g1')

      // start checking g1 object [parent1.child, parent2.children[1], parent3.children[1]]

      expect(parent1.child.point).to.be.instanceof(Point)
      expect(parent2.children[1].point).to.be.instanceof(Point)
      expect(parent3.children[1].point).to.be.instanceof(Point)

      expect(parent1.child.point.asWKT())
        .to.be.equal(parent2.children[1].point.asWKT())
        .to.be.equal(parent3.children[1].point.asWKT())
        .to.be.equal('POINT(-104.05027537 36.23085088)')

      expect(parent1.child.linestring).to.be.instanceof(LineString)
      expect(parent2.children[1].linestring).to.be.instanceof(LineString)
      expect(parent3.children[1].linestring).to.be.instanceof(LineString)

      expect(parent1.child.linestring.asWKT())
        .to.be.equal(parent2.children[1].linestring.asWKT())
        .to.be.equal(parent3.children[1].linestring.asWKT())
        .to.be.equal('LINESTRING(-112.13621287 42.60554422,-91.21824412 38.46636627,-100.35886912 35.94675206,-109.14793162 34.58334196)')

      expect(parent1.child.geometry).to.be.instanceof(Geometry)
      expect(parent2.children[1].geometry).to.be.instanceof(Geometry)
      expect(parent3.children[1].geometry).to.be.instanceof(Geometry)

      expect(parent1.child.geometry.asWKT())
        .to.be.equal(parent2.children[1].geometry.asWKT())
        .to.be.equal(parent3.children[1].geometry.asWKT())
        .to.be.equal('POINT(-97.54636912 40.23328849)')

      expect(parent1.child.polygon).to.be.instanceof(Polygon)
      expect(parent2.children[1].polygon).to.be.instanceof(Polygon)
      expect(parent3.children[1].polygon).to.be.instanceof(Polygon)

      expect(parent1.child.polygon.asWKT())
        .to.be.equal(parent2.children[1].polygon.asWKT())
        .to.be.equal(parent3.children[1].polygon.asWKT())
        .to.be.equal('POLYGON((-113.19090037 43.88589996,-100.88621287 46.96889771,-89.46043162 40.23328849,-99.47996287 29.74993057,-114.24558787 34.36597728,-113.19090037 43.88589996),(-102.68797069 33.71049779,-95.83250194 36.72554725,-107.96140819 42.41117116,-107.78562694 37.28703657,-102.68797069 33.71049779))')

      // start checking g2 object [parent2.child, parent1.children[1], parent2.children[0]]

      expect(parent2.child.point).to.be.instanceof(Point)
      expect(parent1.children[1].point).to.be.instanceof(Point)
      expect(parent2.children[0].point).to.be.instanceof(Point)

      expect(parent2.child.point.asWKT())
        .to.be.equal(parent1.children[1].point.asWKT())
        .to.be.equal(parent2.children[0].point.asWKT())
        .to.be.equal('POINT(-112.66355662 37.91373995)')

      expect(parent2.child.linestring).to.be.instanceof(LineString)
      expect(parent1.children[1].linestring).to.be.instanceof(LineString)
      expect(parent2.children[0].linestring).to.be.instanceof(LineString)

      expect(parent2.child.linestring.asWKT())
        .to.be.equal(parent1.children[1].linestring.asWKT())
        .to.be.equal(parent2.children[0].linestring.asWKT())
        .to.be.equal('LINESTRING(-113.54246287 40.90093567,-81.90183787 49.42873486,-81.90183787 38.19057723)')

      expect(parent2.child.polygon).to.be.instanceof(Polygon)
      expect(parent1.children[1].polygon).to.be.instanceof(Polygon)
      expect(parent2.children[0].polygon).to.be.instanceof(Polygon)

      expect(parent2.child.polygon.asWKT())
        .to.be.equal(parent1.children[1].polygon.asWKT())
        .to.be.equal(parent2.children[0].polygon.asWKT())
        .to.be.equal('POLYGON((-118.64011912 40.09896049,-93.85496287 51.77113916,-86.12058787 33.78357869,-118.64011912 40.09896049))')

      // start checking g3 object [parent3.child, parent1.children[0], parent3.children[0]]

      expect(parent3.child.point).to.be.equal(null)
      expect(parent1.children[0].point).to.be.equal(null)
      expect(parent3.children[0].point).to.be.equal(null)

      expect(parent3.child.linestring).to.be.equal(null)
      expect(parent1.children[0].linestring).to.be.equal(null)
      expect(parent3.children[0].linestring).to.be.equal(null)

      expect(parent3.child.polygon).to.be.equal(null)
      expect(parent1.children[0].polygon).to.be.equal(null)
      expect(parent3.children[0].polygon).to.be.equal(null)
    })

    it('relations #2', async () => {
      class ParentGeo {
      }

      class GeoItems {
      }

      Backendless.Data.mapTableToClass('ParentGeo', ParentGeo)
      Backendless.Data.mapTableToClass('GeoItems', GeoItems)

      const result1 = dataStore.parseResponse([
        {
          'created' : 1589203761669,
          'updated' : null,
          'objectId': '4902C5BF-3DD2-2F57-FF5E-C92610968900',
          'ownerId' : null,
          'key'     : 'p1',
          '___class': 'ParentGeo',
          'children': [
            {
              'created'   : 1589203701262,
              'updated'   : null,
              'objectId'  : '05A4CF86-AB2D-0ED4-FF15-2EE91D7EBA00',
              'ownerId'   : null,
              'key'       : 'g3',
              'polygon'   : null,
              'geometry'  : null,
              'linestring': null,
              'point'     : null,
              '___class'  : 'GeoItems'
            },
            {
              'created'   : 1589203424413,
              'updated'   : 1589203449977,
              'objectId'  : '62837712-49FA-36AA-FFD4-87B56C034C00',
              'ownerId'   : null,
              'key'       : 'g2',
              'polygon'   : {
                'type'       : 'Polygon',
                'coordinates': [
                  [
                    [-118.64011912, 40.09896049],
                    [-93.85496287, 51.77113916],
                    [-86.12058787, 33.78357869],
                    [-118.64011912, 40.09896049]
                  ]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Polygon'
              },
              'geometry'  : null,
              'linestring': {
                'type'       : 'LineString',
                'coordinates': [
                  [-113.54246287, 40.90093567],
                  [-81.90183787, 49.42873486],
                  [-81.90183787, 38.19057723]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.LineString'
              },
              'point'     : {
                'type'       : 'Point',
                'coordinates': [-112.66355662, 37.91373995],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Point'
              },
              '___class'  : 'GeoItems'
            }
          ],
          'child'   : {
            'created'   : 1589203300819,
            'updated'   : 1589203393862,
            'objectId'  : 'CAAC9DEF-4558-66EA-FF82-309B5C909000',
            'ownerId'   : null,
            'key'       : 'g1',
            'polygon'   : {
              'type'       : 'Polygon',
              'coordinates': [
                [
                  [-113.19090037, 43.88589996],
                  [-100.88621287, 46.96889771],
                  [-89.46043162, 40.23328849],
                  [-99.47996287, 29.74993057],
                  [-114.24558787, 34.36597728],
                  [-113.19090037, 43.88589996]
                ],
                [
                  [-102.68797069, 33.71049779],
                  [-95.83250194, 36.72554725],
                  [-107.96140819, 42.41117116],
                  [-107.78562694, 37.28703657],
                  [-102.68797069, 33.71049779]
                ]
              ],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.Polygon'
            },
            'geometry'  : {
              'type'       : 'Point',
              'coordinates': [-97.54636912, 40.23328849],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.Geometry'
            },
            'linestring': {
              'type'       : 'LineString',
              'coordinates': [
                [-112.13621287, 42.60554422],
                [-91.21824412, 38.46636627],
                [-100.35886912, 35.94675206],
                [-109.14793162, 34.58334196]
              ],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.LineString'
            },
            'point'     : {
              'type'       : 'Point',
              'coordinates': [-104.05027537, 36.23085088],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.Point'
            },
            '___class'  : 'GeoItems'
          }
        },
        {
          'created' : 1589203765288,
          'updated' : null,
          'objectId': '66DBB31D-898A-3DC9-FF4A-D6ACE3F6B300',
          'ownerId' : null,
          'key'     : 'p2',
          '___class': 'ParentGeo',
          'children': [
            {
              'created'   : 1589203424413,
              'updated'   : 1589203449977,
              'objectId'  : '62837712-49FA-36AA-FFD4-87B56C034C00',
              'ownerId'   : null,
              'key'       : 'g2',
              'polygon'   : {
                'type'       : 'Polygon',
                'coordinates': [
                  [
                    [-118.64011912, 40.09896049],
                    [-93.85496287, 51.77113916],
                    [-86.12058787, 33.78357869],
                    [-118.64011912, 40.09896049]
                  ]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Polygon'
              },
              'geometry'  : null,
              'linestring': {
                'type'       : 'LineString',
                'coordinates': [
                  [-113.54246287, 40.90093567],
                  [-81.90183787, 49.42873486],
                  [-81.90183787, 38.19057723]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.LineString'
              },
              'point'     : {
                'type'       : 'Point',
                'coordinates': [
                  -112.66355662,
                  37.91373995
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Point'
              },
              '___class'  : 'GeoItems'
            },
            {
              'created'   : 1589203300819,
              'updated'   : 1589203393862,
              'objectId'  : 'CAAC9DEF-4558-66EA-FF82-309B5C909000',
              'ownerId'   : null,
              'key'       : 'g1',
              'polygon'   : {
                'type'       : 'Polygon',
                'coordinates': [
                  [
                    [-113.19090037, 43.88589996],
                    [-100.88621287, 46.96889771],
                    [-89.46043162, 40.23328849],
                    [-99.47996287, 29.74993057],
                    [-114.24558787, 34.36597728],
                    [-113.19090037, 43.88589996]
                  ],
                  [
                    [-102.68797069, 33.71049779],
                    [-95.83250194, 36.72554725],
                    [-107.96140819, 42.41117116],
                    [-107.78562694, 37.28703657],
                    [-102.68797069, 33.71049779]
                  ]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Polygon'
              },
              'geometry'  : {
                'type'       : 'Point',
                'coordinates': [-97.54636912, 40.23328849],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Geometry'
              },
              'linestring': {
                'type'       : 'LineString',
                'coordinates': [
                  [-112.13621287, 42.60554422],
                  [-91.21824412, 38.46636627],
                  [-100.35886912, 35.94675206],
                  [-109.14793162, 34.58334196]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.LineString'
              },
              'point'     : {
                'type'       : 'Point',
                'coordinates': [
                  -104.05027537,
                  36.23085088
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Point'
              },
              '___class'  : 'GeoItems'
            }
          ],
          'child'   : {
            'created'   : 1589203424413,
            'updated'   : 1589203449977,
            'objectId'  : '62837712-49FA-36AA-FFD4-87B56C034C00',
            'ownerId'   : null,
            'key'       : 'g2',
            'polygon'   : {
              'type'       : 'Polygon',
              'coordinates': [
                [
                  [-118.64011912, 40.09896049],
                  [-93.85496287, 51.77113916],
                  [-86.12058787, 33.78357869],
                  [-118.64011912, 40.09896049]
                ]
              ],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.Polygon'
            },
            'geometry'  : null,
            'linestring': {
              'type'       : 'LineString',
              'coordinates': [
                [-113.54246287, 40.90093567],
                [-81.90183787, 49.42873486],
                [-81.90183787, 38.19057723]
              ],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.LineString'
            },
            'point'     : {
              'type'       : 'Point',
              'coordinates': [-112.66355662, 37.91373995],
              'srsId'      : 4326,
              '___class'   : 'com.backendless.persistence.Point'
            },
            '___class'  : 'GeoItems'
          }
        },
        {
          'created' : 1589203768100,
          'updated' : null,
          'objectId': 'AA1F0D9A-0F72-65D9-FFC5-9C268A362200',
          'ownerId' : null,
          'key'     : 'p3',
          '___class': 'ParentGeo',
          'children': [
            {
              'created'   : 1589203701262,
              'updated'   : null,
              'objectId'  : '05A4CF86-AB2D-0ED4-FF15-2EE91D7EBA00',
              'ownerId'   : null,
              'key'       : 'g3',
              'polygon'   : null,
              'geometry'  : null,
              'linestring': null,
              'point'     : null,
              '___class'  : 'GeoItems'
            },
            {
              'created'   : 1589203300819,
              'updated'   : 1589203393862,
              'objectId'  : 'CAAC9DEF-4558-66EA-FF82-309B5C909000',
              'ownerId'   : null,
              'key'       : 'g1',
              'polygon'   : {
                'type'       : 'Polygon',
                'coordinates': [
                  [
                    [-113.19090037, 43.88589996],
                    [-100.88621287, 46.96889771],
                    [-89.46043162, 40.23328849],
                    [-99.47996287, 29.74993057],
                    [-114.24558787, 34.36597728],
                    [-113.19090037, 43.88589996]
                  ],
                  [
                    [-102.68797069, 33.71049779],
                    [-95.83250194, 36.72554725],
                    [-107.96140819, 42.41117116],
                    [-107.78562694, 37.28703657],
                    [-102.68797069, 33.71049779]
                  ]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Polygon'
              },
              'geometry'  : {
                'type'       : 'Point',
                'coordinates': [-97.54636912, 40.23328849],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Geometry'
              },
              'linestring': {
                'type'       : 'LineString',
                'coordinates': [
                  [-112.13621287, 42.60554422],
                  [-91.21824412, 38.46636627],
                  [-100.35886912, 35.94675206],
                  [-109.14793162, 34.58334196]
                ],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.LineString'
              },
              'point'     : {
                'type'       : 'Point',
                'coordinates': [-104.05027537, 36.23085088],
                'srsId'      : 4326,
                '___class'   : 'com.backendless.persistence.Point'
              },
              '___class'  : 'GeoItems'
            }
          ],
          'child'   : {
            'created'   : 1589203701262,
            'updated'   : null,
            'objectId'  : '05A4CF86-AB2D-0ED4-FF15-2EE91D7EBA00',
            'ownerId'   : null,
            'key'       : 'g3',
            'polygon'   : null,
            'geometry'  : null,
            'linestring': null,
            'point'     : null,
            '___class'  : 'GeoItems'
          }
        }
      ])

      const { Point, LineString, Polygon, Geometry } = Backendless.Data

      const parent1 = result1[0] // p1 not rel
      const parent2 = result1[1] // p2 not rel
      const parent3 = result1[2] // p3 not rel

      expect(parent1.key).to.be.equal('p1')
      expect(parent1.child.key).to.be.equal('g1')
      expect(parent1.children[0].key).to.be.equal('g3')
      expect(parent1.children[1].key).to.be.equal('g2')

      expect(parent2.key).to.be.equal('p2')
      expect(parent2.child.key).to.be.equal('g2')
      expect(parent2.children[0].key).to.be.equal('g2')
      expect(parent2.children[1].key).to.be.equal('g1')

      expect(parent3.key).to.be.equal('p3')
      expect(parent3.child.key).to.be.equal('g3')
      expect(parent3.children[0].key).to.be.equal('g3')
      expect(parent3.children[1].key).to.be.equal('g1')

      // start checking g1 object [parent1.child, parent2.children[1], parent3.children[1]]

      expect(parent1.child.point).to.be.instanceof(Point)
      expect(parent2.children[1].point).to.be.instanceof(Point)
      expect(parent3.children[1].point).to.be.instanceof(Point)

      expect(parent1.child.point.asWKT())
        .to.be.equal(parent2.children[1].point.asWKT())
        .to.be.equal(parent3.children[1].point.asWKT())
        .to.be.equal('POINT(-104.05027537 36.23085088)')

      expect(parent1.child.linestring).to.be.instanceof(LineString)
      expect(parent2.children[1].linestring).to.be.instanceof(LineString)
      expect(parent3.children[1].linestring).to.be.instanceof(LineString)

      expect(parent1.child.linestring.asWKT())
        .to.be.equal(parent2.children[1].linestring.asWKT())
        .to.be.equal(parent3.children[1].linestring.asWKT())
        .to.be.equal('LINESTRING(-112.13621287 42.60554422,-91.21824412 38.46636627,-100.35886912 35.94675206,-109.14793162 34.58334196)')

      expect(parent1.child.geometry).to.be.instanceof(Geometry)
      expect(parent2.children[1].geometry).to.be.instanceof(Geometry)
      expect(parent3.children[1].geometry).to.be.instanceof(Geometry)

      expect(parent1.child.geometry.asWKT())
        .to.be.equal(parent2.children[1].geometry.asWKT())
        .to.be.equal(parent3.children[1].geometry.asWKT())
        .to.be.equal('POINT(-97.54636912 40.23328849)')

      expect(parent1.child.polygon).to.be.instanceof(Polygon)
      expect(parent2.children[1].polygon).to.be.instanceof(Polygon)
      expect(parent3.children[1].polygon).to.be.instanceof(Polygon)

      expect(parent1.child.polygon.asWKT())
        .to.be.equal(parent2.children[1].polygon.asWKT())
        .to.be.equal(parent3.children[1].polygon.asWKT())
        .to.be.equal('POLYGON((-113.19090037 43.88589996,-100.88621287 46.96889771,-89.46043162 40.23328849,-99.47996287 29.74993057,-114.24558787 34.36597728,-113.19090037 43.88589996),(-102.68797069 33.71049779,-95.83250194 36.72554725,-107.96140819 42.41117116,-107.78562694 37.28703657,-102.68797069 33.71049779))')

      // start checking g2 object [parent2.child, parent1.children[1], parent2.children[0]]

      expect(parent2.child.point).to.be.instanceof(Point)
      expect(parent1.children[1].point).to.be.instanceof(Point)
      expect(parent2.children[0].point).to.be.instanceof(Point)

      expect(parent2.child.point.asWKT())
        .to.be.equal(parent1.children[1].point.asWKT())
        .to.be.equal(parent2.children[0].point.asWKT())
        .to.be.equal('POINT(-112.66355662 37.91373995)')

      expect(parent2.child.linestring).to.be.instanceof(LineString)
      expect(parent1.children[1].linestring).to.be.instanceof(LineString)
      expect(parent2.children[0].linestring).to.be.instanceof(LineString)

      expect(parent2.child.linestring.asWKT())
        .to.be.equal(parent1.children[1].linestring.asWKT())
        .to.be.equal(parent2.children[0].linestring.asWKT())
        .to.be.equal('LINESTRING(-113.54246287 40.90093567,-81.90183787 49.42873486,-81.90183787 38.19057723)')

      expect(parent2.child.polygon).to.be.instanceof(Polygon)
      expect(parent1.children[1].polygon).to.be.instanceof(Polygon)
      expect(parent2.children[0].polygon).to.be.instanceof(Polygon)

      expect(parent2.child.polygon.asWKT())
        .to.be.equal(parent1.children[1].polygon.asWKT())
        .to.be.equal(parent2.children[0].polygon.asWKT())
        .to.be.equal('POLYGON((-118.64011912 40.09896049,-93.85496287 51.77113916,-86.12058787 33.78357869,-118.64011912 40.09896049))')

      // start checking g3 object [parent3.child, parent1.children[0], parent3.children[0]]

      expect(parent3.child.point).to.be.equal(null)
      expect(parent1.children[0].point).to.be.equal(null)
      expect(parent3.children[0].point).to.be.equal(null)

      expect(parent3.child.linestring).to.be.equal(null)
      expect(parent1.children[0].linestring).to.be.equal(null)
      expect(parent3.children[0].linestring).to.be.equal(null)

      expect(parent3.child.polygon).to.be.equal(null)
      expect(parent1.children[0].polygon).to.be.equal(null)
      expect(parent3.children[0].polygon).to.be.equal(null)
    })
  })

  describe('GEO Types', () => {

    it('fails due to unsupported GEO types', async () => {
      const check = geoData => dataStore.parseResponse([{ ___class: 'ParentGeo', geoData, }])

      const geoData1 = { type: 'InvalidTestType', ___class: 'com.backendless.persistence.Polygon' }
      const geoData2 = { type: 'InvalidTestType', ___class: 'com.backendless.persistence.LineString' }
      const geoData3 = { type: 'InvalidTestType', ___class: 'com.backendless.persistence.Point' }
      const geoData4 = { type: 'InvalidTestType', ___class: 'com.backendless.persistence.Geometry' }

      expect(() => check(geoData1)).to.throw('There is no constructor for InvalidTestType')
      expect(() => check(geoData2)).to.throw('There is no constructor for InvalidTestType')
      expect(() => check(geoData3)).to.throw('There is no constructor for InvalidTestType')
      expect(() => check(geoData4)).to.throw('There is no constructor for InvalidTestType')
    })
  })

  describe('Performance', () => {
    class Child {
    }

    it.performance('circular relations #1', async () => {
      prepareMockRequest([
        {
          created : 1589141341078,
          updated : 1589141357683,
          objectId: '1CA70A3A-A3C4-B454-FF43-2A0595AD0200',
          ownerId : null,
          key     : '111',
          ___class: 'Child',
          children: [
            {
              created : 1589141335441,
              updated : 1589141359837,
              objectId: 'C573DC58-F893-C42F-FF7D-E66ED6AB8C00',
              ownerId : null,
              key     : '333',
              ___class: 'Child',
              children: [
                {
                  created : 1589141337125,
                  updated : 1589141358968,
                  objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
                  ownerId : null,
                  key     : '222',
                  ___class: 'Child',
                  children: [
                    { __originSubID: 'child-222-rel' }
                  ],
                  __subID : 'child-222-rel'
                },
                { __originSubID: 'child-333-rel' },
                { __originSubID: 'child-111-rel' }
              ],
              __subID : 'child-333-rel'
            },
            { __originSubID: 'child-222-rel' }
          ],
          __subID : 'child-111-rel'
        },
        {
          created : 1589141337125,
          updated : 1589141358968,
          objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
          ownerId : null,
          key     : '222',
          ___class: 'Child',
          children: [
            { __originSubID: 'child-222-rel' }
          ],
          __subID : 'child-222-rel'
        },
        {
          created : 1589141335441,
          updated : 1589141359837,
          objectId: 'C573DC58-F893-C42F-FF7D-E66ED6AB8C00',
          ownerId : null,
          key     : '333',
          ___class: 'Child',
          children: [
            {
              created : 1589141337125,
              updated : 1589141358968,
              objectId: 'A8A4B67C-52ED-8D47-FF4C-F2095BC97900',
              ownerId : null,
              key     : '222',
              ___class: 'Child',
              children: [
                { __originSubID: 'child-222-rel' }
              ],
              __subID : 'child-222-rel'
            },
            { __originSubID: 'child-333-rel' },
            { __originSubID: 'child-111-rel' }
          ],
          __subID : 'child-333-rel'
        }
      ])

      Backendless.Data.mapTableToClass('Child', Child)

      await dataStore.find()
    }, { limit: 0.15 })

  })

  it('data store instance', async () => {
    class FooClass {
    }

    dataStore = Backendless.Data.of(FooClass)

    const result1 = dataStore.parseResponse({ foo: 123, bar: 'str' })
    const result2 = dataStore.parseResponse([{ foo: 111 }, { foo: 222 }])

    expect(result1).to.be.eql({ foo: 123, bar: 'str' })
    expect(result1).to.be.instanceof(FooClass)

    expect(result2).to.be.eql([{ foo: 111 }, { foo: 222 }])
    expect(result2[0]).to.be.instanceof(FooClass)
    expect(result2[1]).to.be.instanceof(FooClass)
  })

  it('uses classes from global by default for data store object with inner instances', async () => {
    // eslint-disable-next-line no-console
    const _nativeConsoleWarn = console.warn

    // eslint-disable-next-line no-console
    const spyConsoleWarn = console.warn = chai.spy()

    global.FooClass = class FooClass {
    }

    global.BarFun = function BarFun() {
    }

    dataStore = Backendless.Data.of(tableName)

    const result1 = dataStore.parseResponse({
      foo: { ___class: 'FooClass', value: 1, },
      bar: { ___class: 'BarFun', value: 2, }
    })

    const result2 = dataStore.parseResponse([
      { foo: { ___class: 'FooClass', value: 3, }, bar: { ___class: 'BarFun', value: 5, } },
      { foo: { ___class: 'FooClass', value: 4, }, bar: { ___class: 'BarFun', value: 6, } }
    ])

    expect(result1).to.be.eql({
      foo: { ___class: 'FooClass', value: 1, },
      bar: { ___class: 'BarFun', value: 2, }
    })

    expect(result1.foo).to.be.instanceof(FooClass)
    expect(result1.bar).to.be.instanceof(BarFun)

    expect(result2).to.be.eql([
      { foo: { ___class: 'FooClass', value: 3, }, bar: { ___class: 'BarFun', value: 5, } },
      { foo: { ___class: 'FooClass', value: 4, }, bar: { ___class: 'BarFun', value: 6, } }
    ])

    expect(result2[0].foo).to.be.instanceof(FooClass)
    expect(result2[0].bar).to.be.instanceof(BarFun)

    expect(result2[1].foo).to.be.instanceof(FooClass)
    expect(result2[1].bar).to.be.instanceof(BarFun)

    expect(spyConsoleWarn).to.have.been.called.exactly(6)

    const warningMsg = (
      'Resolving DataTable classes from the global scope is deprecated ' +
      'and it won\'t be supported in the nearest future. ' +
      'Instead, you should register your DataTable classes ' +
      'using the following method Backendless.Data.mapTableToClass'
    )

    expect(spyConsoleWarn).on.nth(1).be.called.with(warningMsg)
    expect(spyConsoleWarn).on.nth(2).be.called.with(warningMsg)
    expect(spyConsoleWarn).on.nth(3).be.called.with(warningMsg)
    expect(spyConsoleWarn).on.nth(4).be.called.with(warningMsg)
    expect(spyConsoleWarn).on.nth(5).be.called.with(warningMsg)
    expect(spyConsoleWarn).on.nth(6).be.called.with(warningMsg)

    // eslint-disable-next-line no-console
    console.warn = _nativeConsoleWarn
  })

  it('does not use classes from global for data store object with inner instances', async () => {
    // eslint-disable-next-line no-console
    const _nativeConsoleWarn = console.warn

    // eslint-disable-next-line no-console
    const spyConsoleWarn = console.warn = chai.spy()

    Backendless.useTableClassesFromGlobalScope = false

    global.FooClass = class FooClass {
    }

    global.BarFun = function BarFun() {
    }

    dataStore = Backendless.Data.of(tableName)

    const result1 = dataStore.parseResponse({
      foo: { ___class: 'FooClass', value: 1, },
      bar: { ___class: 'BarFun', value: 2, }
    })

    const result2 = dataStore.parseResponse([
      { foo: { ___class: 'FooClass', value: 3, }, bar: { ___class: 'BarFun', value: 5, } },
      { foo: { ___class: 'FooClass', value: 4, }, bar: { ___class: 'BarFun', value: 6, } }
    ])

    expect(result1).to.be.eql({
      foo: { ___class: 'FooClass', value: 1, },
      bar: { ___class: 'BarFun', value: 2, }
    })

    expect(result1.foo).to.not.be.instanceof(FooClass)
    expect(result1.bar).to.not.be.instanceof(BarFun)

    expect(result2).to.be.eql([
      { foo: { ___class: 'FooClass', value: 3, }, bar: { ___class: 'BarFun', value: 5, } },
      { foo: { ___class: 'FooClass', value: 4, }, bar: { ___class: 'BarFun', value: 6, } }
    ])

    expect(result2[0].foo).to.not.be.instanceof(FooClass)
    expect(result2[0].bar).to.not.be.instanceof(BarFun)

    expect(result2[1].foo).to.not.be.instanceof(FooClass)
    expect(result2[1].bar).to.not.be.instanceof(BarFun)

    expect(spyConsoleWarn).to.have.been.called.exactly(0)

    // eslint-disable-next-line no-console
    console.warn = _nativeConsoleWarn
  })

  it('data store object with inner instances from classesMap', async () => {
    class FooClass {
    }

    function BarFun() {
    }

    Backendless.Data.mapTableToClass('FooClass', FooClass)
    Backendless.Data.mapTableToClass('BarFun', BarFun)

    dataStore = Backendless.Data.of(tableName)

    const result1 = dataStore.parseResponse({
      foo: { ___class: 'FooClass', value: 1, },
      bar: { ___class: 'BarFun', value: 2, }
    })

    const result2 = dataStore.parseResponse([
      { foo: { ___class: 'FooClass', value: 3, }, bar: { ___class: 'BarFun', value: 5, } },
      { foo: { ___class: 'FooClass', value: 4, }, bar: { ___class: 'BarFun', value: 6, } }
    ])

    expect(result1).to.be.eql({
      foo: { ___class: 'FooClass', value: 1, },
      bar: { ___class: 'BarFun', value: 2, }
    })

    expect(result1.foo).to.be.instanceof(FooClass)
    expect(result1.bar).to.be.instanceof(BarFun)

    expect(result2).to.be.eql([
      { foo: { ___class: 'FooClass', value: 3, }, bar: { ___class: 'BarFun', value: 5, } },
      { foo: { ___class: 'FooClass', value: 4, }, bar: { ___class: 'BarFun', value: 6, } }
    ])

    expect(result2[0].foo).to.be.instanceof(FooClass)
    expect(result2[0].bar).to.be.instanceof(BarFun)

    expect(result2[1].foo).to.be.instanceof(FooClass)
    expect(result2[1].bar).to.be.instanceof(BarFun)
  })

  it('does not create data store instance', async () => {
    dataStore = Backendless.Data.of('Bar')

    const result1 = dataStore.parseResponse({ foo: 123, bar: 'str' })
    const result2 = dataStore.parseResponse([{ foo: 111 }, { foo: 222 }])

    expect(result1).to.be.eql({ foo: 123, bar: 'str' })
    expect(result1.constructor).to.be.equal(Object)

    expect(result2).to.be.eql([{ foo: 111 }, { foo: 222 }])
    expect(result2[0].constructor).to.be.equal(Object)
    expect(result2[1].constructor).to.be.equal(Object)
  })

})
