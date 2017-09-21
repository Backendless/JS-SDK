export const NativeSocketEvents = {
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

export const SubscriptionEvents = {
  SUB_ON : 'SUB_ON',
  SUB_OFF: 'SUB_OFF',
  SUB_END: 'SUB_END',
  SUB_RES: 'SUB_RES'
}

export const MethodEvents = {
  MET_REQ: 'MET_REQ',
  MET_RES: 'MET_RES'
}

export const SubscriptionTypes = {
  OBJECTS_CHANGES: 'OBJECTS_CHANGES',
  RSO_CONNECT    : 'RSO_CONNECT',
  RSO_EVENT      : 'RSO_EVENT',
  PUB_SUB        : 'PUB_SUB',
}

export const MethodTypes = {
  RSO_GET  : 'RSO_GET',
  RSO_SET  : 'RSO_SET',
  RSO_CLEAR: 'RSO_CLEAR',
}
