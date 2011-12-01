// Copyright 2011 Jon Beebe. All Rights Reserved.

/**
 * @fileoverview Base Model class.
 * @author somethingkindawierd@gmail.com (Jon Beebe)
 */

goog.provide('Model');
goog.require('String.extras');

/**
 * Base Model class.
 * Provides the basic features needed by data model objects.
 * Extend this class to create a model specific to your data needs.
 * Most likely you'll want to extend from {@see VModel} where you'll find
 * more advanced features for models requiring validation.
 */
Model = new Class({

  Implements: [Events, Options],

  /** @private Track if this model is in a changed state */
  _changed: false,

  options: {
    saveUrl: ''
  },

  /**
   * Key->Value data for this model.
   *
   * Child classes should override this property with all properties needed
   * in the model. Do not get from this object directly. Either use the
   * `getFields()` to get all field values, or `get` for a single value.
   *
   * Values can be simple, such as numbers or strings, or complex, being a
   * function that takes no parameters to get the value and a single parameter
   * to set the value.
   *
   * @example
   * <code>
   * key: function([set]) {
   *   if(set !== undefined)
   *     // set value
   *   else
   *     // return get value
   * }
   * </code>
   * @type {object}
   */
  fields: {},

  /**
   * Store the original values for this model.
   * @type {object}
   */
  originals: {},

  /**
   * Constructor for class.
   * @param {object} params Init params.
   */
  initialize: function(params, options) {

    this.setOptions(options);

    // I borrowed this next line from Mootools Core Options class.
    // Using this.fields directly results in an object with all the properties
    // set on the __proto__ but not on the actual object.
    // This line copies the values of the child class's `field` property.
    var fields = this.fields = Object.merge.apply(null, [{}, this.fields, params]);
    console.log('this.fields: ', this.fields);

    // We want to establish the original state of this object.
    // If you need to override this behavior, such as setting some properties
    // after constructions, just call the {@see establishOriginals} method again.
    this.establishOriginals();
  },

  /**
   * Get all fields as a normal key=>value object map.
   * Since values can be functions, we use this to get the data in a simpler form.
   * @return {object} A simple data map.
   */
  getFields: function() {
    return Object.map(this.fields, function(value, key) {
      if(typeOf(value) === 'function') {
        return value.apply(this, []);
      }
      else {
        return value;
      }
    }, this);
  },

  clearChanges: function() {
    this.establishOriginals();
  },

  /**
   * Given the current state of the model, lock it in as the 'original' state.
   */
  establishOriginals: function() {
    this.originals = Object.clone(this.getFields());
    this._changed = false;
  },

  /**
   * Get all changes made to the model. Only returns the key=>value pairs that
   * have been changed.
   *
   * @return {object} The changed value map.
   */
  getChanges: function() {
    var changes = {};
    Object.each(this.getFields(), function(value, key) {
      if(this.originals[key] !== value) {
        changes[key] = value;
      }
    }, this);
    return changes;
  },

  isChanged: function() {
    return this._changed;
  },

  /**
   * Get a properties value.
   * Child classes can define properties inside of the fields object, or by
   * defining custom getter methods in the form of `get` + `PropertyName` in
   * CamelCase.
   *
   * We look for the cusom getter first. Then we fall back to accessing the
   * fields value.
   */
  get: function(key) {
    // If we have a custom getter for this property, use it.
    if(typeOf(this['get' + key.ucfirst()]) === 'function') {
      return this['get' + key.ucfirst()].apply(this);
    }
    // If the requested property is defined on the fields object, use it.
    else if(this.fields.hasOwnProperty(key)) {
      if(typeOf(this.fields[key]) === 'function') {
        return this.fields[key].apply(this);
      }
      else {
        return this.fields[key];
      }
    }
    // We cannot access this property, throw an error.
    else {
      throw new Error('Model does not have the property ' + key);
    }
    return this;
  },

  set: function(key, value) {
    console.log('setting', key, value);
    // If we have a custom setter for this property, use it.
    if(typeOf(this['set' + key.ucfirst()]) === 'function') {
      this['set' + key.ucfirst()].apply(this, [value]);
    }
    // If the requested property is defined on the fields object, use it.
    else if(this.fields.hasOwnProperty(key)) {

      // Added this function test to support the Validators, which replace the
      // property with a function to get/set the value.
      if(typeOf(this.fields[key]) === 'function') {
        this.fields[key].apply(this, [value]);
      }
      else {
        this.fields[key] = value;
      }
    }
    // We cannot access this property, throw an error.
    else {
      throw new Error('Model does not have the property ' + key);
    }

    this._changed = true;

    // Fire the basic change event
    this.fireEvent('change', [this, key, value]);

    // Fire a change event for this specific property
    this.fireEvent('change:' + key, [this, value]);

    return this;
  },

  /**
   * Get the data for saving model.
   * Child classes should override this as needed. The object returned will
   * become the `data` property of the Request.
   * @return {object} The data object.
   */
  getDataForSaving: function() {
    return {
      model: this.getFields();
    };
  },

  /**
   * Save the model to the server via ajax.
   *
   * @param {boolean} force Force a save even when model has no changes?
   */
  save: function(force) {

    if(!this.hasChanges() || force !== true) { return; }

    if(this.options.saveUrl !== '') {

      var self = this;
      var req = new Request.JSON({
        url: this.options.saveUrl,
        data: getDataForSaving(),
        onSuccess: function(json) {
          self.onSaveComplete(json);
          self.onAfterSave();
        },
        onError: function() {
          self.onSaveError();
        }
      });

      if(self.onBeforeSave()) {
        req.send();
      }
    }
  },

  /**
   * Do any work necessary before saving.
   *
   * Event listeners can stop the save action by setting the result.stop
   * property to true;
   *
   * @return {boolean} True to continue saving, false to cancel saving.
   */
  onBeforeSave: function() {
    var result = {
      stop: false
    };
    self.fireEvent('beforesave', [this, result]);

    // TODO: perform any before-save work here.

    return !result.stop;
  },

  onAfterSave: function() {
    self.fireEvent('save', this);
    // TODO: perform any after-save work here.
  },

  onSaveComplete: function(result) {
    // TODO: respond to successful save.
  },

  onSaveError: function() {
    // TODO: respond to failed save.
  }

});

