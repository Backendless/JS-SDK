export default class Proxy {

  constructor() {
    this.eventHandlers = {}
  }

  on(eventName, handler) {
    if (!eventName) {
      throw new Error('Event name not specified')
    }

    if (!handler) {
      throw new Error('Handler not specified')
    }

    this.eventHandlers[eventName] = this.eventHandlers[eventName] || []
    this.eventHandlers[eventName].push(handler)
  }

  fireEvent(eventName, data) {
    const handlers = this.eventHandlers[eventName] || []

    handlers.forEach(handler => handler(data))
  }
}
