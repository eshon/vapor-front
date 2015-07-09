const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const anchorProps = require('../router/index.js').anchorProps

module.exports = Component


function Component() {
  return hg.state({})
}

Component.render = function render(state) {
  var subnavs = []
  if (state.dappUrl) {
    var dappUrl = '/dapp/'+state.dappUrl
    subnavs.push(subnav(dappUrl, 'back to dapp'))
  }
  subnavs.push(subnav('/', 'about'))
  subnavs.push(subnav('/trending', 'trending'))
  subnavs.push(subnav('/identities', 'identities'))
  
  return h('.flex-row-right', subnavs)
}

function subnav(target, label) {
  return h('a.subnav-item', anchorProps({ href: target }), label)
}