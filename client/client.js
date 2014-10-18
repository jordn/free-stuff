var appView = "feed"

// counter starts at 0
Session.setDefault("counter", 0);
Session.setDefault("appView", "feed");

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

Template.upload.helpers({
  counter: function () {
    return Session.get("counter");
  }
});

Template.items.helpers({
  items: function () {
    console.log('rendering photos');
    return Items.find({}, {sort: {'dateAdded': -1}});
  }
});

Template.upload.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set("counter", Session.get("counter") + 1);

    var lat = lon = 0;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        Session.set("lat", lat);
        Session.set("lon", lon);
      });
    } else {
      console.log("Geolocation is bitchin'.");
    }

    MeteorCamera.getPicture({/*height, width, quality*/}, function(error, data) {
      if (!error) {
        console.log(error)
        console.log($('main'))
        console.log(document.getElementById('itemFeed'))

        // Session.set("appView", "itemSave");
        // Session.set("photo", data);

        itemSaveModal = Blaze.renderWithData(Template.itemSave, {
          photo: data,
          lat: lat,
          lon: lon
        }, document.getElementById('itemFeed'))
      }
    });
  }
});

Template.itemSave.events({
  'submit form': function (event) {
    console.log('form submit')

    event.preventDefault();
    console.log($('#itemForm-description').val())


    item = Items.insert({
      photo: $('#itemForm-photo').val(),
      lat: $('#itemForm-lat').val(),
      lon: $('#itemForm-lon').val(),
      description: $('#itemForm-description').val(),
      dateAdded: new Date()
    });
    console.log(item);
    Blaze.remove(itemSaveModal)

  }, 'keypress input': function (event) {
    if (evt.which === 29/*escape*/) {
      Blaze.remove(itemSaveModal)
    }
  }, 'click .cancel': function (event) {
    Blaze.remove(itemSaveModal)

  }

})