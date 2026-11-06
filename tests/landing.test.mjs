import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const spec = readFileSync("SPEC.md", "utf8");
const home = readFileSync("index.html", "utf8");
const alias = readFileSync("orca-openspec-designer-guide-with-ui.html", "utf8");
const guide = readFileSync("guide.html", "utf8");

function missionIds() {
  const start = spec.indexOf("<!-- landing-mission-contract:start -->");
  const end = spec.indexOf("<!-- landing-mission-contract:end -->", start);
  assert.ok(start >= 0 && end > start, "landing-mission-contract is required");
  return spec.slice(start, end).split("\n")
    .map(line => line.split("|")[1]?.trim())
    .filter(value => /^mission-[a-z0-9-]+$/.test(value ?? ""));
}

const missions = JSON.parse(home.match(/<script type="application\/json" id="missionData">([\s\S]*?)<\/script>/)?.[1] ?? "[]");

test("short homepage preserves detailed guide and legacy alias", () => {
  assert.equal(home, alias, "alias must remain identical to the short homepage");
  assert.ok(guide.length > 100_000, "full technical guide must remain available");
  assert.ok(home.length < 32_000, "landing should be dramatically shorter than the original guide");
  assert.ok(home.length * 4 < guide.length, "home should not repeat a long technical article");
  assert.ok(home.includes('href="guide.html"'), "full guide should be one click away");
  assert.match(home, /你負責想清楚/);
  assert.ok(!home.includes('id="watchdog"'), "watchdog belongs in the second level");
  assert.ok(guide.includes('id="watchdog"'), "watchdog guide remains accessible");
  assert.ok(guide.includes('id="tutorialLab"'), "deep interactive tutorial remains accessible");
  assert.ok(guide.includes('href="./"'), "the guide has a route back home");
});

test("exactly three mission tabs match the SPEC and have specific short examples", () => {
  assert.deepEqual(missionIds(), ["mission-pm", "mission-design", "mission-team"]);
  assert.deepEqual(missions.map(mission => mission.id), missionIds());
  const buttons = [...home.matchAll(/<button\b[^>]*role="tab"[^>]*>/g)];
  assert.equal(buttons.length, missions.length);
  for (const mission of missions) {
    assert.ok(home.includes('id="' + mission.id + '"'), "mission tab id missing");
    assert.ok(home.includes('data-mission="' + mission.id + '"'), "mission data attribute missing");
    for (const key of ["label", "title", "hint", "before", "afterTitle", "prompt", "guide"]) {
      assert.ok(typeof mission[key] === "string" && mission[key].trim().length > 3,
        "incomplete scenario " + mission.id + ":" + key);
    }
    assert.equal(mission.outputs.length, 3, "a short tangible output needs three examples");
    assert.ok(mission.prompt.length < 280, "first prompt must be brief");
    assert.ok(mission.guide.startsWith("tutorial-"), "mission must open a specific full tutorial");
  }
  for (let i = 1; i <= 8; i++) assert.ok(spec.includes("LANDING-0" + i));
});

test("short home uses progressive reveal without pretending to execute AI", () => {
  assert.match(home, /示範情境，不是真實執行/);
  assert.match(home, /不會真的操作你的專案/);
  assert.ok(home.includes('id="missionResult" hidden'));
  assert.ok(home.includes('id="missionWaiting"'));
  assert.ok(home.includes('id="revealMission"'));
  assert.ok(home.includes('aria-expanded="false"'));
  assert.ok(home.includes('role="tabpanel"'));
  assert.ok(home.includes('role="tablist"'));
  assert.ok(home.includes('id="missionCopyStatus" class="copy-status" role="status" aria-live="polite"'));
  assert.ok(home.includes("navigator.clipboard.writeText"), "copy should be real, not decorative");
  assert.ok(home.includes("fields.prompt.select()"), "failure must still permit manual copy");
  assert.ok(!/localStorage|sessionStorage|fetch\s*\(/.test(home), "home should not store or transmit demo data");
  assert.ok(home.includes('guide.html?case='), "deep tutorial link must be case specific");
  assert.ok(guide.includes("new URLSearchParams(window.location.search)"), "full guide must select deep-linked case");
});

test("legacy fragment links continue to the full guide, local fragments are valid", () => {
  assert.ok(home.includes('location.replace("guide.html" + location.hash)'));
  assert.ok(home.includes('id.startsWith("role-")'), "legacy role shortcuts should continue");
  for (const old of ["watchdog", "orchestration", "quickstart", "crossroles", "reference"]) {
    assert.ok(home.includes('"' + old + '"'), "missing legacy anchor forwarding for " + old);
  }
  const ids = [...home.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  const localLinks = [...home.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, "homepage ids must be unique");
  for (const id of localLinks) assert.ok(ids.includes(id), "missing homepage anchor #" + id);
});
