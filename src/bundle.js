
const Backendless = {}

//TODO: refactor me
const root = typeof root !== 'undefined' ? root : {}

const previousBackendless = root.Backendless

Backendless.noConflict = function() {

  if (root) {
    root.Backendless = previousBackendless
  }

  return Backendless
}

export default Backendless