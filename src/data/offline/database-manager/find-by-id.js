import { parseObjects } from './utils'
import { BackendlessError } from '../../../utils/error'

export async function findById(tableName, objectId) {
  const objects = await this.app.OfflineDBManager.connection.select({
    from : tableName,
    where: { objectId },
    limit: 1
  })

  if (!objects.length) {
    throw new BackendlessError(1000, `Entity with ID ${objectId} not found`, { tableName, objectId })
  }

  const [object] = parseObjects(objects)

  return object
}
