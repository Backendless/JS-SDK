import FilesUtils from './utils'

import { doAction } from './action'

export function renameFile(oldPathName, newName, asyncHandler) {
  const parameters = {
    oldPathName: FilesUtils.ensureSlashInPath(oldPathName),
    newName    : newName
  }

  return doAction('rename', parameters, asyncHandler)
}
