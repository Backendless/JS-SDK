import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function validateStringArgument(label, value) {
  if (!value || !Utils.isString(value)) {
    throw new Error(`${label} be provided and must be not an empty STRING!`)
  }
}
