
/*global jQuery, Handlebars */
jQuery(function( $ ) {
	'use strict';

	var Utils = {
		// https://gist.github.com/1308368
		uuid: function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b},
		pluralize: function( count, word ) {
			return count === 1 ? word : word + 's';
		}
	};

    //Backendless: defaults
    var Defaults = {
        APPLICATION_ID : '',
        SECRET_KEY : '',
        VERSION : 'v1'
    };

	var App = {
		init: function() {
            //Backendless: initialize API
            if( !Defaults.APPLICATION_ID || !Defaults.SECRET_KEY || !Defaults.VERSION )
                alert( "Missing application ID and secret key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. Copy/paste the values into the Backendless.initApp call located in app.js" );

            Backendless.initApp(Defaults.APPLICATION_ID, Defaults.SECRET_KEY, Defaults.VERSION);

			this.ENTER_KEY = 13;
			this.todos = getItems();
			this.cacheElements();
			this.bindEvents();
			this.render();
		},
		cacheElements: function() {
			this.todoTemplate = Handlebars.compile( $('#todo-template').html() );
			this.footerTemplate = Handlebars.compile( $('#footer-template').html() );
			this.$todoApp = $('#todoapp');
			this.$newTodo = $('#new-todo');
			this.$toggleAll = $('#toggle-all');
			this.$main = $('#main');
			this.$todoList = $('#todo-list');
			this.$footer = this.$todoApp.find('#footer');
			this.$count = $('#todo-count');
			this.$clearBtn = $('#clear-completed');
		},
		bindEvents: function() {
			var list = this.$todoList;
			this.$newTodo.on( 'keyup', this.create );
			this.$toggleAll.on( 'change', this.toggleAll );
			this.$footer.on( 'click', '#clear-completed', this.destroyCompleted );
			list.on( 'change', '.toggle', this.toggle );
			list.on( 'dblclick', 'label', this.edit );
			list.on( 'keypress', '.edit', this.blurOnEnter );
			list.on( 'blur', '.edit', this.update );
			list.on( 'click', '.destroy', this.destroy );
		},
		render: function() {
			this.$todoList.html( this.todoTemplate( this.todos ) );
			this.$main.toggle( !!this.todos.length );
			this.$toggleAll.prop( 'checked', !this.activeTodoCount() );
			this.renderFooter();
		},
		renderFooter: function() {
			var todoCount = this.todos.length,
				activeTodoCount = this.activeTodoCount(),
				footer = {
					activeTodoCount: activeTodoCount,
					activeTodoWord: Utils.pluralize( activeTodoCount, 'item' ),
					completedTodos: todoCount - activeTodoCount
				};

			this.$footer.toggle( !!todoCount );
			this.$footer.html( this.footerTemplate( footer ) );
		},
		toggleAll: function() {
			var isChecked = $( this ).prop('checked');
			$.each( App.todos, function( i, val ) {
				val.completed = isChecked;

                //Backendless: update all items
                saveItem(val);
			});
			App.render();
		},
		activeTodoCount: function() {
			var count = 0;
			$.each( this.todos, function( i, val ) {
				if ( !val.completed ) {
					count++;
				}
			});
			return count;
		},
		destroyCompleted: function() {
			var todos = App.todos,
				l = todos.length;
			while ( l-- ) {
				if ( todos[l].completed ) {
					todos.splice( l, 1 );
				}
			}
			App.render();
		},
		getTodo: function( elem, callback ) {
			var id = $( elem ).closest('li').data('id');
			$.each( this.todos, function( i, val ) {
				if ( val.id === id ) {
					callback.apply( App, arguments );
					return false;
				}
			});
		},
		create: function(e) {
			var $input = $(this),
				val = $.trim( $input.val() );
			if ( e.which !== App.ENTER_KEY || !val ) {
				return;
			}

            //Backendless: create new item
            createNewItem(val);

			$input.val('');
			App.render();
		},
		toggle: function() {
			App.getTodo( this, function( i, val ) {
				val.completed = !val.completed;

                //Backendless: update item
                saveItem(val);
			});
			App.render();
		},
		edit: function() {
			$(this).closest('li').addClass('editing').find('.edit').focus();
		},
		blurOnEnter: function( e ) {
			if ( e.keyCode === App.ENTER_KEY ) {
				e.target.blur();
			}
		},
		update: function() {
			var val = $.trim( $(this).removeClass('editing').val() );
			App.getTodo( this, function( i ) {
				if ( val ) {
					this.todos[ i ].title = val;

                    //Backendless: update item
                    saveItem(this.todos[ i ]);
				} else {
					this.todos.splice( i, 1 );
				}
				this.render();
			});
		},
		destroy: function() {
			App.getTodo( this, function( i ) {
                //Backendless: delete item
                deleteItem(this.todos[ i ]);

                this.todos.splice( i, 1 );
				this.render();
			});
		}
	};


    function Task() {
        this.id = "";
        this.title = "";
        this.completed = false;
    }

    function createNewItem(newTitle)
    {
        var record = new Task();
        record.id = Utils.uuid();
        record.title = newTitle;
        record.completed = false;

        var savedItem = saveItem(record);
        App.todos.push(savedItem);
    }

    function saveItem(item)
    {
        return Backendless.Persistence.of( Task ).save(item);
    }

    function deleteItem(item)
    {
        Backendless.Persistence.of( Task ).remove(item);
    }

    function getItems()
    {
        try
        {
            return Backendless.Persistence.of( Task ).find().data;
        }
        catch( e )
        {
            if( e.code != 1009 )
              alert(e.message);
        }

        return [];
    }

    App.init();
});