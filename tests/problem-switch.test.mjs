import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Script } from "node:vm";

const pages = ["index.html", "orca-openspec-designer-guide-with-ui.html"];
const ids = [
  "problemNav", "problemPanel", "problemTitle", "problemFeature",
  "problemPlain", "problemEngineer", "problemLocation", "problemMedia",
  "problemSteps", "problemOpenSpec", "problemPrompt", "problemVerify",
  "problemKicker"
];

class MockElement {
  constructor(name) {
    this.name = name;
    this.children = [];
    this.attributes = new Map();
    this.events = new Map();
    this._innerHTML = "";
    this.textContent = "";
    this.scrollCalls = 0;
    this.open = false;
  }

  set innerHTML(value) {
    this._innerHTML = value;
    this.children = [];
  }

  get innerHTML() {
    return this._innerHTML;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  addEventListener(event, handler) {
    this.events.set(event, handler);
  }

  click() {
    const handler = this.events.get("click");
    assert.equal(typeof handler, "function");
    handler();
  }

  scrollIntoView() {
    this.scrollCalls += 1;
  }
}

function mountPage(html, { mobile = false } = {}) {
  for (const id of ids) {
    assert.ok(html.includes('id="' + id + '"'), "missing element #" + id);
  }
  const nodes = Object.fromEntries(ids.map((id) => [id, new MockElement(id)]));
  const navHtml = html.match(/<nav class="topnav"[^>]*>([\s\S]*?)<\/nav>/i)?.[1];
  assert.ok(navHtml, "top navigation exists");
  const sectionLinks = [...navHtml.matchAll(/<a href="(#[^"]+)"/g)].map((match) => {
    const link = new MockElement("a");
    link.setAttribute("href", match[1]);
    return link;
  });
  const roleJumps = [...html.matchAll(/<a class="role-jump" href="#(role-[^"]+)"/g)].map((match) => {
    const link = new MockElement("a");
    link.setAttribute("href", "#" + match[1]);
    return link;
  });
  const roleDetails = Object.fromEntries(roleJumps.map((link) => [
    link.getAttribute("href").slice(1), new MockElement("details")
  ]));
  const listeners = new Map();
  const document = {
    getElementById: (id) => nodes[id] ?? roleDetails[id] ?? null,
    createElement: (tag) => new MockElement(tag),
    querySelectorAll: (selector) => {
      if (selector === '.topnav a[href^="#"]') return sectionLinks;
      if (selector === '.role-jump[href^="#role-"]') return roleJumps;
      throw new Error("unexpected selector " + selector);
    }
  };
  const window = {
    location: { hash: "" },
    addEventListener: (event, callback) => listeners.set(event, callback),
    matchMedia: (query) => {
      assert.equal(query, "(max-width: 920px)");
      return { matches: mobile };
    }
  };
  nodes.sectionLinks = sectionLinks;
  nodes.roleJumps = roleJumps;
  nodes.roleDetails = roleDetails;
  nodes.setHash = (hash) => {
    window.location.hash = hash;
    const change = listeners.get("hashchange");
    assert.equal(typeof change, "function");
    change();
  };
  const match = html.match(/<script>([\s\S]*?)<\/script>/i);
  assert.ok(match, "missing inline script");
  new Script(match[1]).runInNewContext({ document, window }, { timeout: 5000 });
  return nodes;
}

test("Both published HTML files stay in sync", () => {
  assert.equal(readFileSync(pages[0], "utf8"), readFileSync(pages[1], "utf8"));
});

for (const page of pages) {
  test(page + ": switching cases changes content without recreating buttons", () => {
    const html = readFileSync(page, "utf8");
    const nodes = mountPage(html);
    const nav = nodes.problemNav;
    const buttons = [...nav.children];
    assert.equal(buttons.length, 5);
    assert.equal(nodes.problemKicker.textContent, "痛點 1");

    const titles = new Set();
    for (let i = buttons.length - 1; i >= 0; i--) {
      buttons[i].click();
      assert.equal(nodes.problemKicker.textContent, "痛點 " + (i + 1));
      titles.add(nodes.problemTitle.textContent);
      assert.ok(nodes.problemFeature.textContent, "case feature is populated");
      assert.strictEqual(nav.children[i], buttons[i], "button must remain mounted");
      assert.equal(nav.children.length, buttons.length);
      assert.equal(buttons[i].attributes.get("aria-controls"), "problemPanel");
      buttons.forEach((button, j) => {
        assert.equal(button.attributes.get("aria-current"), String(j === i));
      });
    }
    assert.equal(titles.size, buttons.length, "each button displays a distinct case");
    assert.match(nodes.problemTitle.textContent, /AI 做到一半/);
    assert.equal(nodes.problemPanel.scrollCalls, 0, "desktop must not jump");
  });

  test(page + ": switching on mobile brings the new content into view", () => {
    const nodes = mountPage(readFileSync(page, "utf8"), { mobile: true });
    nodes.problemNav.children[3].click();
    assert.equal(nodes.problemKicker.textContent, "痛點 4");
    assert.equal(nodes.problemPanel.scrollCalls, 1);
  });
}

