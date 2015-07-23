import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import Ember from 'ember';
import startApp from '../../helpers/start-app';
var application;

moduleForComponent('date-picker', 'Integration | Component | date picker', {
  integration: true,
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{date-picker}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#date-picker date=mydate valueFormat='YYYY-MM-DD'}}
      template block text
    {{/date-picker}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('it renders input field', function(assert) {
  assert.expect(3);

  this.set('mydate', moment('2015-08-07'));

  this.render(hbs`{{date-picker date=mydate valueFormat='YYYY-MM-DD'}}`);

  assert.ok(this.$('input'));
  assert.ok(this.$('input.date-picker-input'));
  assert.equal(this.$('input.date-picker-input').val(), '2015-08-07');
});

test('it renders anchor tag', function(assert) {
  assert.expect(3);

  this.set('mydate', moment('2015-08-07'));

  this.render(hbs`{{date-picker date=mydate valueFormat='YYYY-MM-DD' anchorField=true}}`);

  assert.ok(this.$('a'));
  assert.ok(this.$('a.date-picker-anchor'));
  assert.equal(this.$('a.date-picker-anchor').text(), '2015-08-07');
});

test('it can have a date string passed to it', function(assert) {
  assert.expect(1);

  this.set('mydate', moment('2015-08-07').format('L'));

  this.render(hbs`{{date-picker date=mydate valueFormat='YYYY-MM-DD' anchorField=true}}`);
  assert.equal(this.$('a.date-picker-anchor').text(), '2015-08-07');
});

test('it renders block', function(assert) {
  assert.expect(2);

  this.set('date', moment('2015-08-07'));

  this.render(hbs`
    {{#date-picker date=mydate valueFormat='YYYY-MM-DD' inputField=false}}
      <h1>Some block text</h1>
    {{/date-picker}}
  `);

  assert.ok(this.$('h1'));
  assert.equal(this.$('h1').text().trim(), 'Some block text');
});

test('it shows pikaday when clicked', function(assert) {
  assert.expect(3);
  this.set('date', moment('2015-08-07'));

  this.render(hbs`{{date-picker date=mydate valueFormat='YYYY-MM-DD'}}`);

  assert.equal(Ember.$('.pika-single').hasClass('is-hidden'), true);

  click('input');

  andThen(function() {
    assert.equal(Ember.$('.pika-single').hasClass('is-hidden'), false);
    click(document.body);
  });

  andThen(function() {
    assert.equal(Ember.$('.pika-single').hasClass('is-hidden'), true);
  });
});
