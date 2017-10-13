import Utils from '../../utils'

function formCircDeps(obj) {
  const result = new obj.constructor()
  const circDepsIDs = {}
  const iteratedObjects = []

  const _formCircDepsHelper = (obj, res) => {
    if (iteratedObjects.indexOf(obj) === -1) {
      iteratedObjects.push(obj)

      if (obj.hasOwnProperty('__subID')) {
        circDepsIDs[obj['__subID']] = res
        delete obj['__subID']
      }

      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (typeof obj[prop] === 'object' && obj[prop] != null) {
            if (obj[prop].hasOwnProperty('__originSubID')) {
              res[prop] = circDepsIDs[obj[prop]['__originSubID']]
            } else {
              res[prop] = new (obj[prop].constructor)()
              _formCircDepsHelper(obj[prop], res[prop])
            }
          } else {
            res[prop] = obj[prop]
          }
        }
      }
    }
  }

  _formCircDepsHelper(obj, result)

  return result
}

export function parseFindResponse(response, Model) {
  Model = Utils.isFunction(Model) ? Model : undefined

  const sanitizeResponseItem = resp => {
    const item = Model ? new Model() : {}

    return Utils.deepExtend(item, resp.fields || resp)
  }

  const result = Utils.isArray(response)
    ? response.map(sanitizeResponseItem)
    : sanitizeResponseItem(response)

  return formCircDeps(result)
}
