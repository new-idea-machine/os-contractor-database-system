const assert = require("assert");
const { By, Key, Builder } = require("selenium-webdriver");
// require("chromedriver");
var should = require("chai").should();

async function test_case1() {
  let driver = await new Builder().forBrowser("firefox").build();

  await driver.get("http://localhost:3000");

  await driver.findElement(By.className("customButton4")).click();

  await driver
    .findElement(By.id("emailInput"))
    .sendKeys("qa@qa.com", Key.RETURN);

  await driver
    .findElement(By.xpath("/html/body/div/div[2]/div/div[2]/div[1]/input[2]"))
    .sendKeys("123456", Key.RETURN);

  let email = await driver
    .findElement(By.id("emailInput"))
    .getText()
    .then(function (value) {
      return value;
    });
  //Node.js library
  // assert.strictEqual(email, "qa@qa.com");

  //Chai

  email.should.equal("qa@qa.com");

  // setInterval(function () {
  //   driver.quit();
  // }, 20000);

  // await driver
  //   .findElement(By.xpath('//*[@id="root"]/div[2]/div/div[2]/div[1]/button'))
  //   .click();
  // driver.quit();
}
test_case1();
