const IframeSandbox = require('iframe-sandbox')
const XhrStream = require('xhr-stream')
const anchor = require('../router/index.js').anchor
const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const UrlBarComponent = require('../url-bar/index.js')
const mustOverride = require('../../util/mustOverride.js')
const stateExtend = require('../../util/stateExtend.js')
const LifecycleHook = require('../../util/lifecycleHook.js')
// TODO: should be an env var
const dappTransformUrl = '//transform.'+location.host+'/'

module.exports = Component


function Component() {
  return hg.state({
    // state
    dappUrl: hg.value(''),
    // channels
    channels: {
      dappUrlRedirect: mustOverride,
    },
  })
}

Component.render = function render(state) {
  return h('.dapp-sandbox', { hook: new LifecycleHook(state, didInsertElement, willRemoveElement) })
}

//
// Sandbox Lifecycle
//

function didInsertElement(state, container) {

  var target = state.dappUrl

  var frameConfig = {
    container: container,
    origin: target,
  }

  // bug - doesnt work without this 
  process.nextTick(function(){

    // start sandbox
    console.log('starting sandbox for "'+target+'"...')
    IframeSandbox(frameConfig, function(err, sandbox) {
      console.log('loading "'+target+'"...')

      // write to DOM
      requestDappByUrl( target )
        .pipe( sandbox.createWriteStream() )

      // handle messages
      sandbox.on('message', handleSandboxMessage)

    })

  })
}

function willRemoveElement(state, container) {
  container.removeChild(container.childNodes[0])
}

//
// Sandbox methods
//
function handleSandboxMessage(message) {
  // handle rpc call
  if (message.jsonrpc || (message[0] && message[0].jsonrpc)) {
    // batched call
    if (Array.isArray(message)) {
      message.forEach(handleRpc)
    // single call
    } else {
      handleRpc(message)            
    }
  // unknown message
  } else {
    console.warn('Vapor - Unknown message from sandbox:', message)
  }
}

function requestDappByUrl(url) {
  var xhr = new XMLHttpRequest()
  url = dappTransformUrl + encodeURIComponent(url)
  xhr.open('GET', url, true)
  return new XhrStream( xhr )
}

function handleRpc(message) {
  console.log('vapor heard rpc:', message.method, message.params)
  // web3.eth.getTransactionCount(walletAddress, _handleRpc.bind(null, message))
}

// import ethereumjslib from 'npm:ethereumjs-lib'
// var Transaction = ethereumjslib.Transaction
// import web3 from 'npm:web3'
// import BufferModule from 'npm:buffer'
// var Buffer = BufferModule.Buffer
// var vaporRpcUrl = (location.hostname === 'localhost') ? 'http://localhost:4000/' : 'https://rpc.vapor.to/'

// web3.setProvider(new web3.providers.HttpProvider(vaporRpcUrl))

// var walletAddress = 'a06ef3ed1ce41ade87f764de6ce8095c569d6d57'
// var walletKey = Buffer('8234b7fb702abf568633b91b22c03bf9344a6b5371651623d6c412c5f8d9ba73', 'hex')


// function _handleRpc(message, err, txCount){
  
//   switch(message.method) {
    
//     case 'eth_sendTransaction':
//       var txParams = message.params[0]
//       txParams.to = txParams.to ? normalizeHexString(txParams.to) : null
//       txParams.value = txParams.value ? normalizeHexString(txParams.value) : null
//       txParams.data = txParams.data ? normalizeHexString(txParams.data) : null
//       txParams.nonce = txCount
//       txParams.gasLimit = txParams.gas ? normalizeHexString(txParams.gas) : '2fefd8'
//       txParams.gasPrice = 1

//       console.log('sending signed tx:', txParams)
//       var tx = new Transaction(txParams)
//       signTx(tx, walletKey)
//       sendSignedTransaction(tx.serialize().toString('hex'))
//       return

//     default:
//       return

//   }

// }


// // ==========================

// var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1

// function signTx(tx, walletKey) {
//   tx.sign(walletKey)
// }

// function sendSignedTransaction(signedTx) {
//   var stackTrace = window.DEBUG_RPC || false
//   var msgId = Math.floor(Math.random() * MAX_SAFE_INTEGER)
//   var payload = {
//     'method': 'eth_signedTransact',
//     'params': [signedTx, stackTrace],
//     'id': msgId,
//     'jsonrpc': '2.0',
//   }

//   var request = new XMLHttpRequest();
//   request.open('POST', vaporRpcUrl, true);
//   request.send(JSON.stringify(payload));
// }

// // ==========================

// function normalizeHexString(hex) {
//   if (!hex) {
//     return hex
//   }

//   if (hex.slice(0, 2) === '0x') {
//     hex = hex.slice(2);
//   }

//   if (hex.length%2 !== 0) {
//     hex = '0'+hex
//   }

//   return hex
// }
