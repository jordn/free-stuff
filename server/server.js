Meteor.publish('items', function() {
  return Items.find();
});

Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
        options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?width=200&height=200";
        user.profile = options.profile;
    }
    return user;
});