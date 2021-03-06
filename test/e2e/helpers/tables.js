export const DataTypes = {
  INT            : 'INT',
  DOUBLE         : 'DOUBLE',
  BOOLEAN        : 'BOOLEAN',
  STRING         : 'STRING',
  DATETIME       : 'DATETIME',
  TEXT           : 'TEXT',
  STRING_ID      : 'STRING_ID',
  EXTENDED_STRING: 'EXTENDED_STRING',
  JSON           : 'JSON',

  FILE_REF: 'FILE_REF',
  DATA_REF: 'DATA_REF',
  GEO_REF : 'GEO_REF',
  CHILD_OF: 'CHILD_OF',

  UNKNOWN: 'UNKNOWN'
}

export const RelationTypes = {
  ONE_TO_ONE : 'ONE_TO_ONE',
  ONE_TO_MANY: 'ONE_TO_MANY',
}

export class TablesAPI {
  constructor(sandbox) {
    this.sandbox = sandbox
  }

  get DataTypes() {
    return DataTypes
  }

  get RelationTypes() {
    return RelationTypes
  }

  get consoleApi() {
    return this.sandbox.consoleApi
  }

  get appId() {
    return this.sandbox.app.id
  }

  createTable(tableName) {
    return this.consoleApi.tables.create(this.appId, { name: tableName })
  }

  removeTable(tableName) {
    return this.consoleApi.tables.remove(this.appId, { name: tableName })
  }

  createColumn(tableName, columnName, dataType, options) {
    const column = Object.assign({}, {
      name: columnName,
      dataType,
    }, options)

    if (column.dataType === DataTypes.STRING) {
      column.dataSize = 500
    }

    return this.consoleApi.tables.createColumn(this.appId, { name: tableName }, column)
  }

  createRelationColumn(tableName, columnName, toTableName, relationshipType) {
    return this.consoleApi.tables.createColumn(this.appId, { name: tableName }, {
      dataType: 'DATA_REF',
      name    : columnName,
      toTableName,
      relationshipType
    })
  }
}
