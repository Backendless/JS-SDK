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
    this.operationName = null
    this.args = null
  }

  static initContext(operationName, args) {
    const jsonUpdateBuilder = new this()

    jsonUpdateBuilder.operationName = operationName
    jsonUpdateBuilder.args = args

    return jsonUpdateBuilder
  }

  static SET() {
    return this.initContext(OPERATIONS.SET, {})
  }

  static INSERT() {
    return this.initContext(OPERATIONS.INSERT, {})
  }

  static REPLACE() {
    return this.initContext(OPERATIONS.REPLACE, {})
  }

  static REMOVE() {
    return this.initContext(OPERATIONS.REMOVE, [])
  }

  static ARRAY_APPEND() {
    return this.initContext(OPERATIONS.ARRAY_APPEND, {})
  }

  static ARRAY_INSERT() {
    return this.initContext(OPERATIONS.ARRAY_INSERT, {})
  }

  addArgument(arg, argValue) {
    if (!this.args) {
      throw new Error(`You have to choose an operation type. Use one of ['${OPERATIONS_JOINED}']`)
    }

    if (Array.isArray(this.args)) {
      this.args.push(arg)
    } else {
      if (argValue === undefined) {
        throw new Error('You have to specify function\'s second argument')
      }

      this.args[arg] = argValue
    }

    return this
  }

  create() {
    const payloadData = {}

    if (!this.operationName) {
      throw new Error(`You have to choose an operation type. Use one of ['${OPERATIONS_JOINED}']`)
    }

    if ((Array.isArray(this.args) && !this.args.length) || !Object.keys(this.args).length) {
      throw new Error('You have to add at least one argument')
    }

    payloadData[OPERATION_FIELD_NAME] = this.operationName
    payloadData[ARGS_FIELD_NAME] = this.args

    return payloadData
  }
}