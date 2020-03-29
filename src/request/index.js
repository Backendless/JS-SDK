import BackendlessRequest from 'backendless-request'

const Methods = {
  GET   : 'GET',
  POST  : 'POST',
  PUT   : 'PUT',
  DELETE: 'DELETE',
  PATCH : 'PATCH',
}

export default class Request {
  constructor(app) {
    this.app = app

    this.Methods = Methods
  }

  send(config) {
    const XMLHttpRequest = this.app.XMLHttpRequest
    const userToken = this.app.getCurrentUserToken()

    BackendlessRequest.verbose = !!this.app.debugMode
    BackendlessRequest.XMLHttpRequest = XMLHttpRequest

    const url = config.url
    const method = (config.method || Methods.GET).toLowerCase()
    const headers = config.headers || {}

    if (userToken) {
      headers['user-token'] = userToken
    }

    const onError = config.asyncHandler.fault || (error => throw error)
    const onSuccess = config.asyncHandler.success || (result => result)

    return BackendlessRequest[method](url, config.data)
      .set(headers)
      .query(config.query)
      .form(config.form)
      .then(onSuccess, onError)
  }

  get(config) {
    return this.send({ ...config, method: Methods.GET })
  }

  post(config) {
    return this.send({ ...config, method: Methods.POST })
  }

  put(config) {
    return this.send({ ...config, method: Methods.PUT })
  }

  patch(config) {
    return this.send({ ...config, method: Methods.PATCH })
  }

  delete(config) {
    return this.send({ ...config, method: Methods.DELETE })
  }
}
