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
    this.criteria = data.criteria || null
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
   * @param {String|null} criteria
   * @returns {EmailEnvelope}
   */
  setCriteria(criteria) {
    if ([this.addresses, this.ccAddresses, this.bccAddresses].some(addresses => addresses.length > 0)) {
      throw new Error('Criteria can not be set if addresses already set in a builder')
    }

    this.criteria = criteria

    return this
  }

  /**
   *
   * @returns {String} - criteria
   */
  getCriteria() {
    return this.criteria
  }

  toJSON() {
    return {
      ['addresses']      : this.addresses,
      ['cc-addresses']   : this.ccAddresses,
      ['bcc-addresses']  : this.bccAddresses,
      ['criteria']       : this.criteria,
    }
  }
}
