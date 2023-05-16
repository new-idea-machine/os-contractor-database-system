const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");
async function test_case1() {
  let driver = await new Builder().forBrowser("chrome").build();

  await driver.get("http://localhost:3000");
  await driver.findElement(By.className("customButton4")).click();

  await driver
    .findElement(By.id("emailInput"))
    .sendKeys("qa@qa.com", Key.RETURN);
  await driver
    .findElement(By.xpath("/html/body/div/div[2]/div/div[2]/div[1]/input[2]"))
    .sendKeys("123456", Key.RETURN);

  await driver
    .findElement(By.xpath('//*[@id="root"]/div[2]/div/div[2]/div[1]/button'))
    .click();
  setInterval(function () {
    driver.quit();
  }, 20000);
}
test_case1();
