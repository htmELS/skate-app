Template.CompetitionsList.helpers({
  competitions: function () {
    var filter = Settings.get("competitions.filter.venue") ? { "venue.name": Settings.get("competitions.filter.venue") } : {};
    return Competitions.find(filter, { sort: {starts: 1} });
  }
});

Template._competitionItem.helpers({
  subscribeText: function () {
    var s = new Date(this.settings.opens),
      e = new Date(this.settings.closes),
      t = Chronos.currentTime();
    if(t > e)
      return "inschrijving gesloten";
    if(t > s && t < e){
      if (e - t > 1000 * 3600 * 24)
        return "inschrijving nog "+ ((e - t) / 1000 / 3600 / 24).toFixed(0) + " dagen open";
      else
        return "inschrijving nog "+ ((e - t) / 1000 / 3600).toFixed(0) + " uur open";
    }
    else {
      if (s - t > 1000 * 3600 * 24)
        return "inschrijving opent over "+((s - t) / 1000 / 3600 / 24).toFixed(0) + " dagen";
      else
        return "inschrijving opent over "+((s - t) / 1000 / 3600).toFixed(0) + " uur"
    }
    // if()
  }
});

// Strips T and Z from timestamp
var dateFormat = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
Template.registerHelper("datef", date => (date || "").replace(/T|Z/g, " ").replace(/\:00$/, ""));
Template.registerHelper("date", date => (new Date(date)).toLocaleDateString('nl-NL', dateFormat));
Template.registerHelper("time", date => (new Date(date)).toLocaleTimeString('nl-NL'));

// Strips date from timestamp if the start timestamp has the same date
Template.registerHelper("onlytime", (date, start) => {
  if(new Date(date).toDateString() == new Date(start).toDateString()){
    return new Date(date).toLocaleTimeString();
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
    if (!this.subscription.ready()) {
      // IonLoading.show();
    } else {
      // IonLoading.hide();
    }
  }.bind(this));
};

// Template.CompetitionsList.helpers({
//   competitions: function () {
//     return Competitions.find({}, {sort: {start: -1, name: -1}});
//   }
// });