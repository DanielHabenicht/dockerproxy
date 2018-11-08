#! /usr/bin/env node
var cmd = require('node-cmd');
var commander = require('commander');
const configFile = require('./configFile');
const common = require('./common');
const defaults = require('./defaults')
const dialog = require('./dialog');


commander
    .name('dockerproxy config')
    .description('Display the config')
    .parse(process.argv);

// Throws Error if another argument is passed to the command
if (commander.args.length !== 0) {
    common.error(`This command does not accept any arguments.\nSee --help for a list of available options.`);
    process.exit(1);
}

if (configFile.isConfigured()) {
    console.log(`File located at: ${configFile.getSettingsPath()}`)
    console.log(configFile.readConfig());
} else {
    console.log(`Not yet configured.`)
}


