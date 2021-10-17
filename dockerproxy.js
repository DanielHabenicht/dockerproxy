#! /usr/bin/env node
var commander = require("commander");
const common = require("./common");

// Basic Setup
commander
  .name("dockerproxy")
  .version(require("./package.json").version, "-v, --version")
  .description(
    `dockerproxy v${
      require("./package.json").version
    }\n>Proxy any Docker-Container`
  )
  .usage(`[options] <command>`)
  .on("--help", function () {
    console.log("");
    console.log("Examples:");
    console.log("  $ dockerproxy up      # start the Docker Proxy");
    console.log("  $ dockerproxy down    # stop the Docker Proxy");
  })
  .command("up", "start proxying Docker-Containers")
  .alias("u")
  .command("down", "stop proxying Docker-Containers")
  .alias("d")
  .command("config", "Print the config")
  .alias("c")
  .command(
    "setup",
    "setup this command tool in order to use it without options"
  )
  .alias("s")
  // .command('reset')
  // .description('reset the iptables Config, if the container was not stopped
  // properly') .action(() => {
  //   cmd.get(`docker run --rm -it ubuntu 'iptables-save | grep -v REDSOCKS |
  //   iptables-restore'`);
  // })
  .parse(process.argv);

// Handle no arguments
if (commander.args.length === 0) {
  commander.help();
}
