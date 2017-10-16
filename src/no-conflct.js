const root = (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global)

const previousBackendless = root && root.Backendless

export function noConflict() {
  const Backendless = root && root.Backendless

  if (root) {
    root.Backendless = previousBackendless
  }

  return Backendless
}
