# generator-ng-cordova [![Build Status](https://secure.travis-ci.org/exBerliners/generator-ng-cordova.png?branch=master)](https://travis-ci.org/exBerliners/generator-ng-cordova)

## Getting Started

### What is ng-cordova?

Since my creation of [https://github.com/lpaulger/timerApp](https://github.com/lpaulger/timerApp) I've been wanting to create an angular, phonegap/cordova generator for yeoman and here it is!

### Installation Steps
1. Install Yeoman
  
  ```
  $ npm install -g yo
  ```

2. Install the generator 
  
  ```
  $ npm install -g generator-ng-cordova
  ```

2. In the directory you want to install the app run 'yo ng-cordova'
3. follow the steps within the generator
4. You're done! just 'cd' into the application folder

### Post Installation

Once you've gone through the installation, you can start developing your app. 

Use 'grunt serve' to view the app in the browser (with livereload)
Use 'grunt run:android' to run on a device
Use 'grunt emulate:android' to run in an emulated device (assuming you've set one up)

### Get Involved

I'll keep expanding this project to be more flexible. I know other frameworks, tools and generators exist. for example check out [IonicFramework](ionicframework.com) for some powerful UI enhancements for angular and phonegap. I decide to stay away from this to help developers create their own UI experience. If you want a generator and the Ionic experience check out [generator-angular-cordova](https://www.npmjs.org/package/generator-angular-cordova).

I support unit tests! they are run [here](http://travis-ci.org/exBerliners/generator-ng-cordova) [![Build Status](https://secure.travis-ci.org/exBerliners/generator-ng-cordova.png?branch=master)](https://travis-ci.org/exBerliners/generator-ng-cordova). If you care to contribute make sure the tests pass locally by running
```
$ npm test
```

Best of luck!

## License

MIT
