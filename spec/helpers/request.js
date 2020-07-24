'use strict'

module.exports.create = function(queryParams) {
  let request = {
    'pathParams': {},
    'queryString': {}
  }
  if (queryParams) {
    for (const p in queryParams) {
      request.queryString[p] = queryParams[p]
    }
  }
  return request
}