---
description: 如何新增食物圖片到世界美食圖鑑專案
---

# 新增食物圖片工作流程

## 概覽
使用 Antigravity 的 generate_image 工具生成食物圖片，然後轉換為 WebP 格式。

---

## 執行順序總覽

```
階段 1：規劃與研究
  └─ 1.1 決定食物清單
  └─ 1.2 撰寫所有食物描述

階段 2：圖片生成
  └─ 2.1 逐張生成圖片（每次 1 張）
  └─ 2.2 全部完成後，統一複製到專案目錄
  └─ 2.3 批次轉換為 WebP

階段 3：程式碼更新
  └─ 3.1 更新 page.tsx
  └─ 3.2 更新 check page

階段 4：驗證與推送
  └─ 4.1 npm run build 驗證
  └─ 4.2 git push
```

---

## 階段 1：規劃與研究

### 1.1 決定食物清單

先確定要新增的食物項目，包含：
- 食物名稱（中英文）
- 所屬國家/地區
- 主題色

**⚠️ 重要規則：不可重複**
- 新增前**必須先檢查所有已完成的項目**（`check*.html` 中的完整清單）
- 確保新增的食物與已存在的項目**不重複**
- 判定重複的標準：
  - 同一種食物的不同變體視為重複（如：拿坡里披薩 ≈ 披薩）
  - 同一種食物的不同口味視為重複（如：味噌拉麵 ≈ 拉麵）
  - 同一種食物的不同吃法視為重複（如：沙威瑪飯 ≈ 沙威瑪）
- 若發現重複，必須替換為其他不重複的食物

**🌍 選擇原則：異國風情優先**
- 優先選擇**冷門但具有文化特色**的料理
- 涵蓋多元地區：非洲、中東、東歐、南美、加勒比海、東南亞等
- 選擇各國的**傳統特色料理**，而非國際常見的快餐
- 目標：讓其他文化的人看到會覺得新鮮有趣
- 良好範例：法拉費、仁當牛肉、衣索比亞燉菜、牙買加燻雞
- 避免範例：薯條、炒飯、三明治（過於常見）

**🏷️ 中文命名原則：自然、吸引人**

1. **優先使用通用名稱**，避免生硬的「國名+料理」格式
   - ✅ 古拉什 (Goulash) — 使用音譯
   - ✅ 起司鍋 (Fondue) — 使用意譯  
   - ❌ 匈牙利燉牛肉、瑞士起司鍋 — 過於刻意

2. **跨文化圈的料理不以單一國家命名**
   - ✅ 沙威瑪 — 中東各國都有
   - ✅ 烤肉串 — 土耳其、中東、中亞共通
   - ❌ 土耳其沙威瑪、黎巴嫩烤雞

3. **命名優先順序**
   1. 已有流行的中文譯名 → 直接使用（如：提拉米蘇、可頌）
   2. 有常用音譯 → 使用音譯（如：古拉什、哈恰普里）
   3. 食物本身具描述性 → 意譯（如：起司船餅、開放式三明治）
   4. 無明確譯名 → Google 搜尋後選擇最自然的說法

4. **目標：旅行者視角**
   - 讓人一看就想嚐試的命名
   - 如同在異國街頭看到的菜單
   - 帶有神秘感和新鮮感

**📋 命名前置作業**
- 規劃清單後，先 **Google 搜尋** 各料理的常用中文譯名
- 參考台灣、香港、中國的不同說法
- 選擇最自然、最有吸引力的版本
- 若搜尋後仍不確定，優先選擇音譯或意譯

**📝 命名範例對照表**

| 原始命名 | 問題 | 修正後命名 | 說明 |
|---------|------|-----------|------|
| 匈牙利燉牛肉 | 國名生硬 | 古拉什 (Goulash) | 使用通用音譯 |
| 瑞士起司鍋 | 國名多餘 | 起司鍋 (Fondue) | 意譯即有辨識度 |
| 土耳其披薩 | 非準確描述 | 浪馬軍薄餅 (Lahmacun) | 使用音譯 |
| 土耳其烤肉串 | 多國共有 | 什錦烤肉串 (Shish Kebab) | 去除國名 |
| 喬治亞起司餅 | 國名冷門 | 哈恰普里 (Khachapuri) | 音譯更有異國風情 |
| 奈及利亞辣燉飯 | 過長 | 加羅夫飯 (Jollof Rice) | 使用通用音譯 |
| 越南春捲 | OK但可更精確 | 鮮蝦米紙卷 (Goi Cuon) | 區分炸/鮮捲 |
| 緬甸魚湯麵 | 可留國名 | 魚湯米線 (Mohinga) | 若國名有助辨識可保留 |
| 蘇格蘭羊雜布丁 | 過於直譯 | 哈吉斯 (Haggis) | 使用知名音譯 |
| 尼泊爾餃子 | 國名不必要 | 饃饃 (Momo) | 音譯更可愛 |

