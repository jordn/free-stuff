// counter starts at 0
Session.setDefault("counter", 0);
Session.setDefault("appView", "feed");


Template.items.helpers({
  items: function () {
    console.log('rendering photos');
    return Items.find({}, {sort: {'createdAt': -1}});
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

})