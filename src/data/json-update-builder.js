const OperationTypes = {
  SET         : 'JSON_SET',
  INSERT      : 'JSON_INSERT',
  REPLACE     : 'JSON_REPLACE',
  REMOVE      : 'JSON_REMOVE',
  ARRAY_APPEND: 'JSON_ARRAY_APPEND',
  ARRAY_INSERT: 'JSON_ARRAY_INSERT'
}

export default class JSONUpdateBuilder {
  constructor(operationName) {
    this.operationName = operationName
    this.args = {}
  }

  static SET() {
    return new JSONUpdateBuilder(OperationTypes.SET)
  }

  static INSERT() {
    return new JSONUpdateBuilder(OperationTypes.INSERT)
  }

  static REPLACE() {
    return new JSONUpdateBuilder(OperationTypes.REPLACE)
  }

  static REMOVE() {
    return new JSONRemoveBuilder()
  }

  static ARRAY_APPEND() {
    return new JSONUpdateBuilder(OperationTypes.ARRAY_APPEND)
  }

  static ARRAY_INSERT() {
    return new JSONUpdateBuilder(OperationTypes.ARRAY_INSERT)
  }

  addArgument(arg, argValue) {
    if (argValue === undefined) {
      throw new Error('You have to specify function\'s second argument')
    }

    this.args[arg] = argValue

    return this
  }

  toJSON() {
    this.validate()

    return {
      ___operation: this.operationName,
      args        : this.args,
    }
  }

  create() {
    return this.toJSON()
  }

  validate() {
    if (!Object.keys(this.args).length) {
      throw new Error('You have to add at least one argument')
    }
  }
}

class JSONRemoveBuilder extends JSONUpdateBuilder {
  constructor() {
    super(OperationTypes.REMOVE)

    this.args = []
  }

  addArgument(arg) {
    this.args.push(arg)

    return this
  }

  validate() {
    if (!this.args.length) {
      throw new Error('You have to add at least one argument')
    }
  }
}