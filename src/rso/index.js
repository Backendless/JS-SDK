import Connection from './connection'

export default class RemoteSharedObjects {
  constructor(options, backendless) {
    this.backendless = backendless
  }

  connect(name) {
    return new Connection({ name }, this.backendless)
  }
}