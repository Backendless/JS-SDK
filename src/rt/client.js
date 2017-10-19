import RTProvider from './provider'

const NativeSocketEvents = {
  CONNECT          : 'connect',
  CONNECT_ERROR    : 'connect_error',
  CONNECT_TIMEOUT  : 'connect_timeout',
  DISCONNECT       : 'disconnect',
  RECONNECT        : 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECTING     : 'reconnecting',
  RECONNECT_ERROR  : 'reconnect_error',
  RECONNECT_FAILED : 'reconnect_failed',
  ERROR            : 'error',
  PING             : 'ping',
  PONG             : 'pong',
}

const delayedMethod = (method, event) => callback => RTProvider.runDelayedMethod(method, event, callback)

const RTClient = {

  addConnectEventListener   : delayedMethod('on', NativeSocketEvents.CONNECT),
  removeConnectEventListener: delayedMethod('off', NativeSocketEvents.CONNECT),

  addConnectErrorEventListener   : delayedMethod('on', NativeSocketEvents.CONNECT_ERROR),
  removeConnectErrorEventListener: delayedMethod('off', NativeSocketEvents.CONNECT_ERROR),

  addConnectTimeoutEventListener   : delayedMethod('on', NativeSocketEvents.CONNECT_TIMEOUT),
  removeConnectTimeoutEventListener: delayedMethod('off', NativeSocketEvents.CONNECT_TIMEOUT),

  addDisconnectEventListener   : delayedMethod('on', NativeSocketEvents.DISCONNECT),
  removeDisconnectEventListener: delayedMethod('off', NativeSocketEvents.DISCONNECT),

  addReconnectEventListener   : delayedMethod('on', NativeSocketEvents.RECONNECT),
  removeReconnectEventListener: delayedMethod('off', NativeSocketEvents.RECONNECT),

  addReconnectAttemptEventListener   : delayedMethod('on', NativeSocketEvents.RECONNECT_ATTEMPT),
  removeReconnectAttemptEventListener: delayedMethod('off', NativeSocketEvents.RECONNECT_ATTEMPT),

  addReconnectingEventListener   : delayedMethod('on', NativeSocketEvents.RECONNECTING),
  removeReconnectingEventListener: delayedMethod('off', NativeSocketEvents.RECONNECTING),

  addReconnectErrorEventListener   : delayedMethod('on', NativeSocketEvents.RECONNECT_ERROR),
  removeReconnectErrorEventListener: delayedMethod('off', NativeSocketEvents.RECONNECT_ERROR),

  addReconnectFailedEventListener   : delayedMethod('on', NativeSocketEvents.RECONNECT_FAILED),
  removeReconnectFailedEventListener: delayedMethod('off', NativeSocketEvents.RECONNECT_FAILED)

}

export default RTClient