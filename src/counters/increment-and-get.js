import { implementMethod } from './implement-method'

export function incrementAndGet(counterName, async) {
  return implementMethod(counterName, 'increment/get', async)
}
