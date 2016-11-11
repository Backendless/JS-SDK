(function ($, H, bless) {
    var APP_ID = 'A9F6CF0B-6B7F-1403-FFF5-385DFD6D5000';
    var SECRET_KEY = '9E0406F0-0A91-4D41-FF4A-421A613DD300';
    var TABLE_NAME = 'Parent';
    var OBJECT_ID = '352292C3-9417-26BB-FF64-F434B1D91A00';
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
            'onInitState',
            'search',
            'renderSubscriptions',
            'renderSearchResults',
            'addSubscriptions',
            'removeSubscription',
            'declareRelation',
            'onAddSubscriptionsSuccess',
            'onAddSubscriptionsError',
            'onRemoveSubscriptionsSuccess',
            'onRemoveSubscriptionsError'
        ],

        subscriptions: [],

        init: function (appId, sekretKey) {
            bless.enablePromises();
            bless.initApp(appId, sekretKey);

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
            this.ui.container.hide();
            this.ui.searchResults.hide();

            this.declareRelation().then(
                this.onInitState,
                this.onFail
            );
        },

        declareRelation: function () {
            return bless.Persistence.of(TABLE_NAME).declareRelation(
                COLUMN,
                TABLE_NAME,
                'one_to_many'
            );
        },

        onInitState: function () {
            this.ui.container.show();

            this.refreshSubscriptionsList();
        },

        search: function (e) {
            e.preventDefault();

            var searchQuery = this.ui.searchField.val();

            bless.Persistence.of(TABLE_NAME).find(
                bless.DataQueryBuilder.create().setWhereClause('name like \'%' + searchQuery + '%\'')
            ).then(this.renderSearchResults, this.onFail);
        },

        renderSearchResults: function (results) {
            var app = this;

            results = $.map(results, function(item) {
                item._subscribed = app.subscriptions.indexOf(item.objectId) !== -1

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

                bless.Persistence.of(TABLE_NAME).addRelation(
                    OBJECT_ID,
                    COLUMN,
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

                bless.Persistence.of(TABLE_NAME).deleteRelation(
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

            bless.Persistence.of(TABLE_NAME).loadRelations(
                OBJECT_ID,
                bless.LoadRelationsQueryBuilder.create().setRelationName('subscriptions')
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