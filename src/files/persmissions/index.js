import FilePermission from './persmission'

export default class FilePermissions {
  constructor(backendless) {
    this.backendless = backendless

    this.READ = new FilePermission('READ', backendless)
    this.DELETE = new FilePermission('DELETE', backendless)
    this.WRITE = new FilePermission('WRITE', backendless)
  }
}
