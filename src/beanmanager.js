/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
/* global console */
"use strict";

var Map = require('../bower_components/core.js/library/fn/map');
var utils = require('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;


function BeanManager(classRepository) {
    checkMethod('BeanManager(classRepository)');
    checkParam(classRepository, 'classRepository');

    this.classRepository = classRepository;
    this.addedHandlers = new Map();
    this.removedHandlers = new Map();
    this.updatedHandlers = new Map();
    this.arrayUpdatedHandlers = new Map();
    this.allAddedHandlers = [];
    this.allRemovedHandlers = [];
    this.allUpdatedHandlers = [];
    this.allArrayUpdatedHandlers = [];

    var self = this;
    this.classRepository.onBeanAdded(function(type, bean) {
        var handlerList = self.addedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function (handler) {
                try {
                    handler(bean);
                } catch(e) {
                    console.warn('An exception occurred while calling an onBeanAdded-handler for type', type, e);
                }
            });
        }
        self.allAddedHandlers.forEach(function (handler) {
            try {
                handler(bean);
            } catch(e) {
                console.warn('An exception occurred while calling a general onBeanAdded-handler', e);
            }
        });
    });
    this.classRepository.onBeanRemoved(function(type, bean) {
        var handlerList = self.removedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function(handler) {
                try {
                    handler(bean);
                } catch(e) {
                    console.warn('An exception occurred while calling an onBeanRemoved-handler for type', type, e);
                }
            });
        }
        self.allRemovedHandlers.forEach(function(handler) {
            try {
                handler(bean);
            } catch(e) {
                console.warn('An exception occurred while calling a general onBeanRemoved-handler', e);
            }
        });
    });
    this.classRepository.onBeanUpdate(function(type, bean, propertyName, newValue, oldValue) {
        var handlerList = self.updatedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function (handler) {
                try {
                    handler(bean, propertyName, newValue, oldValue);
                } catch(e) {
                    console.warn('An exception occurred while calling an onBeanUpdate-handler for type', type, e);
                }
            });
        }
        self.allUpdatedHandlers.forEach(function (handler) {
            try {
                handler(bean, propertyName, newValue, oldValue);
            } catch(e) {
                console.warn('An exception occurred while calling a general onBeanUpdate-handler', e);
            }
        });
    });
    this.classRepository.onArrayUpdate(function(type, bean, propertyName, index, count, newElements) {
        var handlerList = self.arrayUpdatedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function (handler) {
                try {
                    handler(bean, propertyName, index, count, newElements);
                } catch(e) {
                    console.warn('An exception occurred while calling an onArrayUpdate-handler for type', type, e);
                }
            });
        }
        self.allArrayUpdatedHandlers.forEach(function (handler) {
            try {
                handler(bean, propertyName, index, count, newElements);
            } catch(e) {
                console.warn('An exception occurred while calling a general onArrayUpdate-handler', e);
            }
        });
    });

}


BeanManager.prototype.notifyBeanChange = function(bean, propertyName, newValue) {
    checkMethod('BeanManager.notifyBeanChange(bean, propertyName, newValue)');
    checkParam(bean, 'bean');
    checkParam(propertyName, 'propertyName');

    return this.classRepository.notifyBeanChange(bean, propertyName, newValue);
};


BeanManager.prototype.notifyArrayChange = function(bean, propertyName, index, count, removedElements) {
    checkMethod('BeanManager.notifyArrayChange(bean, propertyName, index, count, removedElements)');
    checkParam(bean, 'bean');
    checkParam(propertyName, 'propertyName');
    checkParam(index, 'index');
    checkParam(count, 'count');
    checkParam(removedElements, 'removedElements');

    this.classRepository.notifyArrayChange(bean, propertyName, index, count, removedElements);
};


BeanManager.prototype.isManaged = function(bean) {
    checkMethod('BeanManager.isManaged(bean)');
    checkParam(bean, 'bean');

    // TODO: Implement dolphin.isManaged() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.create = function(type) {
    checkMethod('BeanManager.create(type)');
    checkParam(type, 'type');

    // TODO: Implement dolphin.create() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.add = function(type, bean) {
    checkMethod('BeanManager.add(type, bean)');
    checkParam(type, 'type');
    checkParam(bean, 'bean');

    // TODO: Implement dolphin.add() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.addAll = function(type, collection) {
    checkMethod('BeanManager.addAll(type, collection)');
    checkParam(type, 'type');
    checkParam(collection, 'collection');

    // TODO: Implement dolphin.addAll() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.remove = function(bean) {
    checkMethod('BeanManager.remove(bean)');
    checkParam(bean, 'bean');

    // TODO: Implement dolphin.remove() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.removeAll = function(collection) {
    checkMethod('BeanManager.removeAll(collection)');
    checkParam(collection, 'collection');

    // TODO: Implement dolphin.removeAll() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.removeIf = function(predicate) {
    checkMethod('BeanManager.removeIf(predicate)');
    checkParam(predicate, 'predicate');

    // TODO: Implement dolphin.removeIf() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.onAdded = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        checkMethod('BeanManager.onAdded(eventHandler)');
        checkParam(eventHandler, 'eventHandler');

        self.allAddedHandlers = self.allAddedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allAddedHandlers = self.allAddedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        checkMethod('BeanManager.onAdded(type, eventHandler)');
        checkParam(type, 'type');
        checkParam(eventHandler, 'eventHandler');

        var handlerList = self.addedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.addedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.addedHandlers.get(type);
                if (exists(handlerList)) {
                    self.addedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


BeanManager.prototype.onRemoved = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        checkMethod('BeanManager.onRemoved(eventHandler)');
        checkParam(eventHandler, 'eventHandler');

        self.allRemovedHandlers = self.allRemovedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allRemovedHandlers = self.allRemovedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        checkMethod('BeanManager.onRemoved(type, eventHandler)');
        checkParam(type, 'type');
        checkParam(eventHandler, 'eventHandler');

        var handlerList = self.removedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.removedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.removedHandlers.get(type);
                if (exists(handlerList)) {
                    self.removedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


BeanManager.prototype.onBeanUpdate = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        checkMethod('BeanManager.onBeanUpdate(eventHandler)');
        checkParam(eventHandler, 'eventHandler');

        self.allUpdatedHandlers = self.allUpdatedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allUpdatedHandlers = self.allUpdatedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        checkMethod('BeanManager.onBeanUpdate(type, eventHandler)');
        checkParam(type, 'type');
        checkParam(eventHandler, 'eventHandler');

        var handlerList = self.updatedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.updatedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.updatedHandlers.get(type);
                if (exists(handlerList)) {
                    self.updatedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


BeanManager.prototype.onArrayUpdate = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        checkMethod('BeanManager.onArrayUpdate(eventHandler)');
        checkParam(eventHandler, 'eventHandler');

        self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        checkMethod('BeanManager.onArrayUpdate(type, eventHandler)');
        checkParam(type, 'type');
        checkParam(eventHandler, 'eventHandler');

        var handlerList = self.arrayUpdatedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.arrayUpdatedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.arrayUpdatedHandlers.get(type);
                if (exists(handlerList)) {
                    self.arrayUpdatedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};



exports.BeanManager = BeanManager;