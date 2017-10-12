import { implementMethod } from './implement-method'

export function decrementAndGet(counterName, async) {
  return implementMethod(counterName, 'decrement/get', async)
}
