import { implementMethod } from './implement-method'

export function decrementAndGet(counterName, asyncHandler) {
  return implementMethod(counterName, 'decrement/get', asyncHandler)
}
