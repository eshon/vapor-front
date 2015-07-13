const Transaction = require('ethereumjs-lib').Transaction
const network = require('./network')
const walletAddress = Buffer('a06ef3ed1ce41ade87f764de6ce8095c569d6d57', 'hex')
const walletKey = Buffer('8234b7fb702abf568633b91b22c03bf9344a6b5371651623d6c412c5f8d9ba73', 'hex')

module.exports = signAndSendTx


function signAndSendTx(txParams) {
  console.log('sending signed tx:', txParams)
  network.getTransactionCount(walletAddress, function(err, txCount){
    txParams.nonce = txCount
    var tx = new Transaction(txParams)
    tx.sign(walletKey)
    network.sendSignedTransaction(tx)
  })
}