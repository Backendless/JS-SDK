/* eslint-disable max-len */

import LocalVars from './local-vars'

const Urls = {
  root: () => LocalVars.appPath,

  blServices     : () => `${Urls.root()}/services`,
  blServiceMethod: (name, method) => `${Urls.blServices()}/${name}/${method}`,

  blEvent: eventName => `${Urls.root()}/servercode/events/${eventName}`,

  logging: () => `${Urls.root()}/log`,

  cache            : () => `${Urls.root()}/cache`,
  cacheItem        : key => `${Urls.cache()}/${key}`,
  cacheItemExpireIn: key => `${Urls.cacheItem(key)}/expireIn`,
  cacheItemExpireAt: key => `${Urls.cacheItem(key)}/expireAt`,
  cacheItemCheck   : key => `${Urls.cacheItem(key)}/check`,

  counters              : () => `${Urls.root()}/counters`,
  counter               : name => `${Urls.counters()}/${name}`,
  counterAddAndGet      : name => `${Urls.counter(name)}/incrementby/get`,
  counterGetAndAdd      : name => `${Urls.counter(name)}/get/incrementby`,
  counterIncrementAndGet: name => `${Urls.counter(name)}/increment/get`,
  counterDecrementAndGet: name => `${Urls.counter(name)}/decrement/get`,
  counterGetAndDecrement: name => `${Urls.counter(name)}/get/decrement`,
  counterGetAndIncrement: name => `${Urls.counter(name)}/get/increment`,
  counterCompareAndSet  : name => `${Urls.counter(name)}/get/compareandset`,
  counterReset          : name => `${Urls.counter(name)}/reset`,

  data                   : () => `${Urls.root()}/data`,
  dataTable              : tableName => `${Urls.data()}/${tableName}`,
  dataTableFind          : tableName => `${Urls.dataTable(tableName)}/find`,
  dataTableObject        : (tableName, objectId) => `${Urls.dataTable(tableName)}/${objectId}`,
  dataTableObjectRelation: (tableName, objectId, columnName) => `${Urls.dataTableObject(tableName, objectId)}/${columnName}`,
  dataTableCount         : tableName => `${Urls.dataTable(tableName)}/count`,
  dataTableProps         : tableName => `${Urls.dataTable(tableName)}/properties`,
  dataBulkTable          : tableName => `${Urls.data()}/bulk/${tableName}`,
  dataBulkTableDelete    : tableName => `${Urls.dataBulkTable(tableName)}/delete`,
  dataObjectPermission   : (tableName, permissionType, objectId) => `${Urls.dataTable(tableName)}/permissions/${permissionType}/${encodeURIComponent(objectId)}`,

  messaging                  : () => `${Urls.root()}/messaging`,
  messagingPush              : () => `${Urls.messaging()}/push`,
  messagingPushTemplates     : deviceType => `${Urls.messaging()}/pushtemplates/${deviceType}`,
  messagingPushWithTemplate  : templateName => `${Urls.messagingPush()}/${templateName}`,
  messagingEmail             : () => `${Urls.messaging()}/email`,
  messagingChannel           : channel => `${Urls.messaging()}/${channel}`,
  messagingMessage           : messageId => `${Urls.messaging()}/${messageId}`,
  messagingRegistrations     : () => `${Urls.messaging()}/registrations`,
  messagingRegistrationDevice: deviceId => `${Urls.messagingRegistrations()}/${deviceId}`,

  geo             : () => `${Urls.root()}/geo`,
  geoRelative     : () => `${Urls.geo()}/relative`,
  geoPoints       : () => `${Urls.geo()}/points`,
  geoPoint        : pointId => `${Urls.geoPoints()}/${pointId}`,
  geoPointMetaData: pointId => `${Urls.geoPoint(pointId)}/metadata`,
  geoCategories   : () => `${Urls.geo()}/categories`,
  geoCategory     : name => `${Urls.geoCategories()}/${name}`,
  geoClusters     : () => `${Urls.geo()}/clusters`,
  geoClusterPoints: clusterId => `${Urls.geoClusters()}/${clusterId}/points`,
  geoCount        : () => `${Urls.geo()}/count`,
  geoFences       : geoFence => `${Urls.geo()}/fences${(geoFence) ? '?geoFence=' + geoFence : ''}`,
  geoFence        : (action, geoFenceName) => `${Urls.geo()}/fence/${action}?geoFence=${geoFenceName}`,

  commerce         : () => `${Urls.root()}/commerce/googleplay`,
  commerceValidate : (name, productId, token) => `${Urls.commerce()}/validate/${name}/inapp/${productId}/purchases/${token}`,
  commerceSubCancel: (name, subId, token) => `${Urls.commerce()}/${name}/subscription/${subId}/purchases/${token}/cancel`,
  commerceSubStatus: (name, subId, token) => `${Urls.commerce()}/${name}/subscription/${subId}/purchases/${token}`,

  files          : () => `${Urls.root()}/files`,
  filePath       : path => `${Urls.files()}/${path}`,
  fileCopy       : () => `${Urls.files()}/copy`,
  fileMove       : () => `${Urls.files()}/move`,
  fileRename     : () => `${Urls.files()}/rename`,
  filePermissions: () => `${Urls.files()}/permissions`,
  filePermission : (type, url) => `${Urls.filePermissions()}/${type}/${encodeURIComponent(url)}`,

  users                 : () => `${Urls.root()}/users`,
  userObject            : objectId => `${Urls.users()}/${objectId}`,
  userRegister          : () => `${Urls.users()}/register`,
  userLogin             : () => `${Urls.users()}/login`,
  userLogout            : () => `${Urls.users()}/logout`,
  userRoles             : () => `${Urls.users()}/userroles`,
  userRoleOperation     : operation => `${Urls.users()}/${operation}`,
  userClassProps        : () => `${Urls.users()}/userclassprops`,
  userRestorePassword   : email => `${Urls.users()}/restorepassword/${encodeURIComponent(email)}`,
  userTokenCheck        : token => `${Urls.users()}/isvalidusertoken/${token}`,
  userResendConfirmation: email => `${Urls.users()}/resendconfirmation/${email}`,
  userSocial            : () => `${Urls.users()}/social`,
  userSocialOAuth       : socialType => `${Urls.userSocial()}/oauth/${socialType.toLowerCase()}/request_url`,
  userSocialLogin       : socialType => `${Urls.userSocial()}/${socialType.toLowerCase()}/sdk/login`,
}

export default Urls