import Async from '../request/async'

import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

const sanitizeFileName = fileName => encodeURIComponent(fileName).replace(/'/g, '%27').replace(/"/g, '%22')

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

  const query = {}

  if (Utils.isBoolean(overwrite)) {
    query.overwrite = overwrite
  }

  return Request.post({
    url : `${Urls.filePath(filePath)}/${sanitizeFileName(fileName)}`,
    query,
    form: { file },
    asyncHandler
  })
}
