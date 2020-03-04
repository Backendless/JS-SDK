import Utils from '../../../utils'
import { DataType } from '../database-manager'
import { convertObject, parseObjects } from './utils'

const StringTypes = ['STRING', 'STRING_ID', 'TEXT', 'FILE_REF', 'BOOLEAN', 'POINT', 'LINESTRING', 'POLYGON', 'GEOMETRY']
const NumberTypes = ['DOUBLE', 'INT', 'DATETIME']

const getColumnType = backendlessType => {
  if (StringTypes.includes(backendlessType)) {
    return DataType.String
  }

  if (NumberTypes.includes(backendlessType)) {
    return DataType.Number
  }
}

const enrichObject = r => ({ ...convertObject(r), blLocalId: r.objectId })

const prepareColumns = schema => {
  const columns = {}

  schema.forEach(columnSchema => {
    columns[columnSchema.name] = {
      dataType: getColumnType(columnSchema.type),
      notNull : columnSchema.required,
      default : columnSchema.defaultValue,
    }
  })

  Object.assign(columns, {
    blLocalId: {
      primaryKey: true
    },

    blPendingOperation: {
      dataType: DataType.String
    }
  })

  return columns
}

async function shouldFetchData(tableName) {
  const dbExist = await this.app.OfflineDBManager.isDbExist()

  if (!dbExist) {
    return true
  }

  const tableExist = await this.app.OfflineDBManager.isTableExist(tableName)

  if (!tableExist) {
    return true
  }

  const objectsCount = await this.app.OfflineDBManager.connection.count({
    from: tableName
  })

  return objectsCount === 0
}

export async function initLocalDatabase(whereClause, callback) {
  if (!Utils.isBrowser) {
    throw new Error('Offline DB is not available outside of browser')
  }

  if (!(await shouldFetchData.call(this, this.className))) {
    const objects = await this.app.OfflineDBManager.connection.select({ from: this.className })

    const parsedObjects = parseObjects(objects)

    if (callback) {
      callback(parsedObjects)
    }

    return parsedObjects
  }

  const [tableObjects, tableSchema] = await Promise.all([
    this.app.Data.of(this.className).fetchAll(whereClause),
    this.app.Data.describe(this.className)
  ])

  await this.app.OfflineDBManager.addTable(this.className, prepareColumns(tableSchema))

  await this.app.OfflineDBManager.connection.insert({
    into  : this.className,
    values: tableObjects.map(enrichObject),
    upsert: true,
  })

  if (callback) {
    callback(tableObjects)
  }

  return tableObjects
}
