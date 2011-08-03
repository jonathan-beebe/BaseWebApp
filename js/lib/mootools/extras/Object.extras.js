goog.provide('Options.extras');

Options.implement({
  
  getOption: function(opt) {
    return this.options[opt];
  },
  
  setOption: function(opt, value) {
    this.options[opt] = value;
  }
  
});
