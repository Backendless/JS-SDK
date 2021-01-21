export function getHugeMySQL(minCharts, columnName) {
  let hugeRequest = ''
  let currentCharts = 0
  let cloneCount = 0

  while (currentCharts < minCharts) {
    const addToRequest = `${columnName} != 'hugerequest${cloneCount}' AND `

    hugeRequest += addToRequest
    cloneCount++
    currentCharts += addToRequest.length
  }

  return hugeRequest += `${columnName} != 'hugerequest${cloneCount}'`
}

export function sortByProperty(property) {
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
