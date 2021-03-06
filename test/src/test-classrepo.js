/*jslint browserify: true, mocha: true, expr: true */
"use strict";

var expect = require('chai').expect;
var sinon = require('sinon');

var Tag = require('../../opendolphin/build/Tag').default;

var consts = require('../../src/constants');

var ClassRepository = require('../../src/classrepo.js').ClassRepository;

function check( done, func ) {
    try {
        func();
        done();
    } catch(e) {
        done(e);
    }
}

describe('ClassRepository primitive properties', function() {

    var dolphin = {
        findPresentationModelById: function() {}
    };
    var classRepo = null;
    var classModel = null;

    beforeEach(function() {
        classRepo = new ClassRepository(dolphin);
        classModel = {
            id: 'ComplexClass',
            attributes: [
                { propertyName: 'booleanProperty', value: consts.BOOLEAN },
                { propertyName: 'floatProperty', value: consts.DOUBLE },
                { propertyName: 'integerProperty', value: consts.INT },
                { propertyName: 'stringProperty', value: consts.STRING },
                { propertyName: 'dateProperty', value: consts.DATE },
                { propertyName: 'enumProperty', value: consts.ENUM }
            ]
        };
        classRepo.registerClass(classModel);
    });



    it('should initialize', sinon.test(function() {
        var beanModel = {
            presentationModelType: 'ComplexClass',
            attributes: [
                { propertyName: 'booleanProperty', tag: Tag.value(), onValueChange: function() {} },
                { propertyName: 'floatProperty', tag: Tag.value(), onValueChange: function() {} },
                { propertyName: 'integerProperty', tag: Tag.value(), onValueChange: function() {} },
                { propertyName: 'stringProperty', tag: Tag.value(), onValueChange: function() {} },
                { propertyName: 'dateProperty', tag: Tag.value(), onValueChange: function() {} },
                { propertyName: 'enumProperty', tag: Tag.value(), onValueChange: function() {} }
            ]
        };
        var bean = classRepo.load(beanModel);
        expect(bean.booleanProperty).to.be.null;
        expect(bean.floatProperty).to.be.null;
        expect(bean.integerProperty).to.be.null;
        expect(bean.stringProperty).to.be.null;
        expect(bean.dateProperty).to.be.null;
        expect(bean.enumProperty).to.be.null;
    }));

    it('can set boolean from opendolphin', sinon.test(function() {
        var onBeanUpdateHandler = this.spy();
        classRepo.onBeanUpdate(onBeanUpdateHandler);
        var booleanPropertyChangeListener = function() {};
        var beanModel = {
            presentationModelType: 'ComplexClass',
            attributes: [
                {
                    propertyName: 'booleanProperty',
                    tag: Tag.value(),
                    onValueChange: function(listener) {
                        booleanPropertyChangeListener = listener;
                    }
                }
            ]
        };
        var bean = classRepo.load(beanModel);
        booleanPropertyChangeListener({oldValue: null, newValue: true});
        booleanPropertyChangeListener({oldValue: true, newValue: false});
        booleanPropertyChangeListener({oldValue: false, newValue: null});
        sinon.assert.callCount(onBeanUpdateHandler, 3);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'booleanProperty', true, null);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'booleanProperty', false, true);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'booleanProperty', null, false);
    }));

    it('can set float from opendolphin', sinon.test(function() {
        var onBeanUpdateHandler = this.spy();
        classRepo.onBeanUpdate(onBeanUpdateHandler);
        var floatPropertyChangeListener = function() {};
        var beanModel = {
            presentationModelType: 'ComplexClass',
            attributes: [
                {
                    propertyName: 'floatProperty',
                    tag: Tag.value(),
                    onValueChange: function(listener) {
                        floatPropertyChangeListener = listener;
                    }
                }
            ]
        };
        var bean = classRepo.load(beanModel);
        floatPropertyChangeListener({oldValue: null,   newValue: 3.1415});
        floatPropertyChangeListener({oldValue: 3.1415, newValue: 2.7182});
        floatPropertyChangeListener({oldValue: 2.7182, newValue: null});
        sinon.assert.callCount(onBeanUpdateHandler, 3);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'floatProperty', 3.1415, null);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'floatProperty', 2.7182, 3.1415);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'floatProperty', null, 2.7182);
    }));

    it('can set integer from opendolphin', sinon.test(function() {
        var onBeanUpdateHandler = this.spy();
        classRepo.onBeanUpdate(onBeanUpdateHandler);
        var integerPropertyChangeListener = function() {};
        var beanModel = {
            presentationModelType: 'ComplexClass',
            attributes: [
                {
                    propertyName: 'integerProperty',
                    tag: Tag.value(),
                    onValueChange: function(listener) {
                        integerPropertyChangeListener = listener;
                    }
                }
            ]
        };
        var bean = classRepo.load(beanModel);
        integerPropertyChangeListener({oldValue: null, newValue: 42});
        integerPropertyChangeListener({oldValue: 42,   newValue: 4711});
        integerPropertyChangeListener({oldValue: 4711, newValue: null});
        sinon.assert.callCount(onBeanUpdateHandler, 3);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'integerProperty', 42, null);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'integerProperty', 4711, 42);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'integerProperty', null, 4711);
    }));

    it('can set string from opendolphin', sinon.test(function() {
        var onBeanUpdateHandler = this.spy();
        classRepo.onBeanUpdate(onBeanUpdateHandler);
        var stringPropertyChangeListener = function() {};
        var beanModel = {
            presentationModelType: 'ComplexClass',
            attributes: [
                {
                    propertyName: 'stringProperty',
                    tag: Tag.value(),
                    onValueChange: function(listener) {
                        stringPropertyChangeListener = listener;
                    }
                }
            ]
        };
        var bean = classRepo.load(beanModel);
        stringPropertyChangeListener({oldValue: null, newValue: 'Hello World'});
        stringPropertyChangeListener({oldValue: 'Hello World', newValue: 'Goodbye World'});
        stringPropertyChangeListener({oldValue: 'Goodbye World', newValue: null});
        sinon.assert.callCount(onBeanUpdateHandler, 3);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'stringProperty', 'Hello World', null);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'stringProperty', 'Goodbye World', 'Hello World');
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'stringProperty', null, 'Goodbye World');
    }));

    it('can set date from opendolphin', sinon.test(function() {
        var date1 = new Date();
        date1.setUTCFullYear(2016, 1, 29);
        date1.setUTCHours(0, 1, 2, 3);
        var date2 = new Date();
        date2.setUTCFullYear(2015, 1, 28);
        date2.setUTCHours(0, 1, 2, 3);
        var onBeanUpdateHandler = this.spy();
        classRepo.onBeanUpdate(onBeanUpdateHandler);
        var datePropertyChangeListener = function() {};
        var beanModel = {
            presentationModelType: 'ComplexClass',
            attributes: [
                {
                    propertyName: 'dateProperty',
                    tag: Tag.value(),
                    onValueChange: function(listener) {
                        datePropertyChangeListener = listener;
                    }
                }
            ]
        };
        var bean = classRepo.load(beanModel);
        datePropertyChangeListener({oldValue: null, newValue: '2016-02-29T00:01:02.003Z'});
        datePropertyChangeListener({oldValue: '2016-02-29T00:01:02.003Z', newValue: '2015-02-28T00:01:02.003Z'});
        datePropertyChangeListener({oldValue: '2015-02-28T00:01:02.003Z', newValue: null});
        sinon.assert.callCount(onBeanUpdateHandler, 3);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'dateProperty', date1, null);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'dateProperty', date2, date1);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'dateProperty', null, date2);
    }));

    it('can set enum from opendolphin', sinon.test(function() {
        var onBeanUpdateHandler = this.spy();
        classRepo.onBeanUpdate(onBeanUpdateHandler);
        var enumPropertyChangeListener = function() {};
        var beanModel = {
            presentationModelType: 'ComplexClass',
            attributes: [
                {
                    propertyName: 'enumProperty',
                    tag: Tag.value(),
                    onValueChange: function(listener) {
                        enumPropertyChangeListener = listener;
                    }
                }
            ]
        };
        var bean = classRepo.load(beanModel);
        enumPropertyChangeListener({oldValue: null, newValue: 'VALUE_1'});
        enumPropertyChangeListener({oldValue: 'VALUE_1', newValue: 'VALUE_2'});
        enumPropertyChangeListener({oldValue: 'VALUE_2', newValue: null});
        sinon.assert.callCount(onBeanUpdateHandler, 3);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'enumProperty', 'VALUE_1', null);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'enumProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'enumProperty', null, 'VALUE_2');
    }));

    it('can set boolean from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'booleanProperty',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.be.true;
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('booleanProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'booleanProperty', true);
    }));

    it('can set boolean to null from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'booleanProperty',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.be.null;
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('booleanProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(true);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'booleanProperty', null);
    }));

    it('can set float from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'floatProperty',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.be.closeTo(2.7182, 1e-6);
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('floatProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'floatProperty', 2.7182);
    }));

    it('can set float to null from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'floatProperty',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.be.null;
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('floatProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(2.7182);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'floatProperty', null);
    }));

    it('can set integer from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'integerProperty',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.equal(4711);
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('integerProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'integerProperty', 4711);
    }));

    it('can set integer to null from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'integerProperty',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.be.null;
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('integerProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(4711);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'integerProperty', null);
    }));

    it('can set string from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'stringProperty',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.equal('Goodbye!');
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('stringProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'stringProperty', 'Goodbye!');
    }));

    it('can set string to null from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'stringProperty',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.be.null;
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('stringProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns('Goodbye!');
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'stringProperty', null);
    }));

    it('can set date from user', sinon.test(function(done) {
        var date1 = new Date();
        date1.setUTCFullYear(2016, 1, 29);
        date1.setUTCHours(0, 1, 2, 3);
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'dateProperty',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.equal('2016-02-29T00:01:02.003Z');
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('dateProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'dateProperty', date1);
    }));

    it('can set date to null from user', sinon.test(function(done) {
        var date1 = new Date();
        date1.setUTCFullYear(2016, 1, 29);
        date1.setUTCHours(0, 1, 2, 3);
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'dateProperty',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.be.null;
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('dateProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(date1);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'dateProperty', null);
    }));

    it('can set enum from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'enumProperty',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.equal('VALUE_1');
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('enumProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'enumProperty', 'VALUE_1');
    }));

    it('can set enum to null from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'enumProperty',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.be.null;
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('enumProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns('VALUE_1');
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'enumProperty', null);
    }));
});


