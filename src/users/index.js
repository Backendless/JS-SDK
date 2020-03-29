import Utils from '../utils'

import { register } from './register'
import { assignRole, getUserRoles, unassignRole } from './roles'
import { login } from './login'
import { loginAsGuest } from './login-as-guest'
import { logout } from './logout'
import { update } from './update'
import { describeUserClass } from './describe-class'
import { restorePassword } from './restore-password'
import { resendEmailConfirmation } from './email-confirmation'
import {
  loginWithGooglePlusSdk,
  loginWithGooglePlus,
  loginWithFacebookSdk,
  loginWithFacebook,
  loginWithTwitter
} from './social'
import {
  setLocalCurrentUser,
  getLocalCurrentUser,
  getCurrentUserToken,
  getCurrentUser,
  isValidLogin,
  loggedInUser
} from './current-user'

class Users {
  constructor(app) {
    this.app = app
  }
}

Object.assign(Users.prototype, {

  register: Utils.promisified(register),

  getUserRoles: Utils.promisified(getUserRoles),

  assignRole: Utils.promisified(assignRole),

  unassignRole: Utils.promisified(unassignRole),

  login: Utils.promisified(login),

  loginAsGuest: Utils.promisified(loginAsGuest),

  describeUserClass: Utils.promisified(describeUserClass),

  restorePassword: Utils.promisified(restorePassword),

  logout: Utils.promisified(logout),

  getCurrentUser: Utils.promisified(getCurrentUser),

  update: Utils.promisified(update),

  loginWithFacebook   : Utils.promisified(loginWithFacebook),
  loginWithFacebookSdk: loginWithFacebookSdk,

  loginWithGooglePlus   : Utils.promisified(loginWithGooglePlus),
  loginWithGooglePlusSdk: loginWithGooglePlusSdk,

  loginWithTwitter: Utils.promisified(loginWithTwitter),

  isValidLogin: Utils.promisified(isValidLogin),

  resendEmailConfirmation: Utils.promisified(resendEmailConfirmation),

  loggedInUser       : loggedInUser,
  getCurrentUserToken: getCurrentUserToken,
  getLocalCurrentUser: getLocalCurrentUser,
  setLocalCurrentUser: setLocalCurrentUser
})

export default Users
