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

    this.KeyValueStore = KeyValueStore.registerType(this)
    this.ListStore = ListStore.registerType(this)
    this.MapStore = MapStore.registerType(this)
    this.SetStore = SetStore.registerType(this)
    this.SortedSetStore = SortedSetStore.registerType(this)
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
}
