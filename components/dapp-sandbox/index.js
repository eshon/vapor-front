// const iframe = require('iframe')
// const IframeSandbox = require('iframe-sandbox')
const DappSandbox = require('dapp-sandbox')
// const XhrStream = require('xhr-stream')
// const anchor = require('../router/index.js').anchor
const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const UrlBarComponent = require('../url-bar/index.js')
const mustOverride = require('../../util/mustOverride.js')
const stateExtend = require('../../util/stateExtend.js')
const LifecycleHook = require('../../util/lifecycleHook.js')
const network = require('../../util/network.js')
const dappTransformUrl = process.env.TRANSFORM_URL

module.exports = Component


// BAD: this is antipattern, but not sure how else to do this
// this is used to connect messages from the iframe sandbox to the component instance
var currentSandbox = null
var currentFlatSandbox = null
var currentSandboxIframe = null
var currentSandboxUrl = null
var currentSandboxIframeInTransit = false

function Component() {
  var state = hg.state({
    // state
    dappUrl: hg.value(''),
    // actions
    actions: {
      newPendingTx: mustOverride,
      dappUrlRedirect: mustOverride,
    },
  })
  return state
}

Component.render = function render(state) {
  currentFlatSandbox = state
  var target = state.dappUrl
  if (!target) return
  return [
    h('.loader'),
    h('.dapp-sandbox', { hook: new LifecycleHook(state, didInsertElement, willRemoveElement) }),
  ]
}

//
// Sandbox Lifecycle
//

function didInsertElement(state, container) {

  var target = state.dappUrl

  if (currentSandboxIframeInTransit) {
    // iframe may be destroyed and recreated immediately
    // due to an aggressive virtual-dom
    // so we reuse the iframe
    currentSandboxIframeInTransit = false
    currentSandboxIframe.style.display = 'block'
    // skip initialization
    return
  }

  if (!currentSandbox && target === currentSandboxUrl) return

  // var frameConfig = {
  //   container: container,
  //   origin: target,
  // }

  // bug - doesnt work without this 
  process.nextTick(function(){

    // start sandbox
    console.log('starting sandbox for "'+target+'"...')

    // cleanup previous sandbox
    if (currentSandbox) {
      currentSandbox.removeAllListeners('url')
      // currentSandbox.removeAllListeners('tx')
      currentSandbox.removeAllListeners('web3Payload')
    }

    currentSandbox = new DappSandbox({
      container: container,
      config: {
        PROXY_URL: 'https://proxy-beta.metamask.io/',
        TRANSFORM_URL: 'https://transform-beta.metamask.io/',
      },
      addresses: ['0x985095ef977ba75fb2bb79cd5c4b84c81392dff6'],
    })

    // currentSandbox.on('tx', function(txParams, cb){
    //   currentFlatSandbox.actions.newPendingTx(txParams, cb)
    // })

    currentSandbox.on('web3Payload', function(payload, cb){
      console.log('web3 payload:', payload)
      network.processWeb3Payload(payload, cb)
    })
    
    currentSandbox.on('url', function(url){
      currentSandboxUrl = url
      currentFlatSandbox.actions.dappUrlRedirect({url: url})
    })

    currentSandbox.navigateTo(target)

  })
}

function urlForHtmlTransform(url) {
  return dappTransformUrl + '/html/' + encodeURIComponent(url)
}

function willRemoveElement(state, container) {
  
  // if (currentSandboxIframe) {
  //   currentSandboxIframe.remove()
  // }
  
  var target = state.dappUrl
  var iframe = container.childNodes[0]

  if (iframe) {

    // iframe may be recreated immediately
    // due to an aggressive virtual-dom
    // so we keep these references around
    currentSandboxIframe = iframe
    currentSandboxIframeInTransit = true

    // hide iframe so it doesnt cause a rendering blip
    // in the case where we dont reuse it 
    iframe.style.display = 'none'
  }

  // check if we did not reuse the iframe
  process.nextTick(function(){
    if (!currentSandboxIframeInTransit) return
    if (!container.childNodes[0]) currentSandbox = null
    // iframe is still in transit, was not reinserted, need to cleanup
    currentSandboxIframeInTransit = false
    container.removeChild(iframe)
  })

}

// function addPendingTx(txParams) {
//   currentFlatSandbox.actions.newPendingTx(txParams)
// }

// //
// // Sandbox methods
// //
// function handleSandboxMessage(message) {
//   // handle rpc call
//   if (message.jsonrpc || (message[0] && message[0].jsonrpc)) {
//     // batched call
//     if (Array.isArray(message)) {
//       message.forEach(handleRpc)
//     // single call
//     } else {
//       handleRpc(message)            
//     }
//   // unknown message
//   } else {
//     console.warn('Vapor - Unknown message from sandbox:', message)
//   }
// }

// function requestDappByUrl(url) {
//   var xhr = new XMLHttpRequest()
//   url = dappTransformUrl + '/' + encodeURIComponent(url)
//   xhr.open('GET', url, true)
//   return new XhrStream( xhr )
// }

// // rpc stuff

// function handleRpc(message){
//   console.log('vapor heard rpc:', message.method, message.params)

//     switch(message.method) {
      
//       case 'eth_sendTransaction':
//         var txParams = message.params[0]
//         txParams.to = txParams.to ? normalizeHexString(txParams.to) : null
//         txParams.value = txParams.value ? normalizeHexString(txParams.value) : null
//         txParams.data = txParams.data ? normalizeHexString(txParams.data) : null
//         txParams.gasLimit = txParams.gas ? normalizeHexString(txParams.gas) : '2fefd8'
//         txParams.gasPrice = 1

//         addPendingTx(txParams)
//         return

//       default:
//         return

//       }
// }

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
