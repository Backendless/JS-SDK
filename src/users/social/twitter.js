import { loginSocial } from './login'

export function loginWithTwitter(fieldsMapping, stayLoggedIn, asyncHandler) {
  return loginSocial.call(this, 'Twitter', fieldsMapping, null, null, stayLoggedIn, asyncHandler)
}