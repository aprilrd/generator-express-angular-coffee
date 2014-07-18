'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var ExpressAngularCoffeeGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.testFramework = 'mocha';
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var prompts, done;
    done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic ExpressAngularCoffee generator.'));

    if (this.options['project-name']) {
      prompts = [{
        type: 'confirm',
        name: 'includeClient',
        message: 'Do you want client side facing files in this project?',
        default: false
      }];
    } else {
      prompts = [{
        type: 'input',
        name: 'projectName',
        message: 'What is the name of this project?'
      },
      {
        type: 'confirm',
        name: 'includeClient',
        message: 'Do you want client side facing files in this project?',
        default: false
      }];
    }

    this.prompt(prompts, function (props) {
      if (this.options['project-name']) {
        this.projectName = this.options['project-name'];
      } else {
        this.projectName = props.projectName;
      }
      this.includeClient = props.includeClient;

      var projectNameRegexp = new RegExp(this.projectName + '$');
      if (projectNameRegexp.test(process.cwd())) {
        done();
      } else {
        this.prompt([{
          type: 'confirm',
          name: 'differentDirName',
          message: 'Your project name is ' + this.projectName + '. But your directory is at ' + process.cwd() + '. Are you sure about using this directory?',
          default: false
        }], function (props) {
          if (props.differentDirName) {
            done();
          } else {
            done(new Error('Use new directory name'));
          }
        })
      }
    }.bind(this));
  },

  app: function () {
    this.mkdir('server');
    this.template('server/_app.coffee', 'server/app.coffee');
    this.mkdir('server/adapters');
    this.mkdir('server/config');
    this.copy('server/config/config.coffee', 'server/config/config.coffee');
    this.copy('server/config/routes.coffee', 'server/config/routes.coffee');
    this.mkdir('server/controllers');
    this.mkdir('server/domains');
    this.mkdir('server/models');
    this.mkdir('server/middlewares');
    this.mkdir('server/views');

    this.mkdir('test');
    this.copy('test/mocha.opts');

    if (this.includeClient) {
      this.mkdir('app');
      this.mkdir('app/assets');
      this.mkdir('app/html');
      this.template('app/html/_index.html', 'app/html/index.html');
      this.mkdir('app/html/views');
      this.mkdir('app/scripts');
      this.mkdir('app/scripts/controllers');
      this.mkdir('app/scripts/services');
      this.copy('app/scripts/app.coffee', 'app/scripts/app.coffee');
      this.copy('app/scripts/config.coffee', 'app/scripts/config.coffee');
      this.mkdir('app/styles');
      this.mkdir('app/styles/views');
      this.mkdir('karma-test');
    }
  },

  projectfiles: function () {
    this.copy('.gitignore');
    this.copy('gulpfile.js');
    this.template('_gulpfile.coffee', 'gulpfile.coffee');
    this.template('_package.json', 'package.json');

    if (this.includeClient) {
      this.template('_bower.json', 'bower.json');
    }
  }
});

module.exports = ExpressAngularCoffeeGenerator;
