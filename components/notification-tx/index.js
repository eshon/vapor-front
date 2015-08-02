const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const keyManager = require('../../util/keyManager')
const mustOverride = require('../../util/mustOverride')
const HyperDrive = require('../../util/hyperDrive')
const selectComponent = require('../select/')
const anchor = require('../router').anchor

module.exports = Component


function Component() {
  return hg.state({
    actions: {
      submitTx: mustOverride,
    }
  })
}

Component.render = function render(state, submitTx, removeTx, setTxFrom) {
  var d = HyperDrive('.notification.flex-row.flex-space-between')
  var fromOptions = keyManager.observ.identities().map(function(id){ return id.label })
  
  if (fromOptions.length) {
    d('from: ')
    d(selectComponent(fromOptions, setTxFrom.bind(null, state)))
  } else {
    d(anchor({ href: '/identities/' }, 'unlock identities'))
  }

  var isValid = !!fromOptions.length

  d('span', 'to: '+state.to.slice(0,8))
  d('span', 'ether: '+parseInt(state.value, 16))
  d('.flex-row-right', [
    h('button', { 'ev-click': hg.sendClick(submitTx, state), disabled: !isValid }, 'confirm'),
    h('button', { 'ev-click': hg.sendClick(removeTx, state) }, 'cancel'),
  ])

  return d.render()
}