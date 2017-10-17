import { sendRequest } from './request'

const Methods = {
  GET   : 'GET',
  POST  : 'POST',
  PUT   : 'PUT',
  DELETE: 'DELETE',
  PATCH : 'PATCH',
}

const Request = {
  Methods,

  send  : sendRequest,
  get   : config => sendRequest({ ...config, method: Methods.GET }),
  post  : config => sendRequest({ ...config, method: Methods.POST }),
  put   : config => sendRequest({ ...config, method: Methods.PUT }),
  delete: config => sendRequest({ ...config, method: Methods.DELETE }),
}

export default Request