export const deprecated = (namespace, alternative) => function(target, prop, descriptor) {
  const value = target[prop]

  descriptor.initializer = () => function() {
    const mainMessage = `"${namespace}.${prop}" is deprecated and will be removed in the nearest release.`
    const helpMessage = `Please use "${alternative}" instead of.`

    // eslint-disable-next-line no-console
    console.warn(`${mainMessage} ${alternative ? helpMessage : ''}`)

    return value.apply(this, arguments)
  }

  return descriptor
}