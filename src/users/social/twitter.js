import { loginSocial } from './login'

export const loginWithTwitter = (fieldsMapping, stayLoggedIn, asyncHandler) =>  {
  return loginSocial.call(this, 'Twitter', fieldsMapping, null, null, stayLoggedIn, asyncHandler)
}