/**
 * Created by xiaoque on 4/30/14.
 */
$(function() {

    var Tweet = Backbone.Model.extend({
        defaults: function(){
            return {
                content: "empty"
            };
        },

        initialize: function(){
            console.log(this.get("content"));
            if (this.get("content")){
                this.set({"title": this.get("content").slice(0, 15)});
            }
            else {
                this.set({"content": this.defaults().content, "title": "empty"});

            }
        }
    });


    var TweetCollection = Backbone.Collection.extend({
        model: Tweet,
     //   url: 'http://localhost:8888/video/learn/tweetOAuth/tweets_json.php?count=2&screen_name=fhollande&include_entities=false&include_rts=false',
        localStorage: new Backbone.LocalStorage("tweetList"),

    });

    var tweets = new TweetCollection();

    var TweetView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#tweetsTemplate').html()),

        render: function() {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        }
    });

    var AppView = Backbone.View.extend({

        el: $("#tweets"),

        events: {
            "keypress #tweet_text": "createTweet"
        },

        initialize: function(){

            _.bindAll(this, 'add', 'addAll');
            this.input = this.$("#tweet_text");

            tweets.bind('add', this.add);
            tweets.bind('reset', this.addAll);
            tweets.fetch();
        },

        add: function(tweet){
            var view = new TweetView({model: tweet});
            $("#sortable").append(view.render().el);
        },

        addAll: function(){
            tweets.each(this.add, this);
        },

        createTweet:function(e){
            if (e.keyCode != 13) return;
            if (!this.input.val()) return;

            tweets.create({content: this.input.val()});
            this.input.val('');
        }

    });

    var app = new AppView();
    console.log("new view");
});