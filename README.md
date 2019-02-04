# Welcome to Backendless!

[![npm version](https://img.shields.io/npm/v/backendless.svg?style=flat)](https://www.npmjs.com/package/backendless)
[![Build Status](https://img.shields.io/travis/Backendless/JS-SDK/4.0/master.svg?style=flat)](https://travis-ci.org/Backendless/JS-SDK)

In this document you will find the instructions for getting up and running with **Backendless** quickly. 
The SDK you downloaded contains a library with the APIs, which provide access to the Backendless services. 
These services enable the server-side functionality for developing and running mobile and desktop applications. 
Follow the steps below to get started with Backendless:

  * **Create Developer Account**. An account is required in order to create and manage your Backendless application. Registration form is available at [https://develop.backendless.com/registration][registration]
  * **Login**. Login to your account using Backendless Console at [https://develop.backendless.com/login][login]
  * **Locate Application ID and API Key**. The console is where you can manage the applications, their configuration settings and data. Before you start using any of the APIs, make sure to select an application in the console and open the “Manage” section. The “App Settings” screen contains the application ID and API keys, which you will need to use in your code.
  * **Examples**. The SDK includes several examples demonstrating some of the Backendless functionality. Each example must be configured with the application ID and API key generated for your application. Make sure to copy/paste these values into the following source code files:
  
    - User Service Register/Login Demo: `examples/user-service/simple-register-login/js/user-example.js`
    - User Service Social Login Demo: `examples/user-service/social-login/js/main.js`
    - Data Service TODO-App Demo: `examples/data-service/todo-app/js/app.js`
    - Data Service Relations Management Demo: `examples/data-service/relations-management/js/app.js`
    - Messaging Service Demo: `examples/messaging-service/chat/js/chat.js`  
    - Geo Service Demo: `examples/geo-service/citysearch/js/citysearch.js`  
    - File Service Demo: `examples/file-service/js/files-example.js`  
    - TypeScript Demo: `examples/typescript/app.ts`
---

## Installation
Use npm:
> npm i backendless

 or reference the library with the URLs below:
 
 Non-compressed library (mapped to the latest released version):
 > https://api.backendless.com/sdk/js/latest/backendless.js 
 
 Minified/compressed library:
 
 > https://api.backendless.com/sdk/js/latest/backendless.min.js
 
 TypeScript library:
 >https://api.backendless.com/sdk/js/latest/backendless.min.map
 https://api.backendless.com/sdk/js/latest/backendless.d.ts
 
## Documentation

You can find the Backendless documentation [on the website][documentation].

Check out the [Getting Started Guide][quick start] page for a quick overview.

## Help
Below are a few links to help with the development:

* [Documentation][documentation]
* [Support Home][support]
* [Slack Channel][slack]
* [Blog][blog]
* [YouTube Channel][youtube]
* [Facebook][facebook]
* [Twitter][twitter]

We would love to hear from you. Please let us know about your experiences using Backendless. 
You can reach us through the [support page][support] or email: [support@backendless.com](mailto:support@backendless.com)

Thank you and endlessly happy coding!  
The Backendless Team

[documentation]: https://backendless.com/products/documentation/
[support]: https://support.backendless.com
[slack]: https://slack.backendless.com
[blog]: https://backendless.com/blog
[youtube]: https://youtube.com/backendless
[facebook]: https://facebook.com/backendless
[twitter]: https://twitter.com/backendless
[login]: https://develop.backendless.com/login
[registration]: https://develop.backendless.com/registration
[quick start]: https://backendless.com/docs/js/quick_start_guide.html