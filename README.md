# Orca × OpenSpec｜跨職能工作流手冊（PM／PO／SA／設計／工程／QA）

這個 repo 是一份「先白話、再深入」的 Orca × OpenSpec 跨職能工作流手冊，涵蓋需求規劃、規格、實作、驗收與維運。

線上版：

https://sodahsu.github.io/notes/

## What / Why

Orca 適合已經在使用 Claude Code、Codex 等 coding agent，而且開始遇到這些問題的人：

- 同時做多個功能，branch / 工作目錄很容易亂
- AI 做到一半沒額度，要換另一個 AI
- AI 說完成了，但不知道它到底改了什麼
- UI 問題看得到，卻要花時間找 DOM / CSS / component
- 隔天回來忘記做到哪
- 希望規格、實作、畫面與 Diff 可以一起驗證

白話：

> Orca 管「工作不要亂」，OpenSpec 管「需求不要歪」。

工程上可以理解成：

- **Orca**：用 Git worktree 隔離功能工作目錄，再把 Agent、Terminal、Browser、Diff、Git 狀態集中在同一個 workspace。
- **OpenSpec**：記錄功能範圍、需求與驗收邊界，讓 AI 實作、handoff、Review 都回到同一份規格。

## Quick Start

### 1. 下載 Orca

https://www.onorca.dev/download

官方提供 macOS、Windows、Linux。

macOS 也可以：

```bash
brew install --cask stablyai/orca/orca
```

### 2. 加入現有 Git repo

不用為 Orca 重建專案，直接把你原本的 repo 加進去。

### 3. 開功能 Worktree

原則：

> 一個可獨立驗收的完整功能，一個 Worktree。

例如：

```text
工作整合分支
├─ 會員管理
├─ 報名流程
└─ 後台設定
```

同一個功能裡的 UI、Mock、Interaction、Review、Test，通常留在同一個 Worktree。

### 4. 讀 / 補 OpenSpec

先確認：

- 這次要做什麼
- 不做什麼
- 哪些仍待確認
- 驗收條件是什麼

再讓 AI 動手。

### 5. AI 做完先看 Diff

不要把「Agent 說 Done」當成完成。

至少確認：

- OpenSpec 對齊
- Browser flow
- typecheck / test / build（依專案）
- Diff Review
- 只有需求需要的變更才 Stage

## Recommended Workflow

```text
工作整合分支
    ↓
Feature Worktree
    ↓
OpenSpec
    ↓
dev server
    ↓
AI 實作
    ↓
Browser 驗證
    ↓
typecheck / test
    ↓
Diff Review
    ↓
Stage / Commit / Push
    ↓
整合回工作整合分支
```

## Designer Workflow

設計師先學這 4 個：

1. **Worktree**：功能不要互相踩。
2. **Browser / Design Mode**：看到哪裡怪，就直接點哪裡。
3. **Diff Review**：不要只相信 AI 說完成。
4. **Device Emulation**：快速檢查 RWD / 手機版。

設計師版流程：

```text
開功能
→ AI 先看懂規格
→ Browser 看畫面
→ Design Mode 指修改位置
→ 手機尺寸驗證
→ Diff Review
→ 收成果
```

## Frontend Workflow

前端工程師每天可以照這條跑：

```text
integration branch
→ feature worktree
→ spec
→ npm run dev
→ implementation
→ typecheck / test
→ browser verification
→ diff
→ stage
→ commit / push
→ integrate
```

### Worktree 怎麼切

以「可獨立驗收的完整功能」為單位。

不要預設拆成：

```text
UI Worktree
Mock Worktree
Interaction Worktree
```

同一功能的 UI / Mock / Interaction 通常應該留在同一個 Worktree。

### AI 換班

Claude 額度不足時，不要重開功能：

```text
同一個 Worktree
   ↓
Claude
   ↓ 額度不足
在新會話中繼續…
   ↓
Codex
```

真正的功能生命週期跟著 Git / Worktree，不跟著某個 AI chat session。

