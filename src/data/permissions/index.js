import Permission from './persmission'

export default class DataPermissions {
  constructor(app) {
    this.FIND = new Permission('FIND', app)
    this.REMOVE = new Permission('REMOVE', app)
    this.UPDATE = new Permission('UPDATE', app)
  }
}