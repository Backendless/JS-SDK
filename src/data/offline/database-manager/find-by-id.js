import { parseObjects } from './utils'

export async function findById(tableName, objectId) {
  const objects = await this.app.OfflineDBManager.connection.select({
    from : tableName,
    where: { objectId },
    limit: 1
  })

  if (!objects.length) {
    throw new Error(JSON.stringify({
      code   : 1000,
      message: `Entity with ID ${ objectId } not found`
    }))
  }

  const [object] = parseObjects(objects)

  return object
}
