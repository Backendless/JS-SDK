(function ($, H, Backendless) {
    var APP_ID = '';
    var SECRET_KEY = '';
    var TABLE_NAME = 'Parent';
    var OBJECT_ID = '';
    var COLUMN = 'subscriptions';

    var App = {
        ui: {
            'container': '.container',
            'searchForm': '#search-form',
            'searchField': '[name="search-field"]',
            'searchResults': '#search-results',
            'searchResultsContainer': '#search-results > .list-container',
            'subscriptionsList': '#subscriptions-list',
            'subscriptionsListContainer': '#subscriptions-list > .list-container'
        },

        templates: {
            'searchResults': '#search-results-template',
            'subscriptionsList': '#subscriptions-template',
            'progress': '#progress-template'
        },

        toBind: [
            'search',
            'renderSubscriptions',
            'renderSearchResults',
            'addSubscriptions',
            'removeSubscription',
            'onAddSubscriptionsSuccess',
            'onAddSubscriptionsError',
            'onRemoveSubscriptionsSuccess',
            'onRemoveSubscriptionsError'
        ],

        subscriptions: [],

        init: function (appId, secretKey) {
            Backendless.initApp(appId, secretKey);

            this.bindHandlers();
            this.compileTemplates();
            this.initUI();
            this.initEventHandlers();
            this.setInitialState();
        },

        bindHandlers: function () {
            var app = this;

            this.toBind.forEach(function (methodName) {
                app[methodName] = app[methodName].bind(app);
            });
        },

        compileTemplates: function () {
            for (var key in this.templates) {
                this.templates[key] = H.compile($(this.templates[key]).html());
            }
        },

        initUI: function () {
            for (var key in this.ui) {
                this.ui[key] = $(this.ui[key]);
            }
        },

        initEventHandlers: function () {
            this.ui.searchForm.on('submit', this.search);
            this.ui.container.on('click', '#subscribe-btn', this.addSubscriptions);
            this.ui.container.on('click', '#unsubscribe-btn', this.removeSubscription);
        },

        setInitialState: function () {
            this.ui.searchResults.hide();
            this.refreshSubscriptionsList();
        },

        search: function (e) {
            e.preventDefault();

            var searchQuery = this.ui.searchField.val();

            Backendless.Persistence.of(TABLE_NAME).find(
                Backendless.DataQueryBuilder.create().setWhereClause('name like \'%' + searchQuery + '%\'')
            ).then(this.renderSearchResults, this.onFail);
        },

        renderSearchResults: function (results) {
            var app = this;

            results = $.map(results, function(item) {
                item._subscribed = app.subscriptions.indexOf(item.objectId) !== -1;

                return item;
            });

            this.ui.searchResults.show();
            this.ui.searchResultsContainer.html(this.templates.searchResults({results: results}));
        },

        addSubscriptions: function () {
            var list = $.map(this.ui.searchResults.find(':checked'), function (el) {
                return el.id;
            });

            if (list.length) {
                $('#subscribe-btn').text('Subscribing...');

                Backendless.Persistence.of(TABLE_NAME).addRelation(
                    OBJECT_ID,
                    COLUMN + ':' + TABLE_NAME,
                    list
                ).then(this.onAddSubscriptionsSuccess, this.onAddSubscriptionsError);
            }
        },

        onAddSubscriptionsSuccess: function() {
            this.ui.searchField.val('');
            this.ui.searchResults.hide();
            this.refreshSubscriptionsList();
        },

        onAddSubscriptionsError: function(error) {
            $('#subscribe-btn').text('Subscribe');
            this.onFail(error);
        },

        removeSubscription: function (e) {
            var list = $.map(this.ui.subscriptionsList.find(':checked'), function (el) {
                return el.id;
            });

            if (list.length) {
                $('#unsubscribe-btn').text('Unsubscribing...');

                Backendless.Persistence.of(TABLE_NAME).deleteRelation(
                    OBJECT_ID,
                    COLUMN,
                    list
                ).then(this.onRemoveSubscriptionsSuccess, this.onRemoveSubscriptionsError);
            }
        },

        onRemoveSubscriptionsSuccess: function() {
            $('#unsubscribe-btn').text('Unsubscribe');
            this.refreshSubscriptionsList();
        },

        onRemoveSubscriptionsError: function(error) {
            $('#unsubscribe-btn').text('Unsubscribe');
            this.onFail(error);
        },

        refreshSubscriptionsList: function () {
            this.ui.subscriptionsListContainer.html(this.templates.progress());

            Backendless.Persistence.of(TABLE_NAME).loadRelations(
                OBJECT_ID,
                Backendless.LoadRelationsQueryBuilder.create().setRelationName('subscriptions')
            ).then(
                this.renderSubscriptions,
                this.onFail
            )
        },

        renderSubscriptions: function (list) {
            this.subscriptions = $.map(list, function (item) {
                return item.objectId;
            });

            this.ui.subscriptionsList.show();
            this.ui.subscriptionsListContainer.html(this.templates.subscriptionsList({list: list}));
        },

        onFail: function (error) {
            alert(error.message || error);
        }
    };

    App.init(APP_ID, SECRET_KEY);
})(jQuery, Handlebars, Backendless);