**🌐 地區分類建議**

以文化圈取代單一國家：
| 文化圈 | 包含國家/地區 |
|-------|-------------|
| 中東 | 土耳其、黎巴嫩、敘利亞、以色列、伊朗 |
| 北非 | 埃及、突尼西亞、摩洛哥、阿爾及利亞 |
| 東歐 | 俄羅斯、烏克蘭、波蘭、捷克 |
| 中歐 | 匈牙利、奧地利、德國 |
| 北歐 | 丹麥、挪威、瑞典、芬蘭、冰島 |
| 加勒比 | 牙買加、古巴、波多黎各、海地 |
| 東南亞 | 越南、泰國、緬甸、寮國、柬埔寨 |
| 南亞 | 印度、斯里蘭卡、孟加拉、巴基斯坦 |
| 高加索 | 喬治亞、亞美尼亞、亞塞拜然 |

### 1.2 撰寫食物描述

為所有食物撰寫描述（詳見後續「撰寫食物描述」章節）。

---

## 階段 2：圖片生成

### 2.1 逐張生成圖片

使用以下 prompt 模板（包含可愛小動物伴侶）：

```
A cute 3D illustration, square 1:1. [食物名稱] [食物描述]. 
Chibi [可愛動物] [動物動作/狀態]. 
Soft pastel background, studio lighting. 
Style: whimsical, 3D game art, no text.
```

**範例 prompt：**
```
A cute 3D illustration, square 1:1. Japanese Ramen noodle soup with rich broth, soft boiled egg, chashu pork, and nori. Chibi shiba inu dog sitting next to the bowl. Soft pastel background, studio lighting. Style: whimsical, 3D game art, no text.
```

**動物搭配建議：**
| 食物類型 | 建議動物 |
|---------|---------|
| 日式料理 | 柴犬 (shiba inu)、貓 (cat) |
| 中式料理 | 熊貓 (panda)、龍 (dragon) |
| 台式料理 | 黑熊 (black bear)、貓 (cat) |
| 義式料理 | 廚師帽貓 (cat with chef hat) |
| 法式料理 | 貴賓狗 (poodle)、蝸牛 (snail) |
| 美式料理 | 白頭鷹 (eagle)、臘腸狗 (dachshund) |
| 墨西哥 | 吉娃娃 (chihuahua)、驢子 (donkey) |
| 印度料理 | 大象 (elephant)、孔雀 (peacock) |
| 韓式料理 | 狐狸 (fox)、兔子 (bunny) |
| 泰式料理 | 泰國貓 (Thai cat)、大象 (elephant) |
| 越南料理 | 水牛 (water buffalo) |
| 德式料理 | 德國牧羊犬 (German shepherd)、豬 (pig) |
| 土耳其 | 羊 (lamb) |
| 俄羅斯 | 熊 (bear) |
| 澳洲 | 無尾熊 (koala)、袋鼠 (kangaroo) |
| 巴西 | 巨嘴鳥 (toucan) |

**重要提示：**
- 每次生成 1 張圖片
- 圖片會自動儲存在 `C:/Users/ligni/.gemini/antigravity/brain/[session-id]/` 目錄
- 檔名格式：`[ImageName]_[timestamp].png`
- 如遇 429 錯誤（速率限制），等待約 45 秒後重試

### 2.2 統一複製圖片

**全部圖片生成完成後**，將所有 PNG 複製到：
```
d:\2025git\202512\20251228food\public\items\
```

重新命名格式：`[編號]-[英文名稱].png`
例如：`61-food-name.png`, `62-another-food.png`

### 2.3 批次轉換為 WebP

在專案目錄執行：
```powershell
cd d:\2025git\202512\20251228food
node convert-to-webp.mjs
```

這會將所有 `.png` 檔案轉換為 `.webp` 並刪除原始 PNG。

---

## 階段 3：程式碼更新

### 3.1 更新 page.tsx

在 `app/page.tsx` 的 `items` 陣列中添加新食物資料：

```typescript
{
  name: "食物名稱 (English Name)",
  theme: "#主題色(hex)",  // 選擇與食物相配的顏色
  image: "/items/[編號]-[英文名稱].webp",
  description: `詳細描述文字...`
},
```

### 3.2 撰寫食物描述 (自然散文標準)

**字數要求：** 約 500-600 字（中文），確保內容紮實且具有極高的文學層次感。

