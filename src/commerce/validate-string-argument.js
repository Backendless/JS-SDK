import Utils from '../utils'

export function validateStringArgument(label, value) {
  if (!value || !Utils.isString(value)) {
    throw new Error(`${label} must be provided and must be not an empty STRING!`)
  }
}
