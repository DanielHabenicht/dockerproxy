var fs = require('fs');
var commander = require('commander');
const settingsPath = './settings.json';

helpers = {
  isConfigured: function() {
    if (!fs.existsSync(settingsPath) && !commander.proxy) {
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
