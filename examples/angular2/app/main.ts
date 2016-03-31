import { bootstrap}    from 'angular2/platform/browser'
import { AppComponent } from './app.component'
import { Backendless } from 'backendless/libs/backendless';
import { Comment } from './comment'

var APP_ID:string = '19C421CA-F89C-E47A-FF71-E6D0666ECB00';
var APP_KEY:string = 'A789016C-5894-3CD7-FFFC-CAC34ECBBD00';
var APP_VER:string = 'v1';

Backendless.initApp(APP_ID, APP_KEY, APP_VER);

var user:Backendless.User = new Backendless.User();
user.username = 'michael@backendless.com';
user.password = "my_super_password";

try {
    Backendless.UserService.register(user);
} catch (error) {
    console.log(error);
}

var dataStore:BackendlessDataStore = Backendless.Persistence.of(Comment);
var commentObject:Comment = new Comment({message: "I'm in", authorEmail: user.username});

dataStore.save(commentObject);

bootstrap(<Function>AppComponent);