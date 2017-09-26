import { loginSocial } from './login'

export const loginWithTwitter = (fieldsMapping, stayLoggedIn, async) =>  {
  return loginSocial('Twitter', fieldsMapping, null, null, stayLoggedIn, async)
}