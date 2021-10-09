var inquirer = require('inquirer');
const defaults = require('./defaults')


const dialog = {
  overwrite: function () {
    return new Promise((resolve, reject) => {
      inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: 'A settings.json File already exists. Do you want to override?',
            default: false
          }
        ])
        .then(answers => {
          resolve(answers.overwrite);
        });
    });
  },
  askForConfig: function (previousConfig) {
    if (!previousConfig) {
      // No previous Configuration
      return new Promise((resolve, reject) => {
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'proxyAddress',
              message: `What is the proxy domain you want to use? (e.g. proxy.domain.de)`,
              validate: function (input) {
                var done = this.async();
                if (input == null || input === '') {
                  done('This Field cannot be blank.');
                  return;
                }
                const regex = new RegExp(
                  '^(?!:\\/\\/)([a-zA-Z0-9-_]+\\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\\.[a-zA-Z]{2,11}?$'
                );
                if (!input.match(regex)) {
                  done('This is not a valid Domain.');
                }
                // Pass the return value in the done callback
                done(null, true);
              }
            },
            {
              type: 'input',
              name: 'proxyPort',
              message: `Which port is the proxy server listening on?`,
              default: defaults.proxyPort,
              validate: function (input) {
                var done = this.async();
                if (input == null || input === '') {
                  done('This Field cannot be blank.');
                  return;
                }
                const regex = new RegExp('^\\d*$');
                if (!input.match(regex)) {
                  done('This is not a valid Port.');
                }
                // Pass the return value in the done callback
                done(null, true);
              }
            },
            {
              type: 'input',
              name: 'network',
              message: `Which network should be proxied? (Leave blank to proxy all.)`,
              default: ''
            },
            {
              type: 'input',
              name: 'containerName',
              message: `Should the container use a special name?`,
              default: defaults.containerName
            }
          ])
          .then(answers => {
            resolve(answersToConfigObject(answers));
          });
      });
    } else {
      console.log('Using previous Config as template');
      return new Promise((resolve, reject) => {
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'proxyAddress',
              message: `What is the proxy address you want to use?`,
              default: previousConfig.proxyAddress,
              validate: function (input) {
                var done = this.async();
                if (input == null || input === '') {
                  done('This Field cannot be blank.');
                  return;
                }
                const regex = new RegExp(
                  '^(?!:\\/\\/)([a-zA-Z0-9-_]+\\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\\.[a-zA-Z]{2,11}?$'
                );
                if (!input.match(regex)) {
                  done('This is not a valid Domain.');
                }
                // Pass the return value in the done callback
                done(null, true);
              }
            },
            {
              type: 'input',
              name: 'proxyPort',
              message: `Which port is the proxy server listening on?`,
              default: previousConfig.proxyPort,
              validate: function (input) {
                var done = this.async();
                if (input == null || input === '') {
                  done('This Field cannot be blank.');
                  return;
                }
                const regex = new RegExp('^\\d*$');
                if (!input.match(regex)) {
                  done('This is not a valid Port.');
                }
                // Pass the return value in the done callback
                done(null, true);
              }
            },
            {
              type: 'input',
              name: 'network',
              message: `Which network should be proxied? (Leave blank to proxy all.)`,
              default: previousConfig.network
            },
            {
              type: 'input',
              name: 'containerName',
              message: `Should the container use a special name?`,
              default: previousConfig.containerName
            }
          ])
          .then(answers => {
            resolve(answersToConfigObject(answers));
          });
      });
    }
  }
};

function answersToConfigObject(answers) {
  return {
    proxyAddress: answers.proxyAddress,
    proxyPort: answers.proxyPort,
    network: answers.network,
    containerName: answers.containerName
  };
}

module.exports = dialog;
