const extend = require('xtend')
const location = require('global/window').location
const RouterComponent = require('../router/index.js')
const routeAtom = RouterComponent.atom
const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const LandingComponent = require('../landing/index.js')
const AppBarComponent = require('../app-bar/index.js')
const DappSandboxComponent = require('../dapp-sandbox/index.js')
const stateExtend = require('../../util/stateExtend.js')
const dappRoutePrefix = '/dapp/'

module.exports = Component


function Component() {
  return hg.state({
    // state
    dappUrl: hg.value(''),
    // components
    route: RouterComponent(),
    landing: LandingComponent(),
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
}

Component.render = function render(state) {

  // define routes
  var routes = {}
  routes['/'] = landingPage.bind(null, state)
  routes[dappRoutePrefix] = dappSandbox.bind(null, state)
  routes[dappRoutePrefix+':target*'] = dappSandbox.bind(null, state)
  routes['__default__'] = redirectTo.bind(null, '/')

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

function landingPage(state) {
  return LandingComponent.render(state.landing)
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
  return location.href.slice(stem.length)
}

function redirectTo(target){
  setTimeout(function(){
    routeAtom.set(target)
  }, 2000)
  return h('span', 'Invalid url. redirecting...')
}