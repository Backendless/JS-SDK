(function (Backendless, $) {

    var APPLICATION_ID = '';
    var SECRET_KEY = '';
    var VERSION = 'v1';

    var DEVICE_ID = 'fileServiceTest';
    var TEST_FOLDER = 'testFolder';
    var files = [];

    if( !APPLICATION_ID || !SECRET_KEY || !VERSION )
        alert( "Missing application ID and secret key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. Copy/paste the values into the Backendless.initApp call located in FilesExample.js" );

    function init() {
        $('.carousel').carousel({interval: false});
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

        Backendless.Persistence.of(FileItem).save(record);
    }

    function deleteItem(id) {
        Backendless.Persistence.of(FileItem).remove(id);
    }

    function onClickFileItem() {
        $(this).toggleClass('selectedThumbnail');
    }

    function refreshItemsList() {
        var items = getItemsFromPersistance();

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
        var db = Backendless.Persistence.of(FileItem);
        try {
            return db.find();
        }
        catch (e) {
            if (e.code == 1009)
                alert('Please upload a file first');
            else
                alert(e.message);
        }

        return [];
    }

    function uploadFile() {
        var callback = {};

        callback.success = function (result) {
            createNewItem(result.fileURL);
            showInfo('File successfully uploaded. Path to download: ' + result.fileURL);
            files = [];
            $('#list').empty();
        };
        callback.fault = function (result) {
            showInfo(result.message);
        };

        try {
            Backendless.Files.upload(files, TEST_FOLDER, true, callback);
        } catch (e) {
            alert('Add some files to upload');
        }
    }

    function deleteSelectedFiles() {
        try {
            var num = 0;
            $('.selectedThumbnail img').each(function (index, value) {
                Backendless.Files.remove(value.src);
                deleteItem(value.id);

                num++;
            });
            if (num == 0)
                alert('Select files to delete');
            else
                showInfo('Objects successfully removed. Objects affected: ' + num);
        }
        catch (e) {
            showInfo(e.message);
        }
    }

    function showInfo(text) {
        $('#message').text(text);
        var carousel = $('.carousel');
        carousel.carousel(2);
        carousel.carousel('pause');
    }

    $().ready(init);
})(Backendless, jQuery);