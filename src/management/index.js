import Data from './data'

export default class Management {
  constructor(app) {
    this.app = app

    this.Data = new Data(app)
  }
}
