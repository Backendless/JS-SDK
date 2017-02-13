import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import PushNotification from 'react-native-push-notification';

import DeviceInfo from 'react-native-device-info';

import Backendless from 'backendless';

const APP_ID = 'YOUR_APPLICATION_ID';
const APP_KEY = 'YOUR_APPLICATION_KEY';

Backendless.initApp(APP_ID, APP_KEY);

PushNotification.configure({

  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(device) {
    Backendless.setupDevice({
      uuid    : DeviceInfo.getUniqueID(),
      platform: device.os,
      version : DeviceInfo.getSystemVersion()
    });

    Backendless.registerDevice(device.token).then(
      function() {
        alert("Registration done");
      },
      function() {
        alert("Oops. Something went wrong");
      }
    );
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    alert('NOTIFICATION');
  },

  // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
  senderID: "YOUR_SENDER_ID",

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true,
});

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Backendless!
        </Text>
        <Text style={styles.instructions}>
          This simple example React-Native app for receiving a push-notification from Backendless Server.
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container   : {
    flex           : 1,
    justifyContent : 'center',
    alignItems     : 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome     : {
    fontSize : 20,
    textAlign: 'center',
    margin   : 10,
  },
  instructions: {
    textAlign   : 'center',
    color       : '#333333',
    marginBottom: 5,
  },
});