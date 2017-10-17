import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

import FilesUtils from './utils'

export function renameFile(oldPathName, newName, asyncHandler) {
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

  return Request.put({
    url         : Urls.fileRename(),
    data        : parameters,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}