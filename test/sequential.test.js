import webdriver from 'selenium-webdriver';
import browserstack from 'browserstack-local';
import hello from './sequential.single.test';

// see: https://www.browserstack.com/local-testing#modifiers
const BrowserStackLocalArgs = {
  key: 'YOUR_BROWSERSTACK_KEY',
  // verbose: true,
  onlyAutomate: true,
  // eslint-disable-next-line
  folder: __dirname,
};

const config = require('./config.json');

const local = new browserstack.Local();

const start = async () =>
  new Promise((resolve, reject) => {
    local.start(BrowserStackLocalArgs, error => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });

const stop = async () =>
  new Promise((resolve, reject) => {
    local.stop(function(error) {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });

beforeAll(async () => {
  console.log('connect');
  try {
    await start();
  } catch (error) {
    console.error(error);
  }
  console.log('connection ready');
}, 20000);

afterAll(async () => {
  console.log('disconnect');
  await stop();
  console.log('disconnected');
}, 20000);

for (const browser of config.browsers) {
  let driver;
  const capabilities = {
    ...browser,
    // build: require('../package.json').version,
    build: '0.1.0', //require('../package.json').version,
    project: 'jest-selenium-browserstack-example',
    // browserName: 'chrome',
    os: 'Windows',
    'browserstack.local': true,
    // 'browserstack.debug': true,
  };

  describe(
    'selenium webdriver',
    () => {
      beforeAll(async () => {
        driver = await new webdriver.Builder()
          .usingServer('http://hub-cloud.browserstack.com/wd/hub')
          .withCapabilities(capabilities)
          .build();
        console.log('driver start');
      }, 20000);

      afterAll(async () => {
        await driver.quit();
        console.log('driver quit');
      }, 20000);

      describe(`desc ${capabilities.browserName}`, () => {
        test(`test ${capabilities.browserName}`, async () => {
          console.log('tests start');
          await hello(driver, capabilities);
          console.log('tests end');
        });
      });
    },
    30000,
  );
}
