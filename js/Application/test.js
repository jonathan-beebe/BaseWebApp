goog.provide('Application');
goog.provide('Application.Test');
goog.require('mootools.extras');
goog.require('TestModel');

Application = function() {};

Application.Test = new Class({

  initialize: function() {},

  run: function() {
    // TODO: init the application here...

    var model = new TestModel({
      Id: 99,
      Text: 'Monkeys'
    });

    this.model = model;

    this.test();
  },

  test: function() {
    console.log('Begin');
    console.log('changes', this.model.getChanges());
    console.log('errors', this.model.hasErrors());
    console.log('Text: ', this.model.get('Text'));

    console.log('Setting');
    this.model.set('Text', 'Jon Beebe');

    console.log('Text: ', this.model.get('Text'));
    console.log('errors', this.model.hasErrors());

    console.log('Setting');
    this.model.set('Text', 'taohudaotudaorubasntoduaouascdeusacoduague');

    console.log('Text: ', this.model.get('Text'));
    console.log('errors', this.model.hasErrors());
    console.log('errors', this.model.getErrors());

  }

});

window.addEvent('domready', function() {
  window.Application = new Application.Test();
  window.Application.run();
});

