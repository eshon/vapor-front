const extend = require('xtend')
const location = require('global/window').location
const RouterComponent = require('../router/')
const routeAtom = RouterComponent.atom
const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const LandingComponent = require('../landing/')
const AppBarComponent = require('../app-bar/')
const DappSandboxComponent = require('../dapp-sandbox/')
const IdMgmtComponent = require('../id-mgmt/')
const stateExtend = require('../../util/stateExtend.js')

const dappRoutePrefix = '/dapp/'

module.exports = Component


function Component() {
  var state = hg.state({
    // state
    dappUrl: hg.value(getDappUrl()),
    // components
    route: RouterComponent(),
    appBar: AppBarComponent(),
    dappSandbox: DappSandboxComponent(),
    // channels
    channels: {
      navigateToDapp: function(state, data){
        var target = data.url
        state.dappUrl.set(target)
        routeAtom.set(dappRoutePrefix + target)
      },
      navigateToRoot: function(state){
        routeAtom.set('/')
      },
    },
  })

  return state
}

Component.render = function render(state) {

  // define routes
  var routes = {}
  routes['__default__'] = redirectTo.bind(null, '/')
  routes['/'] = LandingComponent.render.bind(null, state)
  routes[dappRoutePrefix] = dappSandbox.bind(null, state)
  routes[dappRoutePrefix+':target*'] = dappSandbox.bind(null, state)
  routes['/identities'] = IdMgmtComponent.render.bind(null, state)

  // setup state
  var appBarState = stateExtend(state.appBar, {
    dappUrl: state.dappUrl,
    channels: {
      navigateToDapp: state.channels.navigateToDapp,
      hamburgerHelper: state.channels.navigateToRoot,
    },
  })

  return h('.app-container.flex-column', [
    AppBarComponent.render(appBarState),
    h('.app-content.flex-grow', [
      RouterComponent.render(state, routes)
    ])
  ])
}

function dappSandbox(state, params) {

  var target = getDappUrl()
  
  var dappSandboxState = stateExtend(state.dappSandbox, {
    dappUrl: target,
    channels: {
      dappUrlRedirect: state.channels.navigateToDapp,
    },
  })

  return DappSandboxComponent.render(dappSandboxState)
}

function getDappUrl() {
  var stem = location.origin + dappRoutePrefix
  if (stem === location.href.slice(0, stem.length)) {
    return location.href.slice(stem.length)
  }
}

function redirectTo(target){
  setTimeout(function(){
    routeAtom.set(target)
  }, 2000)
  return h('span', 'Invalid url. redirecting...')
}