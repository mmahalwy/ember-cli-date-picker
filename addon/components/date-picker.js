import Ember from 'ember';
import layout from '../templates/components/date-picker';
import moment from 'moment';

export default Ember.Component.extend({
  layout: layout,

  valueFormat: 'YYYY-MM-DD',
  format: 'YYYY-MM-DD',
  outputFormat: '',
  allowNull: false,
  utc: false,
  date: null,
  pikadayPicker: null,
  inputField: true,
  anchorField: false,

  showInputField: Ember.computed('inputField', 'anchorField', function() {
    return this.get('inputField') && !this.get('template');
  }),

  showAnchorField: Ember.computed('inputField', 'anchorField', function() {
    if (this.get('anchorField')) {
      this.set('inputField', false);
    }

    return this.get('anchorField');
  }),

  yearRange: Ember.computed(function() {
    var calendarYear = moment().year();
    return Ember.String.fmt("%@,%@", calendarYear-3, calendarYear+4);
  }).property(), // default yearRange from -3 to +4 years
  // A private method which returns the year range in absolute terms
  _yearRange: Ember.computed(function() {
    var yr = this.get('yearRange');
    if (!Ember.$.isArray(yr)) {
      yr = yr.split(',');
    }
    // assume we're in absolute form if the start year > 1000
    if (parseInt(yr[0], 10) > 1000) {
      return yr;
    }
    // relative form must be updated to absolute form
    var calendarYear = moment().year();
    return [calendarYear + parseInt(yr[0], 10), calendarYear + parseInt(yr[1], 10)];
  }).property('yearRange'),

  willInsertElement() {
    if (moment.isMoment(this.get('date'))) {
      return this.setDate(this.get('date'));
    }

    if (typeof this.get('date') === 'string') {
      return this.setDate(moment(this.get('date')));
    }

    if (Ember.isBlank(this.get('date'))) {
      return this.setDate(moment());
    }

    throw new Ember.Error('No moment object or date string is passed.');
  },

  didInsertElement: function() {
    let formElement = this.$()[0];
    let that = this;
    let pickerOptions = {
      field: formElement,
      yearRange: that.get('_yearRange'),
      clearInvalidInput: true,
      onSelect() {
        let momentFunction = that.get('utc') ? moment.utc : moment;
        let date = momentFunction(this.getMoment().format('YYYY-MM-DD'), that.get('format'));

        if (!date.isValid()) {
          if (that.get('allowNull')) {
            return that.set('date', null);
          } else {
            date = moment();
          }
        }

        that.setDate(date);
      }
    },
    picker = null;

    ['bound', 'position', 'reposition', 'format', 'firstDay', 'minDate',
    'maxDate', 'showWeekNumber', 'isRTL', 'internationalization', 'yearSuffix',
    'showMonthAfterYear', 'numberOfMonths', 'mainCalendar'].forEach(function(f) {
      if (!Ember.isEmpty(that.get(f))) {
        pickerOptions[f] = that.get(f);
      }

      if (f === 'internationalization') {
        pickerOptions['i18n'] = that.get('internationalization');
      }
    });

    picker = new window.Pikaday(pickerOptions);

    this.set("pikadayPicker", picker);
    return picker.setMoment(this.get('date'));
  },

  setDate: function(date) {
    var dateString;

    if (typeof date === 'string') {
      date = moment(date);
    }

    if (this.get('valueFormat') === 'date') {
      dateString = date.toDate();
    } else {
      dateString = date.format(this.get('valueFormat'));
    }

    if (this.get('outputFormat')) {
      this.set('date', Ember.String.fmt(this.get('outputFormat'), dateString));
    }
    else {
      this.set('date', dateString);
    }

    this.set('dateObject', date);

    this.sendAction('onSelect', date);
  },

  willDestroyElement: function() {
    this.get('pikadayPicker').destroy();
    this._super();
  }
});
