import Backendless from './bundle'

const root = (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global)

const previousBackendless = root && root.Backendless

export function noConflict() {
  if (root) {
    root.Backendless = previousBackendless
  }

  return Backendless
}
