## 本次變更

說明使用者可觀察的行為、文件或教學內容變化。

## 規格同步檢查（必填）

- [ ] 已讀取 `SPEC.md` 並確認是否影響 `WEB / ROLE / PLAN / FLOW / SAFE` 契約
- [ ] 規格有影響：已在**本 PR** 同步修改 `SPEC.md`；或規格無影響，以下說明理由
- [ ] `index.html` 與 `orca-openspec-designer-guide-with-ui.html` 逐字一致
- [ ] README 與網站公開承諾、章節入口同步（若適用）
- [ ] 新增／修改角色、導覽、首頁任務案例或學習路徑時，`SPEC.md`、README 與 Node／Chromium 測試已同步更新
- [ ] 首頁案例包含使用者問題、Agent 參與方式、可交付成果與人工決策界線
- [ ] Quickstart 區分文件／需求工作與程式／介面工作；未要求 PM／SA 為唯讀分析建立 Worktree
- [ ] 不把 AI 推論當成已批准的業務規格；所有重要決策皆列負責人與來源
- [ ] Heartbeat／Watchdog／Recovery 的描述已區分 Orca 原生功能、官方未承諾能力與團隊建議，並附官方文件來源（若本次有影響）

規格無影響的原因（若適用）：＿＿＿

## 驗證證據

- GitHub Actions `verify-guide.yml`：Node 及 Chromium Browser Smoke Test 均 PASS／FAIL／NOT_RUN／BLOCKED（附證據）
- `node --test tests/*.test.mjs` 本機（若執行）：PASS／FAIL／NOT_RUN／BLOCKED
- 導覽／錨點／角色展開／常見痛點切換：PASS／FAIL／NOT_RUN／BLOCKED
- Desktop／Mobile：PASS／FAIL／NOT_RUN／BLOCKED
- 官網功能來源與人工審查：PASS／FAIL／NOT_RUN／BLOCKED

## 風險與待決策

列出未確認的業務規則、產品版本差異、權限或相依 PR。
