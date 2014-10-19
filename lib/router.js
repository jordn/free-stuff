Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return Meteor.subscribe('items'); }

});

Router.onBeforeAction(function() {
  self = this;
  if (!Meteor.user()) {
    // if the user is not logged in, render the Login template
    this.render('signUp');
    console.log("MUST LOG IN")
  } else {
    // otherwise don't hold up the rest of hooks or our route/action function from running
  }
}, {
  only: ['itemAdd', 'item']
});

Router.map(function() {
  this.route('itemList', {path: '/'});
  this.route('item', {
    path: '/item/:_id',
    data: function() { return Items.findOne(this.params._id)}
  });
  this.route('itemAdd', {path: '/add'});
  this.route('signUp', {path: '/signup'});
});

Router.onBeforeAction('loading');
