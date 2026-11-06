import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const pages = ["guide.html"];
const spec = readFileSync("SPEC.md", "utf8");
const agents = readFileSync("AGENTS.md", "utf8");
const readme = readFileSync("README.md", "utf8");
const prTemplate = readFileSync(".github/pull_request_template.md", "utf8");

function contractIds(name, pattern) {
  const startTag = "<!-- " + name + ":start -->";
  const endTag = "<!-- " + name + ":end -->";
  const start = spec.indexOf(startTag);
  const end = spec.indexOf(endTag, start);
  assert.ok(start >= 0 && end > start, "missing spec contract: " + name);
  const block = spec.slice(start + startTag.length, end);
  const ids = block.split("\n").map(line => line.split("|")[1]?.trim())
    .filter(value => value && pattern.test(value));
  assert.ok(ids.length > 0, "empty contract: " + name);
  assert.equal(new Set(ids).size, ids.length, name + " IDs duplicated in SPEC.md");
  return ids;
}
const navigation = contractIds("navigation-contract", /^(?!id$)[a-z][a-z0-9-]*$/);
const sections = contractIds("page-section-contract", /^(?!id$)[a-z][a-z0-9-]*$/);
const roles = contractIds("role-contract", /^role-[a-z0-9-]+$/);
const problemCases = contractIds("problem-case-contract", /^(?!id$)[a-z][a-z0-9-]*$/);

test("Short landing and its legacy alias remain byte-identical", () => {
  assert.equal(readFileSync("index.html", "utf8"), readFileSync("orca-openspec-designer-guide-with-ui.html", "utf8"));
});

test("SPEC defines a user-first journey and all supported entry paths", () => {
  assert.ok(navigation.includes("journey"), "actual-work examples must be a primary entry");
  assert.ok(sections.includes("journey"));
  assert.ok(roles.includes("role-pm") && roles.includes("role-sa"));
  assert.ok(roles.includes("role-frontdesign") && roles.includes("role-security"));
  assert.ok(roles.includes("role-devops") && roles.includes("role-support"));
  assert.ok(problemCases.includes("worker-watch"));
});

for (const page of pages) {
  test(page + ": primary navigation and all page sections match SPEC.md", () => {
    const html = readFileSync(page, "utf8");
    const navStart = html.indexOf('<nav class="topnav"');
    const navEnd = html.indexOf("</nav>", navStart);
    assert.ok(navStart >= 0 && navEnd > navStart, "top navigation missing");
    const topNav = html.slice(navStart, navEnd);
    const navLinks = [...topNav.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(navLinks, navigation, "primary nav does not match SPEC.md");
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, "duplicate IDs on page");
    const allAnchors = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
    for (const id of allAnchors) assert.ok(ids.includes(id), "broken anchor: #" + id);
    const pageIds = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(pageIds, sections, "page section order does not match SPEC.md");
    for (const section of sections) {
      assert.ok(allAnchors.includes(section), "page section must be reachable from a link: #" + section);
    }
  });

  test(page + ": user-first hero and practical task examples are present", () => {
    const html = readFileSync(page, "utf8");
    assert.ok(html.includes("不要先學 Orca。先選一件想完成的工作。"));
    const hero = html.slice(html.indexOf('<section class="hero">'), html.indexOf("</section>", html.indexOf('<section class="hero">')));
    for (const label of ["把需求變清楚", "把畫面做出來", "讓 AI 工作可管理"]) {
      assert.ok(hero.includes(label), "hero missing value proposition: " + label);
    }
    const journeyStart = html.indexOf('<section id="journey"');
    const journeyEnd = html.indexOf("</section>", journeyStart);
    const journey = html.slice(journeyStart, journeyEnd);
    for (const label of ["PM / SA", "UX / DESIGN", "ENGINEERING", "成果：", "LEVEL 1", "LEVEL 2", "LEVEL 3", "LEVEL 4"]) {
      assert.ok(journey.includes(label), "journey missing: " + label);
    }
    assert.ok(journey.includes('href="#role-sa"'));
    assert.ok(journey.includes('href="#role-ux"'));
    assert.ok(journey.includes('href="#orchestration"'));
  });

  test(page + ": quickstart separates document work from code work", () => {
    const html = readFileSync(page, "utf8");
    const start = html.indexOf('<section id="quickstart"');
    const end = html.indexOf("</section>", start);
    const quickstart = html.slice(start, end);
    assert.ok(quickstart.includes("PATH A · PM / PO / SA"));
    assert.ok(quickstart.includes("PATH B · UX / FRONTEND / ENGINEERING"));
    assert.ok(quickstart.includes("這條路徑不需要 Worktree"));
    assert.ok(quickstart.includes("建立一個功能 Worktree"));
  });

  test(page + ": every contracted role has a scenario, prompt and human reviewer", () => {
    const html = readFileSync(page, "utf8");
    const blocks = [...html.matchAll(/<details id="(role-[^"]+)">([\s\S]*?)<\/details>/g)];
    assert.deepEqual(blocks.map(m => m[1]), roles, "role detail IDs and order must match SPEC.md");
    for (const [, id, content] of blocks) {
      assert.match(content, /<summary>[\s\S]*?<\/summary>/, id + " missing summary");
      for (const label of ["輸入", "交付", "人工驗收"]) {
        assert.ok(content.includes(label), id + " missing: " + label);
      }
      assert.match(content, /<pre class="code">[\s\S]*?<\/pre>/, id + " missing reusable prompt");
      assert.ok(html.includes('href="#' + id + '"'), id + " missing role jump link");
    }
  });

  test(page + ": watchdog product boundaries remain visible", () => {
    const html = readFileSync(page, "utf8");
    for (const label of ["Worker Heartbeat", "Agent Dashboard", "Mobile Heartbeat",
      "Runtime Supervisor", "Healthy", "Slow", "Stale", "Failed", "Blocked",
      "worker-show", "worker-read", "worker-stop", "--retry-of", "check --run",
      "preamble 明確要求時", "不是個別 Worker", "沒有承諾"]) {
      assert.ok(html.includes(label), page + " missing guidance: " + label);
    }
    assert.ok(html.includes('href="https://www.onorca.dev/docs/cli/orchestration"'));
    assert.ok(html.includes('href="https://www.onorca.dev/docs/remote-servers"'));
    assert.ok(html.includes('function updateSectionNav()'), "navigation state regression");
    assert.ok(html.includes('const roleJumpLinks'), "role jump opening regression");
  });
}

test("Watchdog capability boundaries are explicit in SPEC.md", () => {
  assert.match(spec, /WATCH-01[\s\S]*?沒有承諾/);
  assert.match(spec, /WATCH-03[\s\S]*?不是 Worker heartbeat/);
  assert.match(spec, /WATCH-06[\s\S]*?不可描述為個別 Worker/);
  assert.match(spec, /WATCH-07[\s\S]*?不是業務交付狀態/);
});

test("Spec synchronization policy is documented for future changes", () => {
  assert.match(spec, /同一 PR/);
  assert.match(spec, /openspec\/changes\//);
  assert.match(spec, /openspec\/specs\//);
  assert.match(agents, /同步修改規格/);
  assert.match(readme, /SPEC\.md/);
  assert.match(prTemplate, /規格同步檢查/);
});
