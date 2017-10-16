import { implementMethodWithValue } from './implement-method-with-value'

export function getAndAdd(counterName, value, asyncHandler) {
  return implementMethodWithValue(counterName, 'get/incrementby' + '?value=', value, asyncHandler)
}
