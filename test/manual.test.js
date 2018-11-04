import { Builder, By, until } from 'selenium-webdriver';
import webdriver from 'selenium-webdriver';

// see: https://www.browserstack.com/automate/capabilities
const capabilities = {
  build: require('../package.json').version,
  project: 'jest-selenium-browserstack-example',
  browserName: 'chrome',
  os: 'Windows',
  'browserstack.local': true,
  // 'browserstack.debug': true,
  'browserstack.user': 'YOUR_BROWSERSTACK_USERNAME',
  'browserstack.key': 'YOUR_BROWSERSTACK_KEY',
};

const getElementById = async (driver, id, timeout = 2000) => {
  const el = await driver.wait(until.elementLocated(By.id(id)), timeout);
  return await driver.wait(until.elementIsVisible(el), timeout);
};

describe('webdriver', () => {
  let driver;

  beforeAll(async () => {
    driver = new webdriver.Builder()
      .usingServer('http://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(capabilities)
      .build();

    // eslint-disable-next-line no-undef
    await driver.get(
      `http://${capabilities['browserstack.user']}.browserstack.com/test.html`,
    );
  }, 10000);

  afterAll(async () => {
    await driver.quit();
  }, 15000);

  test(
    'test',
    async () => {
      const btn = await getElementById(driver, 'test-button');
      await btn.click();

      const output = await getElementById(driver, 'output');
      const outputVal = await output.getAttribute('value');

      expect(outputVal).toEqual('Something');
    },
    10000,
  );
});
