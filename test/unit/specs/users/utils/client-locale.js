import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless from '../../../helpers/sandbox'

describe('<Users> <Utils>', function() {
  describe('Client User Locale', function() {

    it('return undefined when navigator is non-existent', () => {
      global.__test_navigator = null

      const locale = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale).to.be.eql(undefined)
    })

    it('return language code when navigator languages is not empty', () => {
      global.__test_navigator = {
        languages      : ['en-EN','ek-EK'],
        userLanguage   : 'ds-DS',
        language       : 'ms-MS',
        browserLanguage: 'es-ES',
        systemLanguage : 'ru-RU',
      }

      const locale = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale).to.be.eql('en')
    })

    it('return language code when navigator languages is undefined', () => {
      global.__test_navigator = {
        languages      : [],
        userLanguage   : 'ds-DS',
        language       : 'ms-MS',
        browserLanguage: 'es-ES',
        systemLanguage : 'ru-RU',
      }

      const locale1 = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale1).to.be.eql('ds')

      global.__test_navigator.languages = undefined

      const locale2 = Backendless.UserService.Utils.getClientUserLocale()


      expect(locale2).to.be.eql('ds')
    })

    it('return language code when navigator userLanguage is undefined', () => {
      global.__test_navigator = {
        language       : 'ms-MS',
        browserLanguage: 'es-ES',
        systemLanguage : 'ru-RU',
      }

      const locale = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale).to.be.eql('ms')
    })

    it('return language code when navigator userLanguage is undefined', () => {
      global.__test_navigator = {
        browserLanguage: 'es-ES',
        systemLanguage : 'ru-RU',
      }

      const locale = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale).to.be.eql('es')
    })

    it('return language code when navigator browserLanguage is undefined', () => {
      global.__test_navigator = {
        systemLanguage : 'ru-RU',
      }

      const locale = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale).to.be.eql('ru')
    })

    it('return empty string when navigator systemLanguage is undefined', () => {
      global.__test_navigator = {}

      const locale = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale).to.be.eql('')
    })

  })
})
