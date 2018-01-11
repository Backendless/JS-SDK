import { NativeSocketEvents } from './constants'
import RTProvider from './provider'


const subscribeNativeEvent = event => callback => RTProvider.addNativeEventListener(event, callback)
const unsubscribeNativeEvent = event => callback => RTProvider.removeNativeEventListener(event, callback)

const RTClient = {

  addConnectEventListener   : subscribeNativeEvent(NativeSocketEvents.CONNECT),
  removeConnectEventListener: unsubscribeNativeEvent(NativeSocketEvents.CONNECT),

  addConnectErrorEventListener   : subscribeNativeEvent(NativeSocketEvents.CONNECT_ERROR),
  removeConnectErrorEventListener: unsubscribeNativeEvent(NativeSocketEvents.CONNECT_ERROR),

  addDisconnectEventListener   : subscribeNativeEvent(NativeSocketEvents.DISCONNECT),
  removeDisconnectEventListener: unsubscribeNativeEvent(NativeSocketEvents.DISCONNECT),

  addReconnectAttemptEventListener   : subscribeNativeEvent(NativeSocketEvents.RECONNECT_ATTEMPT),
  removeReconnectAttemptEventListener: unsubscribeNativeEvent(NativeSocketEvents.RECONNECT_ATTEMPT),
}

export default RTClient