import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { chromium } from 'playwright';

const spec = readFileSync(resolve('SPEC.md'), 'utf8');
function contractIds(name, pattern) {
  const startTag = '<!-- ' + name + ':start -->';
  const endTag = '<!-- ' + name + ':end -->';
  const start = spec.indexOf(startTag);
  const end = spec.indexOf(endTag, start);
  assert.ok(start >= 0 && end > start, 'missing spec contract ' + name);
  return spec.slice(start + startTag.length, end).split('\n')
    .map(line => line.split('|')[1]?.trim()).filter(value => value && pattern.test(value));
}
const navigation = contractIds('navigation-contract', /^(?!id$)[a-z][a-z0-9-]*$/);
const sections = contractIds('page-section-contract', /^(?!id$)[a-z][a-z0-9-]*$/);
const roles = contractIds('role-contract', /^role-[a-z0-9-]+$/);
const problemCases = contractIds('problem-case-contract', /^(?!id$)[a-z][a-z0-9-]*$/);
const pageUrl = pathToFileURL(resolve('index.html')).href;
const viewports = [
  { name: 'desktop', viewport: { width: 1280, height: 800 } },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true },
];

for (const device of viewports) {
  test('real Chromium ' + device.name + ': user journey, role prompts and watchdog', async () => {
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
      assert.equal(await nav.count(), navigation.length);
      for (let i = 0; i < navigation.length; i++) {
        const link = nav.nth(i);
        const fragment = await link.getAttribute('href');
        assert.equal(fragment, '#' + navigation[i]);
        assert.ok(await page.locator(fragment).count(), 'missing destination ' + fragment);
        await link.click();
        await page.waitForFunction(hash => {
          const current = document.querySelector('.topnav a[href="' + hash + '"]');
          return location.hash === hash && current?.getAttribute('aria-current') === 'location';
        }, fragment);
        assert.equal(await link.getAttribute('aria-current'), 'location', 'active nav ' + fragment);
      }

      const heroEntries = page.locator('.hero a.entry');
      assert.equal(await heroEntries.count(), 4);
      const expectedEntryTargets = ['#role-pm', '#role-ux', '#role-frontend', '#watchdog'];
      for (let i = 0; i < expectedEntryTargets.length; i++) {
        const entry = heroEntries.nth(i);
        assert.equal(await entry.getAttribute('href'), expectedEntryTargets[i]);
        await entry.click();
        await page.waitForFunction(hash => location.hash === hash, expectedEntryTargets[i]);
        if (expectedEntryTargets[i].startsWith('#role-')) {
          assert.equal(await page.locator(expectedEntryTargets[i]).evaluate(el => el.open), true);
        }
      }
      for (const target of ['#journey', '#quickstart']) {
        const cta = page.locator('.hero .cta-row a[href="' + target + '"]');
        assert.equal(await cta.count(), 1, 'hero CTA to ' + target);
        await cta.click();
        await page.waitForFunction(hash => location.hash === hash, target);
      }

      const journey = page.locator('#journey');
      const examples = journey.locator('article.card');
      assert.equal(await examples.count(), 3, 'three practical task examples');
      for (let i = 0; i < 3; i++) {
        const text = await examples.nth(i).innerText();
        assert.ok(text.includes('成果：'), 'example must show an output');
        assert.ok(text.length > 150, 'example must explain the work, not just name a feature');
      }
      const levels = journey.locator('.grid.four a.entry');
      assert.equal(await levels.count(), 4, 'four progressive learning levels');

      const quickstart = page.locator('#quickstart');
      assert.ok((await quickstart.innerText()).includes('PATH A · PM / PO / SA'));
      assert.ok((await quickstart.innerText()).includes('PATH B · UX / FRONTEND / ENGINEERING'));
      assert.ok((await quickstart.innerText()).includes('這條路徑不需要 Worktree'));

      const problemButtons = page.locator('#problemNav button');
      assert.equal(await problemButtons.count(), problemCases.length);
      for (let i = 0; i < problemCases.length; i++) {
        await problemButtons.nth(i).click();
        assert.equal((await page.locator('#problemKicker').innerText()).trim(), '痛點 ' + (i + 1));
        assert.equal(await problemButtons.nth(i).getAttribute('aria-current'), 'true');
        assert.ok((await page.locator('#problemPrompt').innerText()).length > 10);
      }

      const roleLinks = page.locator('#crossroles a.role-jump[href^="#role-"]');
      assert.equal(await roleLinks.count(), roles.length, 'all contracted role cards');
      for (let i = 0; i < roles.length; i++) {
        const link = page.locator('#crossroles a.role-jump[href="#' + roles[i] + '"]');
        assert.equal(await link.count(), 1);
        await link.click();
        assert.equal(await page.locator('#' + roles[i]).evaluate(el => el.open), true);
        assert.ok((await page.locator('#' + roles[i] + ' pre.code').innerText()).length > 20);
      }

      const watchdog = page.locator('#watchdog');
      for (const term of ['Worker Heartbeat', 'Agent Dashboard', 'Mobile Heartbeat',
        'Runtime Supervisor', 'Healthy', 'Stale', 'worker-stop', '--retry-of']) {
        assert.ok((await watchdog.innerText()).includes(term), 'watchdog missing ' + term);
      }

      await page.locator('#role-pm').evaluate(el => { el.open = false; });
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
        device.name + ' horizontal overflow ' + JSON.stringify(size));
      assert.deepEqual(exceptions, [], 'no page JavaScript exceptions');
      await context.close();
    } finally {
      await browser.close();
    }
  });
}
