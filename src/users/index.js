import Utils from '../utils'
import { deprecated } from '../decorators'

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

const Users = {

  @deprecated('Backendless.Users', 'Backendless.Users.register')
  registerSync: Utils.synchronized(register),
  register    : Utils.promisified(register),

  @deprecated('Backendless.Users', 'Backendless.Users.getUserRoles')
  getUserRolesSync: Utils.synchronized(getUserRoles),
  getUserRoles    : Utils.promisified(getUserRoles),

  @deprecated('Backendless.Users', 'Backendless.Users.assignRole')
  assignRoleSync: Utils.synchronized(assignRole),
  assignRole    : Utils.promisified(assignRole),

  @deprecated('Backendless.Users', 'Backendless.Users.unassignRole')
  unassignRoleSync: Utils.synchronized(unassignRole),
  unassignRole    : Utils.promisified(unassignRole),

  @deprecated('Backendless.Users', 'Backendless.Users.login')
  loginSync: Utils.synchronized(login),
  login    : Utils.promisified(login),

  @deprecated('Backendless.Users', 'Backendless.Users.describeUserClass')
  describeUserClassSync: Utils.synchronized(describeUserClass),
  describeUserClass    : Utils.promisified(describeUserClass),

  @deprecated('Backendless.Users', 'Backendless.Users.restorePassword')
  restorePasswordSync: Utils.synchronized(restorePassword),
  restorePassword    : Utils.promisified(restorePassword),

  @deprecated('Backendless.Users', 'Backendless.Users.logout')
  logoutSync: Utils.synchronized(logout),
  logout    : Utils.promisified(logout),

  @deprecated('Backendless.Users', 'Backendless.Users.getCurrentUser')
  getCurrentUserSync: Utils.synchronized(getCurrentUser),
  getCurrentUser    : Utils.promisified(getCurrentUser),

  @deprecated('Backendless.Users', 'Backendless.Users.update')
  updateSync: Utils.synchronized(update),
  update    : Utils.promisified(update),

  @deprecated('Backendless.Users', 'Backendless.Users.loginWithFacebook')
  loginWithFacebookSync: Utils.synchronized(loginWithFacebook),
  loginWithFacebook    : Utils.promisified(loginWithFacebook),
  loginWithFacebookSdk : loginWithFacebookSdk,

  @deprecated('Backendless.Users', 'Backendless.Users.loginWithGooglePlus')
  loginWithGooglePlusSync: Utils.synchronized(loginWithGooglePlus),
  loginWithGooglePlus    : Utils.promisified(loginWithGooglePlus),
  loginWithGooglePlusSdk : loginWithGooglePlusSdk,

  @deprecated('Backendless.Users', 'Backendless.Users.loginWithTwitter')
  loginWithTwitterSync: Utils.synchronized(loginWithTwitter),
  loginWithTwitter    : Utils.promisified(loginWithTwitter),

  @deprecated('Backendless.Users', 'Backendless.Users.isValidLogin')
  isValidLoginSync: Utils.synchronized(isValidLogin),
  isValidLogin    : Utils.promisified(isValidLogin),

  @deprecated('Backendless.Users', 'Backendless.Users.resendEmailConfirmation')
  resendEmailConfirmationSync: Utils.synchronized(resendEmailConfirmation),
  resendEmailConfirmation    : Utils.promisified(resendEmailConfirmation),

  loggedInUser: loggedInUser,

}

export default Users
