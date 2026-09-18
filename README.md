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


## 下載 Orca

官方下載頁：

https://www.onorca.dev/download

目前官方提供：

- macOS：Apple Silicon、Intel
- Windows：Windows 10/11 x64 installer
- Linux：AppImage
- 舊版與 RC：GitHub Releases

macOS 也可以使用 Homebrew：

```bash
brew install --cask stablyai/orca/orca
```

官方安裝說明：

https://www.onorca.dev/docs/install

## 為什麼推薦 Orca

不是因為 Orca 讓 AI 變得比較聰明，而是它把 **AI 開發的工作現場整理得比較清楚**。

對設計師特別有感的地方：

1. **一個功能一個 Worktree**
   - 不同功能不容易互相踩到。
   - UI、Mock、互動可以留在同一個功能工作空間。

2. **多個 AI 可以接力**
   - Claude Code、Codex 等 Agent 可以在同一個工作流裡使用。
   - 某個 Agent 額度不足時，不需要整個功能重來。

3. **可以直接從畫面工作**
   - Browser + Design Mode 適合 UI 微調。
   - 設計師可以直接指出「這裡要改」，不用先找 DOM 或 CSS。

4. **AI 做完後有東西可以 Review**
   - Diff 讓你看到 AI 實際修改了什麼。
   - 有問題可以直接針對變更內容回饋，而不是只相信 AI 說「完成」。

5. **不綁單一 AI**
   - Orca 本身不是模型。
   - 它是用來統一管理你原本就在使用的 coding agents。

6. **搭配 OpenSpec 很適合**
   - Orca：管理「工作怎麼做、在哪裡做」。
   - OpenSpec：管理「這次應該做什麼、不該做什麼」。

白話來說：

> Orca 管「工作不要亂」，OpenSpec 管「需求不要歪」。

### 適合誰？

比較適合已經開始使用 Claude Code、Codex 或其他 coding agent，而且會碰 Git、會看 Diff、需要同時處理多個功能的人。

Orca 官方也明確定位它不是 no-code 工具，而是給已經在寫程式、希望把 AI 當作工作槓桿的人使用。


## 手機模擬器怎麼用

Orca 裡有兩種不同層級的「手機模擬」，先分清楚會比較好用。

### 1. 只要檢查 RWD：用 Browser Device Emulation

如果你做的是 Vue、React 或一般網站，通常不需要先開真正的手機模擬器。

可以直接把 Orca Browser 切成手機尺寸：

```bash
orca set device --name "iPhone 12" --worktree active --json
orca screenshot --worktree active --json
```

Orca 的 Browser 會用 Chrome DevTools Protocol 做 viewport 模擬，所以：

- `window.innerWidth`
- CSS media query
- responsive breakpoint

都會跟著模擬的手機尺寸改變。

設計師最適合拿來檢查：

- 有沒有水平 overflow
- 按鈕手機版有沒有滿寬
- CJK 文字是否爆版
- 表格是否被裁切
- spacing / card / modal 在小螢幕是否正常

### 2. 要測真正 App 操作：用 iOS Simulator

Orca CLI 可以控制 iOS Simulator，而且會綁在目前 Worktree。

常用指令：

```bash
orca emulator list --worktree active --json
orca emulator attach "<device-name-or-udid>" --worktree active --json

orca emulator tap 0.5 0.7 --worktree active --json
orca emulator type "hello" --worktree active --json
orca emulator rotate landscape_left --worktree active --json
orca emulator button home --worktree active --json
orca emulator shutdown --worktree active --json
```

座標採 0～1 的比例值，例如：

```text
0,0        左上
0.5,0.5    畫面中央
1,1        右下
```

適合用來測：

- 原生 App
- WebView
- 點擊 / 輸入
- 滑動與 gesture
- 橫向 / 直向
- Home button 等裝置行為

### 3. Android Emulator

Android AVD / adb 裝置可以加 Orca 的 Android emulator skill：

```bash
npx skills add https://github.com/stablyai/orca --skill orca-emulator-android --global
```

可讓 Agent 操作：

- list / boot emulator
- tap / swipe / type
- hardware button
- install / launch App
- permissions
- accessibility tree
- logcat

### 設計師最簡單的判斷

```text
只是看手機版 UI / RWD
→ Browser Device Emulation

要測 WebView / App / 手勢 / 裝置行為
→ iOS / Android Emulator
```

### 搭配 OpenSpec

可以直接把手機驗收條件寫入 spec，例如：

```text
- 390px 寬度不得出現水平捲軸
- 手機版主要 CTA 改為滿寬
- 表格在手機版不得裁切重要資訊
- WebView 與一般 Browser 顯示差異需驗證
```

給 AI 的 Prompt 可以寫：

```text
先不要修改程式。

請把目前頁面切成 iPhone 12 尺寸檢查 responsive。
依照 OpenSpec 驗證：

1. 有沒有水平 overflow
2. 按鈕是否符合手機版規則
3. 文字 / 表格有沒有被裁切
4. spacing 是否與現有設計系統一致

先列出問題與截圖證據，再提出最小修改。
```

> 注意：Orca Mobile Companion 是「用手機遠端查看與控制桌面上的 Agent / Worktree」，和用來測 App 的 mobile emulator 是不同功能。

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
