import Async from './request/async'

const Utils = {
  isObject(obj) {
    return obj === Object(obj)
  },

  isArray: (Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Array'
  }),

  isString(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'String'
  },

  isNumber(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Number'
  },

  isFunction(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Function'
  },

  isBoolean(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Boolean'
  },

  isDate(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Date'
  },

  isBrowser: isBrowser(),

  isLocalStorageSupported: isLocalStorageSupported(),

  castArray(value) {
    if (Utils.isArray(value)) {
      return value
    }

    return [value]
  },

  toQueryParams(params) {
    params = params || {}
    const result = []

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        result.push(key + '=' + encodeURIComponent(params[key]))
      }
    }

    return result.join('&')
  },

  tryParseJSON(s) {
    try {
      return typeof s === 'string' ? JSON.parse(s) : s
    } catch (e) {
      return s
    }
  },

  getClassName(obj) {
    if (obj.prototype && obj.prototype.___class) {
      return obj.prototype.___class
    }

    if (Utils.isFunction(obj) && obj.name) {
      return obj.name
    }

    const instStringified = (Utils.isFunction(obj) ? obj.toString() : obj.constructor.toString())
    const results = instStringified.match(/function\s+(\w+)/)

    return (results && results.length > 1) ? results[1] : ''
  },

  encodeArrayToUriComponent(arr) {
    return arr.map(item => encodeURIComponent(item)).join(',')
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

  enableAsyncHandlers(service, methods) {
    //TODO: add warning
    //TODO: add toggle to disable it
    methods.forEach(methodName => {
      const method = service[methodName]

      service[methodName] = function(...args) {
        const asyncHandler = (args[args.length - 1] instanceof Async)
          ? args.pop()
          : undefined

        const result = method.apply(this, args)

        if (asyncHandler) {
          //TODO: add warning
          result.then(asyncHandler.success, asyncHandler.fault)
        }

        return result
      }
    })
  }
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
    } else {
      return false
    }
  } catch (e) {
    return false
  }
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

  if (Utils.isObject(obj) && obj != null) {
    if (Utils.isArray(obj)) {
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
