# AGENTS.md — Orca 使用指南維護規範

此 repo 是 GitHub Pages「短首頁 + 完整手冊」兩層教學。先讀 `SPEC.md`，再修改任何內容。規格有影響時，同一 PR 同步修改規格、網站與測試。第一層用短情境激發探索意願，第二層才放完整技術知識；不得把長文章再塞回首頁。

## 真相來源

- `SPEC.md`：landing-mission-contract、完整手冊各種契約及安全規範。
- `index.html`：極短的 3 情境入門頁；`orca-openspec-designer-guide-with-ui.html`：相同的相容入口鏡像。
- `guide.html`：原有完整手冊，包含 15 章節、12 種職能、6 種痛點及 13 步深度教學；不能為了縮短首頁而刪掉這些內容。
- `README.md`：入口摘要，必須與網站定位、功能邊界一致。
- `tests/*.test.mjs`：規格契約、互動與瀏覽器回歸。

## 內容與產品事實

1. 首頁只放短標題、3 個可點選的工作困境、可展開的前後差異、短 Prompt 與完整教學入口；不要技術術語堆疊、四階說教或大量長卡片。示範必須標清楚不是真實執行。
2. Quickstart 必須分流文件／需求工作與程式／介面工作；PM／SA 的唯讀分析不要求建立 Worktree。
3. Orca 是 coding-agent 開發環境，不是模型、PM 專案管理平台或 no-code 工具；PM／SA 的用法需標示為搭配 Agent 的工作方法。
4. OpenSpec 是與 Orca 搭配的規格方法／工具，不得描述為 Orca 原生內建。
5. Orca 官方文件有版本差異時，使用當前官方文件；不要沿用已退役 CLI 指令。
6. 區分原生功能與建議工作法，特別是 Heartbeat、Watchdog、Recovery：
   - Worker heartbeat 是 Orchestration 訊息；只有目前 preamble 要求時才送，並帶 taskId／dispatchId；不要自行假設固定頻率。
   - Agent Dashboard 是 OSC title sequence／hooks 推導的狀態視圖。
   - Mobile heartbeat 是桌面 Agent process 的手機狀態同步。
   - Runtime Supervisor 監督 Orca Server，不是個別 Worker；官方服務支援平台依官方文件標示。
   - 不得宣稱 Orca 有未經官方文件確認的 Worker timeout auto-kill／auto-restart／auto-retry。
   - Worker 恢復需先查證 Dispatch／Terminal，再明確 stop／retry；重試需重新指定 placement。
7. 安全敘述不可淡化：Worktree 不是 OS sandbox；檢查 Agent launch arguments；正式資料、憑證與不可逆操作需最小權限及人工核准。

## 修改規則

- 修改首頁情境時，更新 `SPEC.md` 的 LANDING-01～08、landing-mission-contract、首頁鏡像及 Browser Smoke Test；每個入口都必須展示具體成果和對應的詳細教學，不能只做裝飾卡片。
- 修改完整手冊時，優先維持 `guide.html` 的契約及 15 章節；不要把首頁和完整手冊混為一談。

- 新增／刪除／更名導覽或頁面章節：同一 PR 更新 `SPEC.md` 的 navigation-contract／page-section-contract、HTML、README（若適用）與測試。
- 新增／修改職能：更新 role-contract、角色卡、Prompt、交付物與人工驗收責任。
- 新增／修改痛點案例：更新 problem-case-contract、互動按鈕與 Browser Smoke Test。
- 新增／修改互動教學：更新 tutorial-contract、TUTORIAL 條文、靜態示例資料、首頁教學互動、README、Node 與 Chromium 測試。複製失敗須可選取原文，完成勾選只代表使用者自行記錄，不可宣稱 Orca 已執行。
- 修改 Heartbeat／Watchdog／Recovery：更新 watchdog-contract 及 WATCH 條文，標清楚 Orca 原生能力、官方未承諾能力、團隊建議。
- `index.html` 與相容入口 HTML 必須 byte-identical；`guide.html` 是完整手冊，不與首頁同步覆寫。
- 不得把 AI 推測、SA 原型或 Mock 假設寫成已批准的業務規則。
- 若規格無影響，PR 必須明確寫出理由。

## 驗證

1. `node --test tests/*.test.mjs`。
2. GitHub Actions 的 `tests/browser-smoke.mjs` 必須通過桌面 1280×800 與手機 390×844。
3. 同時驗證短首頁與完整手冊：3 個短情境的切換、鍵盤、成果展開、Prompt 複製成功與失敗回退、導至正確的完整案例；完整手冊的 13 步教學、12 職能、6 痛點、Watchdog、舊錨點轉址、手機版、JS 例外與非預期水平溢出。
4. PR 使用 `.github/pull_request_template.md` 並提供 CI 證據。
5. 未執行的測試標 NOT_RUN；不可宣稱完成。
