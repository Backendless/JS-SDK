export function createComparator(property) {
  return function(a, b) {
    if (a[property] > b[property]) {
      return 1
    }
    if (a[property] < b[property]) {
      return -1
    }

    return 0
  }
}
