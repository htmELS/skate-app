Template.CompetitionsShow.helpers({
  "subscribeWillOpen": function(){
    var time = Chronos.currentTime();
    return new Date(this.settings.opens) > time;
  },
  "subscribeIsOpen": function(){
    var time = Chronos.currentTime();
    return new Date(this.settings.opens) < time && new Date(this.settings.closes) > time;
  },
  "subscribeClosed": function(){
    var time = Chronos.currentTime();
    return new Date(this.settings.closes) < time;
  }
});

Template.CompetitionsShow.helpers({
  subscribeUrl: function(){
    if(Settings.get("relationid"))
      var a = "https://inschrijven.schaatsen.nl/#/wedstrijd/<id>/inschrijven/licentiehouder/<rela>"
        .replace("<id>", this.externalId)
        .replace("<rela>", Settings.get("relationid"));
    else
      var a = "https://inschrijven.schaatsen.nl/#/wedstrijd/<id>/inschrijven/kies-licentie"
        .replace("<id>", this.externalId);
        console.log("url", a);
        return a;
  }
});