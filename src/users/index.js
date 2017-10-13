import Utils from '../utils'

import { register } from './register'
import { assignRole, getUserRoles, unassignRole } from './roles'
import { login } from './login'
import { logout } from './logout'
import { update } from './update'
import { describeUserClass } from './describe-class'
import { restorePassword } from './restore-password'
import { getCurrentUser, isValidLogin, loggedInUser } from './current-user'
import { resendEmailConfirmation } from './email-confirmation'
import {
  loginWithGooglePlusSdk,
  loginWithGooglePlus,
  loginWithFacebookSdk,
  loginWithFacebook,
  loginWithTwitter
} from './social'

const UserService = {

  register    : Utils.promisified(register),
  registerSync: Utils.synchronized(register),

  getUserRoles    : Utils.promisified(getUserRoles),
  getUserRolesSync: Utils.synchronized(getUserRoles),

  assignRole    : Utils.promisified(assignRole),
  assignRoleSync: Utils.synchronized(assignRole),

  unassignRole    : Utils.promisified(unassignRole),
  unassignRoleSync: Utils.synchronized(unassignRole),

  login    : Utils.promisified(login),
  loginSync: Utils.synchronized(login),

  describeUserClass    : Utils.promisified(describeUserClass),
  describeUserClassSync: Utils.synchronized(describeUserClass),

  restorePassword    : Utils.promisified(restorePassword),
  restorePasswordSync: Utils.synchronized(restorePassword),

  logout    : Utils.promisified(logout),
  logoutSync: Utils.synchronized(logout),

  getCurrentUser    : Utils.promisified(getCurrentUser),
  getCurrentUserSync: Utils.synchronized(getCurrentUser),

  update    : Utils.promisified(update),
  updateSync: Utils.synchronized(update),

  loginWithFacebook    : Utils.promisified(loginWithFacebook),
  loginWithFacebookSync: Utils.synchronized(loginWithFacebook),
  loginWithFacebookSdk : loginWithFacebookSdk,

  loginWithGooglePlus    : Utils.promisified(loginWithGooglePlus),
  loginWithGooglePlusSync: Utils.synchronized(loginWithGooglePlus),
  loginWithGooglePlusSdk : loginWithGooglePlusSdk,

  loginWithTwitter    : Utils.promisified(loginWithTwitter),
  loginWithTwitterSync: Utils.synchronized(loginWithTwitter),

  isValidLogin    : Utils.promisified(isValidLogin),
  isValidLoginSync: Utils.synchronized(isValidLogin),

  resendEmailConfirmation    : Utils.promisified(resendEmailConfirmation),
  resendEmailConfirmationSync: Utils.synchronized(resendEmailConfirmation),

  loggedInUser: loggedInUser,

}

export default UserService
