import Utils from '../../../utils'
import { describe } from '../../describe'
import { DataType, DBManager, DBName, idbConnection } from '../database-manager'
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

const shouldFetchData = async tableName => {
  const dbList = await idbConnection.getDbList()

  if (!dbList.includes(DBName)) {
    return true
  }

  const dbSchema = await idbConnection.getDbSchema(DBName)

  const tableExist = dbSchema.tables.find(table => table.name === tableName)

  if (!tableExist) {
    return true
  }

  await idbConnection.openDb(DBName)

  const objectsCount = await idbConnection.count({
    from: tableName
  })

  return objectsCount === 0
}

export async function initLocalDatabase(whereClause, callback) {
  if (!Utils.isBrowser) {
    throw new Error('Offline DB is not available outside of browser')
  }

  if (!(await shouldFetchData(this.className))) {
    const records = await idbConnection.select({ from: this.className })
    const sanitizedRecords = sanitizeRecords(records)

    if (callback) {
      callback(sanitizedRecords)
    }

    return sanitizedRecords
  }

  const [tableRecords, tableSchema] = await Promise.all([
    this.fetchAll(whereClause),
    describe(this.className)
  ])

  await DBManager.addTable(this.className, prepareColumns(tableSchema))

  await idbConnection.insert({
    into  : this.className,
    values: tableRecords.map(enrichRecord),
    upsert: true,
  })

  if (callback) {
    callback(tableRecords)
  }

  return tableRecords
}