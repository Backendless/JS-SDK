import Permission from './persmission'

export default class DataPermissions {
  constructor(backendless) {
    this.FIND = new Permission('FIND', backendless)
    this.REMOVE = new Permission('REMOVE', backendless)
    this.UPDATE = new Permission('UPDATE', backendless)
  }
}