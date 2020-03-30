import Utils from '../utils'

import { EXECUTION_TYPE_HEADER, isExecutionType } from './constants'

export default class Events {
  constructor(app) {
    this.app = app

    Utils.enableAsyncHandlers(this, ['dispatch'])
  }

  async dispatch(eventName, eventArgs, executionType) {
    if (!eventName || !Utils.isString(eventName)) {
      throw new Error('Event Name must be provided and must be not an empty STRING!')
    }

    if (typeof eventArgs === 'string' && isExecutionType(eventArgs)) {
      executionType = eventArgs
      eventArgs = undefined
    }

    if (!Utils.isObject(eventArgs)) {
      eventArgs = {}
    }

    const headers = {}

    if (executionType) {
      headers[EXECUTION_TYPE_HEADER] = executionType
    }

    return this.app.request.post({
      url    : this.app.urls.blEvent(eventName),
      data   : eventArgs,
      headers: headers,
    })
  }
}
