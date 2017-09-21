import Proxy from './proxy'

export default class SocketProxy extends Proxy {
  constructor(url) {
    super()

    this.reconnectWithPolling = true

    try {
      const socket = this.socket = new WebSocket(url)

      socket.onopen = () => this.sockOpen()
      socket.onerror = error => this.sockError(error)
      socket.onclose = () => this.onSocketClose()
      socket.onmessage = event => this.onMessage(event)

    } catch (e) {
      setTimeout(() => this.onSocketClose(), 100)
    }
  }

  onMessage() {
    this.fireEvent('messageReceived', data)
  }

  onSocketClose(data) {
    if (this.reconnectWithPolling) {
      this.fireEvent('socketClose', data)
    }
  }

  close() {
    this.reconnectWithPolling = false

    this.socket.close()
  }
}
