/// <reference path="node_modules/backendless/libs/backendless.d.ts" />

module MyApp {
    var APP_ID:string =  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    var APP_KEY:string = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    var APP_VER:string = 'v1';

    Backendless.initApp(APP_ID, APP_KEY, APP_VER);

    var user:Backendless.User = new Backendless.User();
    user.email = "michael@backendless.com";
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