import { implementMethod } from './implement-method'

export function getAndIncrement(counterName, asyncHandler) {
  return implementMethod(counterName, 'get/increment', asyncHandler)
}
