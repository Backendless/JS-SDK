import FilePermission from './persmission'

export default class FilePermissions {
  constructor(app) {
    this.app = app

    this.READ = new FilePermission('READ', app)
    this.DELETE = new FilePermission('DELETE', app)
    this.WRITE = new FilePermission('WRITE', app)
  }
}
