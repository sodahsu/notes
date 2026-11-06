import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const pages = ["index.html", "orca-openspec-designer-guide-with-ui.html"];
const spec = readFileSync("SPEC.md", "utf8");
const agents = readFileSync("AGENTS.md", "utf8");
const readme = readFileSync("README.md", "utf8");
const prTemplate = readFileSync(".github/pull_request_template.md", "utf8");

function contractIds(name, pattern) {
  const block = spec.match(new RegExp("<!-- " + name + ":start -->([\\s\\S]*?)<!-- " + name + ":end -->"));
  assert.ok(block, "missing spec contract: " + name);
  const ids = block[1].split("\n").map((line) => line.split("|")[1]?.trim())
    .filter((value) => value && pattern.test(value));
  assert.ok(ids.length > 0, "empty contract: " + name);
  assert.equal(new Set(ids).size, ids.length, name + " IDs duplicated in SPEC.md");
  return ids;
}
const sections = contractIds("navigation-contract", /^(?!id$)[a-z][a-z0-9-]*$/);
const roles = contractIds("role-contract", /^role-[a-z0-9-]+$/);

test("Both published HTML files stay in sync", () => {
  assert.equal(readFileSync(pages[0], "utf8"), readFileSync(pages[1], "utf8"));
});

test("Specification includes all intended navigation and cross-functional roles", () => {
  assert.ok(sections.includes("planning") && sections.includes("teamwork") && sections.includes("safety"));
  assert.ok(roles.includes("role-pm") && roles.includes("role-sa"));
  assert.ok(roles.includes("role-frontdesign") && roles.includes("role-security"));
  assert.ok(roles.includes("role-devops") && roles.includes("role-support"));
});

for (const page of pages) {
  test(page + ": navigation, anchors and spec stay synchronized", () => {
    const html = readFileSync(page, "utf8");
    const topNav = html.match(/<nav class="topnav"[^>]*>([\s\S]*?)<\/nav>/i)?.[1];
    assert.ok(topNav, "top navigation missing");
    const navLinks = [...topNav.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(navLinks, sections, "nav does not match SPEC.md section contract");
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, "duplicate IDs on page");
    const allAnchors = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    for (const id of allAnchors) assert.ok(ids.includes(id), "broken anchor: #" + id);
    for (const section of sections) {
      assert.ok(html.includes('<section id="' + section + '"'), "missing section: " + section);
    }
  });

  test(page + ": each contracted role has an accessible case, prompt and reviewer", () => {
    const html = readFileSync(page, "utf8");
    const blocks = [...html.matchAll(/<details id="(role-[^"]+)">([\s\S]*?)<\/details>/g)];
    assert.deepEqual(blocks.map((m) => m[1]), roles, "role detail IDs and order must match SPEC.md");
    for (const [, id, content] of blocks) {
      assert.match(content, /<summary>[\s\S]*?<\/summary>/, id + " missing summary");
      for (const label of ["輸入", "交付", "人工驗收"]) {
        assert.ok(content.includes(label), id + " missing: " + label);
      }
      assert.match(content, /<pre class="code">[\s\S]*?<\/pre>/, id + " missing reusable prompt");
      assert.ok(html.includes('href="#' + id + '"'), id + " missing role jump link");
    }
  });

  test(page + ": planning, governance and delivery gates remain visible", () => {
    const html = readFileSync(page, "utf8");
    for (const label of ["SPEC_DRIFT", "Approval Gate", "Manual", "Auto", "Yolo",
      "Issue", "Worktree", "QA", "資安", "規格", "人工驗收"]) {
      assert.ok(html.includes(label), page + " missing critical guidance: " + label);
    }
    assert.ok(html.includes('href="https://github.com/sodahsu/notes/blob/main/SPEC.md"'), "documentation must link to synchronized spec");
    assert.ok(html.includes('function updateSectionNav()'), "PR3 navigation state regression");
    assert.ok(html.includes('const roleJumpLinks'), "role jump opening regression");
  });
}

test("Spec synchronization policy is documented for future changes", () => {
  assert.match(spec, /同一個 PR／變更中/);
  assert.match(spec, /openspec\/changes\//);
  assert.match(spec, /openspec\/specs\//);
  assert.match(agents, /同步修改規格/);
  assert.match(readme, /SPEC\.md/);
  assert.match(prTemplate, /規格同步檢查/);
});
