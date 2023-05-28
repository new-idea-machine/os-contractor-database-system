import { test } from "@playwright/test";

test("Login-tc1", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.locator(".customButton4 > span:nth-child(1)").click();
  await page.locator("id=emailInput").fill("qa@qa.com");
  await page.getByPlaceholder("Password...").fill("123456");
  await page.locator(".fields > button:nth-child(3)").click();
  await page.locator(".fields > button:nth-child(3)").click();
  await page.pause();
});
