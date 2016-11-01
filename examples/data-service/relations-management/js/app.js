(function ($, bless) {
    var APP_ID = 'A976213F-6BFF-C715-FF75-A698FDEDEF00';
    var SECRET_KEY = '9E84C74A-0A11-B1BE-FFCA-9FE261BDA200';
    var parent = function () {
        this.child = null;
    };

    var App = {
        ui: {
            'declareForm': '#declare-form',
            'declareBtn': '#declare-relation-btn',
            'columnName': '[name="column-name"]',
            'relatedTableName': '[name="related-table-name"]',
            'cardinality': '[name="cardinality"]'
        },

        init: function (appId, sekretKey) {
            //bless.enablePromises();
            bless.initApp(appId, sekretKey);

            this.initUI();
            this.initEventHandlers();
        },

        initUI: function () {
            for (var key in this.ui) {
                this.ui[key] = $(this.ui[key]);
            }
        },

        initEventHandlers: function () {
            this.ui.declareForm.on('submit', this.declareNewRelation.bind(this));
            this.ui.declareBtn.on('click', this.declareNewRelation.bind(this));
        },

        declareNewRelation: function (e) {
            e.preventDefault();

            var colunmName = this.ui.columnName.val();
            var relatedTableName = this.ui.relatedTableName.val();
            var cardinality = this.ui.cardinality.val();

            bless.Persistence.of(parent).declareRelation(colunmName, relatedTableName, cardinality, new bless.Async(console.log,
                console.error));
        }
    };

    App.init(APP_ID, SECRET_KEY);
})(jQuery, Backendless);