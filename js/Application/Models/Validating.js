goog.provide('VModel');
goog.require('Model');
goog.require('VProperty');
goog.require('LengthError');

/**
 * Validating Model.
 * Defines basic framework for data models needing to be validated.
 */
VModel = new Class({

  Extends: Model,

  rules: {},

  /**
   * Store errors.
   * @private
   */
  _errors: {},

  initialize: function(params) {

    // Do the parent thing...this will merge fields with model base
    this.parent(params);

    // Create all the validators for fields with rules
    this.prepareValidators(this.fields, this.rules);
    //this.validateProperties(params);

  },

  /**
   * Prepare all validators for given properties.
   * All properties with rules will become functions instead of simple values.
   * Calling it with a parameter will try to set it to that param value, if
   * it passes the rules. Otherwise calling it will get the value.
   *
   * @param {object} properties The properties definitions.
   * @param {object} rulesDef The rules definitions.
   */
  prepareValidators: function(properties, rulesDef) {
    Object.each(rulesDef, function(rules, key) {
      if(properties.hasOwnProperty(key)) {
        properties[key] = new VProperty(key, properties[key], rules);
      }
    });
  },

  hasErrors: function() {
    return Object.getLength(this._errors) > 0;
  },

  getErrors: function() {
    return this._errors;
  },

  /**
   * Here we override the setter, catching errors and storing them in an array.
   * @override
   */
  set: function(key, value) {
    try {
      this.parent(key, value);
      return true;
    }
    catch(e) {
      this._errors[key] = e;
      return false;
    }
  }

});




