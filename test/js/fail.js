/**
 * Created by xiaoque on 4/30/14.
 */
$(function() {

    var Tweet = Backbone.Model.extend({
        defaults: function () {
            return {
                text: "",
                order: collection.nextOrder()
            };
        },

        initialize: function () {
            if (this.get("text")) {
                console.log("create "+ this.get("text"));
               // count = count+1;
                this.set({"title": this.get("text").slice(0, 15)});
            }
            else {
                this.set({"text": "empty", "title": "empty"});
            }
        }
    });


    var TweetCollection = Backbone.Collection.extend({
        model: Tweet,
        localStorage: new Backbone.LocalStorage("tweetList"),

     //   url: 'http://localhost:8888/video/learn/tweetOAuth/tweets_json.php?count=2&screen_name=fhollande&include_entities=false&include_rts=false',

        /*  url: 'js/data.json',
        parse: function(response){
            return _.map(response, function(obj) {
                var str = obj.text;
                obj = new Object();
                obj.text = str;
                return obj;
            });
            return response;
        }
        */


        fetchSuccess: function(collection, response){
            console.log(collection.length);
        },

        nextOrder: function(){
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },

        comparator: function(tweet) {
            return tweet.get('order');
        },

        find: function(text){
            return this.where({text: text});
        }
    });



    var TweetView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#tweetsTemplate').html()),

        events: {
            'dblclick label': 'edit',
            'keypress .edit': 'update',
            'blur .edit': 'close',
            'drop': 'drop'
        },

        initialize: function(){
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model,'destroy',this.remove);

        },

        drop: function(event, index){
            this.$el.trigger('update-sort', [this.model, index]);
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

    var collection = new TweetCollection();

    var AppView = Backbone.View.extend({

        el: $("#tweets"),

        events: {
            "keypress #tweet_text": "createTweet",
            'update-sort': 'updateSort'
        },

        initialize: function(){

            _.bindAll(this, 'add', 'addAll');
            this.input = this.$("#tweet_text");

            this.collection.bind('add', this.add);
            this.collection.bind('reset', this.addAll);
            var colle = this.collection;
            this.collection.fetch({
                success: function(){
                    var count = colle.length;
                    for(var i = 0; i < count; i++){
                        colle.models[i].set({"order": i});
                    }
                }
            });            /*{
                success: function(collection,response){
                    tweets.localStorage = new Backbone.LocalStorage("tweetList");
                    tweets.reset();
                    _.map(response, function(obj) {
                        tweets.create({text: obj.text});
                    });
                }
            }*/
        },

        add: function(tweet){
            var view = new TweetView({model: tweet});
            $("#sortable").append(view.render().el);
        },

        addAll: function(){
            this.collection.each(this.add, this);
        },

        createTweet:function(e){
            if (e.keyCode != 13) return;
            if (!this.input.val()) return;

            this.collection.create({text: this.input.val()});
            this.input.val('');
        },

        render: function(){
            $("#sortable").children().remove();
            this.addAll();
        },

        updateSort: function(event, model, position){
            var str = model.get("text");
            _.invoke(this.collection.find(str),'destroy');
            this.collection.create({text: str});
            var count = this.collection.length - position - 1;
            for(var i = 0; i< count; i++){
                var str = this.collection.models[position].get("text");
                _.invoke(this.collection.find(str),'destroy');
                this.collection.create({text:str});
            };
            var length = this.collection.length;
            for(var i = 0 ; i<length;i++){
            //    this.collection.models[i].set();
                this.collection.models[i].save({"order": i});
            }
        }

    });

    var app = new AppView({collection: collection});

    $(document).ready(function() {
        $('#sortable').sortable({
            stop: function (event, ui) {
                ui.item.trigger('drop', ui.item.index());
            }
        });
    });
});