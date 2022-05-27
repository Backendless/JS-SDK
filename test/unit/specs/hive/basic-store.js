import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest } from '../../helpers/sandbox'

describe('Hive Store Class', function() {
  forTest(this)

  const hiveName = 'test'

  describe('Store Creating', () => {
    it('fails with invalid store key', async () => {
      const errorMsg = 'Store key must be a string.'

      const hive = Backendless.Hive(hiveName)

      await expect(() => hive.KeyValueStore(null)).to.throw(errorMsg)
      await expect(() => hive.KeyValueStore(0)).to.throw(errorMsg)
      await expect(() => hive.KeyValueStore(false)).to.throw(errorMsg)
      await expect(() => hive.KeyValueStore(true)).to.throw(errorMsg)
      await expect(() => hive.KeyValueStore(123)).to.throw(errorMsg)
      await expect(() => hive.KeyValueStore(() => undefined)).to.throw(errorMsg)
      await expect(() => hive.KeyValueStore({})).to.throw(errorMsg)

      await expect(() => hive.ListStore(null)).to.throw(errorMsg)
      await expect(() => hive.ListStore(0)).to.throw(errorMsg)
      await expect(() => hive.ListStore(false)).to.throw(errorMsg)
      await expect(() => hive.ListStore(true)).to.throw(errorMsg)
      await expect(() => hive.ListStore(123)).to.throw(errorMsg)
      await expect(() => hive.ListStore(() => undefined)).to.throw(errorMsg)
      await expect(() => hive.ListStore({})).to.throw(errorMsg)

      await expect(() => hive.MapStore(null)).to.throw(errorMsg)
      await expect(() => hive.MapStore(0)).to.throw(errorMsg)
      await expect(() => hive.MapStore(false)).to.throw(errorMsg)
      await expect(() => hive.MapStore(true)).to.throw(errorMsg)
      await expect(() => hive.MapStore(123)).to.throw(errorMsg)
      await expect(() => hive.MapStore(() => undefined)).to.throw(errorMsg)
      await expect(() => hive.MapStore({})).to.throw(errorMsg)

      await expect(() => hive.SetStore(null)).to.throw(errorMsg)
      await expect(() => hive.SetStore(0)).to.throw(errorMsg)
      await expect(() => hive.SetStore(false)).to.throw(errorMsg)
      await expect(() => hive.SetStore(true)).to.throw(errorMsg)
      await expect(() => hive.SetStore(123)).to.throw(errorMsg)
      await expect(() => hive.SetStore(() => undefined)).to.throw(errorMsg)
      await expect(() => hive.SetStore({})).to.throw(errorMsg)

      await expect(() => hive.SortedSetStore(null)).to.throw(errorMsg)
      await expect(() => hive.SortedSetStore(0)).to.throw(errorMsg)
      await expect(() => hive.SortedSetStore(false)).to.throw(errorMsg)
      await expect(() => hive.SortedSetStore(true)).to.throw(errorMsg)
      await expect(() => hive.SortedSetStore(123)).to.throw(errorMsg)
      await expect(() => hive.SortedSetStore(() => undefined)).to.throw(errorMsg)
      await expect(() => hive.SortedSetStore({})).to.throw(errorMsg)
    })
  })
})
