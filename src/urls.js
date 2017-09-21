import Backendless from './bundle'

const Urls = {
  root: () => Backendless.appPath,

  blServices     : (serviceName, method) => `${Urls.root()}/services`,
  blServiceMethod: (serviceName, method) => `${Urls.blServices()}/${serviceName}/${method}`,

  blEvent: eventName => `${Urls.root()}/servercode/events/${eventName}`,

  cache            : () => `${Urls.root()}/cache`,
  cacheItem        : key => `${Urls.cache()}/${key}`,
  cacheItemExpireIn: key => `${Urls.cacheItem(key)}/expireIn`,
  cacheItemExpireAt: key => `${Urls.cacheItem(key)}/expireAt`,
  cacheItemCheck   : key => `${Urls.cacheItem(key)}/check`,

  counters     : () => `${Urls.root()}/counters`,
  counter      : counterName => `${Urls.counters()}/${counterName}`,
  counterMethod: (counterName, method) => `${Urls.counter(counterName)}/${method}`,

  data                : () => `${Urls.root()}/data`,
  dataTable           : tableName => `${Urls.data()}/${tableName}`,
  dataTableObject     : (tableName, objectId) => `${Urls.dataTable(tableName)}/${objectId}`,
  dataTableCount     : tableName => `${Urls.dataTable(tableName)}/count`,
  dataBulkTable       : tableName => `${Urls.data()}/bulk/${tableName}`,
  dataObjectPermission: (tableName, permissionType, objectId) => `${Urls.dataTable(tableName)}/permissions/${permissionType}/${encodeURIComponent(objectId)}`,

  messaging                  : () => `${Urls.root()}/messaging`,
  messagingEmail             : () => `${Urls.messaging()}/email`,
  messagingChannel           : channelName => `${Urls.messaging()}/${channelName}`,
  messagingChannelProps      : channelName => `${Urls.messagingChannel()}/properties`,
  messagingMessage           : messageId => `${Urls.messaging()}/${messageId}`,
  messagingRegistrations     : () => `${Urls.messaging()}/registrations`,
  messagingRegistrationDevice: deviceId => `${Urls.messagingRegistrations()}/${deviceId}`,

  geo             : () => `${Urls.root()}/geo`,
  geoRelative     : () => `${Urls.geo()}/relative`,
  geoPoints       : () => `${Urls.geo()}/points`,
  geoPoint        : pointId => `${Urls.geoPoints()}/${pointId}`,
  geoPointMetaData: pointId => `${Urls.geoPoint(pointId)}/metadata`,
  geoCategories   : () => `${Urls.geo()}/categories`,
  geoCategory     : categoryName => `${Urls.geoCategories()}/${categoryName}`,
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
  fileAction     : actionType => `${Urls.files()}/${actionType}`,
  fileBinary     : (path, fileName) => `${Urls.files()}/binary/${path}${fileName ? `/${fileName}` : ''}`,
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
  userSocialLogin       : socialType => `${Urls.userSocial()}/${socialType.toLowerCase()}/login/${Backendless.applicationId}`,
}

export default Urls