**🚨 寫作禁令 (必須嚴格執行)：**
1. **去國名化命名**：`name` 欄位禁止使用「國家 + 食物名」。採用詩意、地理或具描述性的命名（如：`翡翠香草龍蝦` 而非 `馬達加斯加龍蝦`）。
2. **去公式化開頭**：禁止使用「這是...」、「...是一道...」等定義式句型起首。
3. **去標籤化結構**：禁止在描述當中使用中括號標題（如 `[歷史]`），應採用起伏自然的連續三段散文。

**寫作風格指引：**
- **電影感開場**：使用環境描寫、氣候、地理位置或感官體驗切入，營造情境氛圍。
- **視覺化敘事**：描述質地時需具象（如：`如同雲朵般輕盈`、`石化般質地`）。
- **博物學深度**：語調知性但帶有溫度，將食材與民族情感、生存哲學交織在一起。

**內容三段論 (自然融合)：**
1. **第一段 (源頭與情境)**：探討文化源頭、風土背景與名稱深意。
2. **第二段 (工藝與轉化)**：細讀烹飪過程中的技術細節、食材對位與結構變質。
3. **第三段 (儀式與昇華)**：描述品嚐現場的氛圍、當地生活場景，昇華至民族哲學。

**範例 (引人入勝標準)：**
```typescript
description: `散發著迷人異國芬芳與金紅光澤的露兜樹果，被太平洋島民賦予了「熱帶生命之光」的神聖稱號...（下略，參考 #152 描述）`
```

### 3.3 更新 Check Page

**檔案命名規則：**
- 每個 Check Page 最多包含 **100 個項目**
- 檔案命名格式：`check[起始編號]_[結束編號].html`

| 項目範圍 | 檔案名稱 |
|---------|---------|
| #1 - #100 | `check001_100.html` |
| #101 - #200 | `check101_200.html` |
| #201 - #300 | `check201_300.html` |

**範例：**
- 新增 #51-100 → 更新 `check001_100.html`
- 新增 #101-150 → 建立新檔案 `check101_200.html`
- 新增 #151-200 → 更新 `check101_200.html`

**注意：** 新建 Check Page 時，複製現有的樣式規範（10 欄佈局、可展開說明等），只更換 items 陣列內容。

---

## 階段 4：驗證與推送

### 4.1 本地驗證

```powershell
cd d:\2025git\202512\20251228food
npm run build
```

確認建置無錯誤。

### 4.2 推送更新

```powershell
git add .
git commit -m "Add new food items [編號範圍]"
git push
```

## 主題色參考

| 食物類型 | 建議顏色 |
|---------|---------|
| 日式 | #e11d48 (紅) |
| 義式 | #f97316 (橘) |
| 墨西哥 | #eab308 (黃) |
| 泰式 | #22c55e (綠) |
| 法式 | #d4a574 (奶油) |
| 印度 | #ca8a04 (咖哩黃) |
| 韓式 | #dc2626 (辣紅) |
| 越南 | #84cc16 (萊姆綠) |
| 中式 | #ef4444 (中國紅) |
| 台式 | #10b981 (翠綠) |
| 美式 | #3b82f6 (藍) |
| 德式 | #a16207 (啤酒棕) |

## Check Page 樣式規範 (check001_100.html)

檢查頁面採用緊湊的 10 欄網格佈局，搭配可展開/收合的說明區塊：

### 網格佈局設定
```css
.grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);  /* 一行 10 個 */
    gap: 10px;
    max-width: 100%;
    padding: 0 10px;
}
```

### 卡片尺寸設定
| 元素 | 屬性 | 值 |
|------|------|-----|
| 卡片圖片 | height | 120px |
| 卡片內容 | padding | 8px |
| 標題 | font-size | 0.8rem |
| 說明文字 | font-size | 0.65rem |
| 說明文字 | line-height | 1.5 |
| 編號標籤 | font-size | 0.6rem |

### 可展開/收合說明功能
```css
.description-text {
    max-height: 4.5em;  /* 預設約 3 行 */
    overflow: hidden;
}

.description-text.expanded {
    max-height: 2000px;  /* 展開顯示完整內容 */
}
```

**按鈕文字：**
- 收合時：「▼ 展開完整說明」
- 展開時：「▲ 收合說明」

### JavaScript 切換函數
```javascript
function toggleDescription(index) {
    const desc = document.getElementById('desc-' + index);
    const btn = desc.parentElement.querySelector('.toggle-btn');
    
    if (desc.classList.contains('expanded')) {
        desc.classList.remove('expanded');
        btn.textContent = '▼ 展開完整說明';
    } else {
        desc.classList.add('expanded');
        btn.textContent = '▲ 收合說明';
    }
}
```

### HTML 卡片結構
```html
<div class="description-wrapper">
    <p class="card-description description-text" id="desc-${index}">${descriptionHtml}</p>
    <div class="description-fade"></div>
    <button class="toggle-btn" onclick="toggleDescription(${index})">▼ 展開完整說明</button>
</div>
```
