var app = app || {};


$(function(){

	var Note = Backbone.Model.extend({
	    defaults: function(){
	        return {
	            content: "empty"
	        };
	    },

	    initialize: function(){
			if(!this.get("content")){
				this.set({"content": this.defaults().content});
			}
	    }
	});

	var NoteCollection = Backbone.Collection.extend({
	    model: Note,
	    localStorage: new Backbone.LocalStorage("namecolletion"),

	});

	var myNotes = new NoteCollection();

    var noteView = Backbone.View.extend({
        tagName: 'li',
        template: _.template( $('#item-template').html() ),

        events: {
            'dblclick label': 'edit',
            'keypress .edit': 'update',
            'blur .edit': 'close'
        },

        initialize: function(){
            this.listenTo(this.model, 'change', this.render);
        },

        // Re-renders the titles of the todo item.
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
                this.model.save({ content: value });
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

        el: $("#todoapp"),

        events: {
            "keypress #new-todo": "creates",
            "click #test": "clickbutton"
        },

        initialize: function(){
            _.bindAll(this, 'add','addAll');

            this.input = this.$("#new-todo");

            myNotes.bind('add', this.add);
            myNotes.bind('reset', this.addAll);
            myNotes.fetch();
        },

        add: function(note){
            var view = new noteView({model: note});
            $("#list").append(view.render().el);
        },

        addAll: function(){
            myNotes.each(this.add,this);
        },
        creates: function(e){
            if (e.keyCode != 13) return;
            if (!this.input.val()) return;

            myNotes.create({content: this.input.val()});
            this.input.val('');
        },

        clickbutton: function(e){
            if (!this.input.val()) return;
            myNotes.create({content: this.input.val()});
            this.input.val('');
        }

    });

    var app = new AppView;
    console.log("new view");

});