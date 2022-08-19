import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('Hive Service', function() {
  forTest(this)

  const hiveName = 'test'
  const fakeResult = { foo: true }

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

  describe('Get Names', async () => {
    it('success', async () => {
      const request = prepareMockRequest(fakeResult)

      const result = await Backendless.Hive.getNames()

      expect(request).to.deep.include({
        method: 'GET',
        path  : `${APP_PATH}/hive`,
      })

      expect(result).to.be.eql(fakeResult)
    })
  })

  describe('Delete', async () => {
    it('success', async () => {
      const request = prepareMockRequest(fakeResult)

      const result = await Backendless.Hive(hiveName).delete()

      expect(request).to.deep.include({
        method: 'DELETE',
        path  : `${APP_PATH}/hive/${hiveName}`,
      })

      expect(result).to.be.eql(fakeResult)
    })
  })

  describe('Create', async () => {
    it('success', async () => {
      const request = prepareMockRequest(fakeResult)

      const result = await Backendless.Hive(hiveName).create()

      expect(request).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/hive/${hiveName}`,
      })

      expect(result).to.be.eql(fakeResult)
    })
  })

  describe('Rename', async () => {
    it('success', async () => {
      const request = prepareMockRequest(fakeResult)

      const result = await Backendless.Hive(hiveName).rename('newHiveName')

      expect(request).to.deep.include({
        method: 'PUT',
        path  : `${APP_PATH}/hive/${hiveName}?newName=newHiveName`,
      })

      expect(result).to.be.eql(fakeResult)
    })

    it('fails when new hive name is invalid', async () => {
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
