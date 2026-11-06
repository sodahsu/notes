# Orca × OpenSpec 工作手冊｜內容與互動規格

版本：2026-11-06（本次 PR 的目標規格）

## 1. 目的、界線與真相來源

本 Repo 是面向 PM、PO、SA、UX/UI、前端設計、前後端工程、QA、資安、維運與主管的 **Orca 工作方法教學網站**；不是 Orca 的產品原始碼，也不提供原生專案管理服務。

- **本網站內容與互動的規格來源：** 本檔 `SPEC.md`。
- **實作來源：** `index.html`（GitHub Pages 首頁）；`orca-openspec-designer-guide-with-ui.html` 是完全一致的鏡像，必須逐字同步。
- **入門摘要：** `README.md`。詳細情境與可複製 Prompt 以網站為準，不能互相矛盾。
- **可驗證行為：** `tests/*.test.mjs`。測試通過不能代替瀏覽器與人工內容審查。
- **Orca 功能事實：** 以實際版本及官方文件為證；不能將建議工作法描述為原生內建功能。
- **客戶／業務規格：** 以已核准需求決定「預期行為」；以 API、實作及實測決定「現況行為」，兩者衝突必須標記，不得以 AI 推測直接覆蓋。

手冊的 `SPEC.md` 只規範 **這個網站與其教學承諾**；它不代替其他專案的 OpenSpec。其他專案中尚未完成的工作應放在 `openspec/changes/`，只有已實作且驗證完成、經授權確認的行為才進 `openspec/specs/`，不得把原型、Mock 或未批准的規則直接寫成現行規格。

## 2. 網站章節契約

頂部 `nav.topnav` 的全部站內章節連結必須存在且順序如下（由自動測試比對）：

<!-- navigation-contract:start -->
| id | 章節目的 |
| --- | --- |
| why | 簡介與定位 |
| quickstart | 第一次使用 |
| problems | 五種常見痛點的互動切換 |
| designer | 設計師日常操作 |
| frontend | 前端開發流程 |
| planning | 唯讀分析、計畫、核准 |
| crossroles | 跨職能情境及可展開 Prompt |
| teamwork | 角色責任、Issue／Worktree 串接、交付生命週期 |
| orchestration | 正式 Run／Task／Worker／訊息機制 |
| openspec | 規格與實作的雙向同步 |
| safety | Agent 權限、資料、風險治理 |
| mobile | 裝置與模擬器測試界線 |
| reference | 名詞與指令 |
<!-- navigation-contract:end -->

需求：

- **WEB-01**：所有 `href="#..."` 必須指向真實存在且唯一的 HTML ID；導航鍵盤與滑鼠可使用。
- **WEB-02**：常見痛點保留原有五個可切換按鈕及每案的描述、Prompt、驗收內容；切換不得重建按鈕導致焦點遺失。
- **WEB-03**：桌面與窄螢幕都可閱讀；縮小頁面時導覽可換行，`details/summary` 可用滑鼠及鍵盤展開；點擊職能卡片的角色連結，必須自動展開對應的 Prompt 區塊。
- **WEB-04**：鏡像 HTML 完全一致，且新增段落不能破壞現有 JavaScript。
- **WEB-05**：導航、內部連結、角色區塊或展開數量變更時，測試**不得沿用過期固定數量**；應以此契約及實際目標做檢查。
- **WEB-06**：本 repo 的 PR 應由 `.github/workflows/verify-guide.yml` 以唯讀權限執行 `node --test tests/*.test.mjs`，自動擋下導航、角色、鏡像與互動回歸；CI 未跑時必須標記為 NOT_RUN，不能宣稱通過。

## 3. 角色情境契約

下列 `role-* ` 是網站交付的角色情境 ID。每個角色均需要「具體工作情境、輸入、建議步驟／Prompt、交付物、人工核准責任」，不能只有職稱。

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

- **ROLE-01**：明確區分「PM 規劃」「PO 業務決策」「SA 規格與契約」「設計師體驗判斷」「前端設計師互動實作」「前端工程師工程治理」；不將 Agent 模型角色誤當組織職稱。
- **ROLE-02**：政府標案與多階段繳費等案例僅是示範，不代表未經確認的客戶業務規則。
- **ROLE-03**：PM／SA 的分析工作不必建立 Worktree；只有版本控管的修改與獨立開發功能才需要考慮 Worktree。
- **ROLE-04**：所有 Role Prompt 預設先唯讀，輸出須區分已確認、推論、待確認，人工核准後才進行寫入或外部操作。

