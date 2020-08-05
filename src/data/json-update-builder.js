const OPERATIONS = {
  SET         : 'JSON_SET',
  INSERT      : 'JSON_INSERT',
  REPLACE     : 'JSON_REPLACE',
  REMOVE      : 'JSON_REMOVE',
  ARRAY_APPEND: 'JSON_ARRAY_APPEND',
  ARRAY_INSERT: 'JSON_ARRAY_INSERT'
}

const OPERATION_FIELD_NAME = '___operation'
const ARGS_FIELD_NAME = 'args'

export default class JSONUpdateBuilder {
  constructor(operationName) {
    this.operationName = operationName
    this.args = {}
  }

  static SET() {
    return new JSONUpdateBuilder(OPERATIONS.SET)
  }

  static INSERT() {
    return new JSONUpdateBuilder(OPERATIONS.INSERT)
  }

  static REPLACE() {
    return new JSONUpdateBuilder(OPERATIONS.REPLACE)
  }

  static REMOVE() {
    return new JSONRemoveBuilder()
  }

  static ARRAY_APPEND() {
    return new JSONUpdateBuilder(OPERATIONS.ARRAY_APPEND)
  }

  static ARRAY_INSERT() {
    return new JSONUpdateBuilder(OPERATIONS.ARRAY_INSERT)
  }

  addArgument(arg, argValue) {
    if (argValue === undefined) {
      throw new Error('You have to specify function\'s second argument')
    }

    this.args[arg] = argValue

    return this
  }

  toJSON() {
    const payloadData = {}

    this.validateArgs()

    payloadData[OPERATION_FIELD_NAME] = this.operationName
    payloadData[ARGS_FIELD_NAME] = this.args

    return payloadData
  }

  create() {
    return this.toJSON()
  }

  validateArgs() {
    if (!Object.keys(this.args).length) {
      throw new Error('You have to add at least one argument')
    }
  }
}

export class JSONRemoveBuilder extends JSONUpdateBuilder {
  constructor() {
    super(OPERATIONS.REMOVE)

    this.args = []
  }

  addArgument(arg) {
    this.args.push(arg)

    return this
  }

  validateArgs() {
    if (!this.args.length) {
      throw new Error('You have to add at least one argument')
    }
  }
}