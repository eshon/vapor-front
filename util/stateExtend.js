const extend = require('xtend')

module.exports = stateExtend


// helper for Mercury component state extensions

function stateExtend(stateA, stateB) {
  return extend(stateA, stateB, {
    channels: extend(stateA.channels, stateB.channels),
    actions: extend(stateA.actions, stateB.actions),
  })
}