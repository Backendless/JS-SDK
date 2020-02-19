import Utils from '../../utils'

const isOnline = () => {
  if (Utils.isBrowser) {
    return navigator.onLine
  }

  throw new Error('Offline DB is not available outside of browser')
}

const onOnline = cb => {
  if (Utils.isBrowser) {
    window.addEventListener('online', cb)
  }
}

const onOffline = cb => {
  if (Utils.isBrowser) {
    window.addEventListener('offline', cb)
  }
}

export {
  isOnline,
  onOnline,
  onOffline
}