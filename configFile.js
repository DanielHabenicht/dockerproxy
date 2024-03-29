var fs = require('fs');
var path = require('path');
var commander = require('commander');
const settingsPath = path.join(require('os').homedir(), 'docker-container-proxy-settings.json');

const configFile = {
  isConfigured: function () {
    if (!fs.existsSync(settingsPath)) {
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
  },
};

module.exports = configFile;
