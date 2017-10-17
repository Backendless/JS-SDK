//TODO: refactor me
export class SocialContainer {

  constructor(socialType, container) {
    this.socialType = socialType
    this.container = container

    if (container) {
      this.processContainer()

    } else {
      this.createContainer()
    }
  }

  processContainer() {
    let client

    const container = this.container[0]

    const loadingMsg = document.createElement('div')
    loadingMsg.innerHTML = 'Loading...'

    container.appendChild(loadingMsg)
    container.style.cursor = 'wait'

    this.closeContainer = () => {
      container.style.cursor = 'default'
      container.removeChild(client)
    }

    this.removeLoading = () => {
      container.removeChild(loadingMsg)
    }

    this.doAuthorizationActivity = url => {
      this.removeLoading()

      client = document.createElement('iframe')
      client.frameBorder = 0
      client.width = container.style.width
      client.height = container.style.height
      client.id = 'SocialAuthFrame'
      client.setAttribute('src', url + '&amp;output=embed')
      container.appendChild(client)

      client.onload = () => {
        container.style.cursor = 'default'
      }
    }
  }

  createContainer() {
    const container = window.open('', this.socialType + ' authorization',
      'resizable=yes, scrollbars=yes, titlebar=yes, top=10, left=10')

    const body = container.document.getElementsByTagName('body')[0]
    body.innerHTML = 'Loading...'
    container.document.getElementsByTagName('html')[0].style.cursor = 'wait'

    this.closeContainer = function() {
      container.close()
    }

    this.removeLoading = function() {
      body.innerHTML = null
    }

    this.doAuthorizationActivity = function(url) {
      container.location.href = url
      container.onload = function() {
        container.document.getElementsByTagName('html')[0].style.cursor = 'default'
      }
    }
  }
}
