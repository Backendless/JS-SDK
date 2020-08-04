const OPERATIONS = {
  SET         : 'JSON_SET',
  INSERT      : 'JSON_INSERT',
  REPLACE     : 'JSON_REPLACE',
  REMOVE      : 'JSON_REMOVE',
  ARRAY_APPEND: 'JSON_ARRAY_APPEND',
  ARRAY_INSERT: 'JSON_ARRAY_INSERT'
}

const OPERATIONS_JOINED = Object.keys(OPERATIONS).join('\', \'')

const OPERATION_FIELD_NAME = '___operation'
const ARGS_FIELD_NAME = 'args'

export default class JSONUpdateBuilder {
  constructor() {
    this.args = {}
  }

  static SET() {
    return new JSONSetBuilder()
  }

  static INSERT() {
    return new JSONInsertBuilder()
  }

  static REPLACE() {
    return new JSONReplaceBuilder()
  }

  static REMOVE() {
    return new JSONRemoveBuilder()
  }

  static ARRAY_APPEND() {
    return new JSONArrayAppendBuilder()
  }

  static ARRAY_INSERT() {
    return new JSONArrayInsertBuilder()
  }

  addArgument(arg, argValue) {
    if (!this.operationName) {
      throw new Error(`You have to choose an operation type. Use one of ['${OPERATIONS_JOINED}']`)
    }

    if (argValue === undefined) {
      throw new Error('You have to specify function\'s second argument')
    }

    this.args[arg] = argValue

    return this
  }

  toJSON() {
    const payloadData = {}

    if (!this.operationName) {
      throw new Error(`You have to choose an operation type. Use one of ['${OPERATIONS_JOINED}']`)
    }

    if (!Object.keys(this.args).length) {
      throw new Error('You have to add at least one argument')
    }

    payloadData[OPERATION_FIELD_NAME] = this.operationName
    payloadData[ARGS_FIELD_NAME] = this.args

    return payloadData
  }

  create() {
    return this.toJSON()
  }
}

class JSONSetBuilder extends JSONUpdateBuilder {
  constructor() {
    super()

    this.operationName = OPERATIONS.SET
  }
}

class JSONInsertBuilder extends JSONUpdateBuilder {
  constructor() {
    super()

    this.operationName = OPERATIONS.INSERT
  }
}

class JSONReplaceBuilder extends JSONUpdateBuilder {
  constructor() {
    super()

    this.operationName = OPERATIONS.REPLACE
  }
}

class JSONArrayAppendBuilder extends JSONUpdateBuilder {
  constructor() {
    super()

    this.operationName = OPERATIONS.ARRAY_APPEND
  }
}

class JSONArrayInsertBuilder extends JSONUpdateBuilder {
  constructor() {
    super()

    this.operationName = OPERATIONS.ARRAY_INSERT
  }
}

class JSONRemoveBuilder extends JSONUpdateBuilder {
  constructor() {
    super()

    this.operationName = OPERATIONS.REMOVE
    this.args = []
  }

  addArgument(arg) {
    this.args.push(arg)

    return this
  }

  toJSON() {
    const payloadData = {}

    if (!this.args.length) {
      throw new Error('You have to add at least one argument')
    }

    payloadData[OPERATION_FIELD_NAME] = this.operationName
    payloadData[ARGS_FIELD_NAME] = this.args

    return payloadData
  }
}