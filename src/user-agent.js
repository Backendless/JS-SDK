export function getUserAgent() {
  const { default: Utils } = require('./utils')

  let ua = 'NodeJS'

  if (Utils.isBrowser) {
    ua = navigator.userAgent ? navigator.userAgent.toLowerCase() : 'hybrid-app'
  }

  const match = (/(chrome)[ \/]([\w.]+)/.exec(ua) ||
    /(webkit)[ \/]([\w.]+)/.exec(ua) ||
    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
    /(msie) ([\w.]+)/.exec(ua) ||
    ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [])

  const matched = {
    browser: match[1] || '',
    version: match[2] || '0'
  }

  const browser = {}

  if (matched.browser) {
    browser[matched.browser] = true
    browser.version = matched.version
  }

  return browser
}
