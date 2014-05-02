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
                this.set({"title": this.get("text").slice(0, 20)});
            }
            else {
                this.set({"text": "empty", "title": "empty"});
            }
        }
    });


    var TweetCollection = Backbone.Collection.extend({
        model: Tweet,
    //    localStorage: new Backbone.LocalStorage("tweetList"),

        url: 'http://localhost:8888/video/test/tweetOAuth/tweets_json.php?count=10&screen_name=fhollande',

        parse: function(response){
            return _.map(response, function(obj) {
                var str = obj.text;
                obj = new Object();
                obj.text = str;
                return obj;
            });
        },

        nextOrder: function(){
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },

        comparator: function(tweet) {
            return tweet.get('order');
        },

        //find all tweets that title contains the text
        find: function(text){
            var pattern = new RegExp(text);
            return this.filter(function(data){
                var title = data.get("title");
                return pattern.test(title);
            });
        },

        //give the models in collection right order
        reOrder: function(){
            var length = this.length;
            for(var i = 0; i<length ; i++){
                this.models[i].save({"order": i});
            }
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
                this.model.save({ text: value, title: value.slice(0,20)});
            }
            this.$el.removeClass('editing');
        },

        update: function( e ) {
            if (e.keyCode == 13) {
                this.close();
            }
        }

    });

    var SearchView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#searchTemplate').html()),

        render: function() {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        }

    });

    var collection = new TweetCollection();

    var AppView = Backbone.View.extend({

        el: $("#tweets"),

        events: {
            'update-sort': 'updateSort',
            "keypress #search_title": "search"
        },

        initialize: function(){

            _.bindAll(this, 'add', 'addAll');
            this.searchInput = $("#search_title");

            this.collection.bind('add', this.add);
            this.collection.bind('reset', this.addAll);
            var collec = this.collection;
         /*   this.collection.fetch({
                success: function(){
                    collec.reOrder();
                }
            });*/

            this.collection.fetch({
                success: function(collection,response){
                    collection.localStorage = new Backbone.LocalStorage("tweetList");
                    collection.reOrder();
                }
            });
        },

        render: function(){
            $("#sortable").children().remove();
            this.addAll();
        },
        
        add: function(tweet){
            var view = new TweetView({model: tweet});
            $("#sortable").append(view.render().el);
        },

        addAll: function(){
            this.collection.each(this.add, this);
        },

        clearSearch: function(){
            $("#side-bar").children().remove();
        },

        updateSort: function(event, model, position){

            this.collection.remove(model);
            var previousIndex = model.get("order");
            for(previousIndex ; previousIndex <= position ; previousIndex++){
                this.collection.models[previousIndex].save({"order": previousIndex});
            }
            this.collection.add(model,{at: position});
            this.collection.models[position].save({"order": position});
            this.render();
        },

        search: function(e){
            if (e.keyCode != 13) return;
            if (!this.searchInput.val()) return;

            this.clearSearch();
            var value = this.searchInput.val();
            var search = this.collection.find(value);
            _.map(search, function(obj){
                var view  = new SearchView({model: obj});
                $('#side-bar').append(view.render().el);
            });
        }

    });

    var app = new AppView({collection: collection});

    //set jQuery sortable and the trigger
    $(document).ready(function() {
        $('#sortable').sortable({
            stop: function (event, ui) {
                ui.item.trigger('drop', ui.item.index());
            }
        });
    });
});