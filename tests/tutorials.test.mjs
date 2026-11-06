import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const spec = readFileSync("SPEC.md", "utf8");
const pages = ["index.html", "orca-openspec-designer-guide-with-ui.html"];

function specTutorialIds() {
  const start = spec.indexOf("<!-- tutorial-contract:start -->");
  const end = spec.indexOf("<!-- tutorial-contract:end -->", start);
  assert.ok(start >= 0 && end > start, "tutorial-contract is required");
  return spec.slice(start, end).split("\n")
    .map(line => line.split("|")[1]?.trim())
    .filter(id => id && /^tutorial-[a-z0-9-]+$/.test(id));
}
const contractIds = specTutorialIds();

function parseTutorialData(html) {
  const match = html.match(/<script type="application\/json" id="tutorialData">([\s\S]*?)<\/script>/);
  assert.ok(match, "missing tutorial JSON source");
  return JSON.parse(match[1]);
}

test("SPEC defines three unique tutorial IDs and behavior contracts", () => {
  assert.deepEqual(contractIds, ["tutorial-pm-sa", "tutorial-design", "tutorial-engineering"]);
  assert.equal(new Set(contractIds).size, contractIds.length);
  for (let n = 1; n <= 11; n++) {
    assert.ok(spec.includes("TUTORIAL-" + String(n).padStart(2, "0")), "missing tutorial requirement " + n);
  }
});

for (const file of pages) {
  test(file + ": tutorial data, steps and review gates match SPEC", () => {
    const html = readFileSync(file, "utf8");
    const data = parseTutorialData(html);
    assert.deepEqual(data.map(item => item.id), contractIds, "IDs and order differ from SPEC");
    for (const item of data) {
      assert.ok(item.label.length > 6 && item.summary.length > 20, item.id + " has no context");
      assert.ok(item.steps.length >= 4, item.id + " has fewer than four steps");
      for (const [index, step] of item.steps.entries()) {
        for (const key of ["title", "input", "action", "prompt", "output", "review"]) {
          assert.ok(typeof step[key] === "string" && step[key].trim().length >= (key === "title" ? 4 : 12),
            item.id + " step " + index + " missing " + key);
        }
        assert.ok(/確認|檢查|核准|驗收|審查|審核|批准/.test(step.review), "human gate missing");
      }
    }
    assert.ok(data[0].steps[0].action.includes("不必建立 Worktree"), "PM/SA must not require worktree");
    const engineering = data.find(item => item.id === "tutorial-engineering");
    const all = JSON.stringify(engineering);
    for (const key of ["Worktree", "Task", "Dispatch", "heartbeat", "QA", "PR"]) {
      assert.ok(all.toLowerCase().includes(key.toLowerCase()), "engineering tutorial missing " + key);
    }
    assert.ok(all.includes("不宣稱") || all.includes("不可只因無心跳"), "no guaranteed auto-recovery");
  });

  test(file + ": interactive controls and accessible prompt fallback are present", () => {
    const html = readFileSync(file, "utf8");
    assert.ok(html.includes('id="tutorialLab"'));
    assert.ok(html.includes('role="tablist"'));
    assert.ok(html.includes('id="tutorialPanel"'));
    assert.ok(html.includes('role="tabpanel"'));
    assert.ok(html.includes('id="tutorialPrompt"'));
    assert.ok(html.includes('id="tutorialPrompt" rows="6" readonly'), "prompt must remain selectable");
    assert.ok(html.includes('id="tutorialCopyStatus" role="status" aria-live="polite"'));
    assert.ok(html.includes('id="tutorialComplete" type="checkbox"'));
    for (const control of ["tutorialPrev", "tutorialNext", "tutorialCopy", "tutorialProgress"]) {
      assert.ok(html.includes('id="' + control + '"'), "missing control " + control);
    }
    for (const id of contractIds) {
      assert.ok(html.includes('id="' + id + '"'), "missing case tab " + id);
      assert.ok(html.includes('data-tutorial="' + id + '"'));
    }
    const tabMarkup = [...html.matchAll(/<button[^>]*role="tab"[^>]*>/g)];
    assert.equal(tabMarkup.length, contractIds.length, "one interactive tab per case");
    const tutorialScript = html.slice(html.lastIndexOf("<script>"), html.lastIndexOf("</script>"));
    assert.ok(tutorialScript.includes('navigator.clipboard.writeText'), "copy action missing");
    assert.ok(tutorialScript.includes("prompt.select()"), "manual copy fallback missing");
    assert.ok(tutorialScript.includes('"ArrowRight"') && tutorialScript.includes('"ArrowLeft"'),
      "keyboard tab navigation missing");
    assert.ok(!/localStorage|sessionStorage|fetch\s*\(/.test(tutorialScript),
      "tutorial must remain local-only and nonpersistent");
    assert.ok(html.includes("不會連線或執行 Orca"), "simulation boundary missing");
  });
}

test("Published HTML variants remain byte-identical", () => {
  assert.equal(readFileSync(pages[0], "utf8"), readFileSync(pages[1], "utf8"));
});
