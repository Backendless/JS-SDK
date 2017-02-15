Ionic 2 Push Notification Example
=================

This can be used as base template for Ionic 2 Push apps. It's working for both iOS and Android Push Notifications.
Notice that push notification can be received **only on physical android and iOS devices**.
  
## Tutorial
* [GCM Setup for Android Notifications](https://backendless.com/documentation/messaging/ios/messaging_push_notification_setup_androi.htm)
* [APNS Setup for IOS Notifications](https://backendless.com/documentation/messaging/ios/messaging_push_notification_setup_ios.htm)

## Getting Started

* Copy this project directory

* Install Ionic, cordova and node_modules

    ```bash
    $ npm install -g ionic cordova
    $ npm install
    ```

* Generate **SENDER_ID**
  
* _Replace **YOUR_SENDER_ID** in **config.xml and app.component.ts** with above **SENDER_ID**_

* _Replace **YOUR_APPLICATION_ID** and **YOUR_APPLICATION_KEY** by your app id and app key in **app.component.ts**

### Android

```bash
    $ ionic platform add android
    $ ionic build android
    $ ionic run android --device
```

### iOS
```bash
    $ ionic platform add ios
    $ ionic build ios --prod
```    
    Run using XCode

