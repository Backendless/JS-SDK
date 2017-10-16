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

  isBrowser: (new Function('try {return this===window;}catch(e){ return false;}'))(),

  castArray(value) {
    if (Utils.isArray(value)) {
      return value
    }

    return [value]
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

  stringToBiteArray(str) {
    const data = new ArrayBuffer(str.length)
    const ui8a = new Uint8Array(data, 0)

    for (let i = 0; i < str.length; i++) {
      ui8a[i] = (str.charCodeAt(i) & 0xff)
    }

    return ui8a
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

  toUri() {
    //TODO: refactor it
    let uri = ''
    let arg

    for (let i = 0; i < arguments.length; i++) {
      arg = arguments[i]

      if (!arg) {
        continue
      }

      if (Utils.isArray(arg)) {
        uri += this.toUri.apply(this, arg)
      } else if (Utils.isString(arg)) {
        uri += '/'
        uri += encodeURIComponent(arg)
      }
    }

    return uri
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

  deepExtend(destination, source) {
    //TODO: refactor it
    for (const property in source) {
      if (source[property] !== undefined && source.hasOwnProperty(property)) {
        destination[property] = destination[property] || {}
        destination[property] = classWrapper(source[property])

        if (
          destination[property]
          && destination[property].hasOwnProperty(property)
          && destination[property][property]
          && destination[property][property].hasOwnProperty('__originSubID')
        ) {

          destination[property][property] = classWrapper(destination[property])
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
      console.warn('Using of sync methods is an outdated approach. Please, use async methods.')

      const context = this
      const fn = typeof method === 'function' ? method : context[method]

      return fn.apply(context, arguments)
    }
  }
}

function classWrapper(obj) {
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
        Wrapper = eval(wrapperName)
        obj = Utils.deepExtend(new Wrapper(), obj)
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
