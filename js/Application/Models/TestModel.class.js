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

});
