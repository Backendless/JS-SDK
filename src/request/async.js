export default class Async {

  constructor(successCallback, faultCallback, context) {
    if (!(faultCallback instanceof Function)) {
      context = faultCallback
      faultCallback = undefined
    }

    this.successCallback = successCallback
    this.faultCallback = faultCallback
    this.context = context

    //TODO: move it to prototypes
    this.success = data => {
      if (this.successCallback) {
        this.successCallback.call(this.context, data)
      }
    }

    //TODO: move it to prototypes
    this.fault = data => {
      if (this.faultCallback) {
        this.faultCallback.call(this.context, data)
      }
    }
  }
}