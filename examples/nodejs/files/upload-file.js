'use strict';

const backendless = require('../../../es');
const fs = require('fs');
const path = require('path');

const APPLICATION_ID = '';
const SECRET_KEY = '';

backendless.initApp(APPLICATION_ID, SECRET_KEY);

const fileSource = path.resolve(__dirname, './assets/test.txt');
const file = fs.createReadStream(fileSource);
const targetFolder = 'uploads';

backendless.Files.upload(file, targetFolder, true)
  .then(console.log, console.error);