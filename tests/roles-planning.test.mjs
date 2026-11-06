import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const pages = ["index.html", "orca-openspec-designer-guide-with-ui.html"];
const roleIds = ["role-pm", "role-sa", "role-ux", "role-frontend", "role-qa", "role-lead"];

test("published HTML files remain byte-identical", () => {
  assert.equal(readFileSync(pages[0], "utf8"), readFileSync(pages[1], "utf8"));
});

for (const page of pages) {
  test(page + ": planning and role links target existing sections", () => {
    const html = readFileSync(page, "utf8");
    for (const section of ["planning", "crossroles"]) {
      assert.match(html, new RegExp('<section id="' + section + '"'));
      assert.match(html, new RegExp('href="#' + section + '"'));
    }
    const ids = [...html.matchAll(/\\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, "ids must not duplicate");
    const missingAnchors = [...html.matchAll(/href="#([^"]+)"/g)]
      .map((m) => m[1]).filter((id) => !ids.includes(id));
    assert.deepEqual(missingAnchors, [], "on-page links must resolve");
  });

  test(page + ": all six roles have native expandable prompts", () => {
    const html = readFileSync(page, "utf8");
    for (const id of roleIds) {
      assert.match(html, new RegExp('<details id="' + id + '">[\\s\\S]*?<summary>'));
    }
    for (const term of ["PM", "SA", "UX/UI", "Frontend", "QA", "主管", "計畫完成，尚未執行"]) {
      assert.ok(html.includes(term), "missing topic: " + term);
    }
    assert.equal((html.match(/<details id="role-/g) ?? []).length, roleIds.length);
  });
}
