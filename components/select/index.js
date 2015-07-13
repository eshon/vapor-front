const hg = require('../../mercury.js')
const h = require('../../mercury.js').h

module.exports = select


function select(options, wasSelected){
  return h('select', {
    'ev-change': readSelection,
  }, options.map(function(op){
    return h('option', op)
  }))

  function readSelection(event){
    wasSelected(event.target.selectedIndex)
  }
}