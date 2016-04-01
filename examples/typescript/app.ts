/// <reference path="node_modules/backendless/libs/backendless.d.ts" />

module MyApp {
    export var APP_ID:string = '19C421CA-F89C-E47A-FF71-E6D0666ECB00';
    var APP_KEY:string = 'A789016C-5894-3CD7-FFFC-CAC34ECBBD00';
    var APP_VER:string = 'v1';

    Backendless.initApp(APP_ID, APP_KEY, APP_VER);

    var user:Backendless.User = new Backendless.User();
    user.username = "michael@backendless.com";
    user.password = "my_super_password";

    try {
        Backendless.UserService.register(user);
    } catch (error) {
        console.log(error);
    }

    class Comment {
        constructor(public message:string, public authorEmail:string) {
        }
    }

    var dataStore:Backendless.DataStore = Backendless.Persistence.of(Comment);
    var commentObject:Comment = new Comment("I'm in", user.username);

    dataStore.save(commentObject);
    console.log(commentObject);
}