import objectRefsMap from './objects-ref-map'
import { parseBooleans } from './utils'

function sanitizeRecords(records) {
  return records.map(record => {
    const blLocalId = record.blLocalId

    delete record.blLocalId
    delete record.blPendingOperation

    record = parseBooleans(record)

    objectRefsMap.put(record, blLocalId)

    return record
  })
}

export {
  sanitizeRecords
}