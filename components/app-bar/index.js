var anchor = require('../router/index.js').anchor
const hg = require('../../mercury.js')
const h = require('../../mercury.js').h

module.exports = Component

function Component() {
  return hg.state({})
}

Component.render = function render(state) {
  return h('.app-bar.flex-fixed.flex-row', [
    h('span.app-bar-logo.flex-fixed.select-none.cursor-pointer.z-bump', 'Vapor'),
    h('input.app-url-bar.flex-grow.z-bump', { type: 'text', placeholder: 'http://yourdapp.com/' }),
    h('button.btn-hamburger.btn-empty.flex-fixed.z-bump')
  ])
}
