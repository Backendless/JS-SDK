import { EXECUTION_TYPE_HEADER, isExecutionType } from './constants'

export default class Events {
  constructor(app) {
    this.app = app
  }

  async dispatch(eventName, eventArgs, executionType) {
    if (!eventName || typeof eventName !== 'string') {
      throw new Error('Event Name must be provided and must be a string.')
    }

    if (typeof eventArgs === 'string' && isExecutionType(eventArgs)) {
      executionType = eventArgs
      eventArgs = undefined
    }

    if (eventArgs && (typeof eventArgs !== 'object' || Array.isArray(eventArgs))) {
      throw new Error('Event Arguments must be an object.')
    }

    const headers = {}

    if (executionType) {
      headers[EXECUTION_TYPE_HEADER] = executionType
    }

    return this.app.request.post({
      url    : this.app.urls.blEvent(eventName),
      data   : eventArgs || {},
      headers: headers,
    })
  }
}
