import DataQueryBuilder from './data-query-builder'

export default class LoadRelationsQueryBuilder extends DataQueryBuilder {

  static of(RelationModel) {
    return new this(RelationModel)
  }

  constructor(RelationModel) {
    super()

    this.relationModel = RelationModel

    this.relationName = null
  }

  setRelationName(relationName) {
    this.relationName = relationName

    return this
  }

  getRelationName() {
    return this.relationName
  }

  setRelationModel(relationModel) {
    this.relationModel = relationModel

    return this
  }

  getRelationModel() {
    return this.relationModel
  }

  toJSON() {
    const result = super.toJSON()

    result.relationName = this.getRelationName()
    result.relationModel = this.getRelationModel()

    return result
  }
}
