/// <reference path="../../node_modules/backendless/dist/backendless.d.ts" />

import {Component} from '@angular/core';
import {Platform, AlertController} from "ionic-angular";
import {StatusBar, Push, Splashscreen, Device} from "ionic-native";

import {HomePage} from '../pages/home/home';


import Backendless from "backendless";

const APP_ID: string = 'YOUR_APPLICATION_ID';
const APP_KEY: string = 'YOUR_APPLICATION_KEY';

Backendless.initApp(APP_ID, APP_KEY);

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  constructor(public platform: Platform,
              public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.initPushNotification();
    });
  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }

    Backendless.setupDevice({
      uuid: Device.uuid,
      platform: Device.platform,
      version: Device.version
    });

    let push = Push.init({
      android: {
        senderID: "YOUR_SENDER_ID"
      },
      ios: {
        alert: "true",
        badge: false,
        sound: "true"
      },
      windows: {}
    });

    push.on('registration', (data) => {
      Backendless.Messaging.registerDevice(data.registrationId).then(
        function () {
          alert("Registration done");
        },
        function() {
          alert("Oops. Something went wrong");
        }
      );
    });


    push.on('notification', (data) => {
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        console.log("Push notification clicked");
      }
    });

    push.on('error', (e) => {
      console.log(e.message);
    });
  }
}
