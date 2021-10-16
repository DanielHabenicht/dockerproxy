#!/usr/bin/env bats
# Read the Docs: https://bats-core.readthedocs.io/en/stable/tutorial.html#your-first-test

setup() {
  # setup docker
  # start a container
  # so we can more easily try to access the proxied containers. 

    load 'test_helper/bats-support/load'
    load 'test_helper/bats-assert/load'
    # ... the remaining setup is unchanged

    # get the containing directory of this file
    # use $BATS_TEST_FILENAME instead of ${BASH_SOURCE[0]} or $0,
    # as those will point to the bats executable's location or the preprocessed file respectively
    DIR="$( cd "$( dirname "$BATS_TEST_FILENAME" )" >/dev/null 2>&1 && pwd )"
    # make executables in src/ visible to PATH
    PATH="$DIR/../src:$PATH"
}

@test "Is executable" {
  dockerproxy
}


@test "Show Help" {
   run dockerproxy
  assert_output "Usage: dockerproxy [options] <command>

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
  $ dockerproxy down    # stop the Docker Proxy"
}
