#!/usr/bin/env bats

@test "" {
  dockerproxy up
  [ "$status" -eq 1 ]
  [ "$output" = "Usage: dockerproxy [options] <command>

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
     $ dockerproxy down    # stop the Docker Proxy" ]
}

@test "addition using dc" {
  result="$(echo 2 2+p | dc)"
  [ "$result" -eq 4 ]
}