goog.provide('VModel');
goog.require('Model');

/**
 * Validating Model.
 *
 * This model allows for rules to be applied to fields. When setting a value
 * these rules are used to validate the value before setting it.
 */
VModel = new Class({

  Extends: Model,

  rules: {},

  /**
   * Store errors.
   * @private
   */
  _errors: {},

  prepareValidators: function(properties, rulesDef) {

    // Override each property on the property list that has rules.
    // The property will now point to a function that can get or set the value.
    // Calling it with a parameter will try to set it to that param value, if
    // it passes the rules. Otherwise calling it will get the value.
    Object.each(rulesDef, function(rules, key) {
      if(properties.hasOwnProperty(key)) {
        properties[key] = new ValidateableProperty(key, properties[key], rules);
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
   * TODO: Should we just pass the error on?
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




/**
 * Defines a property as a function for getting or setting its value.
 * Setting the value will run the new value through a list of rules to
 * validate it before actually setting it.
 *
 * @param {string} key The key, or label, of this property.
 * @param {mixed} value The default value of the property.
 * @param {object} rules The rules definitions.
 * @return {function} The getter/setter function.
 */
ValidateableProperty = function(key, value, rules) {

  var self = this;

  self.key = key;
  self.value = value;
  self.rules = rules;

  // Return a new function that will set or get the value, depending on if a
  // parameter is passed.
  return function(newValue) {
    if(newValue === undefined) {
      // We're getting the value
      return self.get();
    }
    else {
      // We're setting the value
      self.set(newValue);
    }
  }
};

ValidateableProperty.prototype.get = function () {
  return this.value;
};

ValidateableProperty.prototype.set = function (value) {
  if(this.validate(value)) {
    this.value = value;
  }
};

ValidateableProperty.prototype.validate = function (value) {
  //console.log('validate', this.rules);

  // Loop through each property of this rule.
  // Test the value against each rule by calling the appropriate function.
  // Each rule has a corresponding function to call for the testing.
  //
  // Why is it Object.each breaks here? The rules obj does not 'hasOwnProperty'
  // the prop, it's instead on the objects proto. Is it because it's used on
  // an Implemented class?
  for(var label in this.rules) {

    var func;
    var args;

    // Rule will either be a value, such as a number or string, or it'll be
    // a custom function accepting a value and returning true/false.
    var rule = this.rules[label];

    // Are we using a custom function defined by the rules definition?
    if(typeOf(rule) === 'function') {
      func = rule;
      args = [value];
    }
    // Look for a test function, e.g. the label is 'maxLength' and we're
    // looking for the test function `testMaxLength`
    else {
      test = this['test' + label.ucfirst()];
      if(typeOf(test) === 'function') {
        func = test;
        args = [value, rule];
      }
    }

    if(!func.apply(this, args)) {
      throw new Error('Failed test "' + label + '" with "' + value + '"');
    }
  }

  return true;
};

/**
 * The max-length rule.
 *
 * @param {mixed} value The input value.
 * @param {int} length The maximum length of the value.
 * @return {bool} True if < max, false otherwise.
 */
ValidateableProperty.prototype.testMaxLength = function(value, length) {
  this.name = 'testMaxLength';
  //console.log('TestModel', value, length);
  if(value.length > length) {
    throw new LengthError('Value "' + value + '" exceeds the maximum length of ' + length);
    return false;
  }
  return true;
}


/**
 * Length Error class
 */
LengthError = function(message) {
  this.name = "LengthError";
  this.message = message;
};
LengthError.prototype = Error.prototype;
