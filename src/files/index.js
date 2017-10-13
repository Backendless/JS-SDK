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

const Files = {
  Permissions,

  saveFile    : Utils.promisified(saveFile),
  saveFileSync: Utils.synchronized(saveFile),

  upload    : Utils.promisified(upload),
  uploadSync: Utils.synchronized(upload),

  listing    : Utils.promisified(listing),
  listingSync: Utils.synchronized(listing),

  renameFile    : Utils.promisified(renameFile),
  renameFileSync: Utils.synchronized(renameFile),

  moveFile    : Utils.promisified(moveFile),
  moveFileSync: Utils.synchronized(moveFile),

  copyFile    : Utils.promisified(copyFile),
  copyFileSync: Utils.synchronized(copyFile),

  remove    : Utils.promisified(remove),
  removeSync: Utils.synchronized(remove),

  exists    : Utils.promisified(exists),
  existsSync: Utils.synchronized(exists),

  removeDirectory    : Utils.promisified(removeDirectory),
  removeDirectorySync: Utils.synchronized(removeDirectory),

  getFileCount    : Utils.promisified(getFileCount),
  getFileCountSync: Utils.synchronized(getFileCount),

}

export default Files