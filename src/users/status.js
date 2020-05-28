import Utils from '../utils'

export function enableUser(userId, asyncHandler) {
  return setUserStatus.call(this, userId, 'ENABLED', arguments)
}

export function disableUser(userId, asyncHandler) {
  return setUserStatus.call(this, userId, 'DISABLED', arguments)
}

function setUserStatus(userId, userStatus, args) {
  if (!userId) {
    throw new Error('User objectId can not be empty')
  }

  const responder = Utils.extractResponder(args)
  const isAsync = !!responder

  return this.app.request.put({
    url         : this.app.urls.userStatus(userId),
    data        : { userStatus },
    isAsync,
    asyncHandler: responder
  })
}