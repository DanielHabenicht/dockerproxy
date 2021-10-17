#! /usr/bin/env node
var cmd = require('node-cmd');
var commander = require('commander');
const configFile = require('./configFile');
const common = require('./common');
const defaults = require('./defaults');

commander
  .name('dockerproxy down')
  .option('--containerName <string>', 'proxy server Container Name', defaults.containerName)
  .parse(process.argv);

// Throws Error if another argument is passed to the command
if (commander.args.length !== 0) {
  common.error(`This command does not accept any arguments.\nSee --help for a list of available options.`);
  process.exit(1);
}

var config = {};
try {
  config = configFile.readConfig();
} catch (err) {}

stopProxy(commander.containerName || config.containerName);

function stopProxy(name) {
  cmd.run(`docker container stop ${name}`, function (err, data, stderr) {
    if (err) {
      common.error(`Proxy could not be stopped:\n${stderr}`);
      process.exit(1);
    }
    common.success(`Proxy stopped.`);
    process.exit(0);
  });
}
