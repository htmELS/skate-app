Competition.list = function(venueName, after, before) {

  var filter = venueName ? { "venue.name": venueName } : {};
  var fBegin = { "ends": { "$gte": after } };
  var fEnd   = { "starts": { "$lte": before } };
  var filters = [ filter, fBegin, fEnd ];

  var competitions = Competitions.find(_.extend({}, filter, fBegin, fEnd), { sort: {starts: 1} }).fetch();
  var forwards = Competitions.find(_.extend({}, filter, { "starts": { "$gt": before } }), { sort: {starts: 1}, limit: 20, fields: {starts: 1} }).map(c => c.starts);
  var backward = Competitions.find(_.extend({}, filter, { "ends": { "$lt": after } }), { sort: {starts: -1}, limit: 20, fields: {ends: 1} }).map(c => c.ends);

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
    "more": forwards.length && forwards[forwards.length-1],
    // Continuation backward
    "less": backward.length && backward[backward.length-1]
  };

}