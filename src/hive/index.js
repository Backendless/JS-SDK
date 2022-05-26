import { KeyValueStore, ListStore, MapStore, SetStore, SortedSetStore } from './stores'

export default function HiveService(app) {
  function getHive(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Hive name must be provided and must be a string.')
    }

    return new DataHive(name, { app })
  }

  getHive.getNames = () => {
    return app.request
      .get({
        url: app.urls.dataHives(),
      })
  }

  return getHive
}

export class DataHive {
  constructor(name, context) {
    this.hiveName = name
    this.app = context.app
  }

  create() {
    return this.app.request
      .post({
        url: this.app.urls.dataHive(this.hiveName),
      })
  }

  delete() {
    return this.app.request
      .delete({
        url: this.app.urls.dataHive(this.hiveName),
      })
  }

  rename(newName) {
    if (!newName || typeof newName !== 'string') {
      throw new Error('New Hive name must be provided and must be a string.')
    }

    return this.app.request
      .put({
        url  : this.app.urls.dataHive(this.hiveName),
        query: { newName }
      })
  }

  KeyValueStore(storeKey) {
    if (storeKey !== undefined && typeof storeKey !== 'string') {
      throw new Error('Store key must be a string.')
    }

    return new KeyValueStore(this, storeKey)
  }

  ListStore(storeKey) {
    if (storeKey !== undefined && typeof storeKey !== 'string') {
      throw new Error('Store key must be a string.')
    }

    return new ListStore(this, storeKey)
  }

  MapStore(storeKey) {
    if (storeKey !== undefined && typeof storeKey !== 'string') {
      throw new Error('Store key must be a string.')
    }

    return new MapStore(this, storeKey)
  }

  SetStore(storeKey) {
    if (storeKey !== undefined && typeof storeKey !== 'string') {
      throw new Error('Store key must be a string.')
    }

    return new SetStore(this, storeKey)
  }

  SortedSetStore(storeKey) {
    if (storeKey !== undefined && typeof storeKey !== 'string') {
      throw new Error('Store key must be a string.')
    }

    return new SortedSetStore(this, storeKey)
  }
}
