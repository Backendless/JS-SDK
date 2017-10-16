import { implementMethodWithValue } from './implement-method-with-value'

export function addAndGet(counterName, value, asyncHandler) {
  return implementMethodWithValue(counterName, 'incrementby/get' + '?value=', value, asyncHandler)
}
