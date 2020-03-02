import { sendRequest } from './request'

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

  send(...args) {
    return sendRequest.call(this, ...args)
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

  delete(config) {
    return this.send({ ...config, method: Methods.DELETE })
  }
}