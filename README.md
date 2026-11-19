# Orca × OpenSpec 實戰手冊與互動指南 📘

> **不背厚厚理論，從你今天最卡手的一個工作難題開始！**  
> 專為 PM／PO／SA、設計師、工程師與團隊主管整理的 AI Agent 協同開發入門與實戰手冊。

---

## 🚀 線上即刻體驗

- 🎯 **[1 分鐘互動體驗首頁](https://sodahsu.github.io/notes/)**：選一個常見卡關情境 → 看前後成果對比 → 一鍵複製第一句 Prompt
- 📖 **[完整進階操作手冊](https://sodahsu.github.io/notes/guide.html)**：收錄 [12 大職能 Prompt](https://sodahsu.github.io/notes/guide.html#crossroles)、[13 步互動實戰教學](https://sodahsu.github.io/notes/guide.html#tutorialLab) 與 [心跳／故障恢復指引](https://sodahsu.github.io/notes/guide.html#watchdog)

---

## 💡 為什麼需要這份指南？

帶團隊用 AI Coding Agents（如 Claude Code、Codex、Gemini）寫程式或整需求時，最常卡在這三件事：
1. 🤯 **PM／SA 覺得「需求越聊越亂」**：一句話就想叫 AI 開工，功能越長越散，誰說的才算完全沒共識。
2. 📱 **設計師覺得「手機版越改越破」**：請 AI 調一下手機版按鈕或間距，結果旁邊元件或桌機版也跟著走鐘。
3. 🤖 **工程師／主管覺得「開太多 AI 反而失控」**：好幾個 Agent 同時開工、互相蓋掉同一份檔案，有人卡住也不知道怎麼安全接手。

**不用先讀完一整本教科書！**  
這份指南把複雜概念拆成兩層：首頁先用 3 個生活化情境讓你 1 分鐘上手；真的要帶團隊實戰時，再到完整手冊查對應做法（**Orca** 負責 AI coding agent 的工作環境與上下文，**OpenSpec** 則是搭配它把規格講清楚的協作方法）。

---

## 🎯 首頁精選：三大常見痛點直接對照

打開 [互動體驗首頁](https://sodahsu.github.io/notes/)，只要做 3 個動作：**選情境 → 看看整理後的成果 → 帶走第一句 Prompt**。下表幫你快速對應到完整手冊的實戰練習：

| 你現在卡在哪一關？ | 首頁示範怎麼幫你？ | 核心解法（白話版） | 直接進手冊練習 |
| :--- | :--- | :--- | :--- |
| **PM／SA：需求總是改來改去** | 把混亂需求整理成「已確認／待決策／可驗收」 | 用 OpenSpec 把還沒講死的規則分出來，**先對齊規格再動手**；唯讀分析階段不用切 Worktree | [PM／SA 4 步教學](https://sodahsu.github.io/notes/guide.html?case=tutorial-pm-sa#tutorialLab) |
| **設計師：手機版怎麼改都不順** | 問題定位 → 鎖定最小修改範圍 → 驗收清單 | 用 Browser／Design Mode 指準元件，限制只改表單 CTA 與必要樣式，最後一起核對 **手機、桌機、鍵盤與 Diff** | [UX／Design 4 步教學](https://sodahsu.github.io/notes/guide.html?case=tutorial-design#tutorialLab) |
| **工程／主管：多 AI 難監督** | 任務分工 → 心跳與狀態查證 → 人工驗收把關 | 一個功能一個 Worktree、一位主要 Writer；先查證心跳、Dashboard 與 Terminal 再恢復，最後由**人類確認測試與 Diff** 才整合 | [Engineering 5 步教學](https://sodahsu.github.io/notes/guide.html?case=tutorial-engineering#tutorialLab) |

> 💡 **體驗說明**：首頁與教學模擬都是靜態示範，**不會**連線執行 Orca 或改動你的專案；產出的 Prompt 只要把內容換成你自己的非機敏示範資料，就能直接貼到有權限的 AI 工具裡使用。

---

## 📖 完整操作手冊裡還有什麼？

準備好套用到真實工作流程時，直接前往 [完整操作手冊 (`guide.html`)](https://sodahsu.github.io/notes/guide.html)：
- 🛠️ **[12 種跨職能 Prompt 範本 (`#crossroles`)](https://sodahsu.github.io/notes/guide.html#crossroles)**：涵蓋 PM、PO、SA、UX/UI 設計師、前端設計師、前端工程師、後端工程師、QA、資安／個資、DevOps／維運、系統管理／客服、主管／協調者，點開即複製。
- 🪜 **[三套共 13 步互動實戰教學 (`#tutorialLab`)](https://sodahsu.github.io/notes/guide.html#tutorialLab)**：從 PM／SA 需求收斂（4 步）、UX／Design 畫面修正（4 步）到 Engineering 多 Agent 交付（5 步），每步都有前置條件、Prompt、預期輸出與人工檢查點。
- 🛡️ **[心跳監控與 Watchdog 監督流程 (`#watchdog`)](https://sodahsu.github.io/notes/guide.html#watchdog)**：分清楚 Worker Heartbeat、Agent Dashboard、Mobile Heartbeat 與 Runtime Supervisor 的真實能力與界線，避免誤以為 AI 卡住就會自動重啟。
- 🌿 **[Git Worktree 分支隔離開發 (`#orchestration`)](https://sodahsu.github.io/notes/guide.html#orchestration)**：讓不同功能在各自獨立的 Worktree 中開發，避免平行寫入踩檔。
- ⚖️ **職能分流原則**：PM／SA 需求整理採唯讀分析，**不要求建立 Worktree**；需要修改程式或介面時，才開功能 Worktree。

---

## 🛠️ 本地預覽與自動化測試

本站為純靜態網頁（HTML／CSS／JavaScript），無需編譯打包，在本機啟動靜態伺服器即可預覽：

```bash
# 1. 本地靜態預覽（任選一種靜態伺服器，例如 Python）
python -m http.server 8080
# 開啟瀏覽器前往 http://localhost:8080/（首頁）或 http://localhost:8080/guide.html（完整手冊）

# 2. 執行 Node.js 契約與互動邏輯測試（共 25 項）
node --test tests/*.test.mjs

# 3. （選用）執行 Chromium 跨裝置端對端測試（需先安裝 Playwright 與 Chromium）
node --test tests/browser-smoke.mjs
```

### 檔案結構說明
- `index.html`：極簡入門互動首頁（與 `orca-openspec-designer-guide-with-ui.html` 逐字鏡像一致）
- `guide.html`：完整操作手冊（含 15 章節、12 職能 Prompt、6 種痛點切換與 13 步互動教學）
- `SPEC.md`：本指南內容、架構分層與互動行為的真相來源（驗收契約）
- `AGENTS.md`：AI 代理人與維護者的協同編輯規則
- `tests/`：包含 Node 契約測試（`tests/*.test.mjs`）與 Chromium 跨裝置端對端測試（`tests/browser-smoke.mjs`）

---

## 🔗 相關資源

- 官方產品文件：[Orca Documentation](https://www.onorca.dev/docs)
- 規範方法工具：[OpenSpec (Fission-AI)](https://github.com/Fission-AI/OpenSpec)