describe('ClassRepository Dolphin Bean properties', function() {

    var dolphin = {
        findPresentationModelById: function() {}
    };
    var classRepo = null;
    var bean1 = null;
    var bean2 = null;
    var complexClassModel = null;

    beforeEach(function() {
        classRepo = new ClassRepository(dolphin);

        var simpleClassModel = {
            id: 'SimpleClass',
            attributes: [
                { propertyName: 'text', value: consts.STRING }
            ]
        };
        classRepo.registerClass(simpleClassModel);
        complexClassModel = {
            id: 'ComplexClass',
            attributes: [
                { propertyName: 'reference', value: consts.DOLPHIN_BEAN }
            ]
        };
        classRepo.registerClass(complexClassModel);
        var bean1Model = {
            id: 'id1',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: Tag.value(), onValueChange: function() {} }
            ]
        };
        bean1 = classRepo.load(bean1Model);
        var bean2Model = {
            id: 'id2',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: Tag.value(), onValueChange: function() {} }
            ]
        };
        bean2 = classRepo.load(bean2Model);
    });



    it('should initialize', sinon.test(function() {
        var beanModel = {
            presentationModelType: 'ComplexClass',
            attributes: [
                { propertyName: 'reference', tag: Tag.value(), onValueChange: function() {} }
            ]
        };
        var bean = classRepo.load(beanModel);
        expect(bean.reference).to.be.null;
    }));

    it('can be set from opendolphin', sinon.test(function() {
        var onBeanUpdateHandler = this.spy();
        classRepo.onBeanUpdate(onBeanUpdateHandler);
        var propertyChangeListener = function() {};
        var beanModel = {
            presentationModelType: 'ComplexClass',
            attributes: [
                {
                    propertyName: 'reference',
                    tag: Tag.value(),
                    onValueChange: function(listener) {
                        propertyChangeListener = listener;
                    }
                }
            ]
        };
        var bean = classRepo.load(beanModel);
        propertyChangeListener({oldValue: null,  newValue: 'id1'});
        propertyChangeListener({oldValue: 'id1', newValue: 'id2'});
        propertyChangeListener({oldValue: 'id2', newValue: null});
        sinon.assert.callCount(onBeanUpdateHandler, 3);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'reference', bean1, null);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'reference', bean2, bean1);
        sinon.assert.calledWith(onBeanUpdateHandler, 'ComplexClass', bean, 'reference', null,  bean2);
    }));

    it('can be set from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'reference',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.equal('id2');
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('reference').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'reference', bean2);
    }));

    it('can be set to null from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'reference',
            tag: Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                check(done, function() {
                    expect(newValue).to.be.null;
                });
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('reference').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'reference', null);
    }));

});


