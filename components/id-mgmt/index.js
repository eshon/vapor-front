const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const async = require('async')
const dragDrop = require('drag-drop/buffer')
const ethUtil = require('ethereumjs-util')
const saveAs = require('browser-saveas')
const keyManager = require('../../util/keyManager')
const HyperDrive = require('../../util/hyperDrive')
const fileSelectHandler = require('../../util/fileSelect').handler
const networkedIdentity = require('../networked-identity/')

module.exports = Component


function Component() {
  var state = hg.state({
    // state
    localIds: hg.array([]),
    localIdsOpen: hg.value(false),
    localIdsUnlocking: hg.value(false),
    // channels
    channels: {
      unlockLocal: function(state, data){
        var secret = data.password
        keyManager.open(secret, function(err){
          if (err) throw err
        })
      },
      createLocalId: function(state){
        keyManager.generateIdentity({ label: 'new_id' }, function(err){
          if (err) throw err
        })
      },
    },
    // actions
    actions: {
      importIdentitiesFromFile: function(state, files){
        // import into manager
        files = [].slice.call(files)
        async.each(files, keyManager.importFromFile.bind(keyManager))
      },
      exportAll: function(){
        keyManager.exportAll(function(err, result){
          var blob = new Blob([result], {type: 'text/plain;charset=utf-8'})
          saveAs(blob, 'unlocked-vapor-wallets.json')
        })
      },
    }
  })

  var removeEvent = dragDrop(document.documentElement, state.actions().importIdentitiesFromFile)
  // TODO - removeEvent

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

  if (state.localIdsOpen){
    d(summary(state))
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

  return h('.identities-summary.flex-column', [
    h('section.flex-row', [
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
    ]),
    h('section.flex-row.flex-center', [
      h('button', { 'ev-click': fileSelectHandler(state.actions.importIdentitiesFromFile) }, 'import'),
      h('button', { 'ev-click': state.actions.exportAll }, 'export all'),
    ]),
  ])
}

// util

function noop(){}