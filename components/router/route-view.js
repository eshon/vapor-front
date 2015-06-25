var routeMap = require('route-map')

module.exports = routeView

function routeView(state, routes) {
  var base = state.base
  if (base) {
    var newDefn = {}
    Object.keys(routes).forEach(function applyBase(str) {
      newDefn[base + str] = routes[str]
    })
    routes = newDefn
  }

  var match = routeMap(routes)

  var res = match(state.route)
  if (!res) {
    throw new Error('router: no match found')
  }

  res.params.url = res.url
  return res.fn(res.params)
}