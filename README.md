# Dockerproxy

A little command line tool based on [ncarlier/redsocks](https://github.com/ncarlier/dockerfiles/tree/master/redsocks) to proxy all running docker containers, without the need to configure anything inside of them.

```
Usage: dockerproxy [options] <command>

Options:
  -v, --version               output the version number
  -p, --proxy [address]       proxy server address
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

## Debugging

Launch command with `node --inspect-brk dockerproxy.js setup` and follow this [guide](https://stackoverflow.com/a/47558970/9277073)
