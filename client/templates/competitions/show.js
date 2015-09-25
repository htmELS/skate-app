Template.CompetitionsShow.helpers({
  showButton: showButton,
  noButtonReason: function(){
    if(!this.subscribeStatus().isOpen)
      return this.subscribeText();
    if(this.distances(Settings.get("relationid")).length == 0)
      return "Geen beschikbare afstanden";
  },
  subscribeUrl: function(){
    if(Settings.get("relationid"))
      var a = "https://inschrijven.schaatsen.nl/#/wedstrijd/<id>/inschrijven/licentiehouder/<rela>"
        .replace("<id>", this.externalId)
        .replace("<rela>", Settings.get("relationid"));
    else
      var a = "https://inschrijven.schaatsen.nl/#/wedstrijd/<id>/inschrijven/kies-licentie"
        .replace("<id>", this.externalId);
        return a;
  },
  viewUrl: function(){
    return "https://inschrijven.schaatsen.nl/#/wedstrijd/<id>/informatie".replace("<id>", this.externalId);
  },
  distanceText: distanceText
});