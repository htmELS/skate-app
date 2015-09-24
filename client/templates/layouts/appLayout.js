Template.appLayout.rendered = function () {
  Session.set('currentTab', 'competitionsList');
};

Router.configure({
  layoutTemplate: 'appLayout'
});