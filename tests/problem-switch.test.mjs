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
  const listeners = new Map();
  const document = {
    getElementById: (id) => nodes[id] ?? null,
    createElement: (tag) => new MockElement(tag),
    querySelectorAll: (selector) => {
      assert.equal(selector, '.topnav a[href^="#"]');
      return sectionLinks;
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

test("All internal navigation links point to existing sections", () => {
  const html = readFileSync(pages[0], "utf8");
  const sectionIds = new Set([...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]));
  const allIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  const links = [...html.matchAll(/<a\b[^>]*href="(#[^"]+)"/g)].map((m) => m[1]);
  assert.equal(links.length, 13, "9 navigation links + 4 entry cards");
  assert.equal(new Set(links).size, 9, "nine section destinations");
  assert.equal(sectionIds.size, 9, "nine navigable content sections");
  for (const href of links) {
    assert.ok(allIds.has(href.slice(1)), "missing anchor target: " + href);
  }
  assert.match(html, /html\{scroll-behavior:auto\}/, "avoid unstable animated jumps");
});

test("Eight native accordions remain independently toggleable", () => {
  const html = readFileSync(pages[0], "utf8");
  assert.equal((html.match(/<details(?:\s[^>]*)?>/g) ?? []).length, 8);
  assert.equal((html.match(/<\/details>/g) ?? []).length, 8);
  assert.equal((html.match(/<summary>/g) ?? []).length, 8);
  assert.equal((html.match(/<\/summary>/g) ?? []).length, 8);
});

test("All external links and button-styled links have destinations", () => {
  const html = readFileSync(pages[0], "utf8");
  const external = [...html.matchAll(/<a\b[^>]*href="(https:\/\/[^"]+)"[^>]*>/g)];
  const actions = [...html.matchAll(/<a\s+class="btn[^"]*"\s+href="([^"]+)"[^>]*>/g)];
  assert.equal(external.length, 5, "all five external links are present");
  assert.equal(actions.length, 3, "three links are styled as buttons");
  for (const [, url] of external) {
    assert.match(url, /^https:\/\//);
  }
});

for (const page of pages) {
  test(page + ": each section link highlights when selected", () => {
    const nodes = mountPage(readFileSync(page, "utf8"));
    assert.equal(nodes.sectionLinks.length, 9);
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
