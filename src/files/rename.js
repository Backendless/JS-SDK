import FilesUtils from './utils'

import { doAction } from './action'

export function renameFile(oldPathName, newName, async) {
  const parameters = {
    oldPathName: FilesUtils.ensureSlashInPath(oldPathName),
    newName    : newName
  }

  return doAction('rename', parameters, async)
}
