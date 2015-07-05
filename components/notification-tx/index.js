const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const appNav = require('../app-nav')
const mustOverride = require('../../util/mustOverride.js')

module.exports = Component


function Component() {
  return hg.state({
    actions: {
      submitTx: mustOverride,
    }
  })
}

Component.render = function render(state, submitTx, removeTx) {
  return h('.notification.flex-row.flex-space-between', [
    'to: '+state.to,
    'value: '+state.value,
    h('.flex-row-right', [
      h('button', { 'ev-click': hg.send(submitTx, state) }, 'confirm'),
      h('button', { 'ev-click': hg.send(removeTx, state) }, 'cancel'),
    ]),
  ])
}