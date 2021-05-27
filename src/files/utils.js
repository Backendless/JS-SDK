const FilesUtils = {
  ensureSlashInPath(path) {
    return !path.startsWith('/') ? `/${path}` : path
  },

  preventSlashInPath(path) {
    return (path && path.startsWith('/')) ? path.slice(1) : path
  },

  parseFilePath(path) {
    const result = {
      filePath: path,
      fileName: null,
    }

    if (path) {
      const tokens = path.split('/')

      if (tokens[tokens.length - 1].includes('.')) {
        result.fileName = tokens.pop()
        result.filePath = tokens.join('/')
      }
    }

    return result
  },

  sanitizeFileName(fileName) {
    return encodeURIComponent(fileName)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22')
  },

  getFileName(file) {
    if (file.name) {
      return file.name
    }

    if (file.path) {
      const path = file.path.split('/')

      return path[path.length - 1] //last item of the file path
    }
  },

  async toBase64(content) {
    if (typeof Blob !== 'undefined') {
      if (!(content instanceof Blob)) {
        content = new Blob([content], { type: '' })
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = error => reject(error)
        reader.onload = event => resolve(event.target.result.split(';base64,')[1])
        reader.readAsDataURL(content)
      })
    }

    if (typeof Buffer !== 'undefined') {
      return Buffer.from(content).toString('base64')
    }

    return content
  }
}

export default FilesUtils
