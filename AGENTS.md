# AGENTS.md — Orca 使用指南維護規範

此 repo 是靜態 GitHub Pages 手冊。先讀 `SPEC.md`，再修改任何內容。每次內容或功能改動都必須評估是否需要同步修改規格；規格有影響時，必須在同一 PR 同步修改規格、網站內容與測試。手冊目標是讓使用者依工作目標找到 Orca 用法，而不是堆疊技術名詞。

## 真相來源

- `SPEC.md`：主要導覽、全部頁面章節、角色、痛點案例、Heartbeat／Watchdog／Recovery 及安全契約。
- `index.html`：主頁；`orca-openspec-designer-guide-with-ui.html`：必須逐字一致的鏡像。
- `README.md`：入口摘要，必須與網站定位、功能邊界一致。
- `tests/*.test.mjs`：規格契約、互動與瀏覽器回歸。

## 內容與產品事實

1. 先確認使用者要完成的工作，再介紹功能；首頁必須提供真實任務案例，說明原本問題、Agent 參與方式、成果及人工決策界線。
2. Quickstart 必須分流文件／需求工作與程式／介面工作；PM／SA 的唯讀分析不要求建立 Worktree。
2. Orca 是 coding-agent 開發環境，不是模型、PM 專案管理平台或 no-code 工具；PM／SA 的用法需標示為搭配 Agent 的工作方法。
3. OpenSpec 是與 Orca 搭配的規格方法／工具，不得描述為 Orca 原生內建。
4. Orca 官方文件有版本差異時，使用當前官方文件；不要沿用已退役 CLI 指令。
5. 區分原生功能與建議工作法，特別是 Heartbeat、Watchdog、Recovery：
   - Worker heartbeat 是 Orchestration 訊息；只有目前 preamble 要求時才送，並帶 taskId／dispatchId；不要自行假設固定頻率。
   - Agent Dashboard 是 OSC title sequence／hooks 推導的狀態視圖。
   - Mobile heartbeat 是桌面 Agent process 的手機狀態同步。
   - Runtime Supervisor 監督 Orca Server，不是個別 Worker；官方服務支援平台依官方文件標示。
   - 不得宣稱 Orca 有未經官方文件確認的 Worker timeout auto-kill／auto-restart／auto-retry。
   - Worker 恢復需先查證 Dispatch／Terminal，再明確 stop／retry；重試需重新指定 placement。
6. 安全敘述不可淡化：Worktree 不是 OS sandbox；檢查 Agent launch arguments；正式資料、憑證與不可逆操作需最小權限及人工核准。

## 修改規則

- 新增首頁入口或學習層級時，更新 `SPEC.md` 的 WEB-09～WEB-13 與 Browser Smoke Test；入口必須能導向可完成的下一步，不可只做裝飾卡片。

- 新增／刪除／更名導覽或頁面章節：同一 PR 更新 `SPEC.md` 的 navigation-contract／page-section-contract、HTML、README（若適用）與測試。
- 新增／修改職能：更新 role-contract、角色卡、Prompt、交付物與人工驗收責任。
- 新增／修改痛點案例：更新 problem-case-contract、互動按鈕與 Browser Smoke Test。
- 修改 Heartbeat／Watchdog／Recovery：更新 watchdog-contract 及 WATCH 條文，標清楚 Orca 原生能力、官方未承諾能力、團隊建議。
- 兩份 HTML 必須 byte-identical。
- 不得把 AI 推測、SA 原型或 Mock 假設寫成已批准的業務規則。
- 若規格無影響，PR 必須明確寫出理由。

## 驗證

1. `node --test tests/*.test.mjs`。
2. GitHub Actions 的 `tests/browser-smoke.mjs` 必須通過桌面 1280×800 與手機 390×844。
3. 驗證主導覽、全部章節錨點、任務案例、四階學習路徑、文件／程式兩條 Quickstart、所有角色 Prompt、六個痛點、Watchdog 區塊、鍵盤展開、無 JS 例外與無非預期水平溢出。
4. PR 使用 `.github/pull_request_template.md` 並提供 CI 證據。
5. 未執行的測試標 NOT_RUN；不可宣稱完成。
