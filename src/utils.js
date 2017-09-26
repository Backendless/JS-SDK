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

  emptyFn: function() {
  },

  getNow() {
    return new Date().getTime()
  },

  castArray(value) {
    if (Utils.isArray(value)) {
      return value
    }

    return [value]
  },

  addEvent(evnt, elem, func) {
    if (elem.addEventListener) {
      elem.addEventListener(evnt, func, false)
    }
    else if (elem.attachEvent) {
      elem.attachEvent('on' + evnt, func)
    }
    else {
      elem[evnt] = func
    }
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

  removeEvent(event, elem) {
    if (elem.removeEventListener) {
      elem.removeEventListener(event, null, false)
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, null)
    }

    elem[event] = null
  },

  stringToBiteArray(str) {
    const data = new ArrayBuffer(str.length)
    const ui8a = new Uint8Array(data, 0)

    for (let i = 0; i < str.length; i++) {
      ui8a[i] = (str.charCodeAt(i) & 0xff)
    }

    return ui8a
  },

  onHttpRequestErrorHandler(xhr, errorHandler, responseParser) {
    return function() {
      let errorMessage = 'Unable to connect to the network'

      //this part is needed for those implementations of XMLHttpRequest
      //which call the onerror handler on an any bad request
      if (xhr.status >= 400) {
        errorMessage = responseParser(xhr)
      }

      errorHandler(errorMessage)
    }
  },

  toQueryParams(params) {
    const result = []

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        result.push(key + '=' + encodeURIComponent(params[key]))
      }
    }

    return result.join('&')
  },

  toUri() {
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

  classWrapper(obj) {
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
  },

  deepExtend(destination, source) {
    for (const property in source) {
      if (source[property] !== undefined && source.hasOwnProperty(property)) {
        destination[property] = destination[property] || {}
        destination[property] = Utils.classWrapper(source[property])

        if (
          destination[property]
          && destination[property].hasOwnProperty(property)
          && destination[property][property]
          && destination[property][property].hasOwnProperty('__originSubID')
        ) {

          destination[property][property] = Utils.classWrapper(destination[property])
        }
      }
    }

    return destination
  },

  cloneObject(obj) {
    return Utils.isArray(obj) ? obj.slice() : Utils.deepExtend({}, obj)
  },

  extractResponder(args) {
    let i, len
    for (i = 0, len = args.length; i < len; ++i) {
      if (args[i] instanceof Async) {
        return args[i]
      }
    }

    return null
  },

  wrapAsync(async, parser, context) {
    const success = data => {
      if (parser) {
        data = parser.call(context, data)
      }

      async.success(data)
    }

    const error = data => {
      async.fault(data)
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

export default Utils
