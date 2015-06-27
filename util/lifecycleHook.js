
module.exports = LifecycleHook


function LifecycleHook(state, didInsertElement, willRemoveElement) {
  this.state = state
  this._hook = didInsertElement
  this._unhook = willRemoveElement
}

LifecycleHook.prototype.hook = function(node, prop, prev){
  this._hook && this._hook(this.state, node, prop, prev)
}

LifecycleHook.prototype.unhook = function(node, prop, next){
  this._unhook && this._unhook(this.state, node, prop, next)
}