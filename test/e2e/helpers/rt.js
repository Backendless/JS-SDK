export const TIMEOUT_ERROR = 'RT Callback has not been called!'

export function beforeHook(Backendless) {
  new Promise((resolve, reject) => {
    Backendless.RT.addConnectEventListener(resolve)
    Backendless.RT.addConnectErrorEventListener(reject)

    Backendless.RT.connect()
  })
}

export function afterHook(Backendless) {
  Backendless.resetRT()
}

export async function runRTHandler(subscriber) {
  const results = []
  const callbacks = []

  let index = -1

  const checkReadyResults = () => {
    const nextIndex = index + 1

    if (results[nextIndex] && callbacks[nextIndex]) {
      callbacks[nextIndex](results[nextIndex])

      index = nextIndex

      checkReadyResults()
    }
  }

  const callback = data => {
    results.push(data)

    checkReadyResults()
  }

  await new Promise((onReady, onError) => {
    subscriber({ callback, onError })

    setTimeout(onReady, 5000)
  })

  return {
    results,

    next() {
      const timeoutError = new Error(TIMEOUT_ERROR)

      let resolved = false

      return Promise.race([
        new Promise(resolve => {
          callbacks.push(data => {
            resolved = true

            resolve(data)
          })

          checkReadyResults()
        }),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (!resolved) {
              reject(timeoutError)
            }
          }, 5000)
        }),
      ])

    }
  }
}
