const MAX_SAFE_INTEGER = Math.pow(2, 53) - 1
const rpcUrl = process.env.RPC_URL
const BlockAppsProvider = require('blockapps-web3')
const Transaction = require('ethereumjs-tx')

module.exports = {
  processWeb3Payload: processWeb3Payload,
  sendSignedTransaction: sendSignedTransaction,
  getTransactionCount: getTransactionCount,
  getGasPrice: getGasPrice,
  getBalance: getBalance,
  setupWeb3: setupWeb3,
}


var provider = null

function setupWeb3(accountsObserv, txSubmitHook) {
  var accounts = getAccounts()

  provider = new BlockAppsProvider({
    // temporary: use proxy to get SSL
    host: 'https://proxy.metamask.io/http://hacknet.blockapps.net',
    // host: 'http://hacknet.blockapps.net',
    // host: 'http://api.blockapps.net',
    transaction_signer: { 
      hasAddress: function(address, callback) {
        // var hasAddress = accounts.indexOf(address) !== -1
        var hasAddress = true
        callback(null, hasAddress)
      },
      signTransaction: function(txParams, cb){
        console.log('tx sig requested:', txParams)
        txSubmitHook(txParams)
        // we are submitting manually instead of having our provider submit
        // cb()
      },
    },
    coinbase: accounts[0] || '0x',
    accounts: accounts,
  })

  accountsObserv(setAccounts)

  function setAccounts(){
    accounts = getAccounts() || []
    provider.coinbase = accounts[0] || '0x'
    provider.accounts = accounts
  }

  function getAccounts(){
    return accountsObserv().map(function(acc){ return acc.address })
  }
}

function processWeb3Payload(payload, cb) {
  if (!provider) errorNotInitialized()
  provider.sendAsync(payload, cb)
}

function sendSignedTransaction(signedTx, cb) {
  if (!provider) errorNotInitialized()  
  var rawTx = signedTx.serialize().toString('hex')
  provider.eth_sendRawTransaction(rawTx, cb)
}

function getBalance(address, cb) {
  if (!provider) errorNotInitialized()
  provider.eth_getBalance(address.toString('hex'), null, cb)
}

function getTransactionCount(address, cb) {
  if (!provider) errorNotInitialized()
  provider.eth_getTransactionCount(address.toString('hex'), null, cb)
}

function getGasPrice(cb){
  provider.eth_gasPrice(cb)
}

function errorNotInitialized(){
  throw new Error('MetaMask - network - web3 not initialized.')
} 
