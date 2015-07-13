const async = require('async')
const indexedDbDown = require('level-js')
// const TriplesecDown = require('TriplesecDown')
const EthTeller = require('ether-teller')
const hg = require('../mercury.js')
const networkedIdentity = require('../components/networked-identity/')


// export as singleton
module.exports = new KeyManager()


function KeyManager() {
  var self = this

  self.observ = hg.state({
    isOpen: hg.value(false),
    isUnlocking: hg.value(false),
    identities: hg.array([]),
  })
}

KeyManager.prototype.open = function(secret, cb){
  var self = this

  if (self.observ.isOpen()) return process.nextTick(cb)

  async.series([
    self._setupStore.bind(self),
    self._setupEthTeller.bind(self),
    self._loadIdentities.bind(self),
  ], cb)

}

KeyManager.prototype.generateIdentity = function(opts, cb){
  var self = this
  if (!self.observ.isOpen()) return cb(NotOpenError())

  self.manager.generateIdentity(opts, function(err, keyObject){
    if (err) return cb(err)
    self._addIdentity(keyObject)
  })
}

KeyManager.prototype.importIdentity = function(opts, cb){
  var self = this
  if (!self.observ.isOpen()) return cb(NotOpenError())
  
  self.manager.importIdentity(opts, function(err, keyObject){
    if (err) return cb(err)
    self._addIdentity(keyObject)
  })
}

KeyManager.prototype._setupStore = function(cb){
  var self = this

  // encryption added and removed here :)
  // self.store = TriplesecDown({
  //   secret: secret,
  //   db: indexedDbDown,
  // })('/')
  self.store = indexedDbDown('/')

  self.store.open(function(err) {
    if (err) return cb(err)
    cb()
  })
}

KeyManager.prototype._setupEthTeller = function(cb){
  var self = this

  self.manager = EthTeller(self.store)
  cb()
}

KeyManager.prototype._loadIdentities = function(cb){
  var self = this

  self.manager.lookupAll(function(err, keyObjects){
    if (err) return cb(err)
    self.observ.isOpen.set(true)
    self.observ.isUnlocking.set(false)
    var localIds = keyObjects.forEach(self._addIdentity.bind(self))
    cb()
  })
}

KeyManager.prototype._addIdentity = function(keyObject){
  var self = this

  var networked = networkedIdentity(keyObject)
  self.observ.identities.push(networked)
}

function NotOpenError(){
  return new Error('KeyManager Error - Storage has not been unlocked yet.')
}