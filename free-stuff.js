Items = new Mongo.Collection("items");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
      MeteorCamera.getPicture({}, function(error, data) {
        Items.insert({photo: data});
        console.log(data);
        // callback(error, data)
      });
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
          // Save this somewhere
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
        });
      } else {
        console.log("Geolocation is bitchin'.");
      }
    }
  });

  Template.items.items = function () {
    console.log('rendering photos');
    return Items.find();
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
