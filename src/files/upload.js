import Async from '../request/async'

import { sendFile } from './send'

const getFileName = file => {
  if (file.name) {
    return file.name
  }

  if (file.path) {
    const path = file.path.split('/')
    return path[path.length - 1] //last item of the file path
  }
}

/**
 * @param {File} file
 * @param {String} filePath
 * @param {Boolean} overwrite
 * @param {Async} asyncHandler
 * @returns {Promise.<String>}
 */
export function upload(file, filePath, overwrite, asyncHandler) {
  const fileName = getFileName(file)

  if (!fileName) {
    throw new Error('Wrong type of the file source object. Can not get file name')
  }

  if (overwrite instanceof Async) {
    asyncHandler = overwrite
    overwrite = undefined
  }

  return sendFile.call(this, {
    overwrite   : overwrite,
    path        : filePath,
    fileName    : fileName,
    file        : file,
    asyncHandler: asyncHandler
  })
}
