goog.provide('Class.extras');

/**
 * Fetch all rows of an array/object as a distinct class instance.
 *
 * @static
 * @param {array|object} items Collection to iterate over.
 * @param {Function} klass The Mootools Class function.
 * @return {array} An array of classes.
 */
Class.FetchAllClass = function(items, klass) {
  
  var iterator = null,
      results = [];

  if(typeOf(items) === 'array') { iterator = Array; }
  else if(typeOf(items) === 'object') { iterator = Object; }

  if(!iterator) { return results; }

  iterator.each(items, function(item, key, obj) {
    var c = new klass(item);
    results.push(c);
  });
  return results;
};

