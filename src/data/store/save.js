import Utils from '../../utils'
import Urls from '../../urls'
import Request from '../../request'

import { parseFindResponse } from './parse'

const genID = () => {
  //TODO: refactor me
  let b = ''

  for (let a = b; a++ < 36; b += a * 51
  && 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-') {
  }

  return b
}

export function replCircDeps(object) {
  const objMap = [object]
  let pos

  const _replCircDepsHelper = obj => {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'object' && obj[prop] != null) {
        if ((pos = objMap.indexOf(obj[prop])) !== -1) {
          objMap[pos]['__subID'] = objMap[pos]['__subID'] || genID()
          obj[prop] = { '__originSubID': objMap[pos]['__subID'] }

        } else if (Utils.isDate(obj[prop])) {
          obj[prop] = obj[prop].getTime()

        } else {
          objMap.push(obj[prop])
          _replCircDepsHelper(obj[prop])
        }
      }
    }
  }

  _replCircDepsHelper(object)
}

export function save(obj, asyncHandler) {
  replCircDeps(obj)

  const objRef = obj

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler, resp => parseFindResponse(resp, this.model))
  }

  const result = Request.put({
    url         : Urls.dataTable(this.className),
    data        : obj,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })

  if (asyncHandler) {
    return result
  }

  return Utils.deepExtend(objRef, parseFindResponse(result, this.model))
}
