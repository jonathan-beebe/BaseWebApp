goog.provide('LengthError');

/**
 * Length Error class
 */
LengthError = function(message) {
  this.name = "LengthError";
  this.message = message;
};
LengthError.prototype = Error.prototype;
