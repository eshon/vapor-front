const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const appNav = require('../app-nav')

module.exports = Component


function Component() {
  return hg.state({
    channels: {
      unlockLocal: function(state, data){
        console.log('unlocking with:', data.password)
      },
    },
  })
}

Component.render = function render(state) {
  return [
    appNav.render(state),
    idMgmt(state),
  ]
}

function idMgmt(state){
  return h('.app-section-identity.flex-row.flex-center', [
    h('.flex-column', [
      h('header', [
        h('h1', 'Identity Management'),
        h('h3', 'Ethereum identities are accounts for interacting with smart contracts and storing ether.'),
        summary(),
      ]),
      localIds(state),
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

function localIds(state) {
  var d = HyperDrive('section.local-identities')
  d('h2', 'Local Identities')
  d('button', 'new')
  d('button', 'import')
  d('h3', 'These are stored in the browser and not backed up on our server.')
  d('h3', 'Please be sure you have backups of these identities.')
  if (state.localUnlocked){
    d('span', 'no wallets yet...')    
  } else {
    d('img.lock-icon', { src: '/assets/lock.svg' })
    d('input', {
      type: 'password',
      name: 'password',
      placeholder: 'password',
      'ev-change': hg.sendValue(state.channels.unlockLocal)
    })
  }
  return d.render()
}

function hostedWallets() {
  var d = HyperDrive('section')
  return d.render()
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

function HyperDrive(tag, config){
  var content = []
  append.render = render
  return append
  
  function append(first){
    // hyperscript obj
    if (typeof first === 'object') {
      content.push(first)
    // hyperscript params
    } else {
      content.push(h.apply(null, arguments))
    }
  }
  function render(){
    return h(tag, config, content)
  }
}

// ======================================

function renderLogin(login) {
  return h('div', {
    'ev-event': hg.sendSubmit(login)
  }, [
    h('fieldset', [
      h('legend', 'Login Form'),
      labeledInput('Email: ', {
        name: 'email',
      }),
      labeledInput('Password: ', {
        name: 'password',
        type: 'password'
      }),
    ])
  ]);
}

function labeledInput(label, opts) {
    opts.className = opts.error ?
        styles.inputError.className : '';

    return h('div', [
        h('label', {
            className: ''
        }, [
            label,
            h('input', opts)
        ]),
        h('div', {
            className: ''
        }, [
            opts.error
        ])
    ]);
}