test("All internal navigation links resolve and navigation stays stable", () => {
  const html = readFileSync(pages[0], "utf8");
  const navigation = html.match(/<nav class="topnav"[^>]*>([\s\S]*?)<\/nav>/i)?.[1];
  assert.ok(navigation, "missing site navigation");
  const sectionIds = new Set([...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]));
  const allIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  const linkedSections = [...navigation.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  const links = [...html.matchAll(/<a\b[^>]*href="#([^"]+)"/g)].map((m) => m[1]);

  assert.ok(linkedSections.length >= 9, "all major sections remain available");
  assert.equal(new Set(linkedSections).size, linkedSections.length, "navigation targets must be unique");
  assert.equal(linkedSections.length, sectionIds.size, "top nav must list every named content section");
  for (const id of links) assert.ok(allIds.has(id), "missing anchor target: " + id);
  assert.match(html, /html\{scroll-behavior:auto\}/, "avoid unstable animated jumps");
  assert.match(html, /id="problemTitle" aria-live="polite"/);
});

test("Native accordions remain structurally toggleable", () => {
  const html = readFileSync(pages[0], "utf8");
  const opens = [...html.matchAll(/<details(?:\s[^>]*)?>/g)];
  const closes = [...html.matchAll(/<\/details>/g)];
  const summaries = [...html.matchAll(/<summary>/g)];
  const summaryCloses = [...html.matchAll(/<\/summary>/g)];
  assert.ok(opens.length >= 8, "existing FAQ accordions must remain");
  assert.equal(opens.length, closes.length, "every details is closed");
  assert.equal(opens.length, summaries.length, "every details has a summary");
  assert.equal(summaries.length, summaryCloses.length);
});

test("External and button-styled links have valid destinations", () => {
  const html = readFileSync(pages[0], "utf8");
  const external = [...html.matchAll(/<a\b[^>]*href="(https:\/\/[^"]+)"[^>]*>/g)];
  const actions = [...html.matchAll(/<a\s+class="btn[^"]*"\s+href="([^"]+)"[^>]*>/g)];
  assert.ok(external.length >= 5, "official reference links must remain");
  assert.ok(actions.length >= 3, "primary action links must remain");
  for (const [, url] of external) assert.match(url, /^https:\/\//);
  for (const [, url] of actions) assert.ok(url.startsWith("https://") || url.startsWith("#"));
});

for (const page of pages) {
  test(page + ": each section link highlights when selected", () => {
    const nodes = mountPage(readFileSync(page, "utf8"));
    const html = readFileSync(page, "utf8");
    const navHtml = html.match(/<nav class="topnav"[^>]*>([\s\S]*?)<\/nav>/i)?.[1];
    const expectedLinks = [...navHtml.matchAll(/href="#([^"]+)"/g)].length;
    assert.equal(nodes.sectionLinks.length, expectedLinks);
    for (const active of nodes.sectionLinks) {
      nodes.setHash(active.getAttribute("href"));
      nodes.sectionLinks.forEach((link) => {
        assert.equal(link.getAttribute("aria-current"), link === active ? "location" : null);
      });
    }
    nodes.setHash("");
    assert.ok(nodes.sectionLinks.every((link) => link.getAttribute("aria-current") === null));
  });
}

for (const page of pages) {
  test(page + ": role links expand the matching prompt on desktop and mobile", () => {
    for (const mobile of [false, true]) {
      const nodes = mountPage(readFileSync(page, "utf8"), { mobile });
      assert.equal(nodes.roleJumps.length, 12, "all contracted role shortcuts exist");
      for (const link of nodes.roleJumps) {
        const roleId = link.getAttribute("href").slice(1);
        const target = nodes.roleDetails[roleId];
        assert.ok(target, "missing details " + roleId);
        assert.equal(target.open, false, "details initially collapsed");
        link.click();
        assert.equal(target.open, true, "role shortcut must open " + roleId);
      }
    }
  });
}
