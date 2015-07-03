const anchor = require('../router/index.js').anchor
const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const UrlBarComponent = require('../url-bar/index.js')
const mustOverride = require('../../util/mustOverride.js')
const stateExtend = require('../../util/stateExtend.js')

module.exports = Component


function Component() {
  return hg.state({
    // state
    dappUrl: hg.value(''),
    // components
    urlBar: UrlBarComponent(),
    // channels
    channels: {
      navigateToDapp: mustOverride,
      hamburgerHelper: mustOverride,
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
  
  return h('.app-header', [
    h('.app-bar.flex-row', [
      h('span.app-bar-logo.flex-fixed.select-none.cursor-pointer.z-bump', 'Vapor'),
      UrlBarComponent.render(urlBarState),
      h('button.btn-hamburger.btn-empty.flex-fixed.z-bump', { 'ev-click': hg.sendClick(state.channels.hamburgerHelper) }),
    ]),
    notification(),
  ])
}

function notification(){
  return h('.notification.flex-row.flex-space-between', [
    '3 pending transactions...',
    h('button', 'confirm'),
  ])  
}
