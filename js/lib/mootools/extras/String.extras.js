goog.provide('String.extras');

String.implement({

  // Force the first letter of a string to lowercase.
  lowercaseFirstLetter : function(){
    return this.charAt(0).toLowerCase() + this.slice(1);
  }

});
