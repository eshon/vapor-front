'use strict';

var SingleEvent = require('geval/single');
var MultipleEvent = require('geval/multiple');
var extend = require('xtend');

/*
    Pro tip: Don't require `mercury` itself.
      require and depend on all these modules directly!
*/
var mercury = module.exports = {
    // Entry
    main: require('main-loop'),
    app: app,

    // Base
    BaseEvent: require('value-event/base-event'),

    // Input
    Delegator: require('dom-delegator'),
    channels: channels,
    send: require('value-event/event'),
    sendValue: require('value-event/value'),
    sendSubmit: require('value-event/submit'),
    sendChange: require('value-event/change'),
    sendKey: require('value-event/key'),
    sendClick: require('value-event/click'),

    // State
    // remove from core: favor hg.varhash instead.
    array: require('observ-array'),
    struct: require('observ-struct'),
    // deprecated: use hg.struct instead.
    hash: require('observ-struct'),
    varhash: require('observ-varhash'),
    value: require('observ'),
    state: state,

    // Render
    diff: require('virtual-dom/vtree/diff'),
    patch: require('virtual-dom/vdom/patch'),
    partial: require('vdom-thunk'),
    create: require('virtual-dom/vdom/create-element'),
    h: require('virtual-dom/virtual-hyperscript'),

    // Utilities
    // remove from core: require computed directly instead.
    computed: require('observ/computed'),
    // remove from core: require watch directly instead.
    watch: require('observ/watch'),

    // kumavis - new
    actions: actions,
};

function input(names) {
    if (!names) {
        return SingleEvent();
    }

    return MultipleEvent(names);
}

function channels(funcs, context) {
    return Object.keys(funcs).reduce(createHandle, {});

    function createHandle(acc, name) {
        var handle = mercury.Delegator.allocateHandle(
            funcs[name].bind(null, context));

        acc[name] = handle;
        return acc;
    }
}

function app(elem, observ, render, opts) {
    if (!elem) {
        throw new Error(
            'Element does not exist. ' +
            'Mercury cannot be initialized.');
    }

    mercury.Delegator(opts);
    var loop = mercury.main(observ(), render, extend({
        diff: mercury.diff,
        create: mercury.create,
        patch: mercury.patch
    }, opts));

    elem.appendChild(loop.target);

    return observ(loop.update);
}

// kumavis - new + modified

// modified - added 'actions', removed deprecated 'handles'
function state(obj) {
    var copy = extend(obj);
    var $channels = copy.channels;
    var $actions = copy.actions;

    if ($channels) {
        copy.channels = mercury.value(null);
    }

    if ($actions) {
        copy.actions = mercury.value(null);
    }

    var observ = mercury.struct(copy);

    if ($channels) {
        observ.channels.set(mercury.channels($channels, observ));
    }

    if ($actions) {
        observ.actions.set(mercury.actions($actions, observ));
    }

    return observ;
}

function actions(funcs, context) {
    return Object.keys(funcs).reduce(createEvent, {});

    function createEvent(acc, name) {
        var handle = funcs[name].bind(null, context);

        acc[name] = handle;
        return acc;
    }
}
