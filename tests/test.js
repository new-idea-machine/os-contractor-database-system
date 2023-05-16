const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");
async function test_case1() {
  let driver = await new Builder().forBrowser("chrome").build();

  await driver.get("http://localhost:3000");
  await driver.findElement(By.className("customButton4")).click();
  await driver
    .findElement(By.id("emailInput"))
    .sendKeys("qa@qa.com", Key.RETURN);
  await driver.findElement(By.name("password")).sendKeys("123456", Key.RETURN);
  setInterval(function () {
    driver.quit();
  }, 20000);
}
test_case1();
