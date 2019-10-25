const LocalVars = {
  debugMode        : false,
  serverURL        : 'https://api.backendless.com',
  XMLHttpRequest   : typeof XMLHttpRequest !== 'undefined' ? XMLHttpRequest : undefined,
  applicationId    : null,
  secretKey        : null,
  appPath          : null,
  ServerCode       : null,
  defaultUserLocale: 'en'
}

export default LocalVars
