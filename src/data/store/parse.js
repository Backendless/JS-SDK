import Utils from '../../utils'
import { resolveModelClassFromString } from '../utils'
import constructGeoObject from '../geo/geo-constructor'

function isObject(item) {
  return typeof item === 'object' && item !== null
}

function parseCircularDependencies(obj) {
  const result = new obj.constructor()
  const subIds = {}
  const postAssign = []
  const iteratedItems = []

  function ensureCircularDep(source, target, prop) {
    if (subIds[source[prop].__originSubID]) {
      target[prop] = subIds[source[prop].__originSubID]
    } else {
      postAssign.push([target, prop, source[prop].__originSubID])
    }
  }

  function processModel(source, target, prop) {
    const Model = source[prop].constructor

    target[prop] = new Model()

    if (source[prop].__subID) {
      subIds[source[prop].__subID] = target[prop]
      delete source[prop].__subID
    }
  }

  function buildCircularDeps(source, target) {
    if (iteratedItems.indexOf(source) === -1) {
      iteratedItems.push(source)

      for (const prop in source) {
        if (source.hasOwnProperty(prop)) {
          if (Array.isArray(source[prop])) {
            buildCircularDeps(source[prop], target[prop] = [])

          } else if (isObject(source[prop])) {
            if (source[prop].__originSubID) {
              ensureCircularDep(source, target, prop)

            } else {
              processModel(source, target, prop)

              buildCircularDeps(source[prop], target[prop])
            }

          } else {
            target[prop] = source[prop]
          }
        }
      }
    }
  }

  buildCircularDeps(obj, result)

  postAssign.forEach(([target, prop, __originSubID]) => target[prop] = subIds[__originSubID])

  return result
}

const geoClasses = [
  'com.backendless.persistence.Polygon',
  'com.backendless.persistence.LineString',
  'com.backendless.persistence.Point',
  'com.backendless.persistence.Geometry',
]

const castGeoColumns = item => {
  for (const field in item) {
    const value = item[field]
    const valueIsObject = typeof value === 'object' && value !== null
    const valueIsArray = Array.isArray(value)

    if (valueIsObject && !valueIsArray && geoClasses.includes(value.___class)) {
      item[field] = constructGeoObject(value)
    } else if (valueIsArray) {
      value.map(castGeoColumns)
    }
  }

  return item
}

export function parseFindResponse(response, Model, classToTableMap) {
  const parseResponseItem = item => {
    return sanitizeResponseItem(castGeoColumns(item))
  }

  const sanitizeResponseItem = resp => {
    Model = Utils.isFunction(Model) ? Model : resolveModelClassFromString(resp.___class)

    return Utils.deepExtend(new Model(), resp.fields || resp, classToTableMap)
  }

  return Utils.isArray(response)
    ? parseCircularDependencies(response).map(parseResponseItem)
    : parseResponseItem(parseCircularDependencies(response))
}
