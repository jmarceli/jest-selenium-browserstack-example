import { Builder, By, until } from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox';
import path from 'path';

const getElementById = async (driver, id, timeout = 2000) => {
  const el = await driver.wait(until.elementLocated(By.id(id)), timeout);
  return await driver.wait(until.elementIsVisible(el), timeout);
};

describe('webdriver', () => {
  let driver;

  beforeAll(async () => {
    const options = new firefox.Options();
    options.headless();
    driver = new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();

    // eslint-disable-next-line no-undef
    await driver.get('file://' + path.join(__dirname, 'test.html'));
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('test', async () => {
    const btn = await getElementById(driver, 'test-button');
    await btn.click();

    const output = await getElementById(driver, 'output');
    const outputVal = await output.getAttribute('value');

    expect(outputVal).toEqual('Something');
  });
});
