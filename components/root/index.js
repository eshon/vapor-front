const extend = require('xtend')
const RouterComponent = require('../router/index.js')
const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const LandingComponent = require('../landing/index.js')
const AppBarComponent = require('../app-bar/index.js')
const stateExtend = require('../../util/stateExtend.js')

module.exports = Component


function Component() {
  return hg.state({
    // state
    dappUrl: hg.value(''),
    // components
    route: RouterComponent(),
    landing: LandingComponent(),
    appBar: AppBarComponent(),
    // channels
    channels: {
      navigateToDapp: function(state, data){
        state.dappUrl.set(data.url)
      },
    },
  })
}

Component.render = function render(state) {

  var appBarState = stateExtend(state.appBar, {
    dappUrl: state.dappUrl,
    channels: {
      navigateToDapp: state.channels.navigateToDapp,
    },
  })

  return h('.app-container.flex-column', [
    AppBarComponent.render(appBarState),
    h('.app-content.flex-grow', [
      RouterComponent.render(state, {
        '/': function() {
          return LandingComponent.render(state.landing)
        },
        '/animals': function() {
          return h('h1', ['Animals'])
        },
      })
    ])
  ])
}
