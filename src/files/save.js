import Utils from '../utils'
import Async from '../request/async'

import { sendFile } from './send'

const MAX_CONTENT_SIZE = 2800000

const toByteArray = content => {
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

/**
 * @param {String} path
 * @param {String} fileName
 * @param {String|Uint8Array} fileContent
 * @param {Boolean} overwrite
 * @param {Async} asyncHandler
 * @returns {Promise.<String>}
 */
export function saveFile(path, fileName, fileContent, overwrite, asyncHandler) {
  if (!path || !Utils.isString(path)) {
    throw new Error('Missing value for the "path" argument. The argument must contain a string value')
  }

  if (!fileName || !Utils.isString(fileName)) {
    throw new Error('Missing value for the "fileName" argument. The argument must contain a string value')
  }

  if (overwrite instanceof Async) {
    asyncHandler = overwrite
    overwrite = undefined
  }

  fileContent = toByteArray(fileContent)

  if (getContentSize(fileContent) > MAX_CONTENT_SIZE) {
    throw new Error('File Content size must be less than ' + MAX_CONTENT_SIZE + ' bytes')
  }

  return sendFile({
    overwrite   : overwrite,
    path        : path,
    fileName    : fileName,
    file        : fileContent,
    asyncHandler: asyncHandler
  })
}
