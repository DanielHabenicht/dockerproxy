#! /usr/bin/env node
var cmd = require('node-cmd');
var commander = require('commander');
const configFile = require('./configFile');
const common = require('./common');
const defaults = require('./defaults');

commander
  .name('dockerproxy up')
  .option('-a, --address [domain]', 'proxy server address')
  .option('-p, --port [number]', 'proxy server port', defaults.proxyPort)
  .option('-n, --network <name>', 'docker network interface that should be proxied')
  .option('-w, --whitelistFile <path>', 'proxy server address')
  .option('--containerName <string>', 'proxy server Container Name', defaults.containerName)
  .parse(process.argv);

// Throws Error if another argument is passed to the command
if (commander.args.length !== 0) {
  common.error(
    `This command does not accept any arguments.\nSee --help for a list of available options.`
  );
  process.exit(1);
}

if (!configFile.isConfigured() && !commander.address && !commander.port) {
  common.error(
    `ERROR: No configuration given.\nEither provide proxy address via --proxy option or setup this command via:\n    $ dockerproxy setup`
  );
  process.exit(1);
}
var config = {};
try {
  config = configFile.readConfig();
} catch (err) {}
startProxy(
  commander.address || config.proxyAddress,
  commander.port || config.proxyPort || 8080,
  commander.containerName || config.containerName || 'docker_proxy',
  commander.network || config.network || ''
);

function startProxy(address, port, name, network) {
  console.log(`Starting Proxy-Container, this might take a moment...`);
  var command = '';
  if (network === '') {
    command = `docker run --rm --name ${name} --privileged=true --net=host -e DOCKER_NET -d ncarlier/redsocks ${address} ${port}`;
  } else {
    command = `docker run --rm --name ${name} --privileged=true --net=host -e DOCKER_NET=${network} -d ncarlier/redsocks ${address} ${port}`;
  }
  console.log(command);
  cmd.run(command, function (err, data, stderr) {
    if (err) {
      common.error(`Proxy could not be started:\n ${stderr}`);
      process.exit(1);
    }
    common.success(
      `Started Proxy for network "${
        network === '' ? 'ALL' : network
      }" to "${address}" with id: ${data}`
    );
    process.exit(0);
  });
}
