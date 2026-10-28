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
  const document = {
    getElementById: (id) => nodes[id] ?? null,
    createElement: (tag) => new MockElement(tag)
  };
  const window = {
    matchMedia: (query) => {
      assert.equal(query, "(max-width: 920px)");
      return { matches: mobile };
    }
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

    for (let i = buttons.length - 1; i >= 0; i--) {
      buttons[i].click();
      assert.equal(nodes.problemKicker.textContent, "痛點 " + (i + 1));
      assert.strictEqual(nav.children[i], buttons[i], "button must remain mounted");
      assert.equal(nav.children.length, buttons.length);
      assert.equal(buttons[i].attributes.get("aria-controls"), "problemPanel");
      buttons.forEach((button, j) => {
        assert.equal(button.attributes.get("aria-current"), String(j === i));
      });
    }
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
