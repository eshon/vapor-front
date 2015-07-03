// original: https://github.com/twilson63/mercury-router/

var RouterComponent = require('./router')
RouterComponent.render = require('./route-view')
RouterComponent.anchor = require('./route-anchor').anchor
RouterComponent.anchorProps = require('./route-anchor').anchorProps

module.exports = RouterComponent