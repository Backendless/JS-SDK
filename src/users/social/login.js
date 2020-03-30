import Utils from '../../utils'

import { getUserFromResponse, parseResponse } from '../utils'

import { SocialContainer } from './container'

export async function loginSocial(socialType, fieldsMapping, permissions, container, stayLoggedIn) {
  const socialContainer = new SocialContainer(socialType, container)

  const resolveContainer = () => {
    return new Promise((resolve, reject) => {
      const onMessage = event => {
        if (event.origin === this.app.serverURL) {
          const result = JSON.parse(event.data)

          if (result.fault) {
            reject(result.fault)
          } else {
            resolve(result)
          }

          removeWindowEventListener('message', window, onMessage)

          socialContainer.closeContainer()
        }
      }

      addWindowEventListener('message', window, onMessage)
    })
  }

  const resolveUser = data => {
    this.setLocalCurrentUser(parseResponse.call(this, Utils.tryParseJSON(data), stayLoggedIn))

    return getUserFromResponse.call(this, this.getLocalCurrentUser())
  }

  return this.app.request
    .post({
      url : this.app.urls.userSocialOAuth(socialType),
      data: {
        fieldsMapping: fieldsMapping || {},
        permissions  : permissions || [],
      }
    })
    .then(authUrl => socialContainer.doAuthorizationActivity(authUrl))
    .catch(error => {
      socialContainer.closeContainer()

      throw error
    })
    .then(resolveContainer)
    .then(resolveUser)
}

function addWindowEventListener(event, elem, callback) {
  if (elem.addEventListener) {
    elem.addEventListener(event, callback, false)

  } else if (elem.attachEvent) {
    elem.attachEvent('on' + event, callback)

  } else {
    elem[event] = callback
  }
}

function removeWindowEventListener(event, elem, callback) {
  if (elem.removeEventListener) {
    elem.removeEventListener(event, callback, false)
  } else if (elem.detachEvent) {
    elem.detachEvent('on' + event, callback)
  }

  elem[event] = null
}
