export const Validators = {
  requiredString(key, value, message = 'a string') {
    if (!value || typeof value !== 'string') {
      throw new Error(`${key} must be provided and must be ${message}!`)
    }
  },

  anyNumber(key, value, message = 'a number') {
    if (typeof value !== 'number') {
      throw new Error(`${key} must be provided and must be ${message}!`)
    }
  },

  positiveNumber(key, value, message = 'a number') {
    if (typeof value !== 'number' || value <= 0) {
      throw new Error(`${key} must be provided and must be ${message}!`)
    }
  },

  optionalNumber(key, value, message = 'a number') {
    if (value !== undefined && typeof value !== 'number') {
      throw new Error(`${key} must be ${message}!`)
    }
  }
}
