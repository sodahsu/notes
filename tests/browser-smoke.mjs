import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const pageUrl = pathToFileURL(resolve('index.html')).href;
const viewports = [
  { name: 'desktop', viewport: { width: 1280, height: 800 } },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true },
];

for (const device of viewports) {
  test(`real Chromium ${device.name}: navigation, cases, role prompts, keyboard`, async () => {
    const browser = await chromium.launch({ headless: true });
    try {
      const context = await browser.newContext({
        viewport: device.viewport,
        isMobile: Boolean(device.isMobile),
        hasTouch: Boolean(device.isMobile),
      });
      const page = await context.newPage();
      const exceptions = [];
      page.on('pageerror', error => exceptions.push(error.message));
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });

      const nav = page.locator('.topnav a[href^="#"]');
      assert.equal(await nav.count(), 13, '13 planned section links');
      for (let i = 0; i < await nav.count(); i++) {
        const link = nav.nth(i);
        const fragment = await link.getAttribute('href');
        assert.ok(await page.locator(fragment).count(), `missing destination ${fragment}`);
        await link.click();
        // hashchange updates aria-current asynchronously after URL fragment navigation.
        await page.waitForFunction(hash => {
          const current = document.querySelector(`.topnav a[href="${hash}"]`);
          return location.hash === hash && current?.getAttribute('aria-current') === 'location';
        }, fragment);
        assert.equal(await link.getAttribute('aria-current'), 'location', `active nav ${fragment}`);
      }

      const problemButtons = page.locator('#problemNav button');
      assert.equal(await problemButtons.count(), 5, 'five problem cases');
      for (let i = 0; i < 5; i++) {
        await problemButtons.nth(i).click();
        assert.equal((await page.locator('#problemKicker').innerText()).trim(), `痛點 ${i + 1}`);
        assert.equal(await problemButtons.nth(i).getAttribute('aria-current'), 'true');
        assert.ok((await page.locator('#problemPrompt').innerText()).length > 10, `case ${i + 1} prompt`);
      }

      const roles = page.locator('a.role-jump[href^="#role-"]');
      assert.equal(await roles.count(), 12, 'twelve roles');
      for (let i = 0; i < 12; i++) {
        const role = roles.nth(i);
        const target = await role.getAttribute('href');
        await role.click();
        assert.equal(await page.locator(target).evaluate(el => el.open), true, `${target} expands`);
        assert.ok((await page.locator(`${target} pre.code`).innerText()).length > 20);
      }

      // Native accordion toggles are keyboard-accessible independently of role links.
      const firstSummary = page.locator('#role-pm summary');
      await firstSummary.focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#role-pm').evaluate(el => el.open), false);
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#role-pm').evaluate(el => el.open), true);

      const size = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));
      assert.ok(size.scrollWidth <= size.viewportWidth + 2,
        `${device.name} horizontal overflow ${JSON.stringify(size)}`);
      assert.deepEqual(exceptions, [], 'no page JavaScript exceptions');
      await context.close();
    } finally {
      await browser.close();
    }
  });
}
