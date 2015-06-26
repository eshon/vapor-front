
module.exports = mustOverride

function mustOverride() {
  throw new Error('This method was supposed to be overwritten')
}