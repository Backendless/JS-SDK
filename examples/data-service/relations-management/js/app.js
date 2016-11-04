(function ($, H, bless) {
    var APP_ID = 'A9F6CF0B-6B7F-1403-FFF5-385DFD6D5000';
    var SECRET_KEY = '9E0406F0-0A91-4D41-FF4A-421A613DD300';
    var TABLE_NAME = 'Parent';
    var OBJECT_ID = '352292C3-9417-26BB-FF64-F434B1D91A00';

    var App = {
        ui: {
            'container': '.container',
            'searchForm': '#search-form',
            'searchField': '[name="search-field"]',
            'searchResults': '#search-results',
            'searchResultsContainer': '#search-results > .list-container',
            'followingList': '#following-list',
            'followingListContainer': '#following-list > .list-container',
            'followBtn': '#follow-btn'
        },

        templates: {
            'searchResults': '#search-results-template',
            'followingList': '#following-template',
            'progress': '#progress-template'
        },

        toBind: [
            'onInitState',
            'searchUsers',
            'renderFollowing',
            'renderSearchResults',
            'addFollowing',
            'declareRelation',
            'refreshFollowing'
        ],

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
            this.ui.searchForm.on('submit', this.searchUsers);
            this.ui.followBtn.on('click', this.addFollowing);
            // this.ui.deleteRelation.on('click', this.deleteRelation);
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
            return bless.Persistence.of(TABLE_NAME).deleteRelation(
                'following',
                TABLE_NAME,
                'one_to_many'
            );
        },

        onInitState: function () {
            this.ui.container.show();

            this.refreshFollowing();
        },

        searchUsers: function (e) {
            e.preventDefault();

            var searchQuery = this.ui.searchField.val();

            bless.Persistence.of(TABLE_NAME).find({
                condition: 'name like \'%' + searchQuery + '%\''
            }).then(this.renderSearchResults, this.onFail);
        },

        renderSearchResults: function (results) {
            this.ui.searchResults.show();
            this.ui.searchResultsContainer.html(this.templates.searchResults({results: results}));
        },

        addFollowing: function () {
            var list = this.ui.searchResults.find(':checked').map(function (el) {
                return $(el).id;
            });

            bless.Persistence.of(TABLE_NAME).addRelation(
                OBJECT_ID,
                'following',
                list
            ).then(this.refreshFollowing, console.error);
        },

        refreshFollowing: function () {
            this.ui.
            bless.Persistence.of(TABLE_NAME).loadRelations(OBJECT_ID).then(this.renderFollowing, this.onFail)
        },

        renderFollowing: function (list) {
            this.ui.followingList.show();
            this.ui.followingListContainer.html(this.templates.followingList({list: list}));
        },

        onFail: function (error) {
            console.error(error);
        }
    };

    App.init(APP_ID, SECRET_KEY);
})(jQuery, Handlebars, Backendless);