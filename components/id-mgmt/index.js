const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const async = require('async')
const dragDrop = require('drag-drop/buffer')
const ethUtil = require('ethereumjs-util')
const keyManager = require('../../util/keyManager')
const networkedIdentity = require('../networked-identity/')

module.exports = Component


function Component() {
  var state = hg.state({
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
          if (err) throw err
          state.actions().loadLocalIds()
        })
      },
      createLocalId: function(state){
        if (!keyManager.isOpen) return
        keyManager.generateIdentity({ label: 'new_id' }, function(err){
          if (err) throw err
          state.actions().loadLocalIds()
        })
      },
    },
    // actions
    actions: {
      loadLocalIds: function(state){
        keyManager.lookupAll(function(err, keys){
          if (err) throw err
          state.localIdsUnlocked.set(keyManager.isOpen)
          state.localIdsUnlocking.set(false)
          var localIds = keys.map(networkedIdentity)
          state.localIds.set(localIds)
        })
      },
    }
  })

  dragDrop(document.documentElement, function(files){
    if (!keyManager.isOpen) return
    var keysToImport = files
    .map(function(file){
      return JSON.parse(file.toString())
    })
    async.each(keysToImport, function(data, next){
      if (!data.bkp) return
      var privateKey = new Buffer(data.bkp, 'hex')
      var keyObj = keyManager.importIdentity({
        label: 'Imported Identity',
        privateKey: privateKey,
      }, next)
      state.localIds.push(networkedIdentity(keyObj))
    })
  })

  return state
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
    d(summary(state))
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
        h('td', String(state.balance)),
      ]),
      h('tr', [
        h('td', 'transactions'),
        h('td', String(state.txCount)),
      ]),
    ]),
  ])
}

function newIdentity(state) {
  return h('.new-identity-container.identity-container.flex-center.select-none.cursor-pointer', 
    { 'ev-click': hg.sendClick(state.channels.createLocalId) }, '[ + ]')
}

function summary(state) {
  var totalBalance = state.localIds.reduce(function(acc, id){ return acc + id.balance }, 0)

  return h('.identities-summary.flex-row.flex-space-between', [
    h('table', [
      h('tr', [
        h('td', 'Number of Identities:'),
        h('td', String(state.localIds.length)),
      ]),
    ]),
    h('table', [
      h('tr', [
        h('td', 'Total Balance:'),
        h('td', totalBalance+' Ether'),
      ]),
    ]),
  ])
}

// util

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

function noop(){}