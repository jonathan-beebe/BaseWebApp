goog.provide('Application');
goog.provide('Application.Main');
goog.require('mootools.extras');

Application = function() {};

Application.Main = new Class({

  initialize: function() {},

  run: function() {
    // TODO: init the application here...
  }
  
});

window.addEvent('domready', function() {
  window.Application = new Application.Main();
  window.Application.run();
});

