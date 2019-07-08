import Utils from '../../utils'

export default class EmailEnvelope {

  /**
   *
   * @param {Object} data
   * @returns {EmailEnvelope}
   */
  static create(data) {
    return new EmailEnvelope(data)
  }

  constructor(data) {
    data = data || {}

    this.addresses = data.addresses || []
    this.ccAddresses = data.ccAddresses || []
    this.bccAddresses = data.bccAddresses || []
    this.query = data.query || null
  }

  /**
   *
   * @param {Array|String} addresses
   * @returns {EmailEnvelope}
   */
  setTo(addresses) {
    this.addresses = Utils.castArray(addresses)

    return this
  }

  /**
   *
   * @param {Array|String} addresses
   * @returns {EmailEnvelope}
   */
  addTo(addresses) {
    this.addresses = this.addresses.concat(Utils.castArray(addresses))

    return this
  }

  /**
   *
   * @returns {Array} - addresses
   */
  getTo() {
    return this.addresses
  }

  /**
   *
   * @param {Array|String} addresses
   * @returns {EmailEnvelope}
   */
  setCc(addresses) {

    this.ccAddresses = Utils.castArray(addresses)

    return this
  }

  /**
   *
   * @param {Array|String} addresses
   * @returns {EmailEnvelope}
   */
  addCc(addresses) {
    this.ccAddresses = this.ccAddresses.concat(Utils.castArray(addresses))

    return this
  }

  /**
   *
   * @returns {Array} - cc-addresses
   */
  getCc() {
    return this.ccAddresses
  }

  /**
   *
   * @param {Array|String} addresses
   * @returns {EmailEnvelope}
   */
  setBcc(addresses) {
    this.bccAddresses = Utils.castArray(addresses)

    return this
  }

  /**
   *
   * @param {Array|String} addresses
   * @returns {EmailEnvelope}
   */
  addBcc(addresses) {
    this.bccAddresses = this.bccAddresses.concat(Utils.castArray(addresses))

    return this
  }

  /**
   *
   * @returns {Array} - bcc-addresses
   */
  getBcc() {
    return this.bccAddresses
  }

  /**
   *
   * @param {String|null} query
   * @returns {EmailEnvelope}
   */
  setQuery(query) {
    this.query = query

    return this
  }

  /**
   *
   * @returns {String} - query
   */
  getQuery() {
    return this.query
  }

  toJSON() {
    const data = {}

    if (this.addresses.length > 0) {
      data.addresses = this.addresses
    }

    if (this.ccAddresses.length > 0) {
      data['cc-addresses'] = this.ccAddresses
    }

    if (this.bccAddresses.length > 0) {
      data['bcc-addresses'] = this.bccAddresses
    }

    if (this.query) {
      data.criteria = this.query
    }

    return data
  }
}
