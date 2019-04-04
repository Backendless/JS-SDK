import Utils from '../utils'

export function describeUserClass(/** async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return this.backendless.request.get({
    url         : this.backendless.urls.userClassProps(),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
