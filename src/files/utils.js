const FilesUtils = {
  ensureSlashInPath(path) {
    if (!(/^\//).test(path)) {
      return '/' + path
    }

    return path
  }
}

export default FilesUtils