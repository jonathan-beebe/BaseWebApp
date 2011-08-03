goog.provide('Array.extras');


Array.implement({

  // Merge any number of arrays into a single array
  merge: function() {
    if(arguments.length === 0) { return this; }
    if(arguments.length === 1) {
      return this.combine(arguments[1]);
    }

    var merged = [];
    Array.each(arguments, function(item, index, obj) {
      merged.combine(item);
    });

    return this.combine(merged);
  }

});
