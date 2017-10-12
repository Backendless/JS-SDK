import { implementMethod } from './implement-method'

export function getAndDecrement(counterName, async) {
  return implementMethod(counterName, 'get/decrement', async)
}

