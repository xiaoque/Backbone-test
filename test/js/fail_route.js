/**
 * Created by xiaoque on 4/30/14.
 */
$(function() {

    var Tweet = Backbone.Model.extend({
        defaults: function () {
            return {
                text: "empty"
            };
        },

        initialize: function () {
            if (this.get("text")) {
                console.log("create "+ this.get("text"));
                this.set({"title": this.get("text").slice(0, 15)});
            }
            else {
                this.set({"text": this.defaults().text, "title": "empty"});

            }
        }
    });


    var TweetCollection = Backbone.Collection.extend({
        model: Tweet,
        localStorage: new Backbone.LocalStorage("tweetList"),

        url: 'http://localhost:8888/video/learn/tweetOAuth/tweets_json.php?count=2&screen_name=fhollande&include_entities=false&include_rts=false',

        refreshFromServer: function(options){
            return Backbone.ajaxSync('read', this, options);
        }

    });



    var TweetView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#tweetsTemplate').html()),

        events: {
            'dblclick label': 'edit',
            'keypress .edit': 'update',
            'blur .edit': 'close'
        },

        initialize: function(){
            this.listenTo(this.model, 'change', this.render);

        },

        render: function() {
            this.$el.html( this.template( this.model.toJSON() ) );
            this.input = this.$('.edit');
            return this;
        },

        edit: function() {
            this.$el.addClass('editing');
            this.input.focus();
        },

        close: function() {
            var value = this.input.val().trim();

            if ( value ) {
                this.model.save({ text: value });
            }

            this.$el.removeClass('editing');
        },

        // If you hit `enter`, we're through editing the item.
        update: function( e ) {
            if (e.keyCode == 13) {
                this.close();
            }
        }

    });
    var AppView = Backbone.View.extend({

        el: $("#tweets"),

        initialize: function(){

            _.bindAll(this, 'add', 'addAll');
            var that = this;

            this.collection.bind('add', this.add);
            this.collection.bind('reset', this.addAll());
            var collection = this.collection;
            collection.refreshFromServer({success: function(response) {
                collection.reset(response);
                collection.each(function(model) {
                    model.save();
                });
            }});
        },

        add: function(tweet){
            var view = new TweetView({model: tweet});
            this.collection.add(tweet);
            $("#sortable").append(view.render().el);
        },

        addAll: function(){
            this.collection.each(this.add, this);
        },

        render: function(){
            this.addAll();
        }

    });

    var Router = Backbone.Router.extend({
        routes : {
            "" : "defaultRoute"
        },

        defaultRoute : function(){
            var tweets = new TweetCollection;
            var app = new AppView({collection: tweets});
        }
    });

    var appRouter = new Router();
    Backbone.history.start();
});