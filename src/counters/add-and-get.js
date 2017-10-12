import { implementMethodWithValue } from './implement-method-with-value'

export function addAndGet(counterName, value, async) {
  return implementMethodWithValue(counterName, 'incrementby/get' + '?value=', value, async)
}
