import { implementMethod } from './implement-method'

export function reset(counterName, asyncHandler) {
  return implementMethod(counterName, 'reset', asyncHandler)
}
