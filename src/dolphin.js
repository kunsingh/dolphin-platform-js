/*jslint browserify: true */
/* global Platform */
"use strict";

require('./polyfills.js');
var opendolphin = require('opendolphin');
var Map  = require('../bower_components/core.js/library/fn/map');

var exists = require('./utils.js').exists;
var ClassRepository = require('./classrepo.js').ClassRepository;


exports.connect = function(url, config) {
    return new Dolphin(url, config);
};


var DOLPHIN_BEAN = '@@@ DOLPHIN_BEAN @@@';
var DOLPHIN_LIST_ADD_FROM_SERVER = '@@@ LIST_ADD_FROM_SERVER @@@';
var DOLPHIN_LIST_DEL_FROM_SERVER = '@@@ LIST_DEL_FROM_SERVER @@@';
var DOLPHIN_LIST_SET_FROM_SERVER = '@@@ LIST_SET_FROM_SERVER @@@';
var DOLPHIN_LIST_ADD_FROM_CLIENT = '@@@ LIST_ADD_FROM_CLIENT @@@';
var DOLPHIN_LIST_DEL_FROM_CLIENT = '@@@ LIST_DEL_FROM_CLIENT @@@';
var DOLPHIN_LIST_SET_FROM_CLIENT = '@@@ LIST_SET_FROM_CLIENT @@@';


function onModelAdded(dolphin, model) {
    var type = model.presentationModelType;
    switch (type) {
        case DOLPHIN_BEAN:
            dolphin.classRepository.registerClass(model);
            break;
        case DOLPHIN_LIST_ADD_FROM_SERVER:
            dolphin.classRepository.addListEntry(model);
            dolphin.dolphin.getClientModelStore().deletePresentationModel(model);
            break;
        case DOLPHIN_LIST_DEL_FROM_SERVER:
            dolphin.classRepository.delListEntry(model);
            dolphin.dolphin.getClientModelStore().deletePresentationModel(model);
            break;
        case DOLPHIN_LIST_SET_FROM_SERVER:
            dolphin.classRepository.setListEntry(model);
            dolphin.dolphin.getClientModelStore().deletePresentationModel(model);
            break;
        case DOLPHIN_LIST_ADD_FROM_CLIENT:
        case DOLPHIN_LIST_DEL_FROM_CLIENT:
        case DOLPHIN_LIST_SET_FROM_CLIENT:
            // do nothing
            break;
        default:
            var bean = dolphin.classRepository.load(model);
            var handlerList = dolphin.addedHandlers.get(type);
            if (exists(handlerList)) {
                handlerList.forEach(function(handler) {
                    handler(bean);
                });
            }
            dolphin.allAddedHandlers.forEach(function(handler) {
                handler(bean);
            });
            break;
    }
}

function onModelRemoved(dolphin, model) {
    var type = model.presentationModelType;
    switch (type) {
        case DOLPHIN_BEAN:
            dolphin.classRepository.unregisterClass(model);
            break;
        case DOLPHIN_LIST_ADD_FROM_SERVER:
        case DOLPHIN_LIST_DEL_FROM_SERVER:
        case DOLPHIN_LIST_SET_FROM_SERVER:
        case DOLPHIN_LIST_ADD_FROM_CLIENT:
        case DOLPHIN_LIST_DEL_FROM_CLIENT:
        case DOLPHIN_LIST_SET_FROM_CLIENT:
            // do nothing
            break;
        default:
            var bean = dolphin.classRepository.unload(model);
            if (exists(bean)) {
                var handlerList = dolphin.removedHandlers.get(type);
                if (exists(handlerList)) {
                    handlerList.forEach(function(handler) {
                        handler(bean);
                    });
                }
                dolphin.allRemovedHandlers.forEach(function(handler) {
                    handler(bean);
                });
            }
            break;
    }

}



function Dolphin(url, config) {
    var _this = this;
    var observeInterval = 50;
    this.dolphin = opendolphin.dolphin(url, true, 4);
    if (exists(config)) {
        if (config.serverPush) {
            this.dolphin.startPushListening('ServerPushController:longPoll', 'ServerPushController:release');
        }
        if (config.observeInterval) {
            observeInterval = config.observeInterval;
        }
    }
    this.classRepository = new ClassRepository();
    this.addedHandlers = new Map();
    this.removedHandlers = new Map();
    this.allAddedHandlers = [];
    this.allRemovedHandlers = [];
    setInterval(function() {Platform.performMicrotaskCheckpoint()}, observeInterval);

    this.dolphin.getClientModelStore().onModelStoreChange(function (event) {
        var model = event.clientPresentationModel;
        if (event.eventType === opendolphin.Type.ADDED) {
            onModelAdded(_this, model);
        } else if (event.eventType === opendolphin.Type.REMOVED) {
            onModelRemoved(_this, model);
        }
    });
}


Dolphin.prototype.isManaged = function(bean) {
    // TODO: Implement dolphin.isManaged() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.create = function(type) {
    // TODO: Implement dolphin.create() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.add = function(type, bean) {
    // TODO: Implement dolphin.add() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.addAll = function(type, collection) {
    // TODO: Implement dolphin.addAll() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.remove = function(bean) {
    // TODO: Implement dolphin.remove() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.removeAll = function(collection) {
    // TODO: Implement dolphin.removeAll() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.removeIf = function(predicate) {
    // TODO: Implement dolphin.removeIf() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.onAdded = function(type, eventHandler) {
    // TODO: Probably safer to use copy-on-write here [DP-6]
    if (!exists(eventHandler)) {
        this.allAddedHandlers.push(type);
    } else {
        var handlerList = this.addedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
            this.addedHandlers.set(type, handlerList);
        }
        handlerList.push(eventHandler);
    }

    // TODO: Return subscription [DP-6]
    return null;
};


Dolphin.prototype.onRemoved = function(type, eventHandler) {
    // TODO: Probably safer to use copy-on-write here [DP-6]
    if (!exists(eventHandler)) {
        this.allRemovedHandlers.push(type);
    } else {
        var handlerList = this.removedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
            this.removedHandlers.set(type, handlerList);
        }
        handlerList.push(eventHandler);
    }

    // TODO: Return subscription [DP-6]
    return null;
};


Dolphin.prototype.send = function(command, params) {
    if (exists(params)) {
        var attributes = [];
        for (var prop in params) {
            if (params.hasOwnProperty(prop)) {
                var param = this.classRepository.mapParamToDolphin(params[prop]);
                attributes.push(this.dolphin.attribute(prop, null, param.value, 'VALUE'));
                attributes.push(this.dolphin.attribute(prop, null, param.type, 'VALUE_TYPE'));
            }
        }
        this.dolphin.presentationModel.apply(this.dolphin, [null, '@@@ DOLPHIN_PARAMETER @@@'].concat(attributes));
    }
    this.dolphin.send(command);

    // TODO: Return promise [DP-8]
    return null;
};
