goog.provide('Elements.VariableBinding');

Element.implement({

  __bound: {},

  __boundEvents: {},

  /**
   * Bind a property of the instance to a target Object/Class
   *
   * @param {string} key The property name to bind.
   * @param {Object|Class} target The target to update on changes.
   */
  bindVar: function(key, target) {

    // If this is an input, wire up the change event so we can also
    // notify target of user-changes to value.
    if(this.__isUserInputChange(this, key)) {

      if(!this.__boundEvents[key]) {
        this.__boundEvents = {};
      }

      // If this is the first time wiring up this property then create a
      // define the callback function for this property.
      if(!this.__boundEvents[key]) {
        this.__boundEvents[key] = {
          func: function(event) {
            Object.each(this.__boundEvents[key].targets, function(item) {
              this.__notify(item, key, this.get(key));
            }.bind(this));
          }.bind(this),
          targets: {}
        };
      }

      // If this target has not been assiged to this property then
      // add a change-event listener and add the target to the bound list.
      if(!this.__boundEvents[key].targets[target]) {
        this.addEvent('change', this.__boundEvents[key].func);
        this.__boundEvents[key].targets[target] = target;
      }

    }
    // This is not a property editable via user input, so bind it via
    // the normal mechanism.
    else {
      if(!this.__bound[key]) {
        this.__bound[key] = [];
      }
      this.__bound[key].push(target);
    }
  },
  
  /**
   * Is this element editable via user-input?
   * @private
   * @return {boolean} True if user-editable element, false otherwise.
   */
  __isUserInputChange: function(elem, key) {

    // user-editable properties
    var props = ['value', 'checked', 'selected'];
    // user-editable elements
    var elems = ['input', 'select'];
    
    if(!elems.contains(elem.nodeName.toLowerCase())) { return false; }
    if(!props.contains(key)) { return false; }
    return true;
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

  /**
   * Copied from Mootools Element, with additions
   */
  set: function(prop, value){
    var property = Element.Properties[prop];
    (property && property.set) ? property.set.call(this, value) : this.setProperty(prop, value);
    this.__notifyAll(prop, value);
  }.overloadSetter(),

  /**
   * Notify all targets bound to a property when the prop changes.
   *
   * @private
   *
   * @param {string} key The property name.
   * @param {mixed} value The property value.
   */
  __notifyAll: function(key, value) {

    if(!this.__bound[key]) { return; }

    Array.each(this.__bound[key], function(item) {
      this.__notify(item, key, value);
    }.bind(this));
  },

  __notify: function(item, key, value) {

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

  }

});
