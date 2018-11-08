#! /usr/bin/env node
var cmd = require('node-cmd');
var commander = require('commander');
const configFile = require('./configFile');
const dialog = require('./dialog');
const common = require('./common')

console.log();

// Basic Setup
commander
  .name('dockerproxy')
  .version(require('./package.json').version, '-v, --version')
  .usage(`[options] <command>`)
  .on('--help', function () {
    console.log('');
    console.log('Examples:');
    console.log('  $ dockerproxy start   # Turn on the Docker Proxy');
    console.log('  $ dockerproxy stop    # Turn off the Docker Proxy');
  });

// Start Command
commander
  .command('start')
  .description('start proxying Docker-Containers')
  .action(function () {
    if (!configFile.isConfigured() && !commander.address && !commander.port) {
      common.error(
        `ERROR: No configuration given.\nEither provide proxy address via --proxy option or setup this command via:\n    $ dockerproxy setup`
      );
      process.exit(1);
    }
    var config = {};
    try {
      config = configFile.readConfig();
    } catch (err) { }
    startProxy(
      commander.address || config.proxyAddress,
      commander.port || config.proxyPort || 8080,
      commander.containerName || config.containerName || 'docker_proxy',
      commander.network || config.network || ''
    );
  });

// Stop Command
commander
  .command('stop')
  .description('stop proxying Docker-Containers')
  .action(function () {
    // if (!helpers.isConfigured() && !commander.address && !commander.port) {
    //   common.error(
    //     `ERROR: No configuration given.\nEither provide a container name via --containerName option or setup this command via:\n    $ dockerproxy setup`
    //   );

    // }
    var config = {};
    try {
      config = configFile.readConfig();
    } catch (err) { }
    stopProxy(commander.containerName || config.containerName || 'docker_proxy');
  });

// Setup Command
commander
  .command('setup')
  .description('setup this command tool in order to use it without options')
  .action(function () {
    if (configFile.isConfigured()) {
      dialog.overwrite().then(function (overwrite) {
        if (overwrite) {
          dialog.askForConfig(configFile.readConfig()).then(function (config) {
            configFile.writeConfig(config);
          });
        }
      });
    } else {
      dialog.askForConfig().then(function (config) {
        configFile.writeConfig(config);
      });
    }
  });

commander
  .command('reset')
  .description('reset the iptables Config, if the container was not stopped properly')
  .action(() => {
    cmd.get(`docker run --rm -it ubuntu 'iptables-save | grep -v REDSOCKS | iptables-restore'`);
  });

commander
  .command('config')
  .description('Print the config')
  .action(() => {
    console.log(`File located at: ${configFile.getSettingsPath()}`)
    console.log(configFile.readConfig());
  });

// Arguments
commander
  .option('-a, --address [domain]', 'proxy server address')
  .option('-p, --port [number]', 'proxy server port')
  .option('-n, --network <name>', 'docker network interface that should be proxied')
  .option('-w, --whitelistFile <path>', 'proxy server address')
  .option('--containerName <string>', 'proxy server Container Name')
  .on('command:*', function () {
    console.common.error(`Invalid command: ${commander.args.join(' ')}\nSee --help for a list of available commands.`);
    process.exit(1);
  })
  .parse(process.argv);



// Handle no arguments
if (commander.args.length === 0) {
  commander.help();
}

function startProxy(address, port, name, network) {
  console.log(`Starting Proxy-Container, this might take a moment...`);
  var command = '';
  if (network === '') {
    command = `docker run --rm --name ${name} --privileged=true --net=host -e DOCKER_NET -d ncarlier/redsocks ${address} ${port}`;
  } else {
    command = `docker run --rm --name ${name} --privileged=true --net=host -e DOCKER_NET=${network} -d ncarlier/redsocks ${address} ${port}`;
  }
  console.log(command);
  cmd.get(command, function (err, data, stderr) {
    if (err) {
      common.error(`Proxy could not be started:\n ${stderr}`);
      process.exit(1);
    }
    common.success(`Started Proxy for network "${network === '' ? 'ALL' : network}" to "${address}" with id: ${data}`);
    process.exit(0);
  });
}

function stopProxy(name) {
  cmd.get(`docker container stop ${name}`, function (err, data, stderr) {
    if (err) {
      common.error(`Proxy could not be stopped:\n ${stderr}`);
      process.exit(1);
    }
    common.success(`Proxy stopped.`);
    process.exit(0);
  });
}