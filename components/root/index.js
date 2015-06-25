var RouterComponent = require('../router/index.js')
const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const LandingComponent = require('../landing/index.js')
const AppBarComponent = require('../app-bar/index.js')

module.exports = Component

function Component() {
  return hg.state({
    route: RouterComponent(),
    landing: LandingComponent(),
  })
}

Component.render = function render(state) {
  return h('.app-container', [
    AppBarComponent.render(state),
    h('.app-content', [
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
