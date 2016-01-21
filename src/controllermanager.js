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

require('./polyfills.js');
var Promise = require('../bower_components/core.js/library/fn/promise');
var utils = require('./utils.js');
var exists = utils.exists;
var checkParam = utils.checkParam;

var ControllerProxy = require('./controllerproxy.js').ControllerProxy;

var DOLPHIN_BEAN_TYPE = require('./classrepo.js').DOLPHIN_BEAN;

var SOURCE_SYSTEM = require('./connector.js').SOURCE_SYSTEM;
var SOURCE_SYSTEM_CLIENT = require('./connector.js').SOURCE_SYSTEM_CLIENT;
var ACTION_CALL_BEAN = require('./connector.js').ACTION_CALL_BEAN;

var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var REGISTER_CONTROLLER_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'registerController';
var CALL_CONTROLLER_ACTION_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'callControllerAction';
var DESTROY_CONTROLLER_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'destroyController';

var CONTROLLER_NAME = 'controllerName';
var CONTROLLER_ID = 'controllerId';
var MODEL = 'model';
var ACTION_NAME = 'actionName';
var ERROR_CODE = 'errorCode';
var PARAM_PREFIX = '_';


function ControllerManager(dolphin, classRepository, connector) {
    checkParam(dolphin, 'dolphin');
    checkParam(classRepository, 'classRepository');
    checkParam(connector, 'connector');

    this.dolphin = dolphin;
    this.classRepository = classRepository;
    this.connector = connector;
}


ControllerManager.prototype.createController = function(name) {
    checkParam(name, 'name');

    var self = this;
    var controllerId, modelId, model;
    return new Promise(function(resolve) {
        self.connector.getHighlanderPM().then(function (highlanderPM) {
            highlanderPM.findAttributeByPropertyName(CONTROLLER_NAME).setValue(name);
            self.connector.invoke(REGISTER_CONTROLLER_COMMAND_NAME).then(function() {
                controllerId = highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).getValue();
                modelId = highlanderPM.findAttributeByPropertyName(MODEL).getValue();
                model = self.classRepository.mapDolphinToBean(modelId, DOLPHIN_BEAN_TYPE);
                resolve(new ControllerProxy(controllerId, model, self));
            });
        });
    });
};


ControllerManager.prototype.invokeAction = function(controllerId, actionName, params) {
    checkParam(controllerId, 'controllerId');
    checkParam(actionName, 'actionName');

    var self = this;
    return new Promise(function(resolve, reject) {

        var attributes = [
            self.dolphin.attribute(SOURCE_SYSTEM, null, SOURCE_SYSTEM_CLIENT),
            self.dolphin.attribute(CONTROLLER_ID, null, controllerId),
            self.dolphin.attribute(ACTION_NAME, null, actionName),
            self.dolphin.attribute(ERROR_CODE)
        ];

        if (exists(params)) {
            for (var prop in params) {
                if (params.hasOwnProperty(prop)) {
                    var param = self.classRepository.mapParamToDolphin(params[prop]);
                    attributes.push(self.dolphin.attribute(PARAM_PREFIX + prop, null, param.value, 'VALUE'));
                    attributes.push(self.dolphin.attribute(PARAM_PREFIX + prop, null, param.type, 'VALUE_TYPE'));
                }
            }
        }

        var pm = self.dolphin.presentationModel.apply(self.dolphin, [null, ACTION_CALL_BEAN].concat(attributes));

        self.connector.invoke(CALL_CONTROLLER_ACTION_COMMAND_NAME, params).then(function() {
            var isError = pm.findAttributeByPropertyName(ERROR_CODE).getValue();
            if (isError) {
                reject(new Error("ControllerAction caused an error"));
            } else {
                resolve();
            }
            self.dolphin.deletePresentationModel(pm);
        });
    });
};


ControllerManager.prototype.destroyController = function(controllerId) {
    checkParam(controllerId, 'controllerId');

    var self = this;
    return new Promise(function(resolve) {
        self.connector.getHighlanderPM().then(function (highlanderPM) {
            highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).setValue(controllerId);
            self.connector.invoke(DESTROY_CONTROLLER_COMMAND_NAME).then(resolve);
        });
    });
};



exports.ControllerManager = ControllerManager;
