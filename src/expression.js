export default class BackendlessExpression {
  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('The Backendless.Expression class can be initialized with non empty string value only')
    }

    this.value = value
  }

  toJSON() {
    return {
      ___class: 'BackendlessExpression',
      value   : this.value
    }
  }
}
