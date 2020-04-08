import Utils from '../utils'

export default class DataQuery {
  constructor(args) {
    args = args || {}

    this.properties = args.properties || []
    this.excludeProps = args.excludeProps || []
    this.condition = args.condition || null
    this.havingClause = args.havingClause || null
    this.options = args.options || null
    this.url = args.url || null
  }

  addProperty(prop) {
    this.properties = this.properties || []
    this.properties.push(prop)
  }

  excludeProperties(...properties) {
    this.excludeProps = this.excludeProps || []

    properties.forEach(p => {
      Utils.castArray(p).forEach(property => this.excludeProps.push(property))
    })

    return this
  }

  setOption(name, value) {
    this.options = this.options || {}

    this.options[name] = value
  }

  setOptions(options) {
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        this.setOption(key, options[key])
      }
    }
  }

  getOption(name) {
    return this.options && this.options[name]
  }
}

