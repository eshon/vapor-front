const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const appNav = require('../app-nav')
const keyManager = require('../../util/keyManager')

module.exports = Component


var AncientLocal = require('ancient-tome/local')


function Component() {
  return hg.state({
    localIds: hg.array([]),
    localIdsUnlocked: hg.value(keyManager.isOpen),
    localIdsUnlocking: hg.value(false),
    channels: {
      unlockLocal: function(state, data){
        if (keyManager.isOpen) return
        var secret = data.password
        state.localIdsUnlocking.set(true)
        keyManager.open(secret, function(err){
          if (err) throw err
          state.localIdsUnlocking.set(false)
          state.localIdsUnlocked.set(keyManager.isOpen)
          keyManager.keyList(function(err, keys){
            if (err) throw err
            state.localIds.set(keys)
          })
        })
      },
      createLocalId: function(state){
        if (!keyManager.isOpen) return
        keyManager.generateIdentity('new_id', function(err){
          if (err) throw err
          keyManager.keyList(function(err, keys){
            if (err) throw err
            state.localIds.set(keys)
          })
        })
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
      // h('section', [
      //   h('h2', 'Hosted Identities'),
      //   h('button', 'new'),
      //   h('button', 'upload'),
      //   h('h3', 'These are securely backed up on our server.'),
      //   identity(),
      //   identity(),
      // ]),
    ]),
  ])
}

function localIds(state) {
  var d = HyperDrive('section.local-identities')
  d('h2', 'Local Identities')
  d('h3', 'These are stored in the browser and not backed up on our server.')
  d('h3', 'Please be sure you have backups of these identities.')
  d('h3', 'If this is your first time here, use a memorable password to start creating identities.')

  if (state.localIdsUnlocked){
    d('button', { 'ev-click': hg.sendClick(state.channels.createLocalId) }, 'new')
    d('button', 'import')
    d('br')
    d('br')
    state.localIds.forEach(function(id){
      d(identity(id))
    })
  } else {
    d('img.lock-icon', { src: '/assets/lock.svg' })
    if (state.localIdsUnlocking) {
      d('span', 'unlocking...')
    } else {
      d('input', {
        type: 'password',
        name: 'password',
        placeholder: 'password',
        'ev-change': hg.sendValue(state.channels.unlockLocal)
      })
    }
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
        h('td', 'name'),
        h('td', state.name),
      ]),
      h('tr', [
        h('td', 'address'),
        h('td', state.address.slice(0, 6)),
      ]),
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