## 4. Planning、Orchestration 與規格同步

- **PLAN-01**：Planning = 需求與證據分析、依賴、範圍、風險及驗收計畫。
- **PLAN-02**：Orchestration = 正式 Run／Task／Dispatch／Worker 的執行協調；不等於需求已批准。Worker 提問需要 Coordinator 實際監督處理。
- **PLAN-03**：OpenSpec = 專案業務規格的可追溯變更與已驗證現行行為；不是聊天紀錄或 AI 自動補全。
- **PLAN-04**：單一完整功能原則一個 Worktree／一位主要 Writer；可多個唯讀調查／驗收代理，但禁止未授權的共檔案平行寫入。
- **PLAN-05**：需求變更時，**在同一個 PR／變更中**更新涉及的 Change/Spec、文件、Mock/API 契約及驗收測試。無法確認者必須列入待決策項，不能假裝同步完成。
- **PLAN-06**：驗收證據需分 PASS、FAIL、NOT_RUN、BLOCKED。對 Git 重要操作、部署、付款與個資揭露保留人工 Gate。

## 5. 任務管理與端到端交付

- **FLOW-01**：示範由需求／Issue → SA 確認／Scenario → UX／工程 → QA／資安 → 部署 → 維運的交付鏈，並寫明各 Gate 的權責與證據。
- **FLOW-02**：GitHub、GitLab、Jira、Linear 等任務來源只有在實際連線、授權後才能使用；Issue/Project 狀態是專案工作狀態，Agent Dashboard 的 Working／Done 是 AI 執行狀態，不能互相取代。
- **FLOW-03**：Issue 與 Worktree、PR、測試要保持可追溯；Issue 不得因 Worker 顯示 Done 就直接視為業務完成。
- **FLOW-04**：部署與維運應包含測試環境、上線核准、回復策略、監控與操作交接；避免只停在 Commit/PR。

## 6. 安全與權限治理

- **SAFE-01**：明確提示 Orca 對 Agent 的預設啟動許可可能很高；組織用機應先檢查 Settings → Agents → Agent Permissions，依專案風險選 Manual/Auto/Yolo。獨立 Git Worktree **不是完整的安全沙箱**。
- **SAFE-02**：正式憑證、客戶資料、機敏資訊、個資與未授權檔案不得直接放入 Agent 的可讀／可傳範圍；必要時採最小權限、去識別化及合規來源。
- **SAFE-03**：刪除、重設、強制推送、正式部署、改權限、修改正式資料及其他不可逆動作需授權與獨立審核；不默許 AI 自行決策。
- **SAFE-04**：Skills/MCP 與外部 Agent 需先檢查來源、權限、資料流與供應商政策；資安要求不是只做前端遮罩，授權與資料保護需落在可信邊界。

## 7. 規格同步修改規則（所有後續 PR 必遵守）

當網站功能、教學工作流、職能、Orca 官方產品敘述或規格規則有變化時：

1. **先確認差異。** 讀 `SPEC.md`、`AGENTS.md`、`README.md`、兩份 HTML 與相關測試。
2. **本 PR 同步修改規格。** 若要新增／刪除／更名章節或職能，更新本檔的契約表及受影響的 `WEB-*`、`ROLE-*`、`PLAN-*`、`FLOW-*`、`SAFE-*`。若未影響規格，在 PR 清楚說明「規格無影響」及理由。
3. **同步內容。** `index.html` 與 `orca-openspec-designer-guide-with-ui.html` 必須逐字一致；若影響入門或章節路徑，同步 `README.md`。
4. **同步測試。** 修改使用者可觀察的操作與連結時同步更新 `tests/*.test.mjs`；測試從本檔契約提取角色／導航，而不是各自寫死互相矛盾的數量。
5. **驗證與證據。** 執行 `node --test tests/*.test.mjs`，並按影響面檢查桌面／手機、導覽、展開、常見痛點切換；在 PR 寫出 PASS／FAIL／NOT_RUN／BLOCKED 與理由。
6. **尊重來源與核准。** 官方功能應附來源或版本；業務意圖與現行實作若衝突，標成 `SPEC_DRIFT` 並列出負責人，不自行選一邊。沒有經核准的推測不得寫成既有行為。
7. **核准後整合。** 未通過驗證或尚未核准，不能宣告完成、部署或合併。

這個規則是一個**維護契約**，不是保證 AI 或 Git 會自行修改任何規格；執行前仍需人和 CI／測試實際檢查。
