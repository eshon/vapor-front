const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const keyManager = require('../../util/keyManager')
const mustOverride = require('../../util/mustOverride.js')
const selectComponent = require('../select/')

module.exports = Component


function Component() {
  return hg.state({
    actions: {
      submitTx: mustOverride,
    }
  })
}

Component.render = function render(state, submitTx, removeTx, setTxFrom) {
  var fromOptions = keyManager.observ.identities().map(function(id){ return id.label })
  return h('.notification.flex-row.flex-space-between', [
    'from: ',
    selectComponent(fromOptions, setTxFrom.bind(null, state)),
    h('span', 'to: '+state.to.slice(0,8)),
    h('span', 'ether: '+parseInt(state.value, 16)),
    h('.flex-row-right', [
      h('button', { 'ev-click': hg.sendClick(submitTx, state) }, 'confirm'),
      h('button', { 'ev-click': hg.sendClick(removeTx, state) }, 'cancel'),
    ]),
  ])
}