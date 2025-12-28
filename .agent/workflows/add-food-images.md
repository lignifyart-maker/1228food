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

### 3.2 撰寫食物描述

**字數要求：** 約 300-400 字（中文）

**內容結構（3 段落）：**

1. **歷史起源**（約 100 字）
   - 食物的發源地與歷史背景
   - 名稱的由來或有趣的傳說
   - 歷史演變過程

2. **製作方式**（約 100-150 字）
   - 傳統的製作工序與技藝
   - 關鍵食材與調味料
   - 烹調的講究與技巧

3. **文化意義**（約 100 字）
   - 在當地的飲食文化地位
   - 品嚐方式與搭配建議
   - 現代的發展與變化

**寫作風格：**
- 採用自然歷史風格，如同博物學家的觀察筆記
- 語調知性但不失溫度，帶有故事性
- 使用 `\n\n` 分隔段落
- 避免過度使用專有名詞，適度加入英文原名

**範例格式：**
```typescript
description: `拉麵是日本最具代表性的國民美食之一，這道看似簡單的麵食背後蘊含著深厚的文化底蘊與精湛的烹飪技藝。拉麵的起源可追溯至明治時代末期，當時來自中國的移民將中華麵條引入日本，經過一個多世紀的演變與創新，發展成為獨具日本特色的料理。

湯頭是拉麵的靈魂所在，主要分為四大流派：豚骨（豬骨）、醬油、鹽味與味噌。豚骨拉麵源自九州福岡，以長時間熬煮的濃白豬骨湯著稱，湯頭濃郁如牛奶般醇厚；醬油拉麵則是東京的代表，湯頭清澈而風味深邃。

麵條的粗細、捲曲度和硬度都會影響風味的呈現，專業的拉麵店往往會自製麵條，以達到最佳的搭配效果。配料的選擇同樣講究：叉燒需要經過長時間的滷製、糖心蛋要呈現完美的半熟狀態。日本人對拉麵的熱愛達到了狂熱的程度，各地都有自己引以為傲的在地風味。`
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
