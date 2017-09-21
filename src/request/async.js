export default class Async {

  constructor(successCallback, faultCallback, context) {
    if (!(faultCallback instanceof Function)) {
      context = faultCallback
      faultCallback = null
    }

    this.successCallback = successCallback
    this.faultCallback = faultCallback
    this.context = context

    this.success = data => {
      if (this.successCallback) {
        this.successCallback.call(this.context, data)
      }
    }

    this.fault = data => {
      if (this.faultCallback) {
        this.faultCallback.call(this.context, data)
      }
    }
  }
}