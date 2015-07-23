import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  controllerDateObject: Ember.computed(function() {
    return moment('2015-08-07');
  }),

  controllerDateString: Ember.computed(function() {
    return moment('2015-08-07').format('L');
  }),

  actions: {
    chosenDate(value) {
      console.log(value.format('L'));
    }
  }
});
