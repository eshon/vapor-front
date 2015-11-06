const hg = require('../../mercury.js')
const h = require('../../mercury.js').h
const mustOverride = require('../../util/mustOverride.js')

module.exports = Component


function Component() {
  return hg.state({
    //channels
    actions: {
      navigateToDapp: mustOverride,
    }
  })
}

Component.render = function render(state) {
  return trendingDapps(state)
}

function trendingDapps(state){
  var navigateToDapp = state.actions.navigateToDapp
  var dappState = {
    title: 'BoardRoom',
    description: 'A complete blockchain governance platform.',
    url: 'http://meteor-dapp-boardroom.meteor.com/',
    author: 'Nick Dodson',
    date: 'November 9, 2015',
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
    h('h3.title', state.title),
    h('span.date', state.date),
    h('span.desc', state.description),
    h('span.author', 'Created by '+state.author),
    h('span.rating','')
  ])
}