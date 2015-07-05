const Transaction = require('ethereumjs-lib').Transaction
const request = require('request')

var walletAddress = Buffer('a06ef3ed1ce41ade87f764de6ce8095c569d6d57', 'hex')
var walletKey = Buffer('8234b7fb702abf568633b91b22c03bf9344a6b5371651623d6c412c5f8d9ba73', 'hex')

// const rpcUrl = '//rpc.'+location.host+'/'
const rpcUrl = 'https://rpc.vapor.to/'
// const rpcUrl = 'http://localhost:8000/'

module.exports = signTransaction


function signTransaction(txParams) {
  console.log('sending signed tx:', txParams)
  getNonce(walletAddress, function(err, txCount){
    txParams.nonce = txCount
    var tx = new Transaction(txParams)
    tx.sign(walletKey)
    sendSignedTransaction(tx)
  })
}

function sendSignedTransaction(signedTx) {
  var data = signedTx.serialize().toString('hex')
  var includeTrace = window.DEBUG_RPC || false
  sendRpc('eth_signedTransact', [data, includeTrace])
}

function getNonce(address, cb) {

  var data = [address.toString('hex')]
  sendRpc('eth_getTransactionCount', data, function(err, res, body){
    if (err) throw err
    if (body.error) throw body.error
    nonce = body.result
    if (nonce === '0x') {
      nonce = '0x00'
    }
    console.log('nonce:', nonce)
    cb(null, nonce)
  })

}

function sendRpc(method, data, cb) {
  cb = cb || noop

  var rpcPayload = {
    id: getRandomId(),
    jsonrpc: '2.0',
    method: method,
    params: data,
  }

  request.post(rpcUrl, { withCredentials: false, json: rpcPayload }, cb)
}

// ==========================

var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1

function getRandomId(){
  return Math.floor(Math.random() * MAX_SAFE_INTEGER)
}

function noop(){}