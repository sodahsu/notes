# Orca 使用指南｜先選工作，再學會 AI 協作

線上版：<https://sodahsu.github.io/notes/>

**先不要背 Orca 功能名稱。先看它能幫你完成什麼工作。**

## 先看三個實際工作案例

| 你遇到的問題 | Orca + Agent 怎麼幫忙 | 可交付成果 |
| --- | --- | --- |
| PM／SA：需求散落在會議紀錄、原型與舊規格 | 唯讀整理角色、流程、狀態、例外與未知事項；再由人審查 | 流程草稿、Scenario、需求差異、決策清單 |
| 設計師：AI 產生的畫面不順、不知道要改哪個元件 | Browser／Design Mode 指定元素，Agent 修改後檢查 Diff 與 RWD | 可操作的介面修改、畫面與測試證據 |
| 工程師／主管：多個功能並行，Agent 卡住不易察覺 | Worktree 隔離功能，Orchestration 分派任務，Heartbeat／Watchdog 協助監督 | 獨立功能變更、狀態紀錄、測試證據與 PR |

## 依職能開始

- **PM／PO／SA**：需求與規格 → [實際案例](https://sodahsu.github.io/notes/#journey) → [Planning](https://sodahsu.github.io/notes/#planning)。文件唯讀分析不必建立 Worktree；只有要修改 Repo／規格檔時才進入 Git 工作區。
- **UX/UI／前端設計師**：[設計師工作法](https://sodahsu.github.io/notes/#designer)，從 Browser、Design Mode、RWD 與 Diff Review 開始。
- **前後端工程師**：[前端工程流程](https://sodahsu.github.io/notes/#frontend)，再視多任務需要使用 Worktree／Orchestration。
- **QA／資安**：[跨職能交付](https://sodahsu.github.io/notes/#teamwork) 與 [安全權限](https://sodahsu.github.io/notes/#safety)。
- **主管／Coordinator**：[心跳與故障處理](https://sodahsu.github.io/notes/#watchdog)，掌握 Agent 狀態、Worker heartbeat、阻塞與安全恢復。

## 四階學習路徑

1. **先完成一件事**：一個 Agent、一個任務，學會開始、看成果與驗收。
2. **日常工作流**：Browser、Design Mode、Worktree、Diff 與測試。
3. **多 Agent 協作**：Coordinator、Worker、Task、Heartbeat 與訊息處理。
4. **團隊治理**：Watchdog、Recovery、資安權限、規格同步與交付 Gate。

不需要一次讀完；依你目前的工作需求進入即可。

## Orca 的定位

Orca 是面向 coding agents 的開發環境，把 Git Worktree、Agent Terminal、Browser、Diff、Git 與 CLI 放在一起。它不是模型、不是 Jira 替代品，也不是 no-code 工具。Orca 的價值是讓多個 AI coding agents 在可追蹤的工作環境中執行，並讓人能檢查與交付結果。

如果只是一般文字整理，普通 AI 聊天可能更簡單。當工作需要讀取 Repo、規格、Mock、原型、程式、Browser 或多 Agent 協作時，Orca 才更有價值。

官方定位：<https://www.onorca.dev/docs>

## 端到端交付方式

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

Agent Dashboard 的 Working／Done 不等於 PM 驗收或正式交付完成。

## Heartbeat、Watchdog 與 Recovery

| 名稱 | Orca 目前提供什麼 | 不代表什麼 |
| --- | --- | --- |
| Worker Heartbeat | Orchestration 訊息；只有 preamble 要求時才回報，並帶 taskId／dispatchId | 不代表逾時後會自動 kill／restart Worker |
| Agent Dashboard | Settings → Experimental 啟用；Needs You／Working／Done／Idle 看板欄位，紅點代表 blocked／interrupted／failed | 不是程序存活保證或業務交付狀態 |
| Mobile Heartbeat | 手機追蹤桌面 Agent process；spinner 不一致可強制刷新 | 不是 Worker 自動恢復 |
| Runtime Supervisor | 可在 macOS／Linux 監督 Orca Server 程序並重新啟動 | 不是個別 Worker Watchdog |
| Worker Recovery | worker-show／worker-read／worker-stop／明確 retry | 不是無條件自動重派 |

Coordinator 建議採事件喚醒：Worker 回報、提問或停止時，Orca 喚醒 Coordinator，再執行 `orca orchestration check --run <runId>`；不必派工後永久輪詢。

官方文件沒有承諾通用 Worker Watchdog 會在 heartbeat timeout 後自動 kill／restart／retry。建議採用：

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

## 規格、安全與維護

- Planning 先唯讀調查，區分已確認、推論、待確認；經人工核准才實作。
- OpenSpec 是搭配 Orca 使用的規格方法／工具，不是 Orca 內建功能。
- 未批准／未實作的業務意圖放在 `openspec/changes/`；只有已實作、驗證並經授權確認的現行行為才進 `openspec/specs/`。
- Worktree 是 Git 工作目錄隔離，不是完整 OS 安全沙箱。
- 正式憑證、客戶資料、個資、刪除、強制推送、部署與正式資料異動，遵守最小權限及人工核准。
- 本 Repo 的 `SPEC.md` 是網站資訊架構、角色、案例與互動規格；`AGENTS.md` 定義維護規則。修改功能時需同步更新規格、兩份 HTML、README 與測試。

PR 需通過 `node --test tests/*.test.mjs` 與桌面／手機 Chromium 測試。
