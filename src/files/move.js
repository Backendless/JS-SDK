import FilesUtils from './utils'

import { doAction } from './action'

export function moveFile(sourcePath, targetPath, async) {

  const parameters = {
    sourcePath: FilesUtils.ensureSlashInPath(sourcePath),
    targetPath: FilesUtils.ensureSlashInPath(targetPath)
  }

  return doAction('move', parameters, async)
}
