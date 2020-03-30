import Utils from '../utils'
import Async from '../request/async'

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

  async saveFile(filePath, fileName, fileContent, overwrite, asyncHandler) {

    const toBase64 = content => {
      if (typeof Blob !== 'undefined') {
        if (!(content instanceof Blob)) {
          content = new Blob([content], { type: '' })
        }

        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onerror = error => reject(error)
          reader.onload = event => resolve(event.target.result.split(';base64,')[1])
          reader.readAsDataURL(content)
        })
      }

      if (typeof Buffer !== 'undefined') {
        return Promise.resolve(Buffer.from(content).toString('base64'))
      }

      return Promise.resolve(content)
    }

    const sanitizeFileName = fileName => encodeURIComponent(fileName).replace(/'/g, '%27').replace(/"/g, '%22')

    if (!filePath || !Utils.isString(filePath)) {
      throw new Error('Missing value for the "path" argument. The argument must contain a string value')
    }

    if (!fileName || !Utils.isString(fileName)) {
      throw new Error('Missing value for the "fileName" argument. The argument must contain a string value')
    }

    if (overwrite instanceof Async) {
      asyncHandler = overwrite
      overwrite = undefined
    }

    return toBase64(fileContent)
      .then(fileContent => {
        const query = {}

        if (Utils.isBoolean(overwrite)) {
          query.overwrite = overwrite
        }

        return this.app.request.put({
          url    : `${this.app.urls.fileBinaryPath(filePath)}/${sanitizeFileName(fileName)}`,
          query  : query,
          headers: { 'Content-Type': 'text/plain' },
          data   : fileContent,
          asyncHandler
        })
      })
  }

  async upload(file, filePath, overwrite, asyncHandler) {

    const getFileName = file => {
      if (file.name) {
        return file.name
      }

      if (file.path) {
        const path = file.path.split('/')
        return path[path.length - 1] //last item of the file path
      }
    }

    const fileName = getFileName(file)

    if (!fileName) {
      throw new Error('Wrong type of the file source object. Can not get file name')
    }

    if (overwrite instanceof Async) {
      asyncHandler = overwrite
      overwrite = undefined
    }

    const options = {
      overwrite   : overwrite,
      path        : filePath,
      fileName    : fileName,
      file        : file,
      asyncHandler: asyncHandler
    }

    const sanitizeFileName = fileName => encodeURIComponent(fileName).replace(/'/g, '%27').replace(/"/g, '%22')

    const url = this.app.urls.filePath(options.path) + '/' + sanitizeFileName(options.fileName)
    const query = {}

    if (Utils.isBoolean(options.overwrite)) {
      query.overwrite = options.overwrite
    }

    return this.app.request.post({
      url         : url,
      query       : query,
      form        : { file: options.file },
      asyncHandler: options.asyncHandler
    })
  }

  async listing(path, pattern, recursively, pagesize, offset, asyncHandler) {
    if (offset instanceof Async) {
      asyncHandler = offset
      offset = undefined

    } else if (pagesize instanceof Async) {
      asyncHandler = pagesize
      pagesize = undefined
      offset = undefined

    } else if (recursively instanceof Async) {
      asyncHandler = recursively
      recursively = undefined
      pagesize = undefined
      offset = undefined

    } else if (pattern instanceof Async) {
      asyncHandler = pattern
      pattern = undefined
      recursively = undefined
      pagesize = undefined
      offset = undefined
    }

    const query = {}

    if (Utils.isString(pattern)) {
      query.pattern = pattern
    }

    if (Utils.isBoolean(recursively)) {
      query.sub = recursively
    }

    if (Utils.isNumber(pagesize)) {
      query.pagesize = pagesize
    }

    if (Utils.isNumber(offset)) {
      query.offset = offset
    }

    return this.app.request.get({
      url         : this.app.urls.filePath(path),
      query       : query,
      asyncHandler: asyncHandler
    })
  }

  async renameFile(oldPathName, newName, asyncHandler) {
    if (!oldPathName || !Utils.isString(oldPathName)) {
      throw new Error('Old File "path" must not be empty and must be String')
    }

    if (!newName || !Utils.isString(newName)) {
      throw new Error('New File "path" must not be empty and must be String')
    }

    const parameters = {
      oldPathName: FilesUtils.ensureSlashInPath(oldPathName),
      newName    : newName
    }

    return this.app.request.put({
      url         : this.app.urls.fileRename(),
      data        : parameters,
      asyncHandler: asyncHandler
    })
  }

  async moveFile(sourcePath, targetPath, asyncHandler) {
    const parameters = {
      sourcePath: FilesUtils.ensureSlashInPath(sourcePath),
      targetPath: FilesUtils.ensureSlashInPath(targetPath)
    }

    return this.app.request.put({
      url         : this.app.urls.fileMove(),
      data        : parameters,
      asyncHandler: asyncHandler
    })
  }

  async copyFile(sourcePath, targetPath, asyncHandler) {
    const parameters = {
      sourcePath: FilesUtils.ensureSlashInPath(sourcePath),
      targetPath: FilesUtils.ensureSlashInPath(targetPath)
    }

    return this.app.request.put({
      url         : this.app.urls.fileCopy(),
      data        : parameters,
      asyncHandler: asyncHandler
    })
  }

  async remove(path, asyncHandler) {
    if (!path || !Utils.isString(path)) {
      throw new Error('File "path" must not be empty and must be String')
    }

    if (!path.startsWith('http://') && !path.startsWith('https://')) {
      path = this.app.urls.filePath(path)
    }

    return this.app.request.delete({
      url         : path,
      asyncHandler: asyncHandler
    })
  }

  async exists(path, asyncHandler) {
    if (!path || !Utils.isString(path)) {
      throw new Error('Files "path" must not be empty and must be String')
    }

    return this.app.request.get({
      url         : this.app.urls.filePath(path),
      query       : { action: 'exists' },
      asyncHandler: asyncHandler
    })
  }

  async removeDirectory(path, asyncHandler) {
    if (!path || !Utils.isString(path)) {
      throw new Error('Directory "path" must not be empty and must be String')
    }

    this.app.request.delete({
      url         : this.app.urls.filePath(path),
      asyncHandler: asyncHandler
    })
  }

  async getFileCount(path, pattern, recursive, countDirectories, asyncHandler) {

    if (countDirectories instanceof Async) {
      asyncHandler = countDirectories
      countDirectories = undefined

    } else if (recursive instanceof Async) {
      asyncHandler = recursive
      recursive = undefined
      countDirectories = undefined

    } else if (pattern instanceof Async) {
      asyncHandler = pattern
      pattern = undefined
      recursive = undefined
      countDirectories = undefined
    }

    const query = {
      action          : 'count',
      pattern         : pattern !== undefined ? pattern : '*',
      recursive       : !!recursive,
      countDirectories: !!countDirectories
    }

    if (!path || !Utils.isString(path)) {
      throw new Error('Files "path" must not be empty and must be String')
    }

    if (!query.pattern || !Utils.isString(query.pattern)) {
      throw new Error('Files "path" must not be empty and must be String')
    }

    return this.app.request.get({
      url         : this.app.urls.filePath(path),
      query       : query,
      asyncHandler: asyncHandler
    })
  }

}

