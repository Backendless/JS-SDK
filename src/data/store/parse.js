import Utils from '../../utils'
import constructGeoObject from '../geo/geo-constructor'

const GEO_CLASSES = [
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
    if (source[prop].__subID && subIds[source[prop].__subID]) {
      target[prop] = subIds[source[prop].__subID]
    } else {
      target[prop] = new source[prop].constructor()
    }

    if (source[prop].__subID) {
      subIds[source[prop].__subID] = target[prop]
      delete source[prop].__subID
    }
  }

  function buildCircularDeps(source, target) {
    if (!iteratedItems.includes(source)) {
      iteratedItems.push(source)

      for (const prop in source) {
        if (source.hasOwnProperty(prop) && (!Array.isArray(target[prop]) || !target[prop])) {
          if (Array.isArray(source[prop])) {
            buildCircularDeps(source[prop], target[prop] = [])
          } else if (source[prop] && typeof source[prop] === 'object') {
            if (GEO_CLASSES.includes(source[prop].___class)) {
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
    Model = typeof Model === 'function' ? Model : classToTableMap[record.___class]

    return Utils.deepExtend(Model ? new Model() : {}, record, classToTableMap)
  }

  const result = Array.isArray(response)
    ? response.map(sanitizeResponseItem)
    : sanitizeResponseItem(response)

  return parseCircularDependencies(result)
}
