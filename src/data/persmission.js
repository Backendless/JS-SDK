import Permission from '../persmission'

export default class DataPermission extends Permission {

  static BACKWARD_COMPATIBILITY_LABEL = 'Backendless.Data.Permissions.{FIND|REMOVE|UPDATE}'

  getRequestURL(type, dataObject){
    if (!dataObject.___class || !dataObject.objectId) {
      throw new Error('"dataObject.___class" and "dataObject.objectId" need to be specified')
    }

    return this.app.urls.dataObjectPermission(dataObject.___class, type, dataObject.objectId)
  }
}
