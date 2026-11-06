# AGENTS.md — Orca 工作手冊維護規範

此 repo 是靜態 GitHub Pages 文件網站。先閱讀 [SPEC.md](SPEC.md)，再變更任何內容。**每次變更都要評估規格是否受影響，受影響時在同一個 PR 同步修改規格、網站內容與測試。**

## 真相來源與變更範圍

- `SPEC.md`：網站可觀察行為與編輯維護規格，包含導覽、角色、Planning、治理與交付。
- `index.html`：主頁；`orca-openspec-designer-guide-with-ui.html`：逐字相同的鏡像，任何修改都須同步。
- `README.md`：入門摘要；功能範圍與網址有變需同步。
- `tests/*.test.mjs`：行為回歸與規格同步檢查。執行 `node --test tests/*.test.mjs`。

## 變更前

1. 確認 Git 工作區狀態，保留其他人的未提交修改。
2. 對照 `SPEC.md` 與現行 HTML／README／測試，記下實際要改的範圍。
3. 依據官方版本或有來源的專案證據描述產品能力與業務規則，不得把推測寫成已驗證事實。

## 變更時（必須）

- 新增、刪除、更名導航或角色，**同時**修改 `SPEC.md` 契約表、兩份 HTML 及測試。
- 修改 Planning、Orchestration、OpenSpec、交付、權限治理說明時，同步修改對應 `PLAN`、`FLOW`、`SAFE` 規格條文與 README（若影響入門）。
- 網站兩份 HTML 必須 byte-identical。不可只修一份。
- 修改各角色情境時，明確寫出使用情境、輸入、工作步驟／Prompt、交付物、人工核准責任。
- 本 repo 的 `SPEC.md` 是手冊規格；別的業務 repo 的 `openspec/changes` 屬於「待實作的意圖」，`openspec/specs` 只記經實作與驗證的現行事實。不得把 Prototype/Mock 當成已落地業務規則。
- 若變更不影響規格，PR 必須寫出「規格無影響」及理由，不能略過判斷。
- 不要以 Agent Done 取代 PM／SA／PO／QA／資安／維運的人為核准。

## 驗證與整合

1. `node --test tests/*.test.mjs`。
2. 確認所有錨點可到達、角色卡片連結可開啟對應 `details`、五個常見痛點可切換且保留焦點，並檢查手機視窗。
3. PR 註明哪些驗證實際完成，哪些為 NOT_RUN/BLOCKED。
4. 在新功能 PR 中使用 `.github/pull_request_template.md` 的規格同步勾選表。
5. 未完成測試時不得宣稱成功。不要重設／清理／強制推送以掩蓋問題。
