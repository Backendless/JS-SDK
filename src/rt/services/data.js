import { SubscriptionTypes } from '../constants'

export default class RTData {

  constructor(rtClient) {
    this.rtClient = rtClient
  }

  onObjectsChange(tableName, event, query, callback) {
    const args = buildArguments(tableName, event, query, callback)

    this.rtClient.subscribe(SubscriptionTypes.OBJECTS_CHANGES, args.options, args.callback)
  }

  offObjectsChange(tableName, event, query, callback) {
    const args = buildArguments(tableName, event, query, callback)

    this.rtClient.unsubscribe(SubscriptionTypes.OBJECTS_CHANGES, args.options, args.callback)
  }
}

const buildArguments = (tableName, event, query, callback) => {
  const options = {
    tableName,
    event,
    whereClause: undefined
  }

  if (typeof query === 'function') {
    callback = query
    query = undefined
  }

  if (query) {
    if (Array.isArray(query)) {
      const objectIds = []

      query.forEach(({ objectId }) => {
        if (objectId) {
          objectIds.push(`'${objectId}'`)
        }
      })

      options.whereClause = `objectId in (${objectIds.join(', ')})`
    } else {
      options.whereClause = query
    }
  }

  return {
    options,
    callback
  }
}
