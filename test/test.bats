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
  assert_success
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
  assert_success
  assert_output "0.0.0"
}

@test "Show Version Option 2" {
  run dockerproxy --version
  assert_success
  assert_output "0.0.0"
}

@test 'Config' {
  bash -c "rm $CONFIG_PATH || true"
  eval "run ./test/setup.exp"
  assert_success
  echo "status = ${status}"
  echo "output = ${output}"
  result_file="$(cat $CONFIG_PATH)"
  echo "result_file = ${result_file}"
  [[ "$result_file" == '{"proxyAddress":"test.domain.de","proxyPort":"8080","network":"","containerName":"docker_proxy"}' ]]
}

@test 'Config - Overwrite' {
  eval "run ./test/setup-overwrite.exp"
  assert_success
  echo "status = ${status}"
  echo "output = ${output}"
  result_file="$(cat $CONFIG_PATH)"
  echo "result_file = ${result_file}"
  [[ "$result_file" == '{"proxyAddress":"other.domain.de","proxyPort":"8080","network":"","containerName":"docker_proxy"}' ]]
}

@test 'Up' {
  run dockerproxy up
  assert_success
  assert_line "Starting Proxy-Container, this might take a moment..."
  assert_line "docker run --rm --name docker_proxy --privileged=true --net=host -e DOCKER_NET -d ncarlier/redsocks other.domain.de 8080"
  assert_line --partial 'Started Proxy for network "ALL" to "other.domain.de" with id:'
}

# @test 'Up - Already' {
#   # TODO: Add Detection if container is already up
#   run dockerproxy up
#   assert_success
#   assert_output "Proxy is already running"
# }

# TODO: Add docker exec command to check if the proxy really applies


@test 'Down' {
  run dockerproxy down
  assert_success
  assert_output "Proxy stopped."
}

# TODO: If the container is already down it should be a success
# @test 'Down - Already' {
#   run dockerproxy down
#   assert_failure
#   assert_output "Proxy could not be stopped:
# Error response from daemon: No such container: docker_proxy"
# }
