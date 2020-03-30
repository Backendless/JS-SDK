export default class Async {

  constructor(successCallback, faultCallback, context) {
    if (!(faultCallback instanceof Function)) {
      context = faultCallback
      faultCallback = undefined
    }

    this.successCallback = successCallback
    this.faultCallback = faultCallback
    this.context = context
  }

  success(data) {
    if (this.successCallback) {
      this.successCallback.call(this.context, data)
    }
  }

  fault(data) {
    if (this.faultCallback) {
      this.faultCallback.call(this.context, data)
    }
  }
}
