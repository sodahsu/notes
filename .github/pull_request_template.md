## 本次變更

說明使用者可觀察的行為、文件或教學內容變化。

## 規格同步檢查（必填）

- [ ] 已讀取 `SPEC.md` 並確認是否影響 `WEB / ROLE / PLAN / FLOW / SAFE` 契約
- [ ] 規格有影響：已在**本 PR** 同步修改 `SPEC.md`；或規格無影響，以下說明理由
- [ ] `index.html` 與 `orca-openspec-designer-guide-with-ui.html` 逐字一致
- [ ] README 與網站公開承諾、章節入口同步（若適用）
- [ ] 新增／修改角色與導覽時，相關 `tests/*.test.mjs` 已更新
- [ ] 不把 AI 推論當成已批准的業務規格；所有重要決策皆列負責人與來源

規格無影響的原因（若適用）：＿＿＿

## 驗證證據

- GitHub Actions `verify-guide.yml`：PASS／FAIL／NOT_RUN／BLOCKED（附證據）
- `node --test tests/*.test.mjs` 本機（若執行）：PASS／FAIL／NOT_RUN／BLOCKED
- 導覽／錨點／角色展開／常見痛點切換：PASS／FAIL／NOT_RUN／BLOCKED
- Desktop／Mobile：PASS／FAIL／NOT_RUN／BLOCKED
- 官網功能來源與人工審查：PASS／FAIL／NOT_RUN／BLOCKED

## 風險與待決策

列出未確認的業務規則、產品版本差異、權限或相依 PR。
