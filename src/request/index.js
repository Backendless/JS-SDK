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

    const method = (config.method || Methods.GET).toLowerCase()
    const headers = config.headers || {}

    if (userToken) {
      headers['user-token'] = userToken
    }

    let request = BackendlessRequest[method](config.url, config.data)
      .set(headers)
      .query(config.query)
      .form(config.form)

    if (config.parser) {
      request = request.then(config.parser ? config.parser : result => result)
    }

    if (config.asyncHandler) {
      request.then(config.asyncHandler.success, config.asyncHandler.fault)
    }

    return request
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
