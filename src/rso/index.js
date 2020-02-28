import Connection from './connection'

export default class RemoteSharedObjects {
  constructor(options, app) {
    this.app = app
  }

  connect(name) {
    return new Connection({ name }, this.app)
  }
}