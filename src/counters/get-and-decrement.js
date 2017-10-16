import { implementMethod } from './implement-method'

export function getAndDecrement(counterName, asyncHandler) {
  return implementMethod(counterName, 'get/decrement', asyncHandler)
}

