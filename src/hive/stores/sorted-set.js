import { HiveStore } from './base-store'
import { HiveTypes } from '../constants'

export class SortedSetStore extends HiveStore {
  constructor(dataStore, storeKey) {
    super(dataStore, HiveTypes.SORTED_SET)

    this.storeKey = storeKey
  }
}
