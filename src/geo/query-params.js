import FindHelpers from './find-helpers'

//TODO: refactor me

export function toQueryParams(query) {
  const params = []

  for (const prop in query) {
    if (query.hasOwnProperty(prop) && FindHelpers.hasOwnProperty(prop) && query[prop] != null) {
      params.push(FindHelpers[prop](query[prop]))
    }
  }

  return params.join('&')
}
