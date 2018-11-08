var fs = require('fs');
var commander = require('commander');
const settingsPath = require('os').homedir() + '\\docker-container-proxy-settings.json';

const helpers = {
  isConfigured: function () {
    if (!fs.existsSync(settingsPath) && !commander.address && !commander.port) {
      return false;
    }
    return true;
  },
  writeConfig: function (config) {
    fs.writeFileSync(settingsPath, JSON.stringify(config));
  },
  readConfig: function () {
    return JSON.parse(fs.readFileSync(settingsPath));
  },
  getSettingsPath() {
    return settingsPath;
  }
};

module.exports = helpers;
