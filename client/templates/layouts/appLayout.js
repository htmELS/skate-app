Template.appLayout.rendered = function () {
  Session.set('currentTab', 'competitionsList');
};

Router.configure({
  layoutTemplate: 'appLayout'
});

Template.registerHelper("favColor", () => Settings.get("color") || "#f8f8f8");
Template.registerHelper("favColorDarker", () => Settings.get("colorDarker") || "#b2b2b2");
