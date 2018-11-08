[![npm version](https://badge.fury.io/js/docker-container-proxy.svg)](https://badge.fury.io/js/docker-container-proxy)
[![Build Status](https://travis-ci.org/DanielHabenicht/dockerproxy.svg?branch=master)](https://travis-ci.org/DanielHabenicht/dockerproxy)

# Dockerproxy

A little command line tool based on [ncarlier/redsocks](https://github.com/ncarlier/dockerfiles/tree/master/redsocks) to proxy all running docker containers, without the need to configure anything inside of them.

# Installation

```bash
npm i -g docker-container-proxy
```

> Run `dockerproxy setup` in order to never remember your proxy server address again..

## Interface

```
Usage: dockerproxy [options] <command>

Options:
  -v, --version               output the version number
  -a, --address [domain]      proxy server address
  -p, --port [number]         proxy server port
  -n, --network <name>        docker network interface that should be proxied
  -w, --whitelistFile <path>  proxy server address
  --containerName <string>    proxy server Container Name
  -h, --help                  output usage information

Commands:
  start                       start proxying Docker-Containers
  stop                        stop proxying Docker-Containers
  setup                       setup this command tool in order to use it without options
  reset                       reset the iptables Config, if the container was not stopped properly
  config                      Print the config

Examples:
  $ dockerproxy start   # Turn on the Docker Proxy
  $ dockerproxy stop    # Turn off the Docker Proxy
```

## Example

There are two ways of using this command line tool:

1. Recommended:
   - Configure the cli interactively for easier use later on (just type `dockerproxy setup`)
   - Use either `dockerproxy start` or `dockerproxy stop` for turning the proxy on and off.
2. For starting right away or usage in scripts:
   ```bash
   dockerproxy start --address company-proxy-address.com --port 8080
   ```
   > You can use `--network` to specify a docker interface that should get proxied. (by default all networks get proxied)

## Debugging

Launch command with `node --inspect-brk dockerproxy.js setup` and follow this [guide](https://stackoverflow.com/a/47558970/9277073)
