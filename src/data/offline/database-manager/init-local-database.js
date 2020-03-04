import Utils from '../../../utils'
import { DataType } from '../database-manager'
import { convertBooleansToStrings, sanitizeRecords } from './utils'

const StringTypes = ['STRING', 'STRING_ID', 'TEXT', 'FILE_REF']
const NumberTypes = ['DOUBLE', 'INT', 'DATETIME']

const getColumnType = backendlessType => {
  if (StringTypes.includes(backendlessType)) {
    return DataType.String
  }

  if (NumberTypes.includes(backendlessType)) {
    return DataType.Number
  }

  if (backendlessType === 'BOOLEAN') {
    return DataType.String // 'true', 'false'
  }
}

const enrichRecord = r => ({ ...convertBooleansToStrings(r), blLocalId: r.objectId })

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
    const records = await this.app.OfflineDBManager.connection.select({ from: this.className })

    const sanitizedRecords = sanitizeRecords(records)

    if (callback) {
      callback(sanitizedRecords)
    }

    return sanitizedRecords
  }

  const [tableRecords, tableSchema] = await Promise.all([
    this.app.Data.of(this.className).fetchAll(whereClause),
    this.app.Data.describe(this.className)
  ])

  await this.app.OfflineDBManager.addTable(this.className, prepareColumns(tableSchema))

  await this.app.OfflineDBManager.connection.insert({
    into  : this.className,
    values: tableRecords.map(enrichRecord),
    upsert: true,
  })

  if (callback) {
    callback(tableRecords)
  }

  return tableRecords
}
