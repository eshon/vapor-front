const AncientLocal = require('ancient-tome/local')
const TomeIndexer = require('ancient-tome/indexer')
const EthTeller = require('ether-teller')
const async = require('async')

module.exports = new KeyManager()


function KeyManager() {
  this.isOpen = false
  this.store = TomeIndexer(AncientLocal())
}

KeyManager.prototype.open = function(secret, cb){
  var self = this
  self.store.open(secret, function(err) {
    if (err) return cb(err)
    self.isOpen = true
    self._setupEthTeller()
    cb()
  })
}

KeyManager.prototype._setupEthTeller = function(){
  var self = this
  var manager = self.manager = EthTeller(this.store)
  self.lookupAll = manager.lookupAll.bind(manager)
  self.generateIdentity = manager.generateIdentity.bind(manager)
  self.importIdentity = manager.importIdentity.bind(manager)
}