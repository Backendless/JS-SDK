'use strict';

const backendless = require('../../../es');

const APP1_CONFIG = {
  appId     : 'C67A040A-A03F-D24C-FF1B-5B22F2266800',
  apiKey    : 'ED1D09AA-F987-5FE9-FF49-A1D6B4F08F00',
  standalone: true
}

const APP2_CONFIG = {
  appId     : '2F61325B-B702-8FC3-FFFB-BB6CCC790400',
  apiKey    : '739E84AB-01CD-9342-FFBC-AF67D817E900',
  standalone: true
}

const app1 = backendless.initApp(APP1_CONFIG)
const app2 = backendless.initApp(APP2_CONFIG)

Promise.all([
  app1.Users.login('test@test', 'test'),
  app2.Users.login('test@test', 'test')
])
  .then(() => {
    console.log('App1 user-token: ', app1.getCurrentUserToken())
    console.log('App1 user-token: ', app2.getCurrentUserToken())
  })
  .then(() => Promise.all([
    app1.Data.of('Foo').find(),
    app2.Data.of('Foo').find()
  ]))
  .then(
    ([dataFromApp1, dataFromApp2]) => {
      console.log('Data from App1: ', dataFromApp1)
      console.log('Data from App2: ', dataFromApp2)
    },
    console.error
  )