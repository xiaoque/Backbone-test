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
            if (!this.get("content")) {
                this.set({"content": this.defaults().content, "title": "empty"});
            }
            else {
                this.set({"title": this.get("content").slice(0, 15)});
            }
        }

    });

    var TweetCollection = Backbone.Collection.extend({
        model: Tweet,

        url: 'http://localhost:8888/video/tweets_json.php?count=2&screen_name=fhollande&include_entities=false&include_rts=false',
        parse: function (response) {

            var response_text = response.text;
            return response_text;
        }
    });

    var tweets = new TweetCollection;

    var AppView = Backbone.View.extend({

        el: $("#tweets"),
        template: _.template($('#tweetsTemplate').html()),

        initialize: function(){
            var that = this;
            tweets.fetch({
                success: function(){
                    that.tweets.localStorage = new Backbone.LocalStorage("tweetList");
                    that.render();
                }
            });
        },

        render: function(){
            tweets.models.forEach(function(model){
                $(this.el).html(this.template( this.model.toJSON() ));
            });
        }

    });

    var app = new AppView;
    console.log("new view");
});