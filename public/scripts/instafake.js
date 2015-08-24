// instafake.js
// the hip way to to be....

var instafake = instafake || {};
instafake.blueprints = instafake.blueprints || {};  //classes and constructors
instafake.active = instafake.active || {};  //instantiated objects

// blueprints for models and collections
instafake.blueprints.model = Backbone.Model.extend({
  initialize: function() {
    console.log("a model is ready");
  }
});

instafake.blueprints.collection = Backbone.Collection.extend({
  url: '/api/instafake',
  model: instafake.blueprints.model,
  initialize: function() {
    console.log("a collection is ready");
    // first fetch once this is loaded
    this.fetch();
    this.on('change', function() {
      // keeping my collection up to date with the server
      this.fetch();
    });
  }
});


// Create (CRUD)
instafake.create = function(username, post, description, hashtags) {

  if (!username || !post || !description || !hashtags) return false;

  instafake.active.photosCollection.create({
    username: username,
    post: post,
    description: description,
    hashtags: hashtags
  });

  return true;
};
// blueprints for views

instafake.blueprints.collectionView = Backbone.View.extend({
  initialize: function() {
    this.$el = $('.instafakes');

    this.render();
    var that = this;
    this.collection.on('sync', function() {
      that.render();
    });
  },
  render: function() {
    this.$el.html('');

    var models = this.collection.models;

    for (var m in models) {
      var data = models[m];
      new instafake.blueprints.modelView({
        model: data
      });
    }
  }
});

instafake.blueprints.modelView = Backbone.View.extend({
  initialize: function() {
    this.$el = $('.instafakes');
    this.template = _.template($('#table-row-template').html());
    this.render();
  },
  render: function() {
    var data = this.model.attributes;
    this.$el.append(this.template(data));
  }
});

// events/trigger/everything else
$(document).ready(function() {
  instafake.active.photosCollection = new instafake.blueprints.collection();
  instafake.active.photosCollectionView = new instafake.blueprints.collectionView({
    collection: instafake.active.photosCollection
  });
  $('#add-instafake').on('click', function(event) {

    event.preventDefault();

    // grab real-time variables
    var username = $('#username').val();
    var post = $('#post').val();
    var description = $('#description').val();
    var hashtags = $('#hashtags').val();

    // use backbone collection to add to
    instafake.create(username, post, description, hashtags);
  });

  $('#refresh-instafake').on('click', function() {
    instafake.active.photosCollection.fetch();
  })
});
