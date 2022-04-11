const baseKarma = require('./base-karma')
const mochaConfig = require('../../.mocharc.json')

module.exports = function (config) {
  const baseConfig = baseKarma(config)

  const webdriverConfig = {
    hostname: 'hub.lambdatest.com',
    port: 80
  }

  config.set(Object.assign(baseConfig, {
    browsers: [
      'chrome'
    ],

    reporters: [
      'mocha', 'BrowserStack'
    ],

    client: {
      mocha: {
        timeout: mochaConfig.timeout
      }
    },

    browserStack: {
      startTunnel: true
    },

    customLaunchers: {
      chrome: {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'chrome',
        platform: 'windows 10',
        version: '71.0',
        name: 'Karma With Heartbeat',
        user: process.env.LT_USERNAME,
        accessKey: process.env.LT_ACCESS_KEY,
        pseudoActivityInterval: 5000 // 5000 ms heartbeat
      }
    }
  }))
}
