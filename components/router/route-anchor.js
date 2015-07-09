var h = require('virtual-dom/virtual-hyperscript');
var clickEvent = require('./click-event.js');

var navigateTo = require('./router.js').navigateTo;

module.exports = {
    anchor: anchor,
    anchorProps: anchorProps,
};

function anchor(props, text) {
    props = anchorProps(props)
    return h('a', props, text);
}

function anchorProps(props) {
    var href = props.href;
    props.href = '#';

    props['ev-click'] = clickEvent(navigateTo(href), {
        ctrl: false,
        meta: false,
        rightClick: false
    });

    return props
}