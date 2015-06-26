const document = require('global/document')
const treeify = require('treeify').asTree
const hg = require('./mercury.js')
const App = require('./components/root/index.js')

var app = App()

hg.app(document.body, app, App.render)

// debug
window.app = app

window.debug = debug

function debug() {
  console.log(treeify(app(), true))
}