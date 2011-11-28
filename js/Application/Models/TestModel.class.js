goog.provide('TestModel');
goog.require('VModel');

TestModel = new Class({

  Extends: VModel,

  rules: {
    Text: {
      maxLength: 15,
      content: function(value) {
        return value !== 'beebe';
      }
    }
  },

  fields: {
    Id: '',
    Text: ''
  },

  initialize: function(params) {

    // Do the parent thing...this will merge fields with model base
    this.parent(params);

    // Create all the validators for fields with rules
    this.prepareValidators(this.fields, this.rules);
    //this.validateProperties(params);

  },

});
