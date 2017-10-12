import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'
import Private from '../private'

const isRemoteUrl = url => url.startsWith('http://') || url.startsWith('https://')

const getFileName = file => {
  if (file.name) {
    return file.name
  }

  if (file.path) {
    const path = file.path.split('/')
    return path[path.length - 1] //last item of the file path
  }
}

const sanitizeFileName = fileName => encodeURIComponent(fileName).replace(/'/g, '%27').replace(/"/g, '%22')

const toBiteArray = content => {
  if (typeof Blob !== 'undefined') {

    if (!Array.isArray(content)) {
      content = [content]
    }

    content = new Blob(content)

  } else if (typeof Buffer !== 'undefined') {
    const value = Buffer.from(content)

    content = {
      value  : value,
      options: {
        filename   : 'blob',
        knownLength: value.byteLength,
        contentType: 'application/octet-stream'
      }
    }
  }

  return content
}

const getContentSize = content => {
  if (content.size) {
    return content.size
  }

  return content.options && content.options.knownLength
}

const sendFile = options => {
  const url = Urls.filePath(options.path) + '/' + sanitizeFileName(options.fileName)
  const query = {}

  if (Utils.isBoolean(options.overwrite)) {
    query.overwrite = options.overwrite
  }

  return Backendless._ajax({
    method      : 'POST',
    url         : url,
    query       : query,
    form        : { file: options.file },
    asyncHandler: options.asyncHandler
  })
}

export default class Files {
  constructor() {
    // this.restUrl = Urls.files()
  }

  /**
   * @param {String} path
   * @param {String} fileName
   * @param {String|Uint8Array} fileContent
   * @param {Boolean} overwrite
   * @returns {Promise.<String>}
   */
  saveFile = Utils.promisified('_saveFile')

  /**
   * @deprecated All sync API methods are deprecated
   * @param {String} path
   * @param {String} fileName
   * @param {String|Uint8Array} fileContent
   * @param {Boolean} overwrite
   * @returns {String}
   */
  saveFileSync = Utils.synchronized('_saveFile')

  _saveFile(path, fileName, fileContent, overwrite, asyncHandler) {
    if (!path || !Utils.isString(path)) {
      throw new Error('Missing value for the "path" argument. The argument must contain a string value')
    }

    if (!fileName || !Utils.isString(fileName)) {
      throw new Error('Missing value for the "fileName" argument. The argument must contain a string value')
    }

    if (overwrite instanceof Async) {
      asyncHandler = overwrite
      overwrite = null
    }

    fileContent = toBiteArray(fileContent)

    if (getContentSize(fileContent) > 2800000) {
      throw new Error('File Content size must be less than 2,800,000 bytes')
    }

    return sendFile({
      overwrite   : overwrite,
      path        : path,
      fileName    : fileName,
      file        : fileContent,
      asyncHandler: asyncHandler
    })
  }

  /**
   * @param {File} file
   * @param {String} path
   * @param {Boolean} overwrite
   * @returns {Promise.<String>}
   */
  upload = Utils.promisified('_upload')

  /**
   * @deprecated All sync API methods are deprecated
   * @param {File} file
   * @param {String} path
   * @param {Boolean} overwrite
   * @returns {String}
   */
  uploadSync = Utils.synchronized('_upload')

  _upload(file, path, overwrite, asyncHandler) {
    let fileName = getFileName(file)

    if (!fileName) {
      throw new Error('Wrong type of the file source object. Can not get file name')
    }

    asyncHandler = Utils.extractResponder(arguments)

    return sendFile({
      overwrite   : overwrite,
      path        : path,
      fileName    : fileName,
      file        : file,
      asyncHandler: asyncHandler
    })
  }

  listing = Utils.promisified('_listing')

  listingSync = Utils.synchronized('_listing')

  _listing(path, pattern, recursively, pagesize, offset/**, async */) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder
    let url = Urls.filePath(path)

    if ((arguments.length > 1) && !(arguments[1] instanceof Async)) {
      url += '?'
    }

    if (Utils.isString(pattern)) {
      url += ('pattern=' + pattern)
    }

    if (Utils.isBoolean(recursively)) {
      url += ('&sub=' + recursively)
    }

    if (Utils.isNumber(pagesize)) {
      url += '&pagesize=' + pagesize
    }

    if (Utils.isNumber(offset)) {
      url += '&offset=' + offset
    }

    return Backendless._ajax({
      method      : 'GET',
      url         : url,
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }

  renameFile = Utils.promisified('_renameFile')

  renameFileSync = Utils.synchronized('_renameFile')

  _renameFile(oldPathName, newName, async) {
    this._checkPath(oldPathName)

    const parameters = {
      oldPathName: oldPathName,
      newName    : newName
    }

    return this._doAction('rename', parameters, async)
  }

  moveFile = Utils.promisified('_moveFile')

  moveFileSync = Utils.synchronized('_moveFile')

  _moveFile(sourcePath, targetPath, async) {
    this._checkPath(sourcePath)
    this._checkPath(targetPath)

    const parameters = {
      sourcePath: sourcePath,
      targetPath: targetPath
    }

    return this._doAction('move', parameters, async)
  }

  copyFile = Utils.promisified('_copyFile')

  copyFileSync = Utils.synchronized('_copyFile')

  _copyFile(sourcePath, targetPath, async) {
    this._checkPath(sourcePath)
    this._checkPath(targetPath)

    const parameters = {
      sourcePath: sourcePath,
      targetPath: targetPath
    }

    return this._doAction('copy', parameters, async)
  }

  _checkPath(path) {
    if (!(/^\//).test(path)) {
      path = '/' + path
    }

    return path
  }

  _doAction(actionType, parameters/**, async */) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    return Backendless._ajax({
      method      : 'PUT',
      url         : Urls.fileAction(actionType),
      data        : JSON.stringify(parameters),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }

  remove = Utils.promisified('_remove')

  removeSync = Utils.synchronized('_remove')

  _remove(path/**, async */) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    const url = isRemoteUrl(path) ? path : Urls.filePath(path)

    Backendless._ajax({
      method      : 'DELETE',
      url         : url,
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }

  exists = Utils.promisified('_exists')

  existsSync = Utils.synchronized('_exists')

  _exists(path/**, async */) {
    if (!path || !Utils.isString(path)) {
      throw new Error('Missing value for the "path" argument. The argument must contain a string value')
    }

    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder
    const url = Urls.filePath(path) + '?action=exists'

    return Backendless._ajax({
      method      : 'GET',
      url         : url,
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }

  removeDirectory = Utils.promisified('_removeDirectory')

  removeDirectorySync = Utils.synchronized('_removeDirectory')

  _removeDirectory(path /**, async */) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    return Backendless._ajax({
      method      : 'DELETE',
      url         : Urls.filePath(path),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }

  getFileCount = Utils.promisified('_getFileCount')

  getFileCountSync = Utils.synchronized('_getFileCount')

  _getFileCount(path, /** pattern, recursive, countDirectories, async */) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder
    const query = this._buildCountQueryObject(arguments, isAsync)

    this._validateCountQueryObject(query)

    delete query.path

    const url = Urls.filePath(path) + '?' + Utils.toQueryParams(query)

    return Backendless._ajax({
      method      : 'GET',
      url         : url,
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }

  _buildCountQueryObject(args, isAsync) {
    args = isAsync ? Array.prototype.slice.call(args, 0, -1) : args

    return {
      action          : 'count',
      path            : args[0],
      pattern         : args[1] !== undefined ? args[1] : '*',
      recursive       : args[2] !== undefined ? args[2] : false,
      countDirectories: args[3] !== undefined ? args[3] : false
    }
  }

  _validateCountQueryObject(query) {
    if (!query.path || !Utils.isString(query.path)) {
      throw new Error('Missing value for the "path" argument. The argument must contain a string value')
    }

    if (!query.pattern || !Utils.isString(query.pattern)) {
      throw new Error('Missing value for the "pattern" argument. The argument must contain a string value')
    }

    if (!Utils.isBoolean(query.recursive)) {
      throw new Error('Missing value for the "recursive" argument. The argument must contain a boolean value')
    }

    if (!Utils.isBoolean(query.countDirectories)) {
      throw new Error('Missing value for the "countDirectories" argument. The argument must contain a boolean value')
    }
  }
}