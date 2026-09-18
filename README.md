# Orca × OpenSpec 設計師快速上手

這個 repository 收錄給設計師使用的 AI 開發工作流筆記與互動教學。

目前主題聚焦在：

- Orca 的常用工作方式
- 設計師如何使用 Worktree 管理不同功能
- Claude / Codex / Gemini 之間如何接手
- Browser / Design Mode 如何協助 UI 調整
- Diff Review 如何避免 AI 過度修改
- OpenSpec 如何幫助 AI 理解需求範圍
- 如何把功能完成後整合回工作整合分支

## 線上閱讀

GitHub Pages：

https://sodahsu.github.io/notes/

如果 GitHub Pages 尚未啟用，請到：

`Settings → Pages → Build and deployment → Deploy from a branch`

設定：

- Branch：`main`
- Folder：`/(root)`

儲存後，GitHub 會自動部署網站。

## 主要檔案

### `index.html`

GitHub Pages 首頁。

內容包含：

- 設計師常見 AI 開發痛點
- Orca 功能位置
- Orca 功能介面截圖與示意圖
- 常用操作步驟
- Orca × OpenSpec 工作流

### `orca-openspec-designer-guide-with-ui.html`

互動教學原始頁面。

目前涵蓋的情境：

1. AI 額度用完，換另一個 AI 接手
2. 同時處理多個功能，避免工作混在一起
3. 使用 Design Mode 直接從畫面指定修改位置
4. 使用 Diff Review 檢查 AI 實際修改內容
5. 監控 Claude / Codex 使用額度
6. 使用 Split Panes 同時看 Agent、Browser 與 Diff

## 設計師版工作流

```text
工作整合分支
    ↓
開功能 Worktree
    ↓
讀 / 補 OpenSpec
    ↓
AI 開始實作
    ↓
Browser / Design Mode 看畫面
    ↓
Diff Review
    ↓
用 OpenSpec 對答案
    ↓
Commit / Push
    ↓
整合回工作整合分支
```

可以把它白話理解成：

> Orca 管「工作不要亂」，OpenSpec 管「需求不要歪」。

## 建議使用方式

一個完整、可獨立驗收的功能，開一個 Worktree。

例如：

```text
工作整合分支
├─ 會員管理
├─ 報名流程
└─ 後台設定
```

同一功能裡的：

- UI
- Mock
- Interaction
- Review
- Test

原則上都留在同一個 Worktree。

不要因為 AI 換了，就重新建立另一個 Worktree。

例如 Claude 額度不足時：

```text
會員管理 Worktree
     │
   Claude
     │ 額度不足
     ↓
在新會話中繼續…
     ↓
   Codex
```

功能工作空間維持不變，只換執行的 AI。

## OpenSpec 在流程中的位置

### 開工前

先把這次要做什麼、不做什麼、待確認內容寫清楚。

### 實作中

AI 依照 OpenSpec 實作；需求真的改變時，再更新規格。

### Review 時

用三個東西一起確認：

```text
OpenSpec：原本應該做什麼
Browser：畫面實際長什麼樣
Diff：程式實際改了什麼
```

確認三者一致後，再整合回工作整合分支。

## 給設計師的重點

不用一次學完整套 Git。

先會這四個 Orca 動作就很夠用：

1. 開功能 Worktree
2. 在新會話中繼續
3. Design Mode
4. Diff Review

其餘功能遇到實際需求再學。
