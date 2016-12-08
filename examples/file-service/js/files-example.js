(function (Backendless, $) {

    var APPLICATION_ID = '';
    var SECRET_KEY = '';
    var VERSION = 'v1';

    var DEVICE_ID = 'fileServiceTest';
    var TEST_FOLDER = 'testFolder';
    var files = [];

    if (!APPLICATION_ID || !SECRET_KEY || !VERSION)
        alert("Missing application ID and secret key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. Copy/paste the values into the Backendless.initApp call located in files-example.js");

    function init() {
        $('.carousel').carousel({interval: false});

        Backendless.enablePromises();
        Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);

        initHandlers();
    }

    function initHandlers() {
        $('#files').on('change', handleFileSelect);
        $('.thumbnails').on('click', '.thumbnail', onClickFileItem);
        $('#browse-uploaded-link').on('click', refreshItemsList);
        $('#upload-btn').on('click', uploadFile);
        $('#delete-btn').on('click', deleteSelectedFiles);
    }

    function protectXSS(val) {
        return val.replace(/(<|>|\/)/g, function (match) {
            return match == '<' ? '<' : match == '>' ? '>' : '/';
        });
    }

    function handleFileSelect(evt) {
        var output = [];
        for (var i = 0, f; f = evt.target.files[i]; i++) {
            output.push('<li><strong>', protectXSS(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
            files.push(f)
        }
        $('#list').append('<ul>' + output.join('') + '</ul>');
        $('#files').val('');
    }

    function FileItem() {
        this.url = '';
        this.deviceId = DEVICE_ID;
    }

    function createNewItem(fileUrl) {
        var record = new FileItem();
        record.url = fileUrl;

        return Backendless.Persistence.of(FileItem).save(record);
    }

    function deleteItem(id) {
        return Backendless.Persistence.of(FileItem).remove(id);
    }

    function onClickFileItem() {
        $(this).toggleClass('selectedThumbnail');
    }

    function refreshItemsList() {
        getItemsFromPersistance().then(function(result) { renderItems(result.data); });
    }

    function renderItems(items) {
        $('.thumbnails').empty();

        $.each(items, function (index, value) {
            var name = getRelativeFileName(value.url);
            var li = (
                '<li class="span4">' +
                '<div class="thumbnail">' +
                '<img class="dataPicture" id="' + value.objectId + '" src="' + value.url + '" alt=""/>' +
                '<div align="center">' +
                '<a href="' + value.url + '" >' + decodeURIComponent(protectXSS(name)) + '</a>' +
                '</div>' +
                '</div>' +
                '</li>'
            );

            $('.thumbnails').append(li);
        });
    }

    function getRelativeFileName(str) {
        var rest = str.substring(0, str.lastIndexOf(TEST_FOLDER + '/') + 1);
        return str.substring(str.lastIndexOf('/') + 1, str.length);
    }

    function getItemsFromPersistance() {
        return Backendless.Persistence.of(FileItem).find().catch(function (e) {
            alert(e.code == 1009 ? 'Please upload a file first' : e.message || e);
            return { data: [] };
        });
    }

    function uploadFile() {
        if (files.length === 0) {
            return;
        }

        $('#upload-btn').text('Uploading...');

        var requests = files.map(function (file) {
            return Backendless.Files.upload(file, TEST_FOLDER, true).then(
                function (result) {
                    return createNewItem(result.fileURL);
                }
            );
        });

        Promise.all(requests).then(
            function () {
                showInfo('Files successfully uploaded.');
                files = [];
                $('#list').empty();
            },
            function (err) {
                showInfo(err.message);
            }
        ).then(function(){
            $('#upload-btn').text('Upload File');
        });
    }

    function deleteSelectedFiles() {
        var $selectedElements = $('.selectedThumbnail img');

        if ($selectedElements.length === 0) {
            return;
        }

        var removeRequests = [];

        $('#delete-btn').text('Deleting...');

        $selectedElements.each(function (index, element) {
            removeRequests.push(Backendless.Files.remove(element.src).then(
                function () {
                    return deleteItem(element.id);
                }
            ));
        });

        Promise.all(removeRequests).then(
            function () {
                showInfo('Objects successfully removed.');
            },
            function (err) {
                showInfo(err.message)
            }
        ).then(function() {
            $('#delete-btn').text('Delete Files');
        });
    }

    function showInfo(text) {
        $('#message').text(text);
        var carousel = $('.carousel');
        carousel.carousel(2);
        carousel.carousel('pause');
    }

    $().ready(init);
})(Backendless, jQuery);