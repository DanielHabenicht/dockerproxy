#! /usr/bin/env node
var commander = require('commander');
const configFile = require('./configFile');
const common = require('./common');
const dialog = require('./dialog');

commander.name('dockerproxy setup')
    .description(
        'Setup this command line tool in order to use it without options')
    .parse(process.argv);

// Throws Error if another argument is passed to the command
if (commander.args.length !== 0) {
  common.error(
      `This command does not accept any arguments.\nSee --help for a list of available options.`);
  process.exit(1);
}

if (configFile.isConfigured()) {
  dialog.overwrite().then(function(overwrite) {
    if (overwrite) {
      dialog.askForConfig(configFile.readConfig())
          .then(function(config) { configFile.writeConfig(config); });
    }
  });
} else {
  dialog.askForConfig().then(function(
      config) { configFile.writeConfig(config); });
}
