const chalk = require('chalk');

const common = {
  error(str) { console.error(chalk.red(str)); },

  success(str) { console.log(chalk.green(str)); },
};

module.exports = common;
