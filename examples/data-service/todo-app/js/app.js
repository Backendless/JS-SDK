
/*global jQuery, Handlebars */
jQuery(function($) {
  'use strict';

  var Utils = {
    // https://gist.github.com/1308368
    uuid     : function(a, b) {
      for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(
        16) : '-');
      return b
    },
    pluralize: function(count, word) {
      return count === 1 ? word : word + 's';
    }
  };

    //Backendless: defaults
    var Defaults = {
        APPLICATION_ID : '',
        SECRET_KEY : ''
    };

  var App = {
    init: function() {
      //Backendless: initialize API
      if (!Defaults.APPLICATION_ID || !Defaults.SECRET_KEY) {
        alert(
          "Missing application ID or secret key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. Copy/paste the values into the Backendless.initApp call located in app.js");
      }

      Backendless.initApp(Defaults.APPLICATION_ID, Defaults.SECRET_KEY);

      var self = this;

      var onGetTodosSuccess = function(todos) {
        self.todos = todos;

        self.cacheElements();
        self.bindEvents();
        self.render();
      };

      this.ENTER_KEY = 13;
      getItems().then(onGetTodosSuccess);
    },

    cacheElements: function() {
      this.todoTemplate = Handlebars.compile($('#todo-template').html());
      this.footerTemplate = Handlebars.compile($('#footer-template').html());
      this.$todoApp = $('#todoapp');
      this.$newTodo = $('#new-todo');
      this.$toggleAll = $('#toggle-all');
      this.$main = $('#main');
      this.$todoList = $('#todo-list');
      this.$footer = this.$todoApp.find('#footer');
    },

    bindEvents: function() {
      var list = this.$todoList;
      var footer = this.$footer;

      this.$newTodo.on('keyup', this.create);
      this.$toggleAll.on('change', this.toggleAll);

      footer.on('click', '#clear-completed', this.destroyCompleted);
      footer.on('click', '#complete-all', this.completeAll);

            list.on('change', '.toggle', this.toggle);
            list.on('dblclick', 'label', this.edit);
            list.on('keypress', '.edit', this.blurOnEnter);
            list.on('blur', '.edit', this.update);
            list.on('click', '.destroy', this.destroy);
        },

        render: function() {
            this.$todoList.html(this.todoTemplate({todos: this.todos}));
            this.$main.toggle(!!this.todos.length);
            this.$toggleAll.prop('checked', !this.activeTodoCount());
            this.renderFooter();
        },

        renderFooter: function() {
            var todoCount       = this.todos.length,
                activeTodoCount = this.activeTodoCount(),
                footer          = {
                    activeTodoCount: activeTodoCount,
                    activeTodoWord : Utils.pluralize(activeTodoCount, 'item'),
                    completedTodos : todoCount - activeTodoCount
                };

      this.$footer.toggle(!!todoCount);
      this.$footer.html(this.footerTemplate(footer));
    },

    toggleAll: function() {
      var isChecked = $(this).prop('checked');
      $.each(App.todos, function(i, val) {
        val.completed = isChecked;

        //Backendless: update all items
        saveItem(val);
      });
      App.render();
    },

    activeTodoCount: function() {
      var count = 0;
      $.each(this.todos, function(i, val) {
        if (!val.completed) {
          count++;
        }
      });
      return count;
    },

    destroyCompleted: function() {
      Backendless.Persistence.of(Task).bulkDelete("completed=true").then(function() {
          App.todos = App.todos.filter(function(todo) {
            return !todo.completed;
          });
          App.render();
        }, console.error
      );
    },

    completeAll: function() {
      Backendless.Persistence.of(Task).bulkUpdate({completed: true}, "completed=false").then(function() {
        App.todos = App.todos.map(function(todo) {
          todo.completed = true;
          return todo;
        });
        App.render();
      }, console.error);
    },

    getTodo: function(elem, callback) {
      var id = $(elem).closest('li').data('id');

      $.each(this.todos, function(i, val) {
        if (val.id === id) {
          callback.apply(App, arguments);
          return false;
        }
      });
    },

    create : function(e) {
      var $input = $(this),
          val    = $.trim($input.val());
      if (e.which !== App.ENTER_KEY || !val) {
        return;
      }

      //Backendless: create new item
      createNewItem(val);

      $input.val('');
      App.render();
    },

    toggle: function() {
      App.getTodo(this, function(i, val) {
        val.completed = !val.completed;

        //Backendless: update item
        saveItem(val);
      });
      App.render();
    },

    edit: function() {
      $(this).closest('li').addClass('editing').find('.edit').focus();
    },

    blurOnEnter: function(e) {
      if (e.keyCode === App.ENTER_KEY) {
        e.target.blur();
      }
    },

    update: function() {
      var val = $.trim($(this).removeClass('editing').val());

      App.getTodo(this, function(i) {
        if (val) {
          this.todos[i].title = val;

          //Backendless: update item
          saveItem(this.todos[i]).then(function() {
            App.render();
          }, console.error);
        } else {
          this.todos.splice(i, 1);
        }
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


  function Task(title) {
    this.id = Utils.uuid();
    this.title = title || "";
    this.completed = false;
  }

  function createNewItem(newTitle) {
    var record = new Task(newTitle);

    saveItem(record).then(function(savedItem) {
      App.todos.push(savedItem)
    }, console.error);
  }

  function saveItem(item) {
    return Backendless.Persistence.of(Task).save(item);
  }

  function deleteItem(item) {
    return Backendless.Persistence.of(Task).remove(item);
  }

  function getItems() {
    return Backendless.Persistence.of(Task).find().then(function(todos) {
      return todos;
    }, function(error) {
      if (error.code != 1009) {
        alert(error.message);
      }
    });
  }

  App.init();
});