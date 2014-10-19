Meteor.startup(function() {
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
})


Template.items.helpers({
  items: function () {
    console.log('rendering photos');

    var items = Items.find({}, {sort: {'createdAt': -1}});
    return _.map(items.fetch(), function (item) {
      function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
          var R = 6378.137; // Radius of earth in KM
          var dLat = (lat2 - lat1) * Math.PI / 180;
          var dLon = (lon2 - lon1) * Math.PI / 180;
          var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          var d = R * c;
          return d.toFixed(1) ; // kilometers
      }
      item.distance = measure(item.lat, item.lon, parseFloat(Session.get('lat')), parseFloat(Session.get('lon')));

      if (Meteor.user() && item.seller._id === Meteor.user()._id) {
        console.log("owner")
        item.owner = true;
      }
      return item;
    });
  }
});

var saveThis = function(event, that) {
  if (that.owner) {
    console.log(event);
    console.log(that);
    var field = $(event.currentTarget);
    console.log(field);
    var propertyName = field.attr('field');
    var newValue = field.text();
    var update = {};
    update[propertyName] = newValue;
    console.log(update);
    var candidate = Items.update(that._id, {$set: update });
    field.value(newValue);
  }
}

Template.item.events({
  'blur [contenteditable="true"]': function (event) {
      saveThis(event, this);
  },
  'keydown [contenteditable="true"]': function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  },
})


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
    return Session.get('photo');
  },
  lat: function() {
    return Session.get('lat');
  },
  lon: function() {
    return Session.get('lon');
  },

});

Template.itemAdd.rendered = function() {
  MeteorCamera.getPicture({/*height, width, quality*/}, function(error, data) {
    if (!error) {
      console.log(error)
      console.log($('main'))
      console.log(document.getElementById('itemFeed'))
      Session.set("photo", data);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          Session.set("lat", lat);
          Session.set("lon", lon);
        });
      }
    }
  });
};


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
    delete Session.keys['photo'];

    Router.go('itemFeed');


  }, 'click .cancel': function (event) {
    Router.go('itemFeed')
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
