const MAX_SAFE_INTEGER = Math.pow(2, 53) - 1
const rpcUrl = process.env.RPC_URL
const BlockAppsProvider = require('blockapps-web3')

module.exports = {
  sendSignedTransaction: sendSignedTransaction,
  getTransactionCount: getTransactionCount,
  getBalance: getBalance,
}


var provider = new BlockAppsProvider({
  // temporary: use proxy to get SSL
  host: 'https://proxy.metamask.io/http://hacknet.blockapps.net',
  // host: 'http://hacknet.blockapps.net',
  // host: 'http://api.blockapps.net',
  coinbase: '0x985095ef977ba75fb2bb79cd5c4b84c81392dff6',
  accounts: ['0x985095ef977ba75fb2bb79cd5c4b84c81392dff6'],
});

function sendSignedTransaction(signedTx, cb) {
  provider.eth_sendRawTransaction(signedTx, cb)
}

function getBalance(address, cb) {
  provider.eth_getBalance(address.toString('hex'), null, cb)
}

function getTransactionCount(address, cb) {
  provider.eth_getTransactionCount(address.toString('hex'), null, cb)
}
