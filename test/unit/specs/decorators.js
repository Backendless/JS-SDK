import { expect } from 'chai'
import { describe, it } from 'mocha'

import { deprecated } from '../../../src/decorators'

describe('Decorators', function() {
  this.timeout(2000)

  describe('deprecated', () => {

    it('should not have alternative message', () => {
      class Foo {

        @deprecated('FooNamespace')
        bar() {
        }
      }

      const foo = new Foo()

      const warn = console.warn

      let warnMessage

      console.warn = m => {
        warnMessage = m
      }

      foo.bar()

      expect(warnMessage).to.be.equal(
        '"FooNamespace.bar" is deprecated and will be removed in the nearest release.'
      )

      console.warn = warn
    })

    it('should have alternative message', () => {
      class Foo {

        @deprecated('FooNamespace', 'Alternative message')
        bar() {
        }
      }

      const foo = new Foo()

      const warn = console.warn

      let warnMessage

      console.warn = m => {
        warnMessage = m
      }

      foo.bar()

      expect(warnMessage).to.be.equal(
        '"FooNamespace.bar" is deprecated and will be removed in the nearest release. ' +
        'Please use Alternative message.'
      )

      console.warn = warn
    })

  })

})
