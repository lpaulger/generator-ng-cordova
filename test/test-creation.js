/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('ng-cordova generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('ng-cordova:app', [
        '../../app', [
          helpers.createDummyGenerator(),
          'karma:app'
        ]
      ]);

      this.app.options['skip-install'] = true;
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      'www/index.html',
      'www/views/main.html',
      'www/scripts/controllers/MainCtrl.js',
      'www/scripts/init.js',
      'www/scripts/app.js',
      'www/styles/main.scss',
      '.bowerrc',
      '.editorconfig',
      '.jshintrc',
      'bower.json',
      'config.xml',
      'Gruntfile.js',
      'package.json'
    ];

    helpers.mockPrompt(this.app, {
      appName: ['testApp'],
      coffee: [false],
      compass: [true],
      platforms: [],
      plugins: [],
      modules: []
    });

    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
