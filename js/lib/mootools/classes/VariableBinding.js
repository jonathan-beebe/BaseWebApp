goog.provide('VariableBinding');


/**
 * A very simple property binding class.
 * Allows for child-classes to have their properties bound to target 
 * objects/classes.
 */
VariableBinding = new Class({

  __bound: {},

  /**
   * Bind a property of the instance to a target Object/Class
   *
   * @param {string} key The property name to bind.
   * @param {Object|Class} target The target to update on changes.
   */
  bindVar: function(key, target) {

    if(!this.__bound[key]) {
      this.__bound[key] = [];
    }

    this.__bound[key].push(target);

  },

  /**
   * Remove a target from the binding
   */
  unbindVar: function(key, target) {
    if(!this.__bound[key]) { return; }
    if(target) {
      this.__bound[key].each(function(item, index, array) {
        if(item === target) { delete array[index]; }
      });
    }
    else {
      delete this.__bound[key];
    }
  },

  set: function(key, value) {
    if(this[key] !== value) {
      this[key] = value;
      this.__notify(key, value);
    }
  },

  get: function(key) {
    return this[key];
  },

  /**
   * Notify all targets bound to a property when the prop changes.
   *
   * @private
   *
   * @param {string} key The property name.
   * @param {mixed} value The property value.
   */
  __notify: function(key, value) {

    if(!this.__bound[key]) { return; }

    Array.each(this.__bound[key], function(item) {

      // If it's a function, call it.
      if(item instanceof Function) {
        item(key, value);
      }
      // If it's got a setter, use it.
      else if(item.set && item.set instanceof Function) {
        item.set(key, value);
      }
      // Otherwise just set the property directly.
      else {
        item[key] = value;
      }
    });
  }

});

