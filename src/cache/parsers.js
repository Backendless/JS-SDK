const Classes = {}

export const Parsers = {

  set(className, Class) {
    Classes[className] = Class
  },

  get(className) {
    return Classes[className]
  }
}
