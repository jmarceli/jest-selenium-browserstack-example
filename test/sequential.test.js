import webdriver from 'selenium-webdriver';
// it will download and use BrowserStackLocal binary file behind the scene
// you may check ~/.browserstack dir
import browserstack from 'browserstack-local';

const local = new browserstack.Local();
const until = webdriver.until;
const By = webdriver.By;

const config = require('./config.json');

// see: https://www.browserstack.com/local-testing#modifiers
const BrowserStackLocalArgs = {
  key: 'YOUR_BROWSERSTACK_KEY',
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
    os: 'Windows',
    // build: require('../package.json').version,
    build: require('../package.json').version,
    project: 'jest-selenium-browserstack-example',
    // browserName: 'chrome',
    'browserstack.local': true,
    'browserstack.user': 'YOUR_BROWSERSTACK_USERNAME',
    'browserstack.key': BrowserStackLocalArgs.key,
    // 'browserstack.debug': true,
    ...browser,
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
          await driver.get(
            `http://${
              capabilities['browserstack.user']
            }.browserstack.com/test.html`,
          );
          const btn = await getElementById(driver, 'test-button');
          await btn.click();

          const output = await getElementById(driver, 'output');
          const outputVal = await output.getAttribute('value');

          expect(outputVal).toEqual('Something');
          console.log('tests end');
        });
      });
    },
    30000,
  );
}
