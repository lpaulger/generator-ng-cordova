'use strict';
var util = require('util');
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var cordovaCLI = require('cordova');
var plugman = require('plugman');
var chalk = require('chalk');

var NgCordovaGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }

      var enabledComponents = [];

      if (this.resourceModule) {
        enabledComponents.push('angular-resource/angular-resource.js');
      }

      if (this.cookiesModule) {
        enabledComponents.push('angular-cookies/angular-cookies.js');
      }

      if (this.sanitizeModule) {
        enabledComponents.push('angular-sanitize/angular-sanitize.js');
      }

      if (this.routeModule) {
        enabledComponents.push('angular-route/angular-route.js');
      }

      this.invoke('karma:app', {
        options: {
          coffee: this.options.coffee,
          travis: true,
          'skip-install': this.options['skip-install'],
          components: [
            'angular/angular.js',
            'angular-mocks/angular-mocks.js'
          ].concat(enabledComponents)
        }
      });
    });
  },

  greeting: function(){
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic NgCordova generator.'));

    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'Name your application',
      required: true
    },{
      type: 'confirm',
      name: 'coffee',
      message: 'Would you like to use CoffeeScript?',
      default: false
    },{
      type: 'confirm',
      name: 'compass',
      message: 'Would you like to use Sass (With Compass)?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.appname = props.appName;
      this.coffee = props.coffee;
      this.compass = props.compass;

      done();
    }.bind(this));
  },

  askForPlatforms: function () {
    var done = this.async();

    var platform = process.platform;

    var prompts = [{
      type: 'checkbox',
      name: 'platforms',
      message: 'Which platforms will you develop for',
      choices: [{
        value: 'ios',
        name: 'iOS',
        checked: (platform.indexOf("OSX") != -1)
      }, {
        value: 'android',
        name: 'Android',
        checked: true
      }]
    }];

    this.prompt(prompts, function (props) {
      this.platforms = props.platforms;
      done();
    }.bind(this));
  },

  askForPlugins: function () {
    var done = this.async();

    this.log(chalk.magenta('Here are some basic plugins by Cordova, for others please check out http://plugins.cordova.io/'));

    var plugins = [{
      type: 'checkbox',
      name: 'plugins',
      message: 'Which Cordova plugins would you like to use?',
      choices: [{
        value: 'org.apache.cordova.device',
        name: 'Device',
        checked: true
      },{
        value: 'org.apache.cordova.dialogs',
        name: 'Notification',
        checked: false
      },{
        value: 'org.apache.cordova.file',
        name: 'File',
        checked: false
      },{
        value: 'org.apache.cordova.geolocation',
        name: 'GeoLocation',
        checked: false
      }]
    }];

    this.prompt(plugins, function (props) {
      this.plugins = props.plugins;
      done();
    }.bind(this));
  },

  askForModules: function() {
    var cb = this.async();

    var modules = [{
      type: 'checkbox',
      name: 'modules',
      message: 'Which modules would you like to include?',
      choices: [{
        value: 'resourceModule',
        name: 'angular-resource.js',
        checked: true
      }, {
        value: 'cookiesModule',
        name: 'angular-cookies.js',
        checked: true
      }, {
        value: 'sanitizeModule',
        name: 'angular-sanitize.js',
        checked: true
      }, {
        value: 'routeModule',
        name: 'angular-route.js',
        checked: true
      }]
    }];

    this.prompt(modules, function (props) {
      var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
      this.resourceModule = hasMod('resourceModule');
      this.cookiesModule = hasMod('cookiesModule');
      this.sanitizeModule = hasMod('sanitizeModule');
      this.routeModule = hasMod('routeModule');

      var angMods = [];

      if (this.cookiesModule) {
        angMods.push("'ngCookies'");
      }

      if (this.resourceModule) {
        angMods.push("'ngResource'");
      }
      if (this.sanitizeModule) {
        angMods.push("'ngSanitize'");
      }
      if (this.routeModule) {
        angMods.push("'ngRoute'");
        this.env.options.ngRoute = true;
      }

      if (angMods.length) {
        this.env.options.angularDeps = '\n    ' + angMods.join(',\n    ') + '\n  ';
      }

      cb();
    }.bind(this));
  },

  createCordova: function(){
    console.log("Creating cordova app: " + this.appname);
    var cb = this.async();
    try {
        cordovaCLI.create(process.cwd() + '/' + this.appname, this.packagename, this.appname, function(){

          process.chdir(process.cwd() +'/' + this.appname);

          cb();
        }.bind(this));
    } catch (err) {
        console.error('Failed to create cordova proect: ' + err);
        process.exit(1);
    }
  },

  installPlugins: function(){
    function addPluginsToCordova(index, plugins, cb) {
      if (!(index < plugins.length)) {
          cb();
          return;
      }

      console.log('  Adding ' + plugins[index]);

      cordovaCLI.plugin('add', plugins[index], function () {
          addPluginsToCordova(index + 1, plugins, cb);
      });
    }
    console.log('Installing the Cordovplugins');

    var cb = this.async();

    if(this.plugins && this.plugins.length > 0) addPluginsToCordova(0, this.plugins, cb);
    else cb();
  },

   installPlatforms: function(){
    if (typeof this.platforms === 'undefined') {
        return;
    }

    function addPlatformsToCordova(index, platforms, cb) {
      if (!(index < platforms.length)) {
          cb();
          return;
      }

      console.log('  Adding ' + platforms[index]);

      try {
          cordovaCLI.platform('add', platforms[index], function () {
              addPlatformsToCordova(index + 1, platforms, cb);
          });
      } catch (err) {
          console.error('Failed to add platform ' + platforms['index'] + ': ' + err);
          process.exit(1);
      }
    }

    console.log('Adding requested platforms to the Cordova project');

    var cb = this.async();
    addPlatformsToCordova(0, this.platforms, cb);
  },

  app: function () {

    this.ngRoute = this.env.options.ngRoute;

    //delete cordova generated files
    fs.unlink('www/index.html');
    deleteFolderRecursive('www/css');
    deleteFolderRecursive('www/img');
    deleteFolderRecursive('www/js');

    this.template('_index.html', 'www/index.html');
    this.template('scripts/_init.js', 'www/scripts/init.js');
    this.template('scripts/_app.js', 'www/scripts/app.js');
    this.template('scripts/controllers/_MainCtrl.js', 'www/scripts/controllers/MainCtrl.js');
    this.copy('styles/_main.scss', 'www/styles/main.scss');
    this.template('views/_main.html', 'www/views/main.html');

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('Gruntfile.js', 'Gruntfile.js');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('bowerrc', '.bowerrc');
  }
});

module.exports = NgCordovaGenerator;

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};