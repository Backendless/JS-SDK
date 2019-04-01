/* eslint-disable max-len */

/**
 * @param {Backendless} backendless
 * @returns {Object}
 */
const Urls = backendless => ({
  root: () => backendless.appPath,

  blServices     : () => `${this.root()}/services`,
  blServiceMethod: (name, method) => `${this.blServices()}/${name}/${method}`,

  blEvent: eventName => `${this.root()}/servercode/events/${eventName}`,

  logging: () => `${this.root()}/log`,

  cache            : () => `${this.root()}/cache`,
  cacheItem        : key => `${this.cache()}/${key}`,
  cacheItemExpireIn: key => `${this.cacheItem(key)}/expireIn`,
  cacheItemExpireAt: key => `${this.cacheItem(key)}/expireAt`,
  cacheItemCheck   : key => `${this.cacheItem(key)}/check`,

  counters              : () => `${this.root()}/counters`,
  counter               : name => `${this.counters()}/${name}`,
  counterAddAndGet      : name => `${this.counter(name)}/incrementby/get`,
  counterGetAndAdd      : name => `${this.counter(name)}/get/incrementby`,
  counterIncrementAndGet: name => `${this.counter(name)}/increment/get`,
  counterDecrementAndGet: name => `${this.counter(name)}/decrement/get`,
  counterGetAndDecrement: name => `${this.counter(name)}/get/decrement`,
  counterGetAndIncrement: name => `${this.counter(name)}/get/increment`,
  counterCompareAndSet  : name => `${this.counter(name)}/get/compareandset`,
  counterReset          : name => `${this.counter(name)}/reset`,

  data                   : () => `${this.root()}/data`,
  dataTable              : tableName => `${this.data()}/${tableName}`,
  dataTableFind          : tableName => `${this.dataTable(tableName)}/find`,
  dataTableObject        : (tableName, objectId) => `${this.dataTable(tableName)}/${objectId}`,
  dataTableObjectRelation: (tableName, objectId, columnName) => `${this.dataTableObject(tableName, objectId)}/${columnName}`,
  dataTableCount         : tableName => `${this.dataTable(tableName)}/count`,
  dataTableProps         : tableName => `${this.dataTable(tableName)}/properties`,
  dataBulkTable          : tableName => `${this.data()}/bulk/${tableName}`,
  dataBulkTableDelete    : tableName => `${this.dataBulkTable(tableName)}/delete`,
  dataObjectPermission   : (tableName, permissionType, objectId) => `${this.dataTable(tableName)}/permissions/${permissionType}/${encodeURIComponent(objectId)}`,

  messaging                  : () => `${this.root()}/messaging`,
  messagingPush              : () => `${this.messaging()}/push`,
  messagingPushTemplates     : () => `${this.messaging()}/pushtemplates`,
  messagingPushWithTemplate  : templateName => `${this.messagingPush()}/${templateName}`,
  messagingEmail             : () => `${this.messaging()}/email`,
  messagingChannel           : channel => `${this.messaging()}/${channel}`,
  messagingMessage           : messageId => `${this.messaging()}/${messageId}`,
  messagingRegistrations     : () => `${this.messaging()}/registrations`,
  messagingRegistrationDevice: deviceId => `${this.messagingRegistrations()}/${deviceId}`,

  geo             : () => `${this.root()}/geo`,
  geoRelative     : () => `${this.geo()}/relative`,
  geoPoints       : () => `${this.geo()}/points`,
  geoPoint        : pointId => `${this.geoPoints()}/${pointId}`,
  geoPointMetaData: pointId => `${this.geoPoint(pointId)}/metadata`,
  geoCategories   : () => `${this.geo()}/categories`,
  geoCategory     : name => `${this.geoCategories()}/${name}`,
  geoClusters     : () => `${this.geo()}/clusters`,
  geoClusterPoints: clusterId => `${this.geoClusters()}/${clusterId}/points`,
  geoCount        : () => `${this.geo()}/count`,
  geoFences       : geoFence => `${this.geo()}/fences${(geoFence) ? '?geoFence=' + geoFence : ''}`,
  geoFence        : (action, geoFenceName) => `${this.geo()}/fence/${action}?geoFence=${geoFenceName}`,

  commerce         : () => `${this.root()}/commerce/googleplay`,
  commerceValidate : (name, productId, token) => `${this.commerce()}/validate/${name}/inapp/${productId}/purchases/${token}`,
  commerceSubCancel: (name, subId, token) => `${this.commerce()}/${name}/subscription/${subId}/purchases/${token}/cancel`,
  commerceSubStatus: (name, subId, token) => `${this.commerce()}/${name}/subscription/${subId}/purchases/${token}`,

  files          : () => `${this.root()}/files`,
  filePath       : path => `${this.files()}/${path}`,
  fileCopy       : () => `${this.files()}/copy`,
  fileMove       : () => `${this.files()}/move`,
  fileRename     : () => `${this.files()}/rename`,
  filePermissions: () => `${this.files()}/permissions`,
  filePermission : (type, url) => `${this.filePermissions()}/${type}/${encodeURIComponent(url)}`,

  users                 : () => `${this.root()}/users`,
  userObject            : objectId => `${this.users()}/${objectId}`,
  userRegister          : () => `${this.users()}/register`,
  userLogin             : () => `${this.users()}/login`,
  userLogout            : () => `${this.users()}/logout`,
  userRoles             : () => `${this.users()}/userroles`,
  userRoleOperation     : operation => `${this.users()}/${operation}`,
  userClassProps        : () => `${this.users()}/userclassprops`,
  userRestorePassword   : email => `${this.users()}/restorepassword/${encodeURIComponent(email)}`,
  userTokenCheck        : token => `${this.users()}/isvalidusertoken/${token}`,
  userResendConfirmation: email => `${this.users()}/resendconfirmation/${email}`,
  userSocial            : () => `${this.users()}/social`,
  userSocialOAuth       : socialType => `${this.userSocial()}/oauth/${socialType.toLowerCase()}/request_url`,
  userSocialLogin       : socialType => `${this.userSocial()}/${socialType.toLowerCase()}/sdk/login`,
})

export default Urls