goog.provide('Collection');

/**
 * Provides a simple way for our classes to inherit methods for iterating over
 * a collection of items. 
 */

Collection = new Class({
  _data: []
});

// Map each function of the Array object to this class.
Object.each(Array, function(func, funcName) {
  Collection.implement(funcName, function() {
    // Forward the call to this instances array, passing along all
    // arguments to it's implementation of this method.
    this._data[funcName].apply(this._data, arguments); 
  });
});

