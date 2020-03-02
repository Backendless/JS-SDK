import Utils from '../utils'

const sanitizeFileName = fileName => encodeURIComponent(fileName).replace(/'/g, '%27').replace(/"/g, '%22')

export function sendFile (options) {
  const url = this.app.urls.filePath(options.path) + '/' + sanitizeFileName(options.fileName)
  const query = {}

  if (Utils.isBoolean(options.overwrite)) {
    query.overwrite = options.overwrite
  }

  return this.app.request.post({
    url         : url,
    query       : query,
    form        : { file: options.file },
    asyncHandler: options.asyncHandler
  })
}
