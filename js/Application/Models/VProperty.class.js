goog.provide('VProperty');

/**
 * Defines a property as a function for getting or setting its value.
 * Setting the value will run the new value through a list of rules to
 * validate it before actually setting it.
 *
 * @example
 * <code>
 *   var prop = new VProp('myProp', 'testing', {});
 *   var test = prop(); // test == 'testing'
 *   prop('monkeys'):
 *   var test2 = prop(); // test2 == 'monkeys'
 * </code>
 *
 * @constructor
 *
 * @param {string} key The key, or label, of this property.
 * @param {mixed} value The default value of the property.
 * @param {object} rules The rules definitions.
 *
 * @return {function} The getter/setter function.
 */
VProperty = function(key, value, rules) {

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

VProperty.prototype.get = function () {
  return this.value;
};

VProperty.prototype.set = function (value) {
  if(this.validate(value)) {
    this.value = this.transform(value);
  }
};

/**
 * Transform the value based on a value map. If provided, the input will be
 * run through the value map and transformed according to it's rules.
 * This is a good way to turn boolean values into strings,
 * e.g. true -> 'ACTIVE', false -> 'PAUSED'
 */
VProperty.prototype.transform = function(value) {
  if(this.rules.valueMap && this.rules.valueMap[value.toString()]) {
    return this.rules.valueMap[value.toString()];
  }
  return value;
};

VProperty.prototype.validate = function (value) {
  //console.log('validate', this.rules);

  // Loop through each property of this rule.
  // Test the value against each rule by calling the appropriate function.
  // Each rule has a corresponding function to call for the testing.
  //
  // Why is it Object.each breaks here? The rules obj does not 'hasOwnProperty'
  // the prop, it's instead on the objects proto. Is it because it's used on
  // an Implemented class?
  for(var label in this.rules) {

    var func = false;
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

    if(func) {
      if(!func.apply(this, args)) {
        throw new Error('Failed test "' + label + '" with "' + value + '"');
      }
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
VProperty.prototype.testMaxLength = function(value, length) {
  this.name = 'testMaxLength';
  //console.log('TestModel', value, length);
  if(value.length > length) {
    throw new LengthError('Value "' + value + '" exceeds the maximum length of ' + length);
    return false;
  }
  return true;
}

VProperty.prototype.testMinLength = function(value, length) {
  this.name = 'testMinLength';
  if(value.length < length) {
    throw new LengthError('Value "' + value + '" does not meet the maninum length of ' + length);
    return false;
  }
  return true;
}

VProperty.prototype.testValues = function(value, values) {
  return values.contains(value);
};

VProperty.prototype.testType = function(value, type) {
  if(typeOf(type) !== 'array') { type = [type]; }
  return type.contains(typeOf(value));
};

VProperty.prototype.testMin = function(value, number) {
  return value >= number;
};

VProperty.prototype.testMax = function(value, number) {
  return value <= number;
};
