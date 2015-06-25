var anchor = require('../router/index.js').anchor
const hg = require('../../mercury.js')
const h = require('../../mercury.js').h

module.exports = Component

function Component() {
  return hg.state({})
}

Component.render = function render(state) {
  return h('.app-bar', [
    anchor({ href: '/' }, 'home'),
    anchor({ href: '/animals' }, 'animals!'),
  ])
}
