import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Backendless from 'backendless';

import { AppModule } from './app.module';
import { Comment } from './comment'

const APP_ID: string = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const APP_KEY: string = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

Backendless.initApp(APP_ID, APP_KEY);

const user: Backendless.User = new Backendless.User();
user.email = 'david@bowie.com';
user.password = "im_a_blackstar";

const onError = function (error) {
    console.log(error);
};

const saveComment = function () {
    const dataStore: Backendless.DataStore = Backendless.Persistence.of(Comment);
    const commentObject: Comment = new Comment({ message: "I'm in", authorEmail: user.username });

    dataStore.save(commentObject)
        .then(result => {
            console.log(result);
        }, error => {
            console.error(error);
        });
};

Backendless.UserService.register(user).then(saveComment, onError);

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);