Template.CompetitionsList.helpers({
  title: function () {
    if(Settings.get("competitions.filter.venue"))
      return "Wedstrijden - " + Settings.get("competitions.filter.venue");
    return "Wedstrijden";
  },
  competitionLoadPast: function(){
    return Session.get("competitions.loadPast");
  }
});

Template.CompetitionsList.events({
  "click .loadPast": function(){
    this.less.conti();
  },
  "click .loadFuture": function(){
    this.more.conti();
  }
})

function stable(a,b) { return a - b; }
function maxDistance(a,b){ return a[a.length-1] - b[b.length-1]; }

distanceText = function distanceText () {
  var allowed = this.distances(Settings.get("relationid"));
  
  if(allowed && allowed.length){
    // Find unique distance possibilities
    var sets = _.uniq(allowed.map(a => a.distances.map(d => d.value).sort(stable)).sort(maxDistance).map(d => d.join("/")));
    return sets.join(", ");
  }

  if(!Settings.get("relationid"))
    return "geen beschikbare afstanden, vul in je profiel je KNSB relatienummer in";

  return "geen beschikbare afstanden";
}
showButton = function showButton(){
  return this.subscribeStatus().isOpen && this.distances(Settings.get("relationid")).length > 0;
};

Template._competitionItem.helpers({
  subscribeText: function () {
    return this.subscribeText();
  },
  distanceText: distanceText,
  showButton: showButton,
});



// Strips T and Z from timestamp
var dateFormat = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
Template.registerHelper("datef", date => (date || "").toISOString().replace(/T|Z/g, " ").replace(/\:00$/, ""));
Template.registerHelper("date", date => (new Date(date)).toLocaleDateString('nl-NL', dateFormat));
Template.registerHelper("time", date => (new Date(date)).toLocaleTimeString('nl-NL'));

// Strips date from timestamp if the start timestamp has the same date
Template.registerHelper("onlytime", (date, start) => {
  if(new Date(date).toDateString() == new Date(start).toDateString()){
    return new Date(date).toLocaleTimeString('nl-NL');
  } else {
    return new Date(date).toLocaleDateString('nl-NL', dateFormat) + " " + new Date(date).toLocaleTimeString('nl-NL');
  }
  var startd = (start || "").replace(/T.*$/, "");
  return (date || "").replace(startd+"T", "").replace("Z", "");
});

Template.CompetitionsList.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('competitions');
  }.bind(this));
};

Template.CompetitionsList.rendered = function () {
  this.autorun(function () {
    // if (!this.subscription.ready()) {
    //   IonLoading.show();
    // } else {
    //   IonLoading.hide();
    // }
  }.bind(this));

  if($(".dividerCurrent").closest(".overflow-scroll").scrollTop() == 0)
  $(".dividerCurrent").closest(".overflow-scroll").animate({
    scrollTop: $(".dividerCurrent").position().top
  }, "slow");
};

// Template.CompetitionsList.helpers({
//   competitions: function () {
//     return Competitions.find({}, {sort: {start: -1, name: -1}});
//   }
// });