const Transaction = require('ethereumjs-lib').Transaction
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
    // add nonce
    txParams.nonce = txCount
    // format values
    txParams.gasLimit = normalizeHex(txParams.gas)
    delete txParams.gas
    txParams.data = normalizeHex(txParams.code)
    delete txParams.code
    txParams.nonce = normalizeHex(txParams.nonce)
    txParams.gasPrice = normalizeHex(txParams.gasPrice)

    // create and sign tx
    var tx = new Transaction(txParams)
    targetId.actions.signTx(tx, function(err, tx){
      console.log('sending signed tx:', txParams)
      network.sendSignedTransaction(tx, function(){
        console.log('tx submitted.', arguments)
      })
    })
  })
}

function normalizeHex(hex){
  if (!hex) return
  var value = ethUtil.stripHexPrefix(hex)
  if (value.length % 2 !== 0) {
    value = '0'+value
  }
  value = ethUtil.addHexPrefix(value)
  return value
}