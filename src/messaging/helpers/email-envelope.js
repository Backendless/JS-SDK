import Utils from '../../utils'

function checkCriteria(criteria) {
  if (criteria) {
    throw new Error('Addresses can not be set if criteria is already set in a builder')
  }
}

export default class EmailEnvelop {

  static create() {
    return new EmailEnvelop()
  }

  constructor() {
    this.addresses = []
    this.ccAddresses = []
    this.bccAddresses = []
    this.criteria = null
  }

  /**
   *
   * @param {Array|String} addresses
   * @returns {EmailEnvelop}
   */
  setTo(addresses) {
    if (addresses) {
      checkCriteria(this.criteria)
    }

    this.addresses = Utils.castArray(addresses)

    return this
  }

  /**
   *
   * @param {Array|String} addresses
   * @returns {EmailEnvelop}
   */
  addTo(addresses) {
    checkCriteria(this.criteria)

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
   * @returns {EmailEnvelop}
   */
  setCc(addresses) {
    if (addresses) {
      checkCriteria(this.criteria)
    }

    this.ccAddresses = Utils.castArray(addresses)

    return this
  }

  /**
   *
   * @param {Array|String} addresses
   * @returns {EmailEnvelop}
   */
  addCc(addresses) {
    checkCriteria(this.criteria)

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
   * @returns {EmailEnvelop}
   */
  setBcc(addresses) {
    if (addresses) {
      checkCriteria(this.criteria)
    }

    this.bccAddresses = Utils.castArray(addresses)

    return this
  }

  /**
   *
   * @param {Array|String} addresses
   * @returns {EmailEnvelop}
   */
  addBcc(addresses) {
    checkCriteria(this.criteria)

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
   * @returns {EmailEnvelop}
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
