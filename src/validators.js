export const Validators = {
  requiredString(key, value, message = 'a string') {
    if (!value || typeof value !== 'string') {
      throw new Error(`${key} must be provided and must be ${message}!`)
    }
  },

  requiredNumber(key, value, message = 'a number') {
    if (!value || typeof value !== 'number') {
      throw new Error(`${key} must be provided and must be ${message}!`)
    }
  },

  optionalNumber(key, value, message = 'a number') {
    if (value !== undefined && typeof value !== 'number') {
      throw new Error(`${key} must be ${message}!`)
    }
  }
}
