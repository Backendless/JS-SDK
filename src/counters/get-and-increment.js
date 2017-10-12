import { implementMethod } from './implement-method'

export function getAndIncrement(counterName, async) {
  return implementMethod(counterName, 'get/increment', async)
}
