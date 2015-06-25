const hg = require('../../mercury.js')
const h = require('../../mercury.js').h

module.exports = Component

function Component() {
  return hg.state({})
}

Component.render = function render(state) {
  // return h('div', 'this is the app content')
  return h('div', h('ul', [
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
    h('li', 'this is the app content'),
  ]))
}
