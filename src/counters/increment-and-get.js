import { implementMethod } from './implement-method'

export function incrementAndGet(counterName, asyncHandler) {
  return implementMethod(counterName, 'increment/get', asyncHandler)
}
