import Utils from '../../utils'

export const isOnline = () => {
  if (Utils.isBrowser) {
    return navigator.onLine
  }

  throw new Error('Offline DB is not available outside of browser')
}

export const onOnline = cb => {
  if (Utils.isBrowser) {
    window.addEventListener('online', cb)
  }
}

export const onOffline = cb => {
  if (Utils.isBrowser) {
    window.addEventListener('offline', cb)
  }
}