const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const keyManager = require('../../util/keyManager')
const networkedIdentity = require('../networked-identity/')

module.exports = Component


function Component() {
  return hg.state({
    // state
    localIds: hg.array([]),
    localIdsUnlocked: hg.value(keyManager.isOpen),
    localIdsUnlocking: hg.value(false),
    // channels
    channels: {
      unlockLocal: function(state, data){
        if (keyManager.isOpen) return
        var secret = data.password
        state.localIdsUnlocking.set(true)
        keyManager.open(secret, function(err){
          state.localIdsUnlocking.set(false)
          if (err) throw err
          state.localIdsUnlocked.set(keyManager.isOpen)
          keyManager.keyList(function(err, keys){
            if (err) throw err
            var localIds = keys.map(networkedIdentity)
            state.localIds.set(localIds)
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
      importLocalId: function(state){
        debugger
      }
    },
  })
}

Component.render = function render(state) {
  return idMgmt(state)
}

function idMgmt(state){
  return h('.app-section-identity.flex-row.flex-center', [
    h('.flex-column', [
      h('header', [
        h('h1', 'Identity Management'),
        h('h3', 'Ethereum identities are accounts for interacting with smart contracts and storing ether.'),
        h('h3', 'These are stored in the browser and not backed up on our server.'),
        h('h3', 'Please be sure you have backups of these identities.'),
        h('h3', 'If this is your first time here, use a memorable password to start creating identities.'),
      ]),
      localIds(state),
    ]),
  ])
}

function localIds(state) {
  var d = HyperDrive('section.local-identities')

  if (state.localIdsUnlocked){
    d(summary())
    d('br')
    state.localIds.forEach(function(id){ d(identity(id)) })
    d(newIdentity(state))
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
    h('h4', state.label),
    h('table', [
      h('tr', [
        h('td', 'address'),
        h('td', state.address.slice(0, 6)),
      ]),
      h('tr', [
        h('td', 'balance'),
        h('td', ''+state.balance),
      ]),
      h('tr', [
        h('td', 'transactions'),
        h('td', ''+state.txCount),
      ]),
    ]),
  ])
}

function newIdentity(state) {
  return h('.new-identity-container.identity-container.flex-center.select-none.cursor-pointer', 
    { 'ev-click': hg.sendClick(state.channels.createLocalId) }, '[ + ]')
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
