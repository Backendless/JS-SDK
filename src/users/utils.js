import Utils from '../utils'

export const UsersUtils = {
  getClientUserLocale() {
    const navigator = Utils.getWindowNavigator()

    if (typeof navigator === 'undefined' || !navigator) {
      return
    }

    let language = ''

    if (navigator.languages && navigator.languages.length) {
      language = navigator.languages[0]
    } else {
      language = navigator.userLanguage
        || navigator.language
        || navigator.browserLanguage
        || navigator.systemLanguage
        || ''
    }

    return language.slice(0, 2).toLowerCase()
  }
}
