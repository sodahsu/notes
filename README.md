# Orca × OpenSpec｜設計師與前端工程師快速上手

這個 repo 是一份「先白話、再深入」的 Orca 工作流手冊。

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
└─ .nojekyll
```

- `index.html`：GitHub Pages 首頁。
- `orca-openspec-designer-guide-with-ui.html`：同一份互動教學原始檔。
- `README.md`：工程師快速查閱版。

## GitHub Pages

目前使用：

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

網址：

https://sodahsu.github.io/notes/
