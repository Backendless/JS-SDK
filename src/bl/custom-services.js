import Utils from '../utils'

import { invokeServiceMethod } from './invoke-service-method'

const CustomServices = {

  invoke: Utils.promisified(invokeServiceMethod),

  invokeSync: Utils.synchronized(invokeServiceMethod)

}

export default CustomServices

