var value = require('observ')
var source = require('geval/source')
var window = require('global/window')
var document = require('global/document')

var atom = Router.atom = value(String(document.location.pathname))

module.exports = Router

function Router() {
  var inPopState = false
  var popstates = popstate()

  popstates(onPopState)
  atom(onRouteSet)

  return atom

  function onPopState(uri) {
    inPopState = true
    atom.set(uri)
  }

  function onRouteSet(uri) {
    if (inPopState) {
      inPopState = false
      return
    }

    pushHistoryState(uri)
  }
}

function pushHistoryState(uri) {
  window.history.pushState(undefined, document.title, uri)
}

function popstate() {
  return source(function broadcaster(broadcast) {
    window.addEventListener('popstate', onPopState)

    function onPopState() {
      broadcast(String(document.location.pathname))
    }
  })
}