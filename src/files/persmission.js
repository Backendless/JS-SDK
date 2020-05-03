import Permission from '../persmission'

export default class FilePermission extends Permission {

  static BACKWARD_COMPATIBILITY_LABEL = 'Backendless.Files.Permissions.{READ|DELETE|WRITE}'

  getRequestURL(type, filePath) {
    return this.app.urls.filePermission(type, filePath)
  }
}
