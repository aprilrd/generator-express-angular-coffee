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
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic ExpressAngularCoffee generator.'));

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'What is the name of this project?'
    }];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.includeSass = true;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('src');
    this.mkdir('src/client');
    this.mkdir('src/server');
    this.mkdir('test');

    this.template('_gulpfile.coffee', 'gulpfile.coffee');
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
  },

  projectfiles: function () {

  }
});

module.exports = ExpressAngularCoffeeGenerator;