describe('ClassRepository.mapParamToDolphin()', function() {

    it('undefined', function() {
        var classRepo = new ClassRepository({});
        var result = classRepo.mapParamToDolphin(undefined);
        expect(result).to.be.undefined;
    });

    it('null', function() {
        var classRepo = new ClassRepository({});
        var result = classRepo.mapParamToDolphin(null);
        expect(result).to.be.null;
    });

    it('boolean true', function() {
        var classRepo = new ClassRepository({});
        var result = classRepo.mapParamToDolphin(true);
        expect(result).to.be.true;
    });

    it('boolean false', function() {
        var classRepo = new ClassRepository({});
        var result = classRepo.mapParamToDolphin(false);
        expect(result).to.be.false;
    });

    it('number 0', function() {
        var classRepo = new ClassRepository({});
        var result = classRepo.mapParamToDolphin(0);
        expect(result).to.equal(0);
    });

    it('number positive integer', function() {
        var classRepo = new ClassRepository({});
        var result = classRepo.mapParamToDolphin(42);
        expect(result).to.equal(42);
    });

    it('number negative float', function() {
        var classRepo = new ClassRepository({});
        var result = classRepo.mapParamToDolphin(-0.1);
        expect(result).to.equal(-0.1);
    });

    it('string', function() {
        var classRepo = new ClassRepository({});
        var result = classRepo.mapParamToDolphin('42');
        expect(result).to.equal('42');
    });

    it('string (empty)', function() {
        var classRepo = new ClassRepository({});
        var result = classRepo.mapParamToDolphin('');
        expect(result).to.equal('');
    });

    it('date', function() {
        var date1 = new Date();
        date1.setUTCFullYear(2016, 1, 29);
        date1.setUTCHours(0, 1, 2, 3);
        var classRepo = new ClassRepository({});
        var result = classRepo.mapParamToDolphin(date1);
        expect(result).to.equal('2016-02-29T00:01:02.003Z');
    });

    it('enum', function() {
        var classRepo = new ClassRepository({});
        var result = classRepo.mapParamToDolphin('VALUE_1');
        expect(result).to.equal('VALUE_1');
    });

    // TODO Implement once it is possible to create beans on the client
    it('Dolphin Bean', function() {
    });

    it('arbitrary object', function() {
        var classRepo = new ClassRepository({});
        expect(function() {classRepo.mapParamToDolphin({});}).to.throw(TypeError);
    });

    it('array', function() {
        var classRepo = new ClassRepository({});
        expect(function() {classRepo.mapParamToDolphin([]);}).to.throw(TypeError);
    });

    it('function', function() {
        var classRepo = new ClassRepository({});
        expect(function() {classRepo.mapParamToDolphin(function() {});}).to.throw(TypeError);
    });
});
