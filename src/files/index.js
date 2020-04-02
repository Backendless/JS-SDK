import FilesUtils from './utils'
import FilePermission from './persmission'

export default class Files {
  constructor(app) {
    this.app = app

    this.Permissions = {
      READ  : new FilePermission('READ', app),
      DELETE: new FilePermission('DELETE', app),
      WRITE : new FilePermission('WRITE', app),
    }
  }

  async saveFile(filePath, fileName, fileContent, overwrite) {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('File "path" must be provided and must be a string.')
    }

    if (!fileName || typeof fileName !== 'string') {
      throw new Error('File Name must be provided and must be a string.')
    }

    fileContent = await FilesUtils.toBase64(fileContent)

    const query = {}

    if (typeof overwrite === 'boolean') {
      query.overwrite = overwrite
    }

    return this.app.request.put({
      url    : `${this.app.urls.fileBinaryPath(filePath)}/${FilesUtils.sanitizeFileName(fileName)}`,
      headers: { 'Content-Type': 'text/plain' },
      query  : query,
      data   : fileContent,
    })
  }

  async upload(file, filePath, overwrite) {
    const fileName = FilesUtils.getFileName(file)

    if (!fileName) {
      throw new Error('Wrong type of the file source object. Can not get file name')
    }

    const query = {}

    if (typeof overwrite === 'boolean') {
      query.overwrite = overwrite
    }

    return this.app.request.post({
      url  : `${this.app.urls.filePath(filePath)}/${FilesUtils.sanitizeFileName(fileName)}`,
      query: query,
      form : {
        file
      },
    })
  }

  async listing(path, pattern, recursively, pagesize, offset) {
    const query = {}

    if (typeof pattern === 'string') {
      query.pattern = pattern
    }

    if (typeof recursively === 'boolean') {
      query.sub = recursively
    }

    if (typeof pagesize === 'number' && pagesize >= 0) {
      query.pagesize = pagesize
    }

    if (typeof offset === 'number' && offset >= 0) {
      query.offset = offset
    }

    return this.app.request.get({
      url: this.app.urls.filePath(path),
      query,
    })
  }

  async renameFile(oldPathName, newName) {
    if (!oldPathName || typeof oldPathName !== 'string') {
      throw new Error('Old File "path" must be provided and must be a string.')
    }

    if (!newName || typeof newName !== 'string') {
      throw new Error('New File "path" must be provided and must be a string.')
    }

    return this.app.request.put({
      url : this.app.urls.fileRename(),
      data: {
        oldPathName: FilesUtils.ensureSlashInPath(oldPathName),
        newName    : newName
      },
    })
  }

  async moveFile(sourcePath, targetPath) {
    return this.app.request.put({
      url : this.app.urls.fileMove(),
      data: {
        sourcePath: FilesUtils.ensureSlashInPath(sourcePath),
        targetPath: FilesUtils.ensureSlashInPath(targetPath)
      },
    })
  }

  async copyFile(sourcePath, targetPath) {
    return this.app.request.put({
      url : this.app.urls.fileCopy(),
      data: {
        sourcePath: FilesUtils.ensureSlashInPath(sourcePath),
        targetPath: FilesUtils.ensureSlashInPath(targetPath)
      },
    })
  }

  async remove(filePath) {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('File "path" must be provided and must be a string.')
    }

    if (!filePath.startsWith('http://') && !filePath.startsWith('https://')) {
      filePath = this.app.urls.filePath(filePath)
    }

    return this.app.request.delete({
      url: filePath,
    })
  }

  async exists(filePath) {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('File "path" must be provided and must be a string.')
    }

    return this.app.request.get({
      url  : this.app.urls.filePath(filePath),
      query: {
        action: 'exists'
      },
    })
  }

  async removeDirectory(directoryPath) {
    if (!directoryPath || typeof directoryPath !== 'string') {
      throw new Error('Directory "path" must be provided and must be a string.')
    }

    this.app.request.delete({
      url: this.app.urls.filePath(directoryPath),
    })
  }

  async getFileCount(filesPath, pattern, recursive, countDirectories) {
    if (!filesPath || typeof filesPath !== 'string') {
      throw new Error('Files "path" must be provided and must be a string.')
    }

    if (pattern && typeof pattern !== 'string') {
      throw new Error('Files Pattern must be provided and must be a string.')
    }

    return this.app.request.get({
      url: this.app.urls.filePath(filesPath),
      query:{
        action          : 'count',
        pattern         : pattern || '*',
        recursive       : !!recursive,
        countDirectories: !!countDirectories
      },
    })
  }

}

