export default class Urls {
  constructor(app) {
    this.app = app
  }

  root() {
    if (!this.app.appPath) {
      throw new Error(
        'Backendless API is not configured, make sure you run Backendless.initApp(...) ' +
        'before the operation'
      )
    }

    return this.app.appPath
  }

  // app info

  appInfo() {
    return `${this.root()}/info`
  }

  //automations

  automation() {
    return `${this.app.automationPath}/automation`
  }

  automationFlow() {
    return `${this.automation()}/flow`
  }

  automationFlowExecutionContext(executionId) {
    return `${this.automation()}/flow/execution-context/${executionId}`
  }

  automationFlowTrigger() {
    return `${this.automationFlow()}/trigger`
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

  loggingLevels() {
    return `${this.logging()}/logger`
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

  countersList(pattern) {
    return `${this.counters()}/${pattern || '*'}/list`
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

  dataGrouping(className) {
    return `${this.data()}/data-grouping/${className}`
  }

  dataTable(tableName) {
    return `${this.data()}/${tableName}`
  }

  dataTableUpsert(tableName) {
    return `${this.data()}/${tableName}/upsert`
  }

  dataTableDeepSave(tableName) {
    return `${this.data()}/${tableName}/deep-save`
  }

  dataTableFind(tableName) {
    return `${this.dataTable(tableName)}/find`
  }

  dataTablePrimaryKey(tableName) {
    return `${this.dataTable(tableName)}/pk`
  }

  dataTableObject(tableName, objectId) {
    return `${this.dataTable(tableName)}/${encodeURIComponent(objectId)}`
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

  dataBulkTableUpsert(tableName) {
    return `${this.data()}/bulkupsert/${tableName}`
  }

  dataBulkTableDelete(tableName) {
    return `${this.dataBulkTable(tableName)}/delete`
  }

  dataObjectPermission(tableName, permissionType, objectId) {
    return `${this.dataTable(tableName)}/permissions/${permissionType}/${objectId}`
  }

  dataTableNameById(tableId) {
    return `${this.data()}/${tableId}/table-name`
  }

  transactions() {
    return `${this.root()}/transaction/unit-of-work`
  }

  dataHives() {
    return `${this.root()}/hive`
  }

  dataHive(name) {
    return `${this.dataHives()}/${name}`
  }

  hiveStore(name, storeType) {
    return `${this.dataHive(name)}/${storeType}`
  }

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

  messagingChannels() {
    return `${this.messaging()}/channels`
  }

  messagingChannelName(channelName) {
    return `${this.messagingChannels()}/${channelName}`
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

  directoryPath(path) {
    return `${this.files()}/${path}/`
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

  fileAppendPath(path) {
    return `${this.files()}/append/${path}`
  }

  fileAppendBinaryPath(path) {
    return `${this.files()}/append/binary/${path}`
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

  userRoles(userId) {
    return `${this.users()}/userroles${userId ? `/${userId}` : ''}`
  }

  usersRole(roleName) {
    return `${this.users()}/role/${roleName}`
  }

  userRoleOperation(operation) {
    return `${this.users()}/${operation}`
  }

  userClassProps() {
    return `${this.users()}/userclassprops`
  }

  userRestorePassword(identity) {
    return `${this.users()}/restorepassword/${encodeURIComponent(identity)}`
  }

  userTokenCheck(token) {
    return `${this.users()}/isvalidusertoken/${token}`
  }

  userVerifyPassowrd() {
    return `${this.users()}/verifypassowrd`
  }

  userResendConfirmation(identity) {
    return `${this.users()}/resendconfirmation/${identity}`
  }

  userCreateConfirmationURL(identity) {
    return `${this.users()}/createEmailConfirmationURL/${identity}`
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

  userOAuthLogin(providerCode) {
    return `${this.userSocial()}/${providerCode.toLowerCase()}/login`
  }

  userAuthorizationURL(providerCode) {
    return `${this.users()}/oauth/${providerCode.toLowerCase()}/request_url`
  }

  guestLogin() {
    return `${this.users()}/register/guest`
  }

  userStatus(userId) {
    return `${this.userObject(userId)}/status`
  }

  //management
  management() {
    return `${this.root()}/management`
  }

  managementData() {
    return `${this.management()}/data`
  }

  managementDataTable() {
    return `${this.managementData()}/table`
  }
}
