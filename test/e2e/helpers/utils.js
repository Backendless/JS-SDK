const chr4 = () => Math.random().toString(16).slice(-4)
const chr8 = () => `${chr4()}${chr4()}`

export const uid = () => `${chr8()}${chr8()}${chr8()}${chr8()}`
