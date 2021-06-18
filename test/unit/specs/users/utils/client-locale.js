import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless from '../../../helpers/sandbox'

describe('<Users> <Utils>', function() {
  describe('Client User Locale', function() {

    it('return undefined when navigator is non-existent', () => {
      global.navigator = undefined

      const locale = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale).to.be.eql(undefined)
    })

    it('return language code when navigator languages is not empty', () => {
      global.navigator = {
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
      global.navigator = {
        languages      : [],
        userLanguage   : 'ds-DS',
        language       : 'ms-MS',
        browserLanguage: 'es-ES',
        systemLanguage : 'ru-RU',
      }

      const locale1 = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale1).to.be.eql('ds')

      global.navigator.languages = undefined

      const locale2 = Backendless.UserService.Utils.getClientUserLocale()


      expect(locale2).to.be.eql('ds')
    })

    it('return language code when navigator userLanguage is undefined', () => {
      global.navigator = {
        language       : 'ms-MS',
        browserLanguage: 'es-ES',
        systemLanguage : 'ru-RU',
      }

      const locale = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale).to.be.eql('ms')
    })

    it('return language code when navigator userLanguage is undefined', () => {
      global.navigator = {
        browserLanguage: 'es-ES',
        systemLanguage : 'ru-RU',
      }

      const locale = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale).to.be.eql('es')
    })

    it('return language code when navigator browserLanguage is undefined', () => {
      global.navigator = {
        systemLanguage : 'ru-RU',
      }

      const locale = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale).to.be.eql('ru')
    })

    it('return empty string when navigator systemLanguage is undefined', () => {
      global.navigator = {}

      const locale = Backendless.UserService.Utils.getClientUserLocale()

      expect(locale).to.be.eql('')
    })

  })
})
