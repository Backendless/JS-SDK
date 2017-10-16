import Utils from '../../utils'
import Async from '../../request/async'
import Urls from '../../urls'
import Request from '../../request'
import LocalVars from '../../local-vars'

import { wrapAsync } from '../utils'

import { SocialContainer } from './container'

export function loginSocial(socialType, fieldsMapping, permissions, container, stayLoggedIn, asyncHandler) {
  const socialContainer = new SocialContainer(socialType, container)

  asyncHandler = Utils.extractResponder(arguments)
  asyncHandler = wrapAsync(asyncHandler, stayLoggedIn)

  addWindowEventListener('message', window, function(e) {
    if (e.origin === LocalVars.serverURL) {
      const result = JSON.parse(e.data)

      if (result.fault) {
        asyncHandler.fault(result.fault)
      } else {
        asyncHandler.success(result)
      }

      removeWindowEventListener('message', window)
      socialContainer.closeContainer()
    }
  })

  const interimCallback = new Async(function(r) {
    socialContainer.doAuthorizationActivity(r)
  }, function(e) {
    socialContainer.closeContainer()
    asyncHandler.fault(e)
  })

  const request = {}
  request.fieldsMapping = fieldsMapping || {}
  request.permissions = permissions || []

  Request.post({
    url         : Urls.userSocialOAuth(socialType),
    isAsync     : true,
    asyncHandler: interimCallback,
    data        : request
  })
}


function addWindowEventListener(event, elem, func) {
  if (elem.addEventListener) {
    elem.addEventListener(event, func, false)

  } else if (elem.attachEvent) {
    elem.attachEvent('on' + event, func)

  } else {
    elem[event] = func
  }
}

function removeWindowEventListener(event, elem) {
  if (elem.removeEventListener) {
    elem.removeEventListener(event, null, false)
  } else if (elem.detachEvent) {
    elem.detachEvent('on' + event, null)
  }

  elem[event] = null
}