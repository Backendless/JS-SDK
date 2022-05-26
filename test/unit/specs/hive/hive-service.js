import { expect } from 'chai'
import { describe, it } from 'mocha'

import { DataHive } from '../../../../src/hive'
import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('HiveService', function() {
  forTest(this)

  const hiveName = 'test'

  const hiveUrl = `${APP_PATH}/hive`

  it('create Hive entity', async () => {
    const hive = Backendless.Hive(hiveName)

    expect(hive).to.be.instanceof(DataHive)
    expect(hive.hiveName).to.be.eql(hiveName)
  })

  it('fails when Hive name is invalid', async () => {
    const errorMsg = 'Hive name must be provided and must be a string.'

    expect(() => Backendless.Hive()).to.throw(errorMsg)
    expect(() => Backendless.Hive('')).to.throw(errorMsg)
    expect(() => Backendless.Hive(false)).to.throw(errorMsg)
    expect(() => Backendless.Hive(true)).to.throw(errorMsg)
    expect(() => Backendless.Hive(null)).to.throw(errorMsg)
    expect(() => Backendless.Hive(undefined)).to.throw(errorMsg)
    expect(() => Backendless.Hive(0)).to.throw(errorMsg)
    expect(() => Backendless.Hive(123)).to.throw(errorMsg)
    expect(() => Backendless.Hive({})).to.throw(errorMsg)
    expect(() => Backendless.Hive([])).to.throw(errorMsg)
    expect(() => Backendless.Hive(() => ({}))).to.throw(errorMsg)
  })

  describe('Methods', async () => {
    const fakeResult = { foo: true }

    describe('Get Names', async () => {
      it('should exists', async () => {
        expect(() => Backendless.Hive.getNames).to.exist
        expect(() => Backendless.Hive.getNames).to.be.a('function')
      })

      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await Backendless.Hive.getNames()

        expect(req1).to.deep.include({
          method: 'GET',
          path  : hiveUrl,
        })

        expect(result1).to.be.eql(fakeResult)
      })
    })

    describe('Delete', async () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await Backendless.Hive(hiveName).delete()

        expect(req1).to.deep.include({
          method: 'DELETE',
          path  : `${hiveUrl}/${hiveName}`,
        })

        expect(result1).to.be.eql(fakeResult)
      })
    })

    describe('Create', async () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await Backendless.Hive(hiveName).create()

        expect(req1).to.deep.include({
          method: 'POST',
          path  : `${hiveUrl}/${hiveName}`,
        })

        expect(result1).to.be.eql(fakeResult)
      })
    })

    describe('Rename', async () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await Backendless.Hive(hiveName).rename('newHiveName')

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${hiveUrl}/${hiveName}?newName=newHiveName`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when new hive name is invalid', async ()=> {
        const errorMsg = 'New Hive name must be provided and must be a string.'

        const hive = Backendless.Hive(hiveName)

        await expect(() => hive.rename(undefined)).to.throw(errorMsg)
        await expect(() => hive.rename(null)).to.throw(errorMsg)
        await expect(() => hive.rename(false)).to.throw(errorMsg)
        await expect(() => hive.rename(true)).to.throw(errorMsg)
        await expect(() => hive.rename(0)).to.throw(errorMsg)
        await expect(() => hive.rename(123)).to.throw(errorMsg)
        await expect(() => hive.rename(() => undefined)).to.throw(errorMsg)
        await expect(() => hive.rename({})).to.throw(errorMsg)
      })
    })
  })
})
