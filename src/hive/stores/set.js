import { HiveStore } from './base-store'
import { HiveTypes } from '../constants'

export class SetStore extends HiveStore {
  constructor(dataStore, storeKey) {
    super(dataStore, HiveTypes.SET)

    this.storeKey = storeKey
  }
}
