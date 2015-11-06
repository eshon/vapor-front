const Transaction = require('ethereumjs-tx')
const ethUtil = require('ethereumjs-util')
const network = require('./network')
const keyManager = require('./keyManager.js')

module.exports = signAndSendTx


function signAndSendTx(txParams) {
  var fromAddress = ethUtil.stripHexPrefix(txParams.from)
  var identities = keyManager.observ.identities()
  var targetId = identities.filter(function(data){ return data.address === fromAddress })[0]
  if (!targetId) return console.error('Identity not found...', fromAddress)

  network.getTransactionCount(new Buffer(fromAddress, 'hex'), function(err, txCount){
    if (err) throw err
    // add nonce
    var defaults = { nonce: txCount }

    network.getGasPrice(function(err, gasPrice){
      if (err) throw err
      
      // add gasPrice
      defaults.gasPrice = gasPrice

      // create and sign tx
      var cleanParams = normalizeParams(txParams, defaults)
      var tx = new Transaction(cleanParams)

      targetId.actions.signTx(tx, function(err, tx){
        console.log('sending signed tx:', cleanParams)
        network.sendSignedTransaction(tx, function(){
          console.log('tx submitted.', arguments)
        })
      })
    })

  })
}

function normalizeParams(oldParams, defaults){
  var newParams = {}
  // format values
  newParams.to = oldParams.to ? normalizeHex(oldParams.to) : null
  newParams.value = normalizeHex(oldParams.value)
  newParams.data = normalizeHex(oldParams.code || oldParams.data)
  newParams.gasLimit = normalizeHex(oldParams.gas || oldParams.gasLimit)
  newParams.gasPrice = normalizeHex(oldParams.gasPrice || defaults.gasPrice)
  newParams.nonce = normalizeHex(oldParams.nonce || defaults.nonce)
  return newParams
}

function normalizeHex(hex){
  if (!hex) return null
  var value = ethUtil.stripHexPrefix(hex)
  if (value.length % 2 !== 0) {
    value = '0'+value
  }
  return ethUtil.addHexPrefix(value)
}