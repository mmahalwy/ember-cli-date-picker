import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  controllerDate: Ember.computed(function() {
    return moment('2015-08-07');
  }),

  actions: {
    dateCalled() {
      console.log(this);
      console.log(arguments);
    }
  }
});
