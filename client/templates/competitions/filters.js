Template.competitionsFilterVenue.rendered = function() {
  IonPopover.hide("_filterCompetitions");
  Session.set('ionNavDirection', 'back');
}

Template.competitionsFilterCategory.rendered = function() {
  IonPopover.hide("_filterCompetitions");
  Session.set('ionNavDirection', 'back');
}

Template.competitionsFilterVenue.helpers({
  "venues": function(){
    var all = Competitions.find({}, { sort: {"venue.address.city": 1}, fields: {"venue": true}}).fetch().map(x => x.venue).filter(x => x);
    return _.uniq(all, true, venue => venue.name);
  }
});

Template.competitionsFilterVenue.events({
  "click .venue": function (event, template) {
    Session.set("competitions.filter.end", null);
    Session.set("competitions.filter.start", null);

    if($(event.currentTarget).data('venue'))
      Settings.set("competitions.filter.venue", $(event.currentTarget).data('venue'));
    else
      Settings.set("competitions.filter.venue", null);
  }
})