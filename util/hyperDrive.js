var h = require('../mercury.js').h

module.exports = HyperDrive


function HyperDrive(tag, config){
  var content = []
  append.render = render
  return append
  
  function append(first){
    // hyperscript obj
    if (typeof first === 'object') {
      content.push(first)
    // hyperscript params
    } else {
      content.push(h.apply(null, arguments))
    }
  }
  function render(){
    return h(tag, config, content)
  }
}