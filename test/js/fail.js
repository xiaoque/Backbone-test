/**
 * Created by xiaoque on 4/30/14.
 */
$(function() {

    var Tweet = Backbone.Model.extend({
        defaults: function () {
            return {
                text: ""
            };
        },
        initialize: function () {
            if (this.get("text")) {
                console.log("create "+ this.get("text"));
                this.set({"title": this.get("text").slice(0, 15)});
            }
            else {
                this.set({"text": "empty", "title": "empty"});
            }
        }
    });


    var TweetCollection = Backbone.Collection.extend({
        model: Tweet,
      //  localStorage: new Backbone.LocalStorage("tweetList"),

        url: 'http://localhost:8888/video/learn/tweetOAuth/tweets_json.php?count=2&screen_name=fhollande&include_entities=false&include_rts=false',

        parse: function(response){
            return _.map(response, function(obj) {
                var str = obj.text;
                obj = new Object();
                obj.text = str;
                return obj;
            });
        }

    });

    var tweets = new TweetCollection();


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

            tweets.bind('add', this.add);
            tweets.bind('reset', this.addAll());
            tweets.fetch({
                success: function(collection,response){
                    tweets.localStorage = new Backbone.LocalStorage("tweetList");
                    tweets.reset();
                    _.map(response, function(obj) {
                        tweets.create({text: obj.text});
                    });
                }
            });
        },

        add: function(tweet){
            var view = new TweetView({model: tweet});
            $("#sortable").append(view.render().el);
        },

        addAll: function(){
            tweets.each(this.add, this);
        },

        render: function(){
            this.addAll();
        }

    });

    var app = new AppView();
});