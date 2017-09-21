import Backendless from '../bundle'

export default class SharedObject {
  constructor(name, callback) {
    this.name = name
    this.callback = callback

    Backendless.RTClient.RSO.connect(this.name, this.callback)
  }

  disconnect(){
    Backendless.RTClient.RSO.disconnect(this.name, this.callback)
  }

  get(key, callback){
    Backendless.RTClient.RSO.get(this.name, key, callback)
  }

  set(key, data, callback){
    Backendless.RTClient.RSO.set(this.name, key, data, callback)
  }

  clear(callback){
    Backendless.RTClient.RSO.clear(this.name, callback)
  }

  on(event, callback) {
    Backendless.RTClient.RSO.onEvent(this.name, event, callback)
  }

  off(event, callback) {
    Backendless.RTClient.RSO.offEvent(this.name, event, callback)
  }
}
