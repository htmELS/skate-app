Competitions = new Mongo.Collection('competitions', { transform: (doc) => new Competition(doc) });
Licenses = new Mongo.Collection('licenses');
DistanceCombinations = new Mongo.Collection('distanceCombinations');
DistanceSettings = new Mongo.Collection('distanceSettings');
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

Router.route('/', function(){
  this.render('CompetitionsList', { data: () =>   {
    var filter = Settings.get("competitions.filter.venue") ? { "venue.name": Settings.get("competitions.filter.venue") } : {};
    
    var fBegin = Session.get("competitions.filter.start") || { "ends": { "$gte": new Date() } };
    var fEnd   = Session.get("competitions.filter.end") || { "starts": { "$lte": new Date(new Date().getTime() + 1000 * 3600 * 24 * 60) } };
    var filters = [ filter, fBegin, fEnd ];

    var competitions = Competitions.find(_.extend(filter, fBegin, fEnd), { sort: {starts: 1} }).fetch();

    var first = competitions[0].ends;
    var last = competitions[competitions.length-1].starts;

    return {
      // Data
      competitions: competitions.reduce((memo, item) => {
        var last = memo.length && memo[memo.length-1];
        if(item.settings.closes < new Date() && !memo.past){
          memo.push({ text: "Inschrijving gesloten" });
          memo.past = true;
        }
        if(item.settings.closes > new Date() && item.settings.opens < new Date() && !memo.curr){
          memo.push({ text: "Inschrijving nu open", "class": "dividerCurrent" });
          memo.curr = true;
        }
        if(item.settings.opens > new Date() && !memo.future){
          memo.push({ text: "Inschrijving binnenkort open" });
          memo.future = true;
        }
        memo.push(item);
        return memo;
      }, []),
      // Continuation forward
      "more": function(){
        var any = Competitions.find(_.extend(filter, fBegin), { sort: {starts: 1}, limit: 20 + competitions.length }).fetch().map(c => c.starts)
        return {
          extra: any.length - competitions.length,
          conti: function(){
            Session.set("competitions.filter.end", { "starts": { "$lte" : any[any.length-1] }});
          }};
      },
      // Continuation backward
      "less": function(){
        var any = Competitions.find(_.extend(filter, fEnd), { sort: {starts: -1}, limit: 20 + competitions.length }).fetch().map(c => c.ends)
        return {
          extra: any.length - competitions.length, 
          conti: function(){
            Session.set("competitions.filter.start", { "ends": { "$gte" : any[any.length-1] }});
          }};
      }
    }
  }});
}, { name: 'competitions.list', onBeforeAction: extractUrlSettings });

Router.route('/competitions/:_id', function(){
  this.render('CompetitionsShow', { data: () => Competitions.findOne({_id: this.params._id}) });
}, { name: 'competitions.show' });

Router.route('/competitions/:_id/subscribe', function(){
  this.render('CompetitionsSubscribe', { data: () => Competitions.findOne({_id: this.params._id}) });
}, { name: 'competitions.subscribe' });

Router.route('/competitions/filter/venue', { name: 'competitions.filter.venue' });
Router.route('/competitions/filter/category', { name: 'competitions.filter.category' });

Router.route('/profile', { name: 'profile' });

/**
 * Allows us to provide url params for initial loads
 */
function extractUrlSettings(){
  var map = { 
    "defaultColor": "color",
    "defaultColorDarker": "colorDarker",
    "defaultVenue": "competitions.filter.venue",
  };

  for(n in map){
    if(this.params.query[n] && !Settings.get(map[n]))
      Settings.set(map[n], this.params.query[n]);
  }
  this.next();
}

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

if(Meteor.isServer) {
  Meteor.methods({
    userProfile: function (relationId) {
      var exists = Licenses.findOne({ key: relationId });
      if(!exists)
      HTTP.get("https://inschrijven.schaatsen.nl/api/licenses/KNSB/SpeedSkating.LongTrack/"+relationId,{},function(err,resp){
        console.log("Got back", err, resp);
        if(resp)
          Licenses.update({ key: resp.data.key }, { "$set": resp.data }, {upsert: true});
        else 
          console.warn(err);
      });
    },

    competitors: function (competitionId) {
      // GET https://inschrijven.schaatsen.nl/api/competitions/5789342a-0ede-4369-a34e-1abfc183187d/competitors
    },

    distanceCombinations: function (competitionId) {
      var exists = DistanceCombinations.findOne({ competitionId, lastSyncTimestamp: { $gt: new Date() - 10000 * 3600 } });
      if(!exists)
      HTTP.get("https://inschrijven.schaatsen.nl/api/competitions/"+competitionId+"/distancecombinations",{},function(err,resp){
        if(resp)
          DistanceCombinations.update(
            { competitionId }, 
            { $set: { 
              competitionId, 
              combinations: resp.data,
              lastSyncTimestamp: new Date() 
            } },
            { upsert: true }
          );
        else 
          console.warn(err);
      });
    },

    distanceSettings: function (competitionId, relationId) {
      var exists = DistanceSettings.findOne({ relationId, competitionId, lastSyncTimestamp: { $gt: new Date() - 10000 * 3600 } });
      if(!exists)
      HTTP.get("https://inschrijven.schaatsen.nl/api/competitions/"+competitionId+"/settings/"+relationId,{},function(err,resp){
        if(resp)
          DistanceSettings.update(
            { relationId, competitionId }, 
            { $set: { 
              relationId, 
              competitionId, 
              combinations: resp.data, 
              lastSyncTimestamp: new Date() 
            } },
            { upsert: true }
          );
        else 
          console.warn(err);
      });
    },

    register: function (competitionId, relationId) {
      // POST https://inschrijven.schaatsen.nl/api/competitions/5789342a-0ede-4369-a34e-1abfc183187d/registrations/10158952
      // {"email":"hermanbanken@gmail.com","registerForSerie":false,"distanceCombinations":["a50cf852-618e-4b5f-9ad5-18b3d4028f7a"]}
    }
  });
}