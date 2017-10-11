import { implementMethod } from './implement-method'

export function reset(counterName, async) {
  return implementMethod(counterName, 'reset', async)
}
