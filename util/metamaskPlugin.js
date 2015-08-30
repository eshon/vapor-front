module.exports = setupPluginSupport


function setupPluginSupport(state){
  if (isNotCompatible()) return

  // {
  //   id: 18,
  //   jsonrpc: "2.0",
  //   method: "eth_sendTransaction",
  //   params: [{
  //     data: "0xc1cbbca70000000000000000000000000000000000000000000000000000000000000000",
  //     from: "0xa06ef3ed1ce41ade87f764de6ce8095c569d6d57",
  //     gas: "0x2b7cd0",
  //     gasPrice: "0x1",
  //     to: "0xbe71e4b943144eac4667af2d0301a842d7b4b5c5",
  //     value: "0xde0b6b3a7640000",
  //   }],
  // }

  // setup connection with background
  var metamaskPlugin = chrome.runtime.connect('pfejnnoghgohcpmiahgplcflfpbfeokf', {name: 'metamask'})
  metamaskPlugin.onMessage.addListener(handleMessage)

  // exportUnsignedTxs
  state.pendingTxs(function(){
    // export signedTxs
  })

  function handleMessage(message){
    switch (message.type){

      case 'importUnsignedTxs':
        var addUnsignedTx = state.actions().newPendingTx
        message.payload.forEach(function(tx){
          var txParams = tx.params[0]
          txParams.to = txParams.to ? normalizeHexString(txParams.to) : null
          txParams.value = txParams.value ? normalizeHexString(txParams.value) : null
          txParams.data = txParams.data ? normalizeHexString(txParams.data) : null
          txParams.gasLimit = txParams.gas ? normalizeHexString(txParams.gas) : '2fefd8'
          txParams.gasPrice = 1
          addUnsignedTx(txParams)
        })
        return

    }
  }
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
