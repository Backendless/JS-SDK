export default class Data {
  constructor(app) {
    this.app = app
  }

  createTable(name, columns) {
    if (!name || typeof name !== 'string') {
      throw new Error('Table name must be provided and must be a string.')
    }

    if (!Array.isArray(columns)) {
      throw new Error('Columns must be a list.')
    }

    return this.app.request
      .post({
        url : this.app.urls.managementDataTable(),
        data: { name, columns },
      })
  }
}
