const indexedDbDown = require('level-js')
// const TriplesecDown = require('TriplesecDown')
const EthTeller = require('ether-teller')
const async = require('async')

module.exports = new KeyManager()


function KeyManager() {
  this.isOpen = false
}

KeyManager.prototype.open = function(secret, cb){
  var self = this
  
  // encryption added and removed here :)
  // self.store = TriplesecDown({
  //   secret: secret,
  //   db: indexedDbDown,
  // })('/')
  self.store = indexedDbDown('/')

  self.store.open(function(err) {
    if (err) return cb(err)
    self.isOpen = true
    self._setupEthTeller()
    cb()
  })
}

KeyManager.prototype._setupEthTeller = function(){
  var self = this
  var manager = self.manager = EthTeller(self.store)
  self.lookupAll = manager.lookupAll.bind(manager)
  self.generateIdentity = manager.generateIdentity.bind(manager)
  self.importIdentity = manager.importIdentity.bind(manager)
}
