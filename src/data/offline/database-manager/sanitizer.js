import objectRefsMap from './objects-ref-map'

function sanitizeRecords(records) {
  return records.map(record => {
    const blLocalId = record.blLocalId

    delete record.blLocalId
    delete record.blPendingOperation

    objectRefsMap.put(record, blLocalId)

    return record
  })
}

export {
  sanitizeRecords
}