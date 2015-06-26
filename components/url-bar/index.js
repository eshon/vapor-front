const hg = require('../../mercury.js')
const h = require('../../mercury.js').h

module.exports = Component


function Component() {
  return hg.state({
    value: hg.value(''),
    channels: {
      submit: function(state, data){
        state.value.set(data.url)
      },
    }
  })
}

Component.render = function render(state) {
  return h('input.app-url-bar.flex-grow.z-bump', {
    'ev-event': hg.sendSubmit(state.channels.submit),
    type: 'text',
    name: 'url',
    value: state.value,
    placeholder: 'http://yourdapp.com/',
  })
}
