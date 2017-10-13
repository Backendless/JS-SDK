import FilePermission from './persmission'

const FilePermissions = {
  READ  : new FilePermission('READ'),
  DELETE: new FilePermission('DELETE'),
  WRITE : new FilePermission('WRITE'),
}

export default FilePermissions
