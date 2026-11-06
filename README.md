# Orca｜先試一件事，再決定要不要深入

**[體驗首頁](https://sodahsu.github.io/notes/)** · **[完整操作手冊](https://sodahsu.github.io/notes/guide.html)**

這不是從第一章讀到第十五章的課本。首頁只有三個你可能常遇到的工作問題：

| 我常遇到的事 | 先看哪個示範？ |
| --- | --- |
| PM／SA：需求越聊越亂 | 需求 → 已確認／待決策／可驗收 |
| 設計師：手機版改不順 | 問題定位 → 修改範圍 → 驗收 |
| 工程／主管：多個 AI 難以監督 | 分工 → 狀態 → QA／人工把關 |

先在首頁**選情境 → 看前後差異 → 帶走第一句 Prompt**，有興趣再進入完整教學。

## 不用讀完才開始

完整手冊保留 12 種職能 Prompt、三套共 13 步的互動教學、Orchestration、OpenSpec、Heartbeat、Watchdog、Worktree、資安與錯誤處理。PM／SA 的唯讀分析不必預設建立 Worktree；程式修改才使用功能 Worktree。

首頁的「成果」是虛構示意：**不會執行 Orca、修改 Repo 或自動批准需求**。Prompt 可複製貼到自己有權使用的 Agent。完成標記也只表示使用者自行記錄，不是 CI 或正式交付證據。

## 檔案與驗證

- `SPEC.md`：短首頁與完整手冊的真相來源／驗收契約。
- `index.html`、`orca-openspec-designer-guide-with-ui.html`：逐字一致的短首頁。
- `guide.html`：完整技術手冊及互動教學。
- `AGENTS.md`：AI／維護者的變更規則。
- `tests/*.test.mjs`：Node 契約測試；`tests/browser-smoke.mjs`：Chromium 桌機／手機 E2E。
- `node --test tests/*.test.mjs`；Browser 由 GitHub Actions 安裝 Chromium 驗證。

所有修改走 Git 分支、PR、CI、Review，確認成功後才合併、部署。

官方產品文件：[Orca](https://www.onorca.dev/docs)。
