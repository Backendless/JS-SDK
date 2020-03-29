import Utils from '../utils'

import Permissions from './persmissions'

import { saveFile } from './save'
import { upload } from './upload'
import { listing } from './listinig'
import { renameFile } from './rename'
import { moveFile } from './move'
import { remove } from './remove'
import { copyFile } from './copy'
import { exists } from './exists'
import { removeDirectory } from './remove-directory'
import { getFileCount } from './count'

class Files {
  constructor(app) {
    this.app = app

    this.Permissions = new Permissions(app)
  }
}

Object.assign(Files.prototype, {

  saveFile: Utils.promisified(saveFile),

  upload: Utils.promisified(upload),

  listing: Utils.promisified(listing),

  renameFile: Utils.promisified(renameFile),

  moveFile: Utils.promisified(moveFile),

  copyFile: Utils.promisified(copyFile),

  remove: Utils.promisified(remove),

  exists: Utils.promisified(exists),

  removeDirectory: Utils.promisified(removeDirectory),

  getFileCount: Utils.promisified(getFileCount),

})

export default Files
