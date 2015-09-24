Competitions = new Mongo.Collection('competitions');
Settings = {};

Settings.get = function(key) {
  Session.get(key);
  return JSON.parse(localStorage.getItem(key));
};
Settings.set = function(key, value) {
  Session.set(key, value);
  localStorage.setItem(key, JSON.stringify(value));
};

AppController = RouteController.extend({ layoutTemplate: 'appLayout' });

CompetitionsController = AppController.extend({});

Router.route('/', { name: 'competitions.list' });

Router.route('/competitions/:_id', function(){
  this.render('CompetitionsShow', { data: () => Competitions.findOne({_id: this.params._id}) });
}, { name: 'competitions.show' });

Router.route('/competitions/:_id/subscribe', function(){
  this.render('CompetitionsSubscribe', { data: () => Competitions.findOne({_id: this.params._id}) });
}, { name: 'competitions.subscribe' });

Router.route('/competitions/filter/venue', { name: 'competitions.filter.venue' });
Router.route('/competitions/filter/category', { name: 'competitions.filter.category' });

Router.route('/profile', { name: 'profile' });


if (Meteor.isClient) {
  LastUpdate = new Mongo.Collection("syncLastUpdate");
  Meteor.subscribe('lastSyncTimestamp');
  // Meteor.startup(function () {
  //   // AutoForm.setDefaultTemplate('ionic');
  // });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Meteor.methods({
  userProfile: function (relationId) {
    if(Meteor.isServer) {
      HTTP.get("https://inschrijven.schaatsen.nl/api/licenses/KNSB/SpeedSkating.LongTrack/10158952",{},function(err,resp){
        console.log(resp);
        return Session.set("userProfile["+relationId+"]", resp);
      });
    }
    return Session.get("userProfile["+relationId+"]");
  }
});