接手 Prompt：

```text
接手目前這個功能。先不要修改。

先讀 OpenSpec，再檢查 git status 與 git diff。
整理：
1. 已完成
2. 未完成
3. 與規格不一致的地方
4. 下一步

不要重做已完成部分。
```



## Planning：先計畫、再批准、再執行

Orca 不只是讓 AI 寫程式，也適合在 Agent 工作環境中整理有來源的計畫。它**沒有預設的 PM／SA 專屬管理功能**；以下是使用 Agent、工作目錄、OpenSpec、Browser、Diff 與 Orchestration 的建議流程。

```text
需求與依據 → 唯讀調查 → 計畫草稿 → 人工核准 → 分工執行 → 驗證與交接
```

通用 Planning Prompt：

```text
你是計畫協調者。先唯讀分析，不修改程式、文件與 Git。
查核已提供來源與目前專案狀態，整理：
1. 目標、非目標、來源
2. 已確認事實、推論、待確認規則
3. 執行順序、依賴、負責角色及交付物
4. 修改範圍與禁止修改範圍
5. 風險、待決策事項、驗收方式與驗收者
6. 是否需要 Solo、唯讀平行調查或 Worktree 多代理
最後標示「計畫完成，尚未執行」，等待核准。
```

只有獨立開發功能才需要視情況開 Worktree；PM／SA 分析文件不必預設切 Git 分支。正式 Orchestration 是任務編排，不等於業務規則經過核准。

## 不同職能的 Orca 使用情境

| 職能 | 實際情境 | 建議工作方式 | 交付／人工驗收 |
| --- | --- | --- | --- |
| PM | 政府專案需求新增、進度風險 | 比對合約與會議紀錄，整理 WBS、里程碑、依賴與風險 | 計畫草案；PM／業主核准時程與範圍 |
| SA | 從訪談、原型、API 整理真實規格 | 分析角色、流程、狀態、資料契約和例外 | Scenario／OpenSpec 草案；SA／業務確認 |
| UX/UI | 接手 AI 產生的 HTML 雛形 | Browser／Design Mode 找出資訊架構、RWD、可用性與錯誤狀態問題 | 設計檢查清單與視覺驗收 |
| Frontend | API 未完成先用 Mock 建互動 | 核准規格後開功能 Worktree、實作、測試、Diff | 功能提交與測試證據；Code Review |
| QA | 報名、繳費、補件跨角色測試 | 由核准規格建立正常、邊界、異常、權限案例 | PASS／FAIL／NOT_RUN／BLOCKED 與重現證據 |
| 主管 | 多專案競爭人力、AI 派工 | 優先順序、工作 ownership、任務依賴和風險決策 | 分工及驗收閘門；主管批准 |

### PM 範例｜新增線上繳費需求

```text
請根據已提供的合約、會議紀錄、專案時程，先唯讀整理：
- 既有範圍與新增變更
- WBS、相依工作、責任角色和里程碑草案
- 風險、阻塞、需業主決策事項
- 每項結論的依據
尚無證據的工時、預算、規則標示待確認。
只提出計畫，不修改任何檔案。
```

### SA 範例｜考選系統多階段繳費

```text
依現有已核准文件、原型及 API 證據整理：
- 報考繳費、受訓繳費、證書核發前繳費的流程與角色
- 狀態轉換、通知／補件／失敗／逾期路徑
- API 請求與回應、欄位、權限及異常
- 驗收 Scenario 與證據來源
區分「已確認規則」「原型暗示」「Mock 假設」「待確認」。
未批准規則不得直接寫入正式 openspec/specs。
```

### 六種職能的完整可複製 Prompt

