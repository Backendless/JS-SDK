class SpatialType {
  constructor({ srsId, name }) {
    this.srsId = srsId
    this.name = name
  }

  getSRSId() {
    return this.srsId
  }

  getName() {
    return this.name
  }

  toString() {
    return this.getName() + '(' + this.getSRSId() + ')'
  }
}

const CARTESIAN = new SpatialType({
  srsId: 0,
  name : 'Cartesian'
})

const PULKOVO_1995 = new SpatialType({
  srsId: 4200,
  name : 'Pulkovo 1995'
})

const WGS84 = new SpatialType({
  srsId: 4326,
  name : 'WGS 84'
})

const WGS84_PSEUDO_MERCATOR = new SpatialType({
  srsId: 3857,
  name : 'WGS 84 / Pseudo-Mercator'
})

const WGS84_WORLD_MERCATOR = new SpatialType({
  srsId: 3395,
  name : 'WGS 84 / World Mercator'
})

const SpatialReferenceSystem = {
  CARTESIAN,
  PULKOVO_1995,
  WGS84,
  WGS84_PSEUDO_MERCATOR,
  WGS84_WORLD_MERCATOR,
  DEFAULT: WGS84,

  SRS_MAP: {},

  valueBySRSId(srsId) {
    return SpatialReferenceSystem.SRS_MAP[srsId]
  }
}

Object.keys(SpatialReferenceSystem).forEach(type => {
  if (SpatialReferenceSystem[type] instanceof SpatialType) {
    const spatialType = SpatialReferenceSystem[type]

    SpatialReferenceSystem.SRS_MAP[spatialType.getSRSId()] = spatialType
  }
})

export default SpatialReferenceSystem