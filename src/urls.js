export default class Urls {
  constructor(app) {
    this.app = app
  }

  root() {
    return this.app.appPath
  }

  //bl

  blServices() {
    return `${this.root()}/services`
  }

  blServiceMethod(name, method) {
    return `${this.blServices()}/${name}/${method}`
  }

  blEvent(eventName) {
    return `${this.root()}/servercode/events/${eventName}`
  }

  //logging

  logging() {
    return `${this.root()}/log`
  }

  //cache

  cache() {
    return `${this.root()}/cache`
  }

  cacheItem(key) {
    return `${this.cache()}/${key}`
  }

  cacheItemExpireIn(key) {
    return `${this.cacheItem(key)}/expireIn`
  }

  cacheItemExpireAt(key) {
    return `${this.cacheItem(key)}/expireAt`
  }

  cacheItemCheck(key) {
    return `${this.cacheItem(key)}/check`
  }

  //counters

  counters() {
    return `${this.root()}/counters`
  }

  counter(name) {
    return `${this.counters()}/${name}`
  }

  counterAddAndGet(name) {
    return `${this.counter(name)}/incrementby/get`
  }

  counterGetAndAdd(name) {
    return `${this.counter(name)}/get/incrementby`
  }

  counterIncrementAndGet(name) {
    return `${this.counter(name)}/increment/get`
  }

  counterDecrementAndGet(name) {
    return `${this.counter(name)}/decrement/get`
  }

  counterGetAndDecrement(name) {
    return `${this.counter(name)}/get/decrement`
  }

  counterGetAndIncrement(name) {
    return `${this.counter(name)}/get/increment`
  }

  counterCompareAndSet(name) {
    return `${this.counter(name)}/get/compareandset`
  }

  counterReset(name) {
    return `${this.counter(name)}/reset`
  }

  //data

  data() {
    return `${this.root()}/data`
  }

  dataTable(tableName) {
    return `${this.data()}/${tableName}`
  }

  dataTableFind(tableName) {
    return `${this.dataTable(tableName)}/find`
  }

  dataTableObject(tableName, objectId) {
    return `${this.dataTable(tableName)}/${objectId}`
  }

  dataTableObjectRelation(tableName, objectId, columnName) {
    return `${this.dataTableObject(tableName, objectId)}/${columnName}`
  }

  dataTableCount(tableName) {
    return `${this.dataTable(tableName)}/count`
  }

  dataTableProps(tableName) {
    return `${this.dataTable(tableName)}/properties`
  }

  dataBulkTable(tableName) {
    return `${this.data()}/bulk/${tableName}`
  }

  dataBulkTableDelete(tableName) {
    return `${this.dataBulkTable(tableName)}/delete`
  }

  dataObjectPermission(tableName, permissionType, objectId) {
    return `${this.dataTable(tableName)}/permissions/${permissionType}/${encodeURIComponent(objectId)}`
  }

  //messaging

  messaging() {
    return `${this.root()}/messaging`
  }

  messagingPush() {
    return `${this.messaging()}/push`
  }

  messagingPushTemplates(deviceType) {
    return `${this.messaging()}/pushtemplates/${deviceType}`
  }

  messagingPushWithTemplate(templateName) {
    return `${this.messagingPush()}/${templateName}`
  }

  messagingEmail() {
    return `${this.messaging()}/email`
  }

  messagingChannel(channel) {
    return `${this.messaging()}/${channel}`
  }

  messagingMessage(messageId) {
    return `${this.messaging()}/${messageId}`
  }

  messagingRegistrations() {
    return `${this.messaging()}/registrations`
  }

  messagingRegistrationDevice(deviceId) {
    return `${this.messagingRegistrations()}/${deviceId}`
  }

  emailTemplate() {
    return `${this.root()}/emailtemplate`
  }

  emailTemplateSend() {
    return `${this.emailTemplate()}/send`
  }

  //geo

  geo() {
    return `${this.root()}/geo`
  }

  geoRelative() {
    return `${this.geo()}/relative`
  }

  geoPoints() {
    return `${this.geo()}/points`
  }

  geoPoint(pointId) {
    return `${this.geoPoints()}/${pointId}`
  }

  geoPointMetaData(pointId) {
    return `${this.geoPoint(pointId)}/metadata`
  }

  geoCategories() {
    return `${this.geo()}/categories`
  }

  geoCategory(name) {
    return `${this.geoCategories()}/${name}`
  }

  geoClusters() {
    return `${this.geo()}/clusters`
  }

  geoClusterPoints(clusterId) {
    return `${this.geoClusters()}/${clusterId}/points`
  }

  geoCount() {
    return `${this.geo()}/count`
  }

  geoFences(geoFence) {
    return `${this.geo()}/fences${(geoFence) ? '?geoFence=' + geoFence : ''}`
  }

  geoFence(action, geoFenceName) {
    return `${this.geo()}/fence/${action}?geoFence=${geoFenceName}`
  }

  //commerce
  commerce() {
    return `${this.root()}/commerce/googleplay`
  }

  commerceValidate(name, productId, token) {
    return `${this.commerce()}/validate/${name}/inapp/${productId}/purchases/${token}`
  }

  commerceSubCancel(name, subId, token) {
    return `${this.commerce()}/${name}/subscription/${subId}/purchases/${token}/cancel`
  }

  commerceSubStatus(name, subId, token) {
    return `${this.commerce()}/${name}/subscription/${subId}/purchases/${token}`
  }

  //files
  files() {
    return `${this.root()}/files`
  }

  filePath(path) {
    return `${this.files()}/${path}`
  }

  fileCopy() {
    return `${this.files()}/copy`
  }

  fileMove() {
    return `${this.files()}/move`
  }

  fileRename() {
    return `${this.files()}/rename`
  }

  filePermissions() {
    return `${this.files()}/permissions`
  }

  filePermission(type, url) {
    return `${this.filePermissions()}/${type}/${encodeURIComponent(url)}`
  }

  fileBinaryPath(path) {
    return `${this.files()}/binary/${path}`
  }

  //users
  users() {
    return `${this.root()}/users`
  }

  userObject(objectId) {
    return `${this.users()}/${objectId}`
  }

  userRegister() {
    return `${this.users()}/register`
  }

  userLogin() {
    return `${this.users()}/login`
  }

  userLogout() {
    return `${this.users()}/logout`
  }

  userRoles() {
    return `${this.users()}/userroles`
  }

  userRoleOperation(operation) {
    return `${this.users()}/${operation}`
  }

  userClassProps() {
    return `${this.users()}/userclassprops`
  }

  userRestorePassword(email) {
    return `${this.users()}/restorepassword/${encodeURIComponent(email)}`
  }

  userTokenCheck(token) {
    return `${this.users()}/isvalidusertoken/${token}`
  }

  userResendConfirmation(email) {
    return `${this.users()}/resendconfirmation/${email}`
  }

  userSocial() {
    return `${this.users()}/social`
  }

  userSocialOAuth(socialType) {
    return `${this.userSocial()}/oauth/${socialType.toLowerCase()}/request_url`
  }

  userSocialLogin(socialType) {
    return `${this.userSocial()}/${socialType.toLowerCase()}/sdk/login`
  }

  guestLogin() {
    return `${this.users()}/register/guest`
  }

  userStatus(userId) {
    return `${this.userObject(userId)}/status`
  }
}
