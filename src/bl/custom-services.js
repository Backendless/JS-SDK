import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

const invoke = (serviceName, method, parameters, async) => {
  const responder = Utils.extractResponder(arguments)

  return Backendless._ajax({
    method      : 'POST',
    url         : Urls.blServiceMethod(serviceName, method),
    data        : JSON.stringify(parameters),
    isAsync     : !!responder,
    asyncHandler: responder
  })
}

const CustomServices = {

  invoke: Utils.promisified(invoke),

  invokeSync: Utils.synchronized(invoke)

}

export default CustomServices

