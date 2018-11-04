import { until, By } from 'selenium-webdriver';

const hello = async (driver, capabilities) => {
  const getElementById = async (id, timeout = 5000) => {
    const el = await driver.wait(until.elementLocated(By.id(id)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
  };

  await driver.get(
    `http://${capabilities['browserstack.user']}.browserstack.com/test.html`,
  );
  const btn = await getElementById('test-button');
  await btn.click();

  const output = await getElementById('output');
  const outputVal = await output.getAttribute('value');

  expect(outputVal).toEqual('Something');
};
export default hello;
