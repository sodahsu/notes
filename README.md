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


## 手機模擬器怎麼用（詳細版）

先不要把所有「手機」功能混在一起。Orca 這裡其實有三種不同用途：

| 你要做什麼 | 用什麼 |
| --- | --- |
| 看手機版 RWD / breakpoint / overflow | Browser Device Emulation |
| 測 App / WebView / 鍵盤 / 手勢 / 旋轉 | iOS / Android Emulator |
| 人離開電腦，用手機查看 Agent 進度 | Mobile Companion |

### A. Browser Device Emulation：前端設計師最常用

適合 Vue、React、一般網站、後台與 PWA。

Orca Browser 會透過 Chrome DevTools Protocol 模擬 viewport，所以頁面讀到的：

- `window.innerWidth`
- CSS media query
- responsive breakpoint

都會跟著模擬尺寸變化。

#### 1. 先確認 CLI

Orca Desktop 的 Settings 裡啟用 / 註冊 Orca CLI，然後：

```bash
orca status --json
```

#### 2. 前端跑起來

例如：

```bash
npm run dev
```

並在 Orca Browser 打開 localhost。

#### 3. 切成手機 profile

```bash
orca set device --name "iPhone 12" --worktree active --json
```

#### 4. 截圖

```bash
orca screenshot --worktree active --json
orca full-screenshot --worktree active --json
```

#### 5. 建議檢查

- 水平 overflow
- CTA 是否符合手機版規則
- 中文換行 / 裁切
- 表格 / Modal 是否超出 viewport
- sticky / fixed 是否遮內容
- touch target 是否過小
- spacing 是否沿用既有設計系統

> Browser 裝置模擬適合 RWD QA，但不等於真正 iPhone Safari 或 Android WebView。

### B. iOS Simulator：測真正 App / WebView 行為

先安裝 skill：

```bash
npx skills add https://github.com/stablyai/orca --skill orca-emulator --global
```

Agent 可以先讀目前 Orca 版本對應的 guide：

```bash
orca skills get orca-emulator
```

#### 找到裝置

```bash
orca emulator list --worktree active --json
```

#### 綁定 Simulator

```bash
orca emulator attach "<device-name-or-udid>" --worktree active --json
```

#### 點擊

```bash
orca emulator tap 0.5 0.7 --worktree active --json
```

#### 輸入

```bash
orca emulator type "hello" --worktree active --json
```

#### 滑動 / 拖曳

```bash
orca emulator gesture '[{"type":"begin","x":0.5,"y":0.8},{"type":"move","x":0.5,"y":0.4},{"type":"end","x":0.5,"y":0.2}]' --worktree active --json
```

#### 旋轉

```bash
orca emulator rotate landscape_left --worktree active --json
```

#### Home

```bash
orca emulator button home --worktree active --json
```

#### 結束

```bash
orca emulator shutdown --worktree active --json
```

Orca 的 emulator 座標是 0～1 的相對座標：

```text
0,0       左上
0.5,0.5   中央
1,1       右下
```

單次點擊優先用 `tap`；拖曳或多段觸控流程用 `gesture`。

iOS Simulator 需要可提供 Apple Simulator 環境的 Mac runtime / host。Windows 工作機如果只是做 Web，先用 Browser Device Emulation；真的需要 iOS 行為時再接 Mac host。

### C. Android Emulator / 實機

安裝 Android skill：

```bash
npx skills add https://github.com/stablyai/orca --skill orca-emulator-android --global
```

再讓 Agent 讀目前版本說明：

```bash
orca skills get orca-emulator-android
```

官方 skill 的用途包含：

- list / boot AVD
- tap / swipe / type
- hardware buttons
- install / launch App
- permissions
- accessibility tree
- logcat

不要直接叫 AI 從記憶猜 adb / Orca flags，先載入目前版本的 guide。

### D. Mobile Companion 不是 Emulator

Orca Mobile Companion 是手機端遙控 / 監看工具。

可以用手機：

- 看每個 Worktree
- 看 Agent working / waiting / done
- 看 terminal
- 看 source control
- 回覆 Agent 問題
- 切換部分 Agent account

它不是用來模擬 App 的測試裝置。

白話：

```text
Mobile Companion = 用手機遙控 Orca
Mobile Emulator   = 讓 AI 操作一台測試手機
```

### E. 搭配 OpenSpec

不要只寫：

```text
支援 RWD
```

改成可驗收的 scenario：

```text
- 390px viewport 不得出現非預期水平捲軸
- 手機版主要 CTA 必須滿寬
- CTA 不得被 fixed footer 或 virtual keyboard 遮住
- 中文標題可以換行，但不得截字
- 表格使用既定 mobile pattern，不由 AI 自行發明
- WebView 與一般 Browser 不一致時先標記待確認
```

### F. 推薦 QA 流程

```text
切手機尺寸
  ↓
先截圖
  ↓
找出可重現問題
  ↓
對 OpenSpec 預期
  ↓
AI 做最小修改
  ↓
同尺寸再驗一次
  ↓
看 Diff
```

給 AI：

```text
先不要修改程式。

請用 iPhone 12 viewport 檢查目前頁面，依 OpenSpec 驗證：
1. horizontal overflow
2. CTA 行為
3. 中文換行 / 裁切
4. 表格 / Modal
5. sticky / fixed
6. touch target
7. spacing

先回報「問題 → 證據 → 最小修改建議」。
我確認後再實作。
```

官方文件：

- Browser viewport emulation: https://www.onorca.dev/docs/browser/overview
- Orca CLI / mobile emulator: https://www.onorca.dev/docs/cli/reference
- Emulator skills: https://www.onorca.dev/docs/cli/skills
- Mobile Companion: https://www.onorca.dev/docs/mobile

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
