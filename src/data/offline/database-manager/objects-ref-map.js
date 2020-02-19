const objectRefsMap = new WeakMap()

const put = (object, blLocalId) => objectRefsMap.set(object, blLocalId)

const get = object => objectRefsMap.get(object)

export default {
  put,
  get
}