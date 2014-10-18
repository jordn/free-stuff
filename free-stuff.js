Items = new Mongo.Collection("items");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.upload.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.items.items = function () {
    console.log('rendering photos');
    return Items.find();
  }

  Template.upload.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);

      lat = lon = 0;

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
        });
      } else {
        console.log("Geolocation is bitchin'.");
      }

      MeteorCamera.getPicture({/*height, width, quality*/}, function(error, data) {
        if (!error) {
          Items.insert({
            photo: data,
            lat: lat,
            lon: lon
          });
        }
      });
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
