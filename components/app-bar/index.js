const anchor = require('../router/').anchor
const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const UrlBarComponent = require('../url-bar/')
const NotificationTxComponent = require('../notification-tx/')
const mustOverride = require('../../util/mustOverride.js')
const stateExtend = require('../../util/stateExtend.js')

module.exports = Component


function Component() {
  return hg.state({
    // state
    dappUrl: hg.value(''),
    showNotification: hg.value(false),
    // components
    urlBar: UrlBarComponent(),
    // channels
    channels: {
      navigateToDapp: mustOverride,
      hamburgerHelper: mustOverride,
    },
    // actions
    actions: {

    },
  })
}

Component.render = function render(state) {
  
  var urlBarState = stateExtend(state.urlBar, {
    value: state.dappUrl,
    channels: {
      submit: state.channels.navigateToDapp,
    },
  })
  
  return h('.app-header.flex-fixed', [
    h('.app-bar.flex-row', [
      h('span.app-bar-logo.flex-fixed.select-none.cursor-pointer.z-bump', 'Vapor'),
      UrlBarComponent.render(urlBarState),
      h('button.btn-hamburger.btn-empty.flex-fixed.z-bump', { 'ev-click': hg.sendClick(state.channels.hamburgerHelper) }),
    ]),
    state.pendingTxs.map(function(txParams){
      return NotificationTxComponent.render(txParams, state.actions.submitTx, state.actions.removeTx, state.actions.setTxFrom)
    }),
  ])
}

function pluralize(count, singular, plural) {
  // accepts array or int
  if (Array.isArray(count)) {
    count = count.length
  }
  // guesses plural form
  if (!plural) {
    plural = singular + 's'
  }
  if (count === 1) {
    return singular
  } else {
    return plural
  }
}