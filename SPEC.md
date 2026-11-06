# Orca 使用指南｜資訊架構、角色與監督規格

版本：2026-11-06

## 1. 目的、定位與真相來源

本 Repo 是 **Orca 使用方法教學網站**，目標是讓使用者先理解「Orca 能解決什麼工作問題」，再依自己的職能找到入門路徑，最後學會多 Agent 監督、故障處理與安全交付。

- Orca 是面向 coding agents 的開發環境；不是模型、不是 Jira／專案管理平台、不是 no-code 工具，也不保證自動完成業務核准或所有 Worker 故障恢復。
- PM／PO／SA 可在需要 Repo、規格、Mock 或開發上下文時使用 Agent 輔助 Planning；業務決策與正式專案追蹤仍由既有權責及工具負責。
- OpenSpec 是與 Orca 搭配使用的規格方法／工具，不得寫成 Orca 原生內建功能。
- 本手冊內容與互動的規格來源：本檔 `SPEC.md`。
- 實作來源：`index.html`；`orca-openspec-designer-guide-with-ui.html` 是完全一致的鏡像。
- 快速查閱：`README.md`。AI 維護規則：`AGENTS.md`。
- 可驗證行為：`tests/*.test.mjs`。測試通過不取代人工內容審查。
- Orca 產品能力以當前官方文件與版本為準；建議工作法不得冒充原生功能。

本 Repo 的 `SPEC.md` 規範本網站，不代替實際業務專案的 OpenSpec。其他專案中未批准／未實作的需求放在 `openspec/changes/`；只有經授權確認、實作與驗證的現行行為才進 `openspec/specs/`。

## 2. 首頁閱讀路徑與主要導覽契約

首頁先回答「為什麼要用」，再提供職能入口、交付全貌、第一次使用與進階監督。頂部導覽只放主要入口；次要操作章節透過首頁卡片、職能連結與上下文 CTA 進入，避免把所有細節塞進同一排導覽。

<!-- navigation-contract:start -->
| id | 導覽標籤 | 使用者問題 |
| --- | --- | --- |
| why | Orca 能幫什麼 | 什麼情況值得用 Orca？ |
| crossroles | 依職能找用法 | 我的角色可以怎麼開始？ |
| teamwork | 從需求到交付 | 團隊如何交接與驗收？ |
| quickstart | 第一次開始 | 如何完成第一個小任務？ |
| planning | 計畫與規格 | 怎麼先整理需求再派工？ |
| orchestration | 多 Agent 協作 | 怎麼分派與監督 Worker？ |
| watchdog | 心跳與故障處理 | Worker 是否還活著？卡住如何恢復？ |
| openspec | OpenSpec 同步 | 怎麼讓規格與程式同步？ |
| safety | 安全與權限 | 怎麼控制 Agent 權限與資料風險？ |
| reference | 指令速查 | 需要查什麼術語或指令？ |
<!-- navigation-contract:end -->

<!-- page-section-contract:start -->
| id | 章節目的 |
| --- | --- |
| why | Orca 定位、適用與不適用情境 |
| crossroles | 12 種職能入口與可複製 Prompt |
| teamwork | 端到端交付流程、責任矩陣與任務來源 |
| quickstart | 第一次使用與第一個任務 |
| planning | 唯讀調查、計畫與人工核准 |
| openspec | Change 與現行 Spec 的界線 |
| designer | 設計師的 Browser／Design Mode 工作法 |
| frontend | 前端工程流程 |
| problems | 五種常見痛點的互動切換 |
| orchestration | Run／Task／Dispatch／Worker／Coordinator |
| watchdog | Heartbeat、狀態監控、Watchdog 與 Recovery |
| safety | Agent 權限、資料與不可逆操作治理 |
| mobile | 手機 companion、RWD、Emulator 與 WebView |
| reference | 名詞、CLI 與官方文件 |
<!-- page-section-contract:end -->

<!-- problem-case-contract:start -->
| id | 使用者問題 |
| --- | --- |
| agent-handoff | AI 額度用完，需要換 Agent 接手 |
| worktree-conflict | 多個功能同時開發，避免互相踩檔案 |
| diff-review | AI 擴大修改範圍，需要檢查 Diff |
| design-mode | 想直接指出畫面元件並修正 |
| checkpoint | 隔天回來或換人接手，需要進度快照 |
| worker-watch | Worker 沒回應，需要判斷是否卡住與安全恢復 |
<!-- problem-case-contract:end -->


### WEB requirements

