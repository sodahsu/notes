# Orca 使用指南｜從第一個任務到 AI 艦隊監督

線上版：<https://sodahsu.github.io/notes/>

**這份手冊不是功能字典，而是工作入口。** 先找到你要完成的事，再學對應的 Orca 能力。

## 先選你要完成的工作

| 你的工作 | 從這裡開始 | 你會得到什麼 |
| --- | --- | --- |
| PM／PO／SA：需求還不清楚 | [依職能找用法](https://sodahsu.github.io/notes/#crossroles) → [Planning](https://sodahsu.github.io/notes/#planning) | 有來源的需求整理、流程、Scenario、決策清單與驗收條件 |
| UX/UI／前端設計師：畫面需要落地 | [設計師工作法](https://sodahsu.github.io/notes/#designer) | Browser、Design Mode、RWD 與 Diff Review |
| 前後端工程師：多功能並行 | [前端工程流程](https://sodahsu.github.io/notes/#frontend) → [Orchestration](https://sodahsu.github.io/notes/#orchestration) | Worktree 隔離、Agent 分工、測試與整合 |
| QA／資安：需要可驗收證據 | [跨職能交付](https://sodahsu.github.io/notes/#teamwork) → [安全與權限](https://sodahsu.github.io/notes/#safety) | 測試矩陣、風險檢查、權限 Gate 與證據 |
| 主管：想知道 AI 是否卡住 | [心跳與故障處理](https://sodahsu.github.io/notes/#watchdog) | Agent 狀態、Worker heartbeat、Watchdog 判斷與 Recovery |
| 第一次使用 Orca | [快速開始](https://sodahsu.github.io/notes/#quickstart) | 從既有 Repo 開第一個功能 Worktree |

## Orca 的定位

Orca 是面向 coding agents 的桌面開發環境，把 Git Worktree、Agent Terminal、Browser、Diff、Git 與 CLI 放在一起。它不是模型，也不是 no-code 工具或 Jira 替代品。Orca 的核心價值是讓多個 AI coding agents 在隔離的工作區執行，並讓人能檢查與交付結果。

PM／PO／SA 可以在需要 Repo、規格、Mock 與開發上下文時使用 Agent 輔助 Planning；業務決策、專案進度與正式驗收仍由既有權責及系統負責。

官方定位：<https://www.onorca.dev/docs>

## 建議的端到端工作方式

```text
需求／Issue
  → PO 核准目標與業務規則
  → SA 整理流程、Scenario 與契約
  → UX/UI 確認體驗
  → 前後端工程師在功能 Worktree 實作
  → Orchestration 分派／監督 Worker（需要時）
  → QA／資安驗證
  → Diff Review／PR／部署核准
  → 維運與客服交接
```

Orca 可以協助連結 Issue 與 Worktree，但 Agent Dashboard 的 Working／Done 不等於 PM 驗收或正式交付完成。

## Heartbeat、Watchdog 與 Recovery：務必分清楚

| 名稱 | Orca 目前提供什麼 | 不代表什麼 |
| --- | --- | --- |
| Worker Heartbeat | Orchestration 訊息；長時間工作應回報，並帶 taskId／dispatchId | 不代表逾時後會自動 kill／restart Worker |
| Agent Dashboard | Settings → Experimental 啟用；Needs You／Working／Done／Idle 看板欄位，紅點代表 blocked／interrupted／failed | 不是程序存活保證或業務交付狀態 |
| Mobile Heartbeat | 手機追蹤桌面 Agent process；spinner 不一致可強制刷新 | 不是 Worker 自動恢復 |
| Runtime Supervisor | 可在 macOS／Linux 監督 Orca Server 程序並重新啟動 | 不是個別 Worker Watchdog |
| Worker Recovery | worker-show／worker-read／worker-stop／明確 retry | 不是無條件自動重派 |

Coordinator 的目前建議流程是事件喚醒：Worker 回報、提問或停止時，Orca 喚醒 Coordinator，再執行 `orca orchestration check --run <runId>`；不必派工後永久輪詢。Agent Dashboard 在 Settings → Experimental 開啟；若狀態未顯示，檢查 `orca agent hooks status --json`。

官方文件沒有承諾通用的 Worker Watchdog 會在 heartbeat timeout 後自動 kill／restart／retry。建議團隊採用：

```text
Heartbeat／Checkpoint
  → 偵測疑似停滯
  → 檢查 Dispatch、Terminal 與 Agent 狀態
  → Coordinator 判斷等待／提問／停止
  → 確認前一個 Dispatch 安全結束
  → 明確 retry 或交由人工處理
```

官方參考：

- Orchestration：<https://www.onorca.dev/docs/cli/orchestration>
- Agent 狀態與 Dashboard：<https://www.onorca.dev/docs/model/agents-sessions>
- Mobile heartbeat：<https://www.onorca.dev/docs/mobile>
- Runtime Supervisor：<https://www.onorca.dev/docs/remote-servers>

## 規格與安全原則

- Planning 先唯讀調查，區分已確認、推論、待確認；經人工核准才實作。
- OpenSpec 與 Orca 是搭配使用，不是 Orca 內建功能。
- 未批准／未實作的業務意圖放在 `openspec/changes/`；只有已實作、驗證並經授權確認的現行行為才進 `openspec/specs/`。
- Worktree 是 Git 工作目錄隔離，不是完整 OS 安全沙箱。
- Orca 對支援的 Agent 可能預設帶入高自主權啟動參數；使用前到 Settings → Agents 檢查各 Agent 的 launch arguments。
- 正式憑證、客戶資料、個資、刪除、強制推送、部署與正式資料異動，遵守最小權限及人工核准。

## 本手冊如何維護

- `SPEC.md`：導覽、頁面章節、職能、Watchdog 與安全契約。
- `AGENTS.md`：AI 與維護者的修改規則。
- `index.html` 與 `orca-openspec-designer-guide-with-ui.html`：必須逐字一致。
- `tests/*.test.mjs`：規格同步與互動回歸。
- PR 需執行 `node --test tests/*.test.mjs` 與桌面／手機 Chromium smoke test。

**任何職能、導覽、Orca 功能敘述或監督流程變更，都必須在同一個 PR 評估並同步修改 SPEC、HTML、README 與測試。**
