crimes = new Meteor.Collection('violations');

if (Meteor.isClient) {

  randomCrime = function() {
    var skip = _.random(0, totalCrimes() - 1)
    return crimes.find({},{'skip':skip, 'limit':1}).fetch()[0];
  }

  totalCrimes = function() {
    return crimes.find().count();
  }

  Template.jumbotron.events({
    'click .report-btn': function () {
        $('.report-offender').addClass('hidden');
        $('.report-offender-form').removeClass('hidden');
    },
    'click .submit-btn': function () {
      var victim = $('.victim').val()
      var criminal = $('.criminal').val().length > 0 ? $('.criminal').val() : $('.criminal').attr('placeholder');
      var violation = $('.violation').val().length > 0 ? $('.violation').val() : $('.violation').attr('placeholder');

      if (victim.length > 0) {
        $('.victim').val('');
        $('.criminal').val('');
        $('.violation').val('');
        $('.name-alert').addClass('hidden');
        crimes.insert({
          'victim': victim,
          'criminal': criminal,
          'violation': violation,
          'created_at': moment().format()
        });
      } else {
        $('.name-alert').removeClass('hidden');
      }
    },
    'click .refresh-violation': function () {
        $('.criminal').attr('placeholder', randomCrime().criminal);
        $('.violation').attr('placeholder', randomCrime().violation);
    }
  });

  Template.jumbotron.randomCriminal = function() {
    crime = randomCrime();
    return crime ? crime.criminal : '';
  }

  Template.jumbotron.randomViolation = function() {
    crime = randomCrime();
    return crime ? crime.violation : '';
  }

  Template.violations.violations = function() {
    return crimes.find({},{'sort': {'created_at': -1}});
  }
  Template.violations.violationTime = function() {
    return this.created_at ? moment(this.created_at).format('h:mma MM/D/YY') : '';
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
