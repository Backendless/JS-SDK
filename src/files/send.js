import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

const sanitizeFileName = fileName => encodeURIComponent(fileName).replace(/'/g, '%27').replace(/"/g, '%22')

export const sendFile = options => {
  const url = Urls.filePath(options.path) + '/' + sanitizeFileName(options.fileName)
  const query = {}

  if (Utils.isBoolean(options.overwrite)) {
    query.overwrite = options.overwrite
  }

  return Backendless._ajax({
    method      : 'POST',
    url         : url,
    query       : query,
    form        : { file: options.file },
    asyncHandler: options.asyncHandler
  })
}
