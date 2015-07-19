const hg = require('../../mercury.js')
const h = require('../../mercury.js').h

module.exports = Component


function Component() {
  return hg.state({})
}

Component.render = function render(state) {
  return aboutSection(state)
}

function aboutSection(){
  return h('.app-section-about.flex-row.flex-center', [
    h('.flex-column', [
      h('h2', 'Your window into the decentralized web'),
      h('br'),
      h('span', 'A new paradigm is upon us.'),
      h('span', 'The internet is reinventing itself.'),
      h('span', 'We offer ourselves as humble gatekeepers'),
      h('span', 'to a new ecosystem of human collaboration.'),
    ]),
  ])
}