import Utils from '../utils'

export function describeUserClass(/** async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return this.app.request.get({
    url         : this.app.urls.userClassProps(),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
