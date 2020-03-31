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

  send(options) {
    BackendlessRequest.verbose = !!this.app.debugMode
    BackendlessRequest.XMLHttpRequest = this.app.XMLHttpRequest

    const method = (options.method || Methods.GET).toLowerCase()
    const headers = options.headers || {}
    const userToken = this.app.getCurrentUserToken()

    if (userToken) {
      headers['user-token'] = userToken
    }

    return BackendlessRequest[method](options.url, options.data)
      .set(headers)
      .query(options.query)
      .form(options.form)
  }

  get(options) {
    return this.send({ ...options, method: Methods.GET })
  }

  post(options) {
    return this.send({ ...options, method: Methods.POST })
  }

  put(options) {
    return this.send({ ...options, method: Methods.PUT })
  }

  patch(options) {
    return this.send({ ...options, method: Methods.PATCH })
  }

  delete(options) {
    return this.send({ ...options, method: Methods.DELETE })
  }
}
