Template.Profile.helpers({
  relationId: () => { return Settings.get("relationid") },
  color: () => { return Settings.get("color") },
  profile: () => {
    Meteor.call("userProfile", Settings.get("relationid"));
    return Session.get("userProfile["+Settings.get("relationid")+"]");
  }
});

Template.Profile.events({
  "click button[type=submit]": function(){
    Settings.set("relationid", $("#relationId").val());
    return false;
  } 
})