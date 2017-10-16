import Urls from '../urls'
import Request from '../request'

import FilesUtils from './utils'

export function moveFile(sourcePath, targetPath, asyncHandler) {
  const parameters = {
    sourcePath: FilesUtils.ensureSlashInPath(sourcePath),
    targetPath: FilesUtils.ensureSlashInPath(targetPath)
  }

  return Request.put({
    url         : Urls.fileMove(),
    data        : parameters,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}