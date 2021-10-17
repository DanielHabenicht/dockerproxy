#!/usr/bin/env bats
# Read the Docs: https://bats-core.readthedocs.io/en/stable/tutorial.html#your-first-test

CONFIG_PATH=~/docker-container-proxy-settings.json

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

@test "Show Help" {
  run dockerproxy help
  [ "$status" -eq 0 ]
  assert_output "Usage: dockerproxy [options] <command>

dockerproxy v0.0.0
>Proxy any Docker-Container

Options:
  -v, --version   output the version number
  -h, --help      display help for command

Commands:
  up|u            start proxying Docker-Containers
  down|d          stop proxying Docker-Containers
  config|c        Print the config
  setup|s         setup this command tool in order to use it without options
  help [command]  display help for command

Examples:
  $ dockerproxy up      # start the Docker Proxy
  $ dockerproxy down    # stop the Docker Proxy"
}

@test "Show Version Option 1" {
  run dockerproxy -v
  [ "$status" -eq 0 ]
  assert_output "0.0.0"
}

@test "Show Version Option 2" {
  run dockerproxy --version
  [ "$status" -eq 0 ]
  assert_output "0.0.0"
}

@test 'Config' {
  rm $CONFIG_PATH
  eval "run ./test/setup.exp"
  echo "status = ${status}"
  echo "output = ${output}"
  result_file="$(cat $CONFIG_PATH)"
  echo "result_file = ${result_file}"
  [[ "$result_file" == '{"proxyAddress":"test.domain.de","proxyPort":"8080","network":"","containerName":"docker_proxy"}' ]]
  [[ "$status" == 0 ]]
}

@test 'Config - Overwrite' {
  eval "run ./test/setup-overwrite.exp"
  echo "status = ${status}"
  echo "output = ${output}"
  result_file="$(cat $CONFIG_PATH)"
  echo "result_file = ${result_file}"
  [[ "$result_file" == '{"proxyAddress":"other.domain.de","proxyPort":"8080","network":"","containerName":"docker_proxy"}' ]]
  [[ "$status" == 0 ]]

}