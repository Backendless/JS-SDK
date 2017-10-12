'use strict';

const backendless = require('../../../es');

const APPLICATION_ID = '';
const SECRET_KEY = '';

backendless.initApp(APPLICATION_ID, SECRET_KEY);

const targetFolder = 'uploads';
const fileName = 'foo.txt';
const fileContent = Buffer.from('test test test');

backendless.Files.saveFile(targetFolder, fileName, fileContent, true)
  .then(console.log, console.error);