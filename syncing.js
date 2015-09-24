if (Meteor.isServer) {
  DBSync.configure({
    remote_root: Meteor.settings.remote_sync_root,
    max_retries: 10,
    poll_length: 'every 10 minute',   // Later.js text
    restivus_options: { // Passed throuw to restivus
      use_default_auth: false
    } 
  });

  var competitionFields = ["id", "name", "starts", "ends", "discipline", "resultsStatus", "location", "extra", "sponsor", "class", "culture", "licenseIssuerId", "settings", "venue", "serie"];
  var competitionIn = competitionFields.reduce((memo, key) => { memo[key] = {mapTo: key}; return memo; }, {});
  competitionIn.id = {mapTo: "externalId"};

  DBSync.addCollection({ 
    collection: Competitions, 
    remote_external_id_field: "id",
    index: {
      route: "/competitions"
    }, 
    mapIn: competitionIn,
    write: false,
  });

  DBSync.start();
}