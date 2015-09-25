Competition = class Competition {
  constructor(options){
    for(n in options){
      if(options.hasOwnProperty(n))
        this[n] = options[n];
    }
  }

  distances(relationId) {
    var settings = DistanceSettings.findOne({ relationId: relationId, competitionId: this.externalId });
    if(!settings || settings.lastSyncTimestamp < 1000 * 3600){
      Meteor.call("distanceSettings", this.externalId, relationId);
    }
    var possible = DistanceCombinations.findOne({ competitionId: this.externalId });
    if(!possible || possible.lastSyncTimestamp < 1000 * 3600){
      Meteor.call("distanceCombinations", this.externalId);
    }

    if (settings && possible && settings.combinations) {
      // All available settings for this user
      var existing = settings.combinations.distanceCombinations.map(c => ({ "id": c.distanceCombinationId, "max": c.allowedRegistrations }));
      // Filter combinations by settings
      var allowed = possible.combinations.filter(c => _.any(existing, a => a.id == c.id));

      return allowed;
    }

    return [];
  }

  subscribeStatus() {
    var time = Chronos.currentTime();
    var o = new Date(this.settings ? this.settings.opens : this.starts);
    var s = new Date(this.settings ? this.settings.closes : this.ends);
    return {
      willOpen: o > time,
      isOpen: o < time && s > time,
      isClosed: s < time,
      text: this.subscribeText(),
    };
  }

  subscribeText() {
    if(!this.settings)
      return "";

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
  }
}