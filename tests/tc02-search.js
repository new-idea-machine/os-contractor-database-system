const { By, Builder } = require("selenium-webdriver");
// require("chromedriver");

async function test_case2() {
  let driver = await new Builder().forBrowser("firefox").build();

  await driver.get("http://localhost:3000/contractorList");

  await driver
    .findElement(By.xpath(`//*[@id="root"]/div[1]/ul/li[3]/a`))
    .click();
  await driver
    .findElement(
      By.xpath(
        `//*[@id="root"]/div[1]/div[2]/div[1]/div/div[1]/div/div[1]/span/input`
      )
    )
    .click();

  await driver.findElement(By.id(":r2:")).click();
  setInterval(function () {
    driver.quit();
  }, 5000);
}
test_case2();
