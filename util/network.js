const request = require('request')
const MAX_SAFE_INTEGER = Math.pow(2, 53) - 1
// const rpcUrl = '//rpc.'+location.host+'/'
const rpcUrl = 'https://rpc.vapor.to/'
// const rpcUrl = 'http://localhost:8000/'

module.exports = {
  sendSignedTransaction: sendSignedTransaction,
  getTransactionCount: getTransactionCount,
  getBalance: getBalance,
  sendRpc: sendRpc,
}

function sendSignedTransaction(signedTx) {
  var data = signedTx.serialize().toString('hex')
  var includeTrace = window.DEBUG_RPC || false
  sendRpc('eth_signedTransact', [data, includeTrace])
}

function getBalance(address, cb) {
  var data = [address.toString('hex')]
  sendRpc('eth_getBalance', data, function(err, balance){
    if (err) throw err
    cb(null, balance)
  })
}

function getTransactionCount(address, cb) {
  var data = [address.toString('hex')]
  sendRpc('eth_getTransactionCount', data, function(err, nonce){
    if (err) throw err
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

  request.post(rpcUrl, { withCredentials: false, json: rpcPayload }, function(err, res, body){
    err = err || body.error
    if (err) return cb(err)

    var result = body.result
    if (result === '0x') result = '0x00'
    if (result === '0x0') result = '0x00'
    console.log('result:', result)
    cb(null, result)
  })
}

// util

function getRandomId(){
  return Math.floor(Math.random() * MAX_SAFE_INTEGER)
}

function noop(){}