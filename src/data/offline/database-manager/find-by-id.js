import { sanitizeRecords } from './utils'

export async function findById(tableName, objectId) {
  const records = await this.app.OfflineDBManager.connection.select({
    from : tableName,
    where: { objectId },
    limit: 1
  })

  if (!records.length) {
    throw new Error(JSON.stringify({
      code   : 1000,
      message: `Entity with ID ${ objectId } not found`
    }))
  }

  const [sanitizedRecord] = sanitizeRecords(records)

  return sanitizedRecord
}