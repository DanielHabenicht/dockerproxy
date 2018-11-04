var fs = require('fs');
var commander = require('commander');
const { getInstalledPathSync } = require('get-installed-path');
const settingsPath = getInstalledPathSync('docker-container-proxy') + '/settings.json';

helpers = {
  isConfigured: function() {
    if (!fs.existsSync(settingsPath) && !commander.address && !commander.port) {
      return false;
    }
    return true;
  },
  writeConfig: function(config) {
    fs.writeFileSync(settingsPath, JSON.stringify(config));
  },
  readConfig: function() {
    return JSON.parse(fs.readFileSync(settingsPath));
  }
};

module.exports = helpers;
