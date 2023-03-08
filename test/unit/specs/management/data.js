import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('Management - Data', function() {
  forTest(this)

  const fakeResult = { foo: true }

  describe('Create Table', function() {
    it('success', async () => {
      const request = prepareMockRequest(fakeResult)

      const result = await Backendless.Management.Data.createTable('MyTable', [])

      expect(request).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/management/data/table`,
        body  : { name: 'MyTable', columns: [] }
      })

      expect(result).to.be.eql(fakeResult)
    })

    it('fail when name is not provided or not a string', async () => {
      const errorMsg = 'Table name must be provided and must be a string.'

      await expect(() => Backendless.Management.Data.createTable(undefined, [])).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable(null, [])).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable(false, [])).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable(true, [])).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable([], [])).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable(0, [])).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable('', [])).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable(123, [])).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable(() => undefined, [])).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable({}, [])).to.throw(errorMsg)
    })

    it('fail when columns is not provided or not an array', async () => {
      const errorMsg = 'Columns must be a list.'

      await expect(() => Backendless.Management.Data.createTable('MyTable', undefined)).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable('MyTable', null)).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable('MyTable', false)).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable('MyTable', true)).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable('MyTable', 0)).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable('MyTable', 123)).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable('MyTable', () => undefined)).to.throw(errorMsg)
      await expect(() => Backendless.Management.Data.createTable('MyTable', {})).to.throw(errorMsg)
    })
  })
})
