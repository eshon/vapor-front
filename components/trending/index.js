const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const mustOverride = require('../../util/mustOverride.js')

module.exports = Component


function Component() {
  return hg.state({
    //channels
    channels: {
      navigateToDapp: mustOverride,
    }
  })
}

Component.render = function render(state) {
  return trendingDapps(state)
}

function trendingDapps(state){
  var navigateToDapp = state.channels.navigateToDapp
  var dappState = {
    title: 'DaoFund',
    description: 'True decentralized crowd funding. Bring your project to life!',
    url: 'https://kumavis.github.io/dao-fund/?address=0xbe71e4b943144eac4667af2d0301a842d7b4b5c5',
  }
  return h('.app-section-trending.flex-column.flex-center', [
    h('header', [
      h('h1', 'Trending Dapps'),
    ]),
    h('section.flex-row.flex-wrap.flex-center', [
      trendingThumbnail(dappState, navigateToDapp),
      trendingThumbnail(dappState, navigateToDapp),
      trendingThumbnail(dappState, navigateToDapp),
      trendingThumbnail(dappState, navigateToDapp),
      trendingThumbnail(dappState, navigateToDapp),
      trendingThumbnail(dappState, navigateToDapp),
      trendingThumbnail(dappState, navigateToDapp),
      trendingThumbnail(dappState, navigateToDapp),
      trendingThumbnail(dappState, navigateToDapp),
      trendingThumbnail(dappState, navigateToDapp),
    ]),
  ])
}

function trendingThumbnail(state, navigateToDapp){
  return h('.trending-container.flex-column.cursor-pointer',
    { 'ev-click': hg.sendClick(navigateToDapp, state) }, [
    h('h3', state.title),
    h('span', state.description),
  ])
}