import { parseObjects } from './utils'
import { BackendlessError } from '../../../utils/error'

export async function findFirst(tableName) {
  const objects = await this.app.OfflineDBManager.connection.select({
    from : tableName,
    order: {
      by  : 'created',
      type: 'asc'
    },
    limit: 1
  })

  if (!objects.length) {
    throw new BackendlessError(1010, 'Unable to retrieve data - object store is empty', { tableName })
  }

  const [object] = parseObjects(objects)

  return object
}
