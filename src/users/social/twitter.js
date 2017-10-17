import { loginSocial } from './login'

export const loginWithTwitter = (fieldsMapping, stayLoggedIn, asyncHandler) =>  {
  return loginSocial('Twitter', fieldsMapping, null, null, stayLoggedIn, asyncHandler)
}