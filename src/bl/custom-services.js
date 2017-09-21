import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export default class CustomServices {

  constructor() {
    // this.restUrl = Urls.blServices()
  }

  invoke = Utils.promisified('_invoke')

  invokeSync = Utils.synchronized('_invoke')

  _invoke(serviceName, method, parameters, async) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    return Backendless._ajax({
      method      : 'POST',
      url         : Urls.blServiceMethod(serviceName, method),
      data        : JSON.stringify(parameters),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }
}