- **WEB-01**：所有站內 `href="#..."` 必須指向真實且唯一的 HTML ID。
- **WEB-02**：常見痛點保留六個互動案例；切換內容不得重建按鈕或遺失焦點。
- **WEB-03**：桌面與窄螢幕可閱讀；`details/summary` 支援滑鼠與鍵盤；職能捷徑會自動展開對應 Prompt。
- **WEB-04**：`index.html` 與鏡像 HTML 必須逐字一致；重排章節不得破壞現有 JavaScript。
- **WEB-05**：頂部導覽、頁面章節、職能數量以本檔契約為準，測試從契約讀取，不得在多處寫死互相矛盾的數字。
- **WEB-06**：PR 需執行 Node 測試與真實 Chromium Browser Smoke Test；未執行標記 NOT_RUN。
- **WEB-07**：Browser Smoke Test 至少覆蓋契約中的導覽、所有職能捷徑、所有痛點案例、鍵盤展開、無 JS 例外與非預期橫向溢出；桌面 1280×800、手機 390×844。
- **WEB-08**：主導覽只顯示 navigation-contract；所有 page-section-contract 章節仍需可由主導覽、職能卡、CTA 或內容連結到達。

## 3. 角色情境契約

每個職能都必須有具體情境、輸入、工作步驟／Prompt、交付物與人工驗收責任。Agent／Coordinator／Worker 是 Orca 執行角色，不等於公司組織職稱。

<!-- role-contract:start -->
| id | 職能 |
| --- | --- |
| role-pm | PM 專案經理 |
| role-po | PO／業務負責人 |
| role-sa | SA 系統分析師 |
| role-ux | UX/UI 設計師 |
| role-frontdesign | 前端設計師 |
| role-frontend | 前端工程師 |
| role-backend | 後端工程師 |
| role-qa | QA 測試人員 |
| role-security | 資安／個資負責人 |
| role-devops | DevOps／維運 |
| role-support | 系統管理／客服 |
| role-lead | 主管／Coordinator |
<!-- role-contract:end -->

- **ROLE-01**：PM 規劃、PO 業務決策、SA 規格與契約、UX/UI 體驗、前端設計師互動落地、前端工程師工程品質、後端資料與授權、QA 驗證、資安風險、維運上線與主管資源決策需分清楚。
- **ROLE-02**：政府標案與多階段繳費案例僅示範，不代表未經確認的客戶業務規則。
- **ROLE-03**：PM／SA 文件分析不必預設建立 Worktree；只有需要修改 Repo 或獨立開發功能時才考慮。
- **ROLE-04**：Role Prompt 預設唯讀，區分已確認、推論、待確認；寫入、對外操作與業務核准由人決定。

## 4. Planning、Orchestration 與規格同步

- **PLAN-01**：Planning 是工作方法：需求與證據分析、範圍、依賴、風險、交付物及驗收計畫；不是 Orca 內建 PM 模組。
- **PLAN-02**：Orchestration 是 Orca 的正式多 Agent 編排層，包含 Run、Task、Dispatch、Worker、訊息與 Decision Gate；它不代表需求已核准。
- **PLAN-03**：OpenSpec 是搭配 Orca 使用的規格方法／工具。待實作／未批准意圖放在 `openspec/changes/`；已實作、驗證、經授權確認的現行行為才進 `openspec/specs/`。
- **PLAN-04**：單一完整功能原則上一個 Worktree／一位主要 Writer；可有多個唯讀調查與驗收代理，但禁止未授權的共檔案平行寫入。
- **PLAN-05**：需求變更時，在同一 PR／變更中評估並同步更新 Change／Spec、文件、Mock／API 契約及驗收測試。
- **PLAN-06**：驗收狀態使用 PASS、FAIL、NOT_RUN、BLOCKED。Git 破壞性操作、正式部署、資料異動與個資揭露保留人工 Gate。

## 5. 任務管理與端到端交付

- **FLOW-01**：教學交付鏈為需求／Issue → PO 核准 → SA Scenario／契約 → 設計與實作 → QA／資安 → PR／部署 → 維運交接。
- **FLOW-02**：GitHub、GitLab、Jira、Linear 等任務來源須實際連線與授權；Issue 狀態、Worktree 狀態、Agent Dashboard 狀態與業務驗收不得混為一談。
- **FLOW-03**：Issue、Worktree、PR、CI、測試與交付證據需可追溯。Agent 顯示 Done 不代表 PM／PO 已驗收。
- **FLOW-04**：部署交付包含環境、上線核准、回復策略、監控與操作交接。

## 6. Heartbeat、Watchdog 與 Recovery 契約

