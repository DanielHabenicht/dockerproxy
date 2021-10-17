[![npm version](https://badge.fury.io/js/docker-container-proxy.svg)](https://badge.fury.io/js/docker-container-proxy)
[![Build Status](https://travis-ci.org/DanielHabenicht/dockerproxy.svg?branch=master)](https://travis-ci.org/DanielHabenicht/dockerproxy)

# Dockerproxy

A little command line tool based on
[ncarlier/redsocks](https://github.com/ncarlier/dockerfiles/tree/master/redsocks)
to proxy all running docker containers, without the need to configure anything
inside of them.

# Installation

```bash
npm i -g docker-container-proxy
```

> Run `dockerproxy setup` in order to never remember your proxy server address
> again..

## Interface

```
Usage: dockerproxy [options] <command>

Proxy any Docker-Container

Options:
  -v, --version  output the version number
  -h, --help     output usage information

Commands:
  up|u           start proxying Docker-Containers
  down|d         stop proxying Docker-Containers
  config|c       Print the config
  setup|s        setup this command tool in order to use it without options
  help [cmd]     display help for [cmd]

Examples:
  $ dockerproxy up      # start the Docker Proxy
  $ dockerproxy down    # stop the Docker Proxy
```

### Up

```
Usage: dockerproxy up [options]

Options:
  -a, --address [domain]      proxy server address
  -p, --port [number]         proxy server port (default: "8080")
  -n, --network <name>        docker network interface that should be proxied
  -w, --whitelistFile <path>  proxy server address
  --containerName <string>    proxy server Container Name (default: "docker_proxy")
  -h, --help                  output usage information
```

### Down

```
Usage: dockerproxy down [options]

Options:
  --containerName <string>  proxy server Container Name (default: "docker_proxy")
  -h, --help                output usage information
```

### Setup

```
Usage: dockerproxy setup [options]

Setup this command line tool in order to use it without options

Options:
  -h, --help  output usage information
```

### Config

```
Usage: dockerproxy config [options]

Display the config

Options:
  -h, --help  output usage information
```

## Example

There are two ways of using this command line tool:

1. Recommended:
   - Configure the cli interactively for easier use later on (just type
     `dockerproxy setup`)
   - Use either `dockerproxy up` or `dockerproxy down` for starting or stopping
     the proxy.
2. For starting right away or usage in scripts:
   ```bash
   dockerproxy start --address company-proxy-address.com --port 8080
   ```
   > You can use `--network` to specify a docker interface that should get
   > proxied. (by default all networks get proxied)

## Development and Debugging

1. Clone the repository and including the submodules
   (`git submodule update --init --recursive`)
1. Launch command with `node --inspect-brk dockerproxy.js setup`.
   1. Follow this [guide](https://stackoverflow.com/a/47558970/9277073).
   2. Launch `Attach to Remote` Debug Task in VSCode.

## Testing

Install bats (`npm i -g bats`) and expect (`sudo apt-get install expect`).
Simply run `npm run test` afterwards.
