import { parseObjects } from './utils'

export async function findLast(tableName) {
  const objects = await this.app.OfflineDBManager.connection.select({
    from : tableName,
    order: {
      by  : 'created',
      type: 'desc'
    },
    limit: 1
  })

  if (!objects.length) {
    throw new Error(JSON.stringify({
      code   : 1010,
      message: 'Unable to retrieve data - object store is empty'
    }))
  }

  const [object] = parseObjects(objects)

  return object
}
