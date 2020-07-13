const Utils = {

  isBrowser: isBrowser(),

  isLocalStorageSupported: isLocalStorageSupported(),

  globalScope: (
    (typeof self === 'object' && self.self === self && self) ||
    (typeof global === 'object' && global.global === global && global)
  ),

  castArray(value) {
    if (Array.isArray(value)) {
      return value
    }

    if (typeof value === 'undefined') {
      return []
    }

    return [value]
  },

  isCustomClassInstance(item) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return false
    }

    return item.constructor !== Object
  },

  getClassName(obj) {
    if (obj && obj.className) {
      return obj.className
    }

    if (typeof obj === 'function') {
      if (obj.name) {
        return obj.name
      }
    }

    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      if (obj.___class) {
        return obj.___class
      }

      if (obj.constructor !== Object) {
        return Utils.getClassName(obj.constructor)
      }
    }

    return null
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

export default Utils
