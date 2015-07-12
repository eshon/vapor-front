const async = require('async')
const hg = require('../../mercury.js')
const network = require('../../util/network')

module.exports = networkedIdentity


function networkedIdentity(data){
  var state = hg.state({
    // local data
    label: hg.value(data.label),
    address: hg.value(data.address),
    // networked data
    balance: hg.value(null),
    txCount: hg.value(null),
    // connection state
    isLoaded: hg.value(false),
    // actions
    actions: {
      update: function(state){
        requestIdentity(state.address(), function(err, data){
          if (err) throw err
          state.balance.set(data.balance)
          state.txCount.set(data.txCount)
        })
      }
    }
  })

  state.actions().update()

  return state
}

function requestIdentity(address, cb) {
  if (!Buffer.isBuffer(address)) address = new Buffer(address, 'hex')
  async.parallel([
    network.getBalance.bind(null, address),
    network.getTransactionCount.bind(null, address),
  ], function(err, results){
    if (err) return cb(err)
    cb(null, {
      balance: rpcHexToInt(results[0]),
      txCount: rpcHexToInt(results[1]),
    })
  })
}

function rpcHexToInt(hexStr) {
  return parseInt(hexStr.slice(2), 16)
}