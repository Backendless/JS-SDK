import Utils from '../utils'
import { deprecated } from '../decorators'

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

const Files = {
  Permissions,

  @deprecated('Backendless.Files', 'Backendless.Files.saveFile')
  saveFileSync: Utils.synchronized(saveFile),
  saveFile    : Utils.promisified(saveFile),

  @deprecated('Backendless.Files', 'Backendless.Files.upload')
  uploadSync: Utils.synchronized(upload),
  upload    : Utils.promisified(upload),

  @deprecated('Backendless.Files', 'Backendless.Files.listing')
  listingSync: Utils.synchronized(listing),
  listing    : Utils.promisified(listing),

  @deprecated('Backendless.Files', 'Backendless.Files.renameFile')
  renameFileSync: Utils.synchronized(renameFile),
  renameFile    : Utils.promisified(renameFile),

  @deprecated('Backendless.Files', 'Backendless.Files.moveFile')
  moveFileSync: Utils.synchronized(moveFile),
  moveFile    : Utils.promisified(moveFile),

  @deprecated('Backendless.Files', 'Backendless.Files.copyFile')
  copyFileSync: Utils.synchronized(copyFile),
  copyFile    : Utils.promisified(copyFile),

  @deprecated('Backendless.Files', 'Backendless.Files.remove')
  removeSync: Utils.synchronized(remove),
  remove    : Utils.promisified(remove),

  @deprecated('Backendless.Files', 'Backendless.Files.exists')
  existsSync: Utils.synchronized(exists),
  exists    : Utils.promisified(exists),

  @deprecated('Backendless.Files', 'Backendless.Files.removeDirectory')
  removeDirectorySync: Utils.synchronized(removeDirectory),
  removeDirectory    : Utils.promisified(removeDirectory),

  @deprecated('Backendless.Files', 'Backendless.Files.getFileCount')
  getFileCountSync: Utils.synchronized(getFileCount),
  getFileCount    : Utils.promisified(getFileCount),

}

export default Files