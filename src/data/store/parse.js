import Utils from '../../utils'
import { resolveModelClassFromString } from '../utils'
import constructGeoObject from '../geo/geo-constructor'

function isObject(item) {
  return typeof item === 'object' && item !== null
}

const geoClasses = [
  'com.backendless.persistence.Polygon',
  'com.backendless.persistence.LineString',
  'com.backendless.persistence.Point',
  'com.backendless.persistence.Geometry',
]

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
            if (geoClasses.includes(source[prop].___class)) {
              target[prop] = constructGeoObject(source[prop])
            } else if (source[prop].__originSubID) {
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

export function parseFindResponse(response, Model, classToTableMap) {
  const sanitizeResponseItem = record => {
    Model = Utils.isFunction(Model) ? Model : resolveModelClassFromString(record.___class)

    return Utils.deepExtend(new Model(), record, classToTableMap)
  }

  const result = Utils.isArray(response)
    ? response.map(sanitizeResponseItem)
    : sanitizeResponseItem(response)

  return parseCircularDependencies(result)
}
