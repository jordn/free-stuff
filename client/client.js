var appView = "feed",
 lat = lon = 0;

// counter starts at 0
Session.setDefault("lat", 0);
Session.setDefault("lon", 0);

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {

    Session.set("lat", position.coords.latitude);
    Session.set("lon", position.coords.longitude);
  });
}


Template.items.helpers({
  items: function () {
    console.log('rendering photos');

    var items = Items.find({}, {sort: {'createdAt': -1}});
    return _.map(items.fetch(), function (item) {
      function measure(lat1, lon1,lat2 , lon2){  // generally used geo measurement function
          var R = 6378.137; // Radius of earth in KM
          var dLat = (lat2 - lat1) * Math.PI / 180;
          var dLon = (lon2 - lon1) * Math.PI / 180;
          var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          var d = R * c;
          return d * 1000; // meters
      }
      item.distance = measure(item.lat, item.lon, parseFloat(Session.get('lat')), parseFloat(Session.get('lon')));
      return item;
    });
  }
});


Template.footer.events({
  'click button': function () {
    if (Meteor.user()) {
      console.log('logged in')
    } else {
      console.log('not logged in')
    }
  }
});

Template.itemAdd.helpers({
  photo: function() {
    Session.get('photo');
  }
});

Template.itemAdd.rendered = function() {
  MeteorCamera.getPicture({/*height, width, quality*/}, function(error, data) {
    if (!error) {
      console.log(error)
      console.log($('main'))
      console.log(document.getElementById('itemFeed'))

      // Session.set("appView", "itemSave");
      Session.set("photo", data);
    }
  });
};


    // var lat = lon = 0;

    // if ("geolocation" in navigator) {
    //   navigator.geolocation.getCurrentPosition(function(position) {
    //     lat = position.coords.latitude;
    //     lon = position.coords.longitude;
    //     Session.set("lat", lat);
    //     Session.set("lon", lon);
    //   });
    // } else {
    //   console.log("Geolocation is bitchin'.");
    // }


//   }
// });

Template.itemAdd.events({
  'submit form': function (event) {
    console.log('form submit')

    event.preventDefault();
    console.log($('#itemForm-description').val())


    item = Items.insert({
      seller: Meteor.user(),
      photo: $('#itemForm-photo').val(),
      lat: $('#itemForm-lat').val(),
      lon: $('#itemForm-lon').val(),
      description: $('#itemForm-description').val(),
      createdAt: new Date()
    });
    console.log(item);
    Blaze.remove(itemSaveModal)

  }, 'click .cancel': function (event) {
    Blaze.remove(itemSaveModal)

  }

});

Template.body.helpers({
  appView: function () {
    return Session.get('appView');
  },
  // Not used atm
  dataHelpers: function() {
    var data = UI._templateInstance().data || {};
    //Add the helpers onto the existing data (if any)
    _(data).extend({
      color: function() {
        return "#f00";
      }
    });
    return data;
  }
});
