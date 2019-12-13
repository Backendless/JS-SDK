import User from '../users/user'

export function resolveModelClassFromString(className) {
  if (className === User.className) {
    return User
  }

  return function () {
  }
}

export function convertObject(obj, result = {}) {
  for (const key in obj) {
    const value = obj[key]

    if (value instanceof Backendless.Data.Geometry) {
      result[key] = value.asGeoJSON()
    } else if (typeof value === 'object' && value != null && !Array.isArray(value)) {
      result[key] = convertObject(value, result[key])
    } else {
      result[key] = value
    }
  }

  return result
}