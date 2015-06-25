const document = require('global/document')
const hg = require('./mercury.js')
const App = require('./components/root/index.js')

var app = App()

hg.app(document.body, app, App.render)