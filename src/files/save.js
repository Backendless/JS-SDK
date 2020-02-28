import Utils from '../utils'
import Async from '../request/async'
import Urls from '../urls'

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

/**
 * @param {String} filePath
 * @param {String} fileName
 * @param {String|Uint8Array} fileContent
 * @param {Boolean} overwrite
 * @param {Async} asyncHandler
 * @returns {Promise.<String>}
 */
export function saveFile(filePath, fileName, fileContent, overwrite, asyncHandler) {
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