請看 [線上互動手冊的「PM / SA 等職能」章節](https://sodahsu.github.io/notes/#crossroles)，裡面也有 UX/UI、前端、QA、主管情境，以及人工驗收界線。

## 跨職能交付與任務追蹤

[線上互動手冊：跨職能任務與交付](https://sodahsu.github.io/notes/#teamwork) 包含責任矩陣、Issue → Worktree → PR → CI → QA／資安 → 上線與維運交接。PM／SA 不必先學會寫程式，但必須清楚區分：

- **Issue / GitHub Projects / Jira / Linear**：工作、責任、期限與業務驗收的追蹤來源。只有完成實際連線與授權，Orca 才能讀寫對應任務。
- **Worktree / PR / CI**：程式工作空間、版本審查與可驗證測試。
- **Agent Dashboard / Checkpoint**：代理的執行狀態和交接快照，不能代表業務已驗收或已部署。
- **人工 Gate**：PO 核准規則、PM 核准交付、QA 確認測試、資安確認風險、維運／主管核准上線；必須依實際組織權限調整。

以政府標案為例：

```text
PM 需求／Issue
  → PO／業主批准範圍與規則
  → SA 明確化 Scenario／API 契約
  → UX/UI＋前端設計師確認互動
  → 前後端工程師實作與整合
  → QA／資安驗證
  → PR／部署 Gate
  → 系統管理／客服與維運交接
```

### 角色差異不可混淆

- **UX/UI**：資訊架構、體驗與視覺驗收。
- **前端設計師**：HTML/CSS/JS、Vue 互動實作與設計系統落地。
- **前端工程師**：共用元件、架構、API／Mock、工程測試、效能與程式品質。
- **後端工程師**：契約、交易、資料完整性與可信任邊界的授權。

更多 PO、Backend、資安、DevOps、系統管理與客服的情境、可複製 Prompt、輸入／輸出與人工驗收請見 [所有職能](https://sodahsu.github.io/notes/#crossroles)。

## AI Agent 安全與權限

[安全治理章節](https://sodahsu.github.io/notes/#safety) 詳細說明：

1. 在 Orca `Settings → Agents → Agent Permissions` 檢查 Manual／Auto／Yolo 等設定；預設高自主權的 Agent 可能執行比你預期更大的動作。
2. Worktree 是 Git 工作目錄隔離，**不等於 OS 沙箱**。
3. 不得未授權提供客戶資料、個資、憑證、正式資料庫與有寫入權的 MCP；使用去識別化資料及最小權限。
4. 正式部署、刪除、強制推送、改權限、付款／資料異動等操作要有獨立的人工核准。
5. 前端資訊遮罩、錯誤頁與檢核不等於後端授權，資安責任需要跨層驗證。

Orca 官方說明：[Supported agents／permissions](https://www.onorca.dev/docs/agents/supported)、[Settings](https://www.onorca.dev/docs/settings)。

## 必須同步更新規格的維護契約

本 Repo 的 [SPEC.md](SPEC.md) 是 **這份工作手冊本身** 的可觀察行為與章節／角色契約；[AGENTS.md](AGENTS.md) 規定 AI 開發者必須遵守同步修改規則，PR 建立時參照 [檢查表](.github/pull_request_template.md)。

**每次修改教學工作流、角色、章節、導覽、Orca 功能敘述或驗收規則，都必須在同一個 PR 評估並同步修改 `SPEC.md`、兩份 HTML、必要的 README 和測試。** 若規格無影響，PR 必須明確寫出理由。由 `tests/roles-planning.test.mjs` 比對 SPEC 中的導航／角色清單與網站內容。

兩份公開 HTML 必須逐字相同，既有常見痛點切換行為不得壞掉。變更完成後：

```bash
node --test tests/*.test.mjs
```

檢查結果需標為 `PASS`／`FAIL`／`NOT_RUN`／`BLOCKED`，且必要時人工驗證桌面／手機、角色展開及所有按鈕。

**要特別分清楚兩種規格同步：**

- **本手冊：** 修改 `SPEC.md` 以維護教學行為與導航契約。
- **使用手冊的業務專案：** 待批准／未完工的工作寫入 `openspec/changes/`；只有經確認、實作及驗證的現行業務行為，才可更新 `openspec/specs/`。若已核准意圖與實際系統不符，標 `SPEC_DRIFT` 並由權責決策，不讓 AI 自行覆寫。

## Orca Orchestration：Worker 有問題，Commander 會回答嗎？

**可以，但不是保證自動回答。** Orca 正式的 Orchestration 提供 Worker → Commander 的阻塞提問與回覆機制；Commander 仍需要留在監督迴圈，持續讀取問題、回答、驗收 Worker 的完成回報。

- **Commander（協調者）**：建立 Run、定義工作邊界、啟動 Worker、回答問題、檢查結果及整合。
- **Worker（執行者）**：依 Task 執行；需要協調者做決策時使用 ```orca orchestration ask```；完成後回報 ```worker_done```。
- **Run / Task / Dispatch**：分別是協調空間與收件匣、工作項目，以及該工作的某一次實際派工。

### 1. 啟用並派工

先在 Orca 的 **Settings → Experimental** 啟用 Orchestration，並從 Commander 的 Orca 終端機執行：

```bash
orca status --json
orca skills get orchestration --full
orca orchestration run-create --objective "檢查報名頁手機版" --json
orca orchestration worker-start --spec "檢查報名頁 RWD 與互動問題，回報證據" --worktree current --agent codex --json
```

```worker-start --spec``` 會建立 Task 並啟動 Dispatch；若需要相依任務，再明確使用 ```task-create``` + ```worker-start --task```。多個會寫入的 Worker 必須先界定檔案 ownership；獨立功能才切獨立 Worktree。

### 2. Worker 卡住：用 ask，不要在本機 AI 介面提問

從**收到 Dispatch preamble 的 Worker 終端機**執行，並以 preamble 指定的執行檔、身分與旗標為準：

```bash
orca orchestration ask --question "API 尚未完成，可以先使用 Mock 嗎？" --options "先用Mock,等待API" --timeout-ms 600000 --json
```

在有效 Dispatch 內，問題預設送到所屬 Run 的 Commander。```ask``` 會阻塞等待回答；逾時不會自動取消問題，請用**同一個訊息 ID**恢復等待，避免重複提問：

```bash
orca orchestration ask --resume <message_id> --timeout-ms 600000 --json
```

### 3. Commander 收件、回答、驗收

在**已綁定 Run 的 Commander 終端機**執行：

```bash
orca orchestration check --wait --types "worker_done,escalation,question" --timeout-ms 900000 --json
orca orchestration reply --id <message_id> --body "先使用 Mock，維持既有 API 契約；未知業務規則保持待確認。" --json
orca orchestration check --ack <delivery_id> --wait --types "worker_done,escalation,question" --timeout-ms 900000 --json
```

每次 ```check``` 回傳的 Delivery 可能包含多則訊息；**逐則處理後才 ack**，再繼續等待。只有看到 ```worker_done``` 且驗證 Diff／測試／工作範圍無誤後，才能把任務視為完成。派工後就結束 Commander 會話，並不能保證 Worker 的問題會有人答覆。

### 4. 什麼情況由誰決定？

| 狀況 | 建議處理 |
| --- | --- |
| 技術細節、現有測試失敗、Mock 策略 | Commander 查程式碼、OpenSpec 和 API 契約後回答 |
| 跨 Worker 同檔案修改／整合衝突 | Commander 指定單一寫入者並調整派工 |
| 新增業務規則、重大變更、不可逆操作 | Commander 暫停相關修改，詢問使用者 |
| ```ask``` 逾時、Worker 沒動靜 | 確認 Run 綁定與訊息處理狀態，檢查 Dispatch；不要直接重啟 |

故障排查：

```bash
orca orchestration worker-list --include-remote --json
orca orchestration task-list --json
orca orchestration worker-read --dispatch <dispatch_id> --limit 50 --json
```

**原則：**Orca 的問答機制負責傳訊，Commander 的監督迴圈才負責回答與決策。不要把逾時當作 Worker 已退出，也不要因為沒有訊息就直接 reset 或刪 Worktree。

官方依據：[Orchestration CLI](https://github.com/stablyai/orca/blob/main/docs/site/content/docs/cli/orchestration.mdx) · [官方 Orchestration Skill 指引](https://github.com/stablyai/orca/blob/main/skill-guides/orchestration.md)。實際旗標以本機 ```orca skills get orchestration --full``` 為準。

## OpenSpec Integration

### 開工前

定範圍：

- 要做什麼
- 不做什麼
- 待確認
- 驗收 Scenario

### 實作中

Agent 換人時先讀同一份 spec。

需求真的改變時，更新規格；不要只改聊天記憶。

### Review 時

用三個東西一起看：

```text
OpenSpec：原本應該做什麼
Browser：實際長什麼樣
Diff：程式實際改了什麼
```

未知規則維持「待確認」，不要讓 AI 自己補成既定業務規則。

## Mobile Testing

先分清楚：

| 情境 | 工具 |
| --- | --- |
| RWD / breakpoint / overflow | Browser Device Emulation |
| App / WebView / keyboard / gesture / rotation | iOS / Android Emulator |
| 離開電腦，用手機看 Agent | Mobile Companion |

### Browser Device Emulation

```bash
orca status --json
orca set device --name "iPhone 12" --worktree active --json
orca screenshot --worktree active --json
orca full-screenshot --worktree active --json
```

Browser 模擬適合 responsive QA，但不等於真實 iPhone Safari / Android WebView。

### iOS Simulator

```bash
npx skills add https://github.com/stablyai/orca --skill orca-emulator --global
orca skills get orca-emulator

orca emulator list --worktree active --json
orca emulator attach "<device-name-or-udid>" --worktree active --json
orca emulator tap 0.5 0.7 --worktree active --json
orca emulator type "hello" --worktree active --json
orca emulator rotate landscape_left --worktree active --json
orca emulator button home --worktree active --json
orca emulator shutdown --worktree active --json
```

### Android

```bash
npx skills add https://github.com/stablyai/orca --skill orca-emulator-android --global
orca skills get orca-emulator-android
```

### OpenSpec 手機 Scenario

不要只寫「支援 RWD」。

例如：

```text
- 390px viewport 不得出現非預期水平捲軸
- 手機版主要 CTA 必須滿寬
- CTA 不得被 fixed footer 或 virtual keyboard 遮住
- 中文標題可以換行，但不得截字
- WebView 與一般 Browser 不一致時先標記待確認
```

## Command Reference

### Browser / Device

```bash
orca status --json
orca set device --name "iPhone 12" --worktree active --json
orca screenshot --worktree active --json
```

### Handoff

```text
先不要修改。
請檢查 git status、git diff、OpenSpec，
整理：已完成、未完成、問題、下一步。
不要重寫已完成部分。
```

## Terms

| 名詞 | 白話 |
| --- | --- |
| Worktree | 功能專用工作目錄 |
| Branch | 這份工作的版本線 |
| Agent | 幫你執行工作的 AI |
| Diff | 這次到底改了哪些程式 |
| OpenSpec | 功能規格與驗收邊界 |
| Checkpoint | 留給自己或下一個 AI 的進度快照 |

## Repo Structure

```text
/
├─ index.html
├─ orca-openspec-designer-guide-with-ui.html
├─ README.md
├─ SPEC.md                 # 規格／導覽／角色契約
├─ AGENTS.md               # AI 修改時的同步規則
├─ tests/                  # 互動與規格同步測試
└─ .nojekyll
```

- `index.html`：GitHub Pages 首頁。
- `orca-openspec-designer-guide-with-ui.html`：同一份互動教學原始檔。
- `README.md`：跨職能快速查閱版。
- `SPEC.md`：此工作手冊的規格來源，所有修改需評估同步。
- `AGENTS.md`：AI 與人員維護本 repo 時的最低規範。

## GitHub Pages

目前使用：

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

網址：

https://sodahsu.github.io/notes/
