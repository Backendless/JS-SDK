export const UsersUtils = {
  getClientUserLocale() {
    if (typeof navigator === 'undefined') {
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
