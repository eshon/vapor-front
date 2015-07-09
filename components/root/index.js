const extend = require('xtend')
const location = require('global/window').location
const RouterComponent = require('../router/')
const routeAtom = RouterComponent.atom
const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const stateExtend = require('../../util/stateExtend.js')
const signAndSendTx = require('../../util/signTx.js')
const LandingComponent = require('../landing/')
const AppBarComponent = require('../app-bar/')
const DappSandboxComponent = require('../dapp-sandbox/')
const IdMgmtComponent = require('../id-mgmt/')
const TrendingComponent = require('../trending/')
const AppNavComponenent = require('../app-nav')

const dappRoutePrefix = '/dapp/'

module.exports = Component


function Component() {
  var state = hg.state({
    // state
    dappUrl: hg.value(getDappUrl()),
    pendingTxs: hg.array([]),
    // components
    route: RouterComponent(),
    appBar: AppBarComponent(),
    dappSandbox: DappSandboxComponent(),
    idMgmt: IdMgmtComponent(),
    trending: TrendingComponent(),
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
    // actions
    actions: {
      newPendingTx: function(state, txParams){
        state.pendingTxs.push(txParams)
      },
      submitTx: function(state, txParams){
        state.actions().removeTx(txParams)
        signAndSendTx(txParams)
      },
      removeTx: function(state, txParams){
        // remove tx from pendingTxs
        state.pendingTxs.splice(state.pendingTxs.indexOf(txParams), 1)
      },
    },
  })

  return state
}

Component.render = function render(state) {

  // define routes
  var routes = {}
  routes['__default__'] = redirectTo.bind(null, '/')
  routes['/'] = landingPage.bind(null, state)
  routes[dappRoutePrefix] = dappSandbox.bind(null, state)
  routes[dappRoutePrefix+':target*'] = dappSandbox.bind(null, state)
  routes['/identities'] = idMgmt.bind(null, state)
  routes['/trending'] = trendingDapps.bind(null, state)

  // setup state
  var appBarState = stateExtend(state.appBar, {
    dappUrl: state.dappUrl,
    pendingTxs: state.pendingTxs,
    channels: {
      navigateToDapp: state.channels.navigateToDapp,
      hamburgerHelper: state.channels.navigateToRoot,
    },
    actions: {
      submitTx: state.actions.submitTx,
      removeTx: state.actions.removeTx,
    },
  })

  return h('.app-container.flex-column', [
    AppBarComponent.render(appBarState),
    h('.app-content.flex-grow', [
      RouterComponent.render(state, routes)
    ])
  ])
}

function appNav(state) {
  return AppNavComponenent.render(state)
}

function landingPage(state) {
  return [
    appNav(state),
    LandingComponent.render(),
  ]
}

function dappSandbox(state, params) {

  var target = getDappUrl()
  
  var dappSandboxState = stateExtend(state.dappSandbox, {
    dappUrl: target,
    channels: {
      dappUrlRedirect: state.channels.navigateToDapp,
    },
    actions: {
      newPendingTx: state.actions.newPendingTx,
    },
  })

  return DappSandboxComponent.render(dappSandboxState)
}

function idMgmt(state) {
  var idMgmtState = stateExtend(state.idMgmt, {})
  return [
    appNav(state),
    IdMgmtComponent.render(idMgmtState),
  ]
}

function trendingDapps(state) {
  var trendingState = stateExtend(state.trending, {
    channels: {
      navigateToDapp: state.channels.navigateToDapp
    }
  })
  return [
    appNav(state),
    TrendingComponent.render(trendingState),
  ]
}

// util

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
