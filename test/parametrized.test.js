import webdriver from 'selenium-webdriver';
// it will download and use BrowserStackLocal binary file behind the scene
// you may check ~/.browserstack dir
import browserstack from 'browserstack-local';

const local = new browserstack.Local();
const until = webdriver.until;
const By = webdriver.By;

// see: https://www.browserstack.com/automate/capabilities
const capabilities = {
  build: require('../package.json').version,
  project: 'jest-selenium-browserstack-example',
  browserName: process.env.BROWSER, //'chrome',
  os: process.env.OS, //'Windows',
  'browserstack.local': true,
  // 'browserstack.debug': true,
  'browserstack.user': 'YOUR_BROWSERSTACK_USERNAME',
  'browserstack.key': 'YOUR_BROWSERSTACK_KEY',
};

// see: https://www.browserstack.com/local-testing#modifiers
const BrowserStackLocalArgs = {
  key: capabilities['browserstack.key'],
  // verbose: true,
  onlyAutomate: true,
  // eslint-disable-next-line
  folder: __dirname,
};

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

const getElementById = async (driver, id, timeout = 5000) => {
  const el = await driver.wait(until.elementLocated(By.id(id)), timeout);
  return await driver.wait(until.elementIsVisible(el), timeout);
};

describe('webdriver', () => {
  let driver;

  beforeAll(async () => {
    try {
      // BrowserStackLocal has to be ready before webdriver initialization
      await start();
      driver = new webdriver.Builder()
        .usingServer('http://hub-cloud.browserstack.com/wd/hub')
        .withCapabilities(capabilities)
        .build();

      await driver.get(
        `http://${
          capabilities['browserstack.user']
        }.browserstack.com/test.html`,
      );
    } catch (error) {
      console.error('connetion error', error);
    }
    // IMPORTANT! Selenium and Browserstack needs more time than regular Jest
  }, 10000);

  afterAll(async () => {
    try {
      await driver.quit(); // ~ 11 s !
      await stop(); // ~ 3 s
    } catch (error) {
      console.error('disconnection error', error);
    }
    // IMPORTANT! Selenium and Browserstack needs a lot of time!
  }, 20000);

  test(
    'test',
    async () => {
      // may help with debugging
      // const src = await driver.getPageSource();
      // console.log(src);

      const btn = await getElementById(driver, 'test-button');
      await btn.click();

      const output = await getElementById(driver, 'output');
      const outputVal = await output.getAttribute('value');

      expect(outputVal).toEqual('Something');
    },
    // IMPORTANT! 5s timeout should be sufficient complete test
    5000,
  );
});
