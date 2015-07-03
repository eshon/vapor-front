const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const appNav = require('../app-nav')

module.exports = Component


function Component() {
  return hg.state({})
}

Component.render = function render(state) {
  return [
    appNav.render(state),
    aboutSection(),
  ]
}

function aboutSection(){
  return h('.app-section-identity.flex-row.flex-center', [
    h('.flex-column', [
      h('header', [
        h('h1', 'Identity Management'),
        h('h3', 'Ethereum identities are accounts for interacting with smart contracts and storing ether.'),
        summary(),
      ]),
      h('section', [
        h('h2', 'Local Identities'),
        h('button', 'new'),
        h('button', 'import'),
        h('h3', 'These are stored in the browser and not backed up on our server.'),
        h('h3', 'Please be sure you have backups of these wallets.'),
        // h('span', 'no wallets yet...'),
        identity(),
        identity(),
        identity(),
      ]),
      h('section', [
        h('h2', 'Hosted Identities'),
        h('button', 'new'),
        h('button', 'upload'),
        h('h3', 'These are securely backed up on our server.'),
        identity(),
        identity(),
      ]),
    ]),
  ])
}

function identity(state) {
  return h('.identity-container.flex-row.flex-space-between', [
    h('h4', 'primary'),
    h('table', [
      h('tr', [
        h('td', 'balance'),
        h('td', '400 Ether'),
      ]),
      h('tr', [
        h('td', 'transactions'),
        h('td', '16'),
      ]),
    ]),
  ])
}

function summary(state) {
  return h('.identities-summary.flex-row.flex-space-between', [
    h('table', [
      h('tr', [
        h('td', 'Number of Identities:'),
        h('td', '6'),
      ]),
    ]),
    h('table', [
      h('tr', [
        h('td', 'Total Balance:'),
        h('td', '2402 Ether'),
      ]),
    ]),
  ])
}