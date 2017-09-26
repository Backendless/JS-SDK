import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'
import Private from '../private'

const isRemoteUrl = url => url.startsWith('http://') || url.startsWith('https://')

function sendData(options) {
  const async = options.async
  const encoded = options.encoded
  const boundary = '-backendless-multipart-form-boundary-' + Utils.getNow()
  const xhr = new Backendless.XMLHttpRequest()

  const badResponse = xhr => {
    let result = {}

    try {
      result = JSON.parse(xhr.responseText)
    } catch (e) {
      result.message = xhr.responseText
    }

    result.statusCode = xhr.status

    return result
  }

  xhr.open(options.method, options.url, !!async)

  if (encoded) {
    xhr.setRequestHeader('Content-Type', 'text/plain')
  } else {
    xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary)
  }

  if (Private.getUIState() !== null) {
    xhr.setRequestHeader('uiState', Private.getUIState())
  }

  const currentUser = Private.getCurrentUser()
  const userToken = currentUser && currentUser['user-token'] || Backendless.LocalCache.get('user-token')

  if (userToken) {
    xhr.setRequestHeader('user-token', userToken)
  }

  if (async) {
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status) {
        if (xhr.status >= 200 && xhr.status < 300) {
          async.success(JSON.parse(xhr.responseText))
        } else {
          async.fault(JSON.parse(xhr.responseText))
        }
      }
    }

    xhr.onerror = Utils.onHttpRequestErrorHandler(xhr, async.fault, badResponse)
  }

  xhr.send(encoded ? options.data : Utils.stringToBiteArray(getBuilder(options.fileName, options.data, boundary)))

  if (async) {
    return xhr
  }

  if (xhr.status >= 200 && xhr.status < 300) {
    return xhr.responseText ? JSON.parse(xhr.responseText) : true
  } else {
    throw badResponse(xhr)
  }
}

function getBuilder(filename, filedata, boundary) {
  const dashdash = '--'
  const crlf = '\r\n'
  let builder = ''

  builder += dashdash
  builder += boundary
  builder += crlf
  builder += 'Content-Disposition: form-data; name="file"'
  builder += '; filename="' + filename + '"'
  builder += crlf

  builder += 'Content-Type: application/octet-stream'
  builder += crlf
  builder += crlf

  builder += filedata
  builder += crlf

  builder += dashdash
  builder += boundary
  builder += dashdash
  builder += crlf

  return builder
}

export default class Files {
  constructor() {
    // this.restUrl = Urls.files()
  }

  saveFile = Utils.promisified('_saveFile')

  saveFileSync = Utils.synchronized('_saveFile')

  _saveFile(path, fileName, fileContent, overwrite, async) {
    if (!path || !Utils.isString(path)) {
      throw new Error('Missing value for the "path" argument. The argument must contain a string value')
    }

    if (!fileName || !Utils.isString(path)) {
      throw new Error('Missing value for the "fileName" argument. The argument must contain a string value')
    }

    if (overwrite instanceof Async) {
      async = overwrite
      overwrite = null
    }

    if (typeof File !== 'undefined' && !(fileContent instanceof File)) {
      fileContent = new Blob([fileContent])
    }

    if (fileContent.size > 2800000) {
      throw new Error('File Content size must be less than 2,800,000 bytes')
    }

    let baseUrl = Urls.fileBinary(path, (Utils.isString(fileName) && fileName))

    if (overwrite) {
      baseUrl += '?overwrite=true'
    }

    fileName = encodeURIComponent(fileName).replace(/'/g, '%27').replace(/"/g, '%22')

    function send(content) {
      sendData({
        url     : baseUrl,
        data    : content,
        fileName: fileName,
        encoded : true,
        async   : async,
        method  : 'PUT'
      })
    }

    if (typeof Blob !== 'undefined' && fileContent instanceof Blob) {
      const reader = new FileReader()
      reader.fileName = fileName
      reader.onloadend = function(e) {
        send(e.target.result.split(',')[1])
      }

      reader.onerror = function(evn) {
        async.fault(evn)
      }

      reader.readAsDataURL(fileContent)
    } else {
      send(fileContent)
    }

    if (!async) {
      return true
    }
  }

  upload = Utils.promisified('_upload')

  uploadSync = Utils.synchronized('_upload')

  _upload(files, path, overwrite, async) {
    async = Utils.extractResponder(arguments)
    files = files.files || files

    const baseUrl = Urls.filePath(path) + '/'

    let overwriting = ''

    if (Utils.isBoolean(overwrite)) {
      overwriting = '?overwrite=' + overwrite
    }

    if (Utils.isBrowser) {
      if (window.File && window.FileList) {
        if (files instanceof File) {
          files = [files]
        }

        for (let i = 0, len = files.length; i < len; i++) {
          try {
            const reader = new FileReader()
            const fileName = encodeURIComponent(files[i].name).replace(/'/g, '%27').replace(/"/g, '%22')
            const url = baseUrl + fileName + overwriting

            reader.fileName = fileName
            reader.onloadend = function(e) {
              sendData({
                url     : url,
                data    : e.target.result,
                fileName: fileName,
                async   : async,
                method  : 'POST'
              })
            }

            reader.onerror = function(evn) {
              async.fault(evn)
            }
            reader.readAsBinaryString(files[i])

          } catch (err) {

          }
        }
      }
      else {
        //IE iframe hack
        const ifrm = document.createElement('iframe')
        ifrm.id = ifrm.name = 'ifr' + Utils.getNow()
        ifrm.width = ifrm.height = '0'

        document.body.appendChild(ifrm)
        const form = document.createElement('form')
        form.target = ifrm.name
        form.enctype = 'multipart/form-data'
        form.method = 'POST'
        document.body.appendChild(form)
        form.appendChild(files)
        let fileName = encodeURIComponent(files.value).replace(/'/g, '%27').replace(/"/g, '%22')
        const index = fileName.lastIndexOf('\\')

        if (index) {
          fileName = fileName.substring(index + 1)
        }
        form.action = baseUrl + fileName + overwriting
        form.submit()
      }
    } else {
      throw new Error('Upload File not supported with NodeJS')
    }
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