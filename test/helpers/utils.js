const chr4 = () => Math.random().toString(16).slice(-4)
const chr8 = () => `${chr4()}${chr4()}`

const Utils = {
  uidShort: () => chr8(),

  uid: () => `${chr8()}${chr8()}${chr8()}${chr8()}`,

  objectId: () => `${chr8()}-${chr4()}-${chr4()}-${chr4()}-${chr8()}${chr4()}`.toUpperCase(),

  wait: milliseconds => {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds)
    })
  },

  timeout: milliseconds => {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Timeout')), milliseconds)
    })
  },

  shouldNotBeCalledInTime(fn, timeout = 2000) {
    return Promise.race([fn(), Utils.timeout(timeout)])
      .catch(error => {
        if (error.message !== 'Timeout') {
          throw error
        }
      })
  }
}

export default Utils
