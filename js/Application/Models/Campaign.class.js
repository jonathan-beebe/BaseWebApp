goog.provide('Campaign');
goog.require('VModel');

Campaign = new Class({
  Extends: VModel,

  fields: {
    Name: '',
    MaxCpc: 0,
    Budget: 0,
    Status: 'PAUSED'
  },

  rules: {
    Name: {
      type: 'string',
      minLength: 3,
      maxLength: 45
    },
    MaxCpc: {
      type: 'number',
      min: 0
    },
    Budget: {
      type: 'number',
      min: 0
    },
    Status: {
      type: ['string', 'boolean'],
      values: ['PAUSED','ACTIVE','DELETED', true, false],
      valueMap: {
        'true': 'ACTIVE',
        'false': 'PAUSED'
      }
    }
  }

});
