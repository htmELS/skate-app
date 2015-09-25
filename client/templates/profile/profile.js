Template.Profile.helpers({
  relationId: () => { return Settings.get("relationid") },
  color: () => { return Settings.get("color") },
  profile: () => {
    var l = Licenses.findOne({ key: Settings.get("relationid") });
    if(!l) 
      Meteor.call("userProfile", Settings.get("relationid"));
    return l;
  }
});

Template.Profile.events({
  "click button[type=submit]": function(){
    Settings.set("relationid", $("#relationId").val());
    return false;
  },
  "click .color-pick": function(event){
    var style = getComputedStyle(event.currentTarget);
    Settings.set("color", style.backgroundColor);
    Settings.set("colorDarker", style.borderColor);
  }
})