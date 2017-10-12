import { implementMethodWithValue } from './implement-method-with-value'

export function getAndAdd(counterName, value, async) {
  return implementMethodWithValue(counterName, 'get/incrementby' + '?value=', value, async)
}
