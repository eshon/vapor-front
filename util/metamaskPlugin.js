module.exports = setupPluginSupport


function setupPluginSupport(state){
  if (isNotCompatible()) return

  var addUnsignedTx = state.actions.newPendingTx

  // setup connection with background
  var metamaskPlugin = chrome.runtime.connect('pfejnnoghgohcpmiahgplcflfpbfeokf', {name: 'metamask'})
  metamaskPlugin.onMessage.addListener(function(){
    console.log('message:', arguments)
    switch (message.type){

      case 'importUnsignedTxs':
        message.payload.forEach(function(message){
          var txParams = message.params[0]
          txParams.to = txParams.to ? normalizeHexString(txParams.to) : null
          txParams.value = txParams.value ? normalizeHexString(txParams.value) : null
          txParams.data = txParams.data ? normalizeHexString(txParams.data) : null
          txParams.gasLimit = txParams.gas ? normalizeHexString(txParams.gas) : '2fefd8'
          txParams.gasPrice = 1
          addUnsignedTx(txParams)
        })
        return

    }
  })
}

function isNotCompatible(){
  return ('undefined' === typeof chrome)
}

function normalizeHexString(hex) {
  if (!hex) {
    return hex
  }

  if (hex.slice(0, 2) === '0x') {
    hex = hex.slice(2);
  }

  if (hex.length%2 !== 0) {
    hex = '0'+hex
  }

  return hex
}