<!-- watchdog-contract:start -->
| 能力 | 分類 | 本手冊必須說清楚的行為 |
| --- | --- | --- |
| Worker Heartbeat | Orca 原生 | 長時間工作的 Worker 應回報 heartbeat；訊息需帶 taskId 與 dispatchId。 |
| Agent Dashboard | Orca 原生 | 依終端機 OSC title sequence 與 Agent hooks 顯示 Working／Needs You／Done／Blocked／Idle；是狀態視圖，不是程序存活保證。 |
| Mobile Heartbeat | Orca 原生 | 手機追蹤桌面 Agent process heartbeat；卡住的 spinner 可強制刷新 Worktree row。這不是 Worker auto-recovery。 |
| Runtime Supervisor | Orca 原生（平台受限） | 監督 Orca Server 程序並在異常退出後重新啟動；不是個別 Worker Watchdog。官方 service install 支援 macOS／Linux，Windows 尚不支援。 |
| Worker Recovery | Orca 原生的明確操作 | worker-show／worker-read／worker-stop／worker-start --retry-of；需先查證再由 Coordinator 決定，不能當成自動重派。 |
| Worker Watchdog policy | 本手冊建議的團隊流程 | 以 heartbeat、checkpoint、Dashboard、Dispatch 與 Terminal 證據判斷 Healthy／Slow／Stale／Failed／Blocked；觀察門檻由團隊設定。 |
<!-- watchdog-contract:end -->

- **WATCH-01**：不得宣稱 Orca 已提供通用 Worker Watchdog，可在 heartbeat timeout 後自動 kill／restart／retry。官方文件未承諾這種自動故障恢復。
- **WATCH-02**：Worker heartbeat、Agent Dashboard 狀態、Mobile heartbeat、Runtime Supervisor 必須分別說明，不可混稱同一種心跳。
- **WATCH-03**：Orchestration `check --wait` 等待期間每 15 秒寫到 stderr 的 JSON heartbeat，是等待命令本身的訊號，不是 Worker heartbeat interval。
- **WATCH-04**：官方沒有承諾固定 Worker heartbeat 秒數；Watchdog timeout 由團隊依任務類型與長指令設定，不得把 15 秒當成 Worker 週期。
- **WATCH-05**：疑似失聯先檢查 Worker／Dispatch／Terminal；只有確認前一個 Dispatch 安全結束，才可明確 retry，並重新指定 Worktree／host placement。
- **WATCH-06**：Runtime Supervisor 只監督 Orca Server，不可描述為個別 Worker 的看門狗。
- **WATCH-07**：Agent Dashboard 的 Working／Needs You／Done／Blocked／Idle 是 Agent 狀態，不是業務交付狀態。

## 7. 安全與權限治理

- **SAFE-01**：Orca 對支援 Agent 可能預設帶入高自主權啟動參數；須提醒使用者在 Settings → Agents 檢查每個 Agent 的 launch arguments，依專案敏感度調整。不可假設每次操作都會詢問。
- **SAFE-02**：Worktree 是 Git 工作目錄隔離，不是完整 OS 安全沙箱。
- **SAFE-03**：正式憑證、客戶資料、個資、未授權檔案與具寫入權的連接器遵守最小權限與資料最小化。
- **SAFE-04**：刪除、重設、強制推送、正式部署、改權限、正式資料異動等不可逆操作需獨立人工核准。
- **SAFE-05**：Skills／MCP／外部 Agent 安裝前檢查來源、權限、資料流與供應商政策；前端遮罩不能取代後端授權。

## 8. 規格同步維護規則（所有後續 PR 必遵守）

1. 變更前閱讀 `SPEC.md`、`AGENTS.md`、`README.md`、兩份 HTML 與相關測試。
2. 章節、導覽、職能或 Watchdog 能力有變更時，在同一 PR 更新對應契約表及受影響的 WEB／ROLE／PLAN／FLOW／WATCH／SAFE 條文。
3. `index.html` 與 `orca-openspec-designer-guide-with-ui.html` 必須逐字一致。
4. 若影響入門或公開承諾，同步更新 README；修改可觀察行為時同步更新 Node 與 Chromium 測試。
5. 測試必須從本檔契約讀取導覽與角色，不得在多處寫死互相矛盾的數量。
6. 官方功能敘述需附當前官方來源；未確認功能標為未確認，建議工作法標為建議。
7. 執行 `node --test tests/*.test.mjs` 與 `node --test tests/browser-smoke.mjs`；在 PR 標示 PASS／FAIL／NOT_RUN／BLOCKED。
8. 未通過驗證或未經核准，不可宣告完成、部署或合併。

本檔是手冊維護契約，不保證 AI 或 Git 自動更新規格；每次修改仍須由作者與 CI 驗證。
