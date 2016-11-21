import { bootstrap } from 'angular2/platform/browser'
import { AppComponent } from './app.component'
import { Comment } from './comment'
import Backendless from 'backendless';

var APP_ID:string = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
var APP_KEY:string = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

Backendless.initApp(APP_ID, APP_KEY);

var user:Backendless.User = new Backendless.User();
user.email = 'michael@backendless.com';
user.password = "my_super_password";

var onError = function(error) {
    console.log(error);
};

var saveComment = function() {
    var dataStore:Backendless.DataStore = Backendless.Persistence.of(Comment);
    var commentObject:Comment = new Comment({message: "I'm in", authorEmail: user.username});

    dataStore.save(commentObject).then(function(result) {
        console.log(result);
    }, console.error);
};

Backendless.UserService.register(user).then(saveComment, onError);

bootstrap(<Function>AppComponent);