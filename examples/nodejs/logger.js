'use strict'
require('@babel/register')
const backendless = require('../../src')

// const APPLICATION_ID = ''
// const SECRET_KEY = ''

// backendless.initApp(APPLICATION_ID, SECRET_KEY);
const logger = backendless.Logging.getLogger('Foo')

setInterval(() => {
  console.log('add message')
  logger.info('test')
}, 500)

// const targetFolder = 'uploads';
// const fileName = 'foo.txt';
// const fileContent = Buffer.from('test test test');
//
// backendless.Files.saveFile(targetFolder, fileName, fileContent, true)
//   .then(console.log, console.error);