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

  isEmpty(obj) {
    if (obj === null || obj === undefined) {
      return true
    }

    if (Utils.isArray(obj) || Utils.isString(obj)) {
      return obj.length === 0
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null) {
        return false
      }
    }

    return true
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

  extractResponder(args) {
    for (let i = 0; i < args.length; i++) {
      if (args[i] instanceof Async) {
        return args[i]
      }
    }
  },

  wrapAsync(asyncHandler, parser, context) {
    //TODO: should we remove it?
    if (asyncHandler instanceof Async && !parser) {
      return asyncHandler
    }

    const success = data => {
      if (parser) {
        data = parser.call(context, data)
      }

      asyncHandler.success(data)
    }

    const error = data => {
      asyncHandler.fault(data)
    }

    return new Async(success, error)
  },

  promisified(method) {
    return function() {
      Utils.checkPromiseSupport()

      const args = [].slice.call(arguments)
      const context = this
      const fn = typeof method === 'function' ? method : context[method]

      return new Promise(function(resolve, reject) {
        args.push(new Async(resolve, reject, context))
        fn.apply(context, args)
      })
    }
  },

  synchronized(method) {
    return function() {
      // eslint-disable-next-line no-console
      console.warn('Using of sync methods is an outdated approach. Please use async methods.')

      const context = this
      const fn = typeof method === 'function' ? method : context[method]

      return fn.apply(context, arguments)
    }
  },

  checkPromiseSupport() {
    if (typeof Promise === 'undefined') {
      throw new Error(
        'This browser doesn\'t support Promise API. Please use polyfill.\n' +
        'More info is in the Backendless JS-SDK docs: https://backendless.com/docs/js/doc.html#sync-and-async-calls'
      )
    }
  },

  mirrorKeys(obj) {
    const mirroredObject = {}

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        mirroredObject[key] = key
      }
    }

    return mirroredObject
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
