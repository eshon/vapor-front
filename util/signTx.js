const Transaction = require('ethereumjs-lib').Transaction
const ethUtil = require('ethereumjs-util')
const network = require('./network')
const walletAddress = Buffer('985095ef977ba75fb2bb79cd5c4b84c81392dff6', 'hex')
const walletKey = Buffer('0d0ba14043088cd629a978b49c8691deca5926f0271432bc0064e4745bac0a9f', 'hex')

module.exports = signAndSendTx


function signAndSendTx(txParams) {
  network.getTransactionCount(walletAddress, function(err, txCount){
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
    tx.sign(walletKey)
    console.log('sending signed tx:', txParams)
    network.sendSignedTransaction(tx, function(){

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