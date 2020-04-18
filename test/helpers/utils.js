const chr4 = () => Math.random().toString(16).slice(-4)
const chr8 = () => `${chr4()}${chr4()}`

const Utils = {
  uidShort: () => chr8(),

  uid: () => `${chr8()}${chr8()}${chr8()}${chr8()}`,

  wait: milliseconds => {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds)
    })
  }
}

export default Utils
