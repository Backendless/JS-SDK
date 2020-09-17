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
  },

  getProviderCode(providerName) {
    //to snake case
    return providerName && providerName.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.toLowerCase())
      .join('_')
  }
}
