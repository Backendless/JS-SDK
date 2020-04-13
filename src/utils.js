const Utils = {

  isBrowser: isBrowser(),

  isLocalStorageSupported: isLocalStorageSupported(),

  castArray(value) {
    if (Array.isArray(value)) {
      return value
    }

    return [value]
  },

  isCustomClassInstance(item) {
    return !!item && typeof item === 'object' && !Array.isArray(item) && item.constructor !== Object
  },

  getClassName(obj) {
    if (obj.prototype && obj.prototype.___class) {
      return obj.prototype.___class
    }

    if (typeof obj === 'function' && obj.name) {
      return obj.name
    }

    const instStringified = (typeof obj === 'function' ? obj.toString() : obj.constructor.toString())
    const results = instStringified.match(/function\s+(\w+)/)

    return (results && results.length > 1) ? results[1] : ''
  },

  deepExtend(destination, source, classToTableMap = {}) {
    //TODO: refactor it
    for (const property in source) {
      if (source[property] !== undefined && source.hasOwnProperty(property)) {
        destination[property] = destination[property] || {}
        destination[property] = classWrapper(source[property], classToTableMap)

        if (
          destination[property]
          && destination[property].hasOwnProperty(property)
          && destination[property][property]
          && destination[property][property].hasOwnProperty('__originSubID')
        ) {

          destination[property][property] = classWrapper(destination[property], classToTableMap)
        }
      }
    }

    return destination
  },

  uuid() {
    const chr4 = () => Math.random().toString(16).slice(-4).toUpperCase()
    const chr8 = () => `${chr4()}${chr4()}`
    const chr12 = () => `${chr4()}${chr4()}${chr4()}`

    return `${chr8()}-${chr4()}-${chr4()}-${chr4()}-${chr12()}`
  },
}

function isBrowser() {
  return (typeof self === 'object' && self.self === self) && (typeof window === 'object' && window === self)
}

function isLocalStorageSupported() {
  try {
    if (isBrowser() && window.localStorage) {
      localStorage.setItem('localStorageTest', true)
      localStorage.removeItem('localStorageTest')

      return true
    }
  } catch (e) {
  }

  return false
}

function classWrapper(obj, classToTableMap) {
  //TODO: refactor it
  const wrapper = obj => {
    let wrapperName = null
    let Wrapper = null

    for (const property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (property === '___class') {
          wrapperName = obj[property]
          break
        }
      }
    }

    if (wrapperName) {
      try {
        Wrapper = classToTableMap[wrapperName] || eval(wrapperName)
        obj = Utils.deepExtend(new Wrapper(), obj, classToTableMap)
      } catch (e) {
      }
    }

    return obj
  }

  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      for (let i = obj.length; i--;) {
        obj[i] = wrapper(obj[i])
      }
    } else {
      obj = wrapper(obj)
    }
  }

  return obj
}

export default Utils
