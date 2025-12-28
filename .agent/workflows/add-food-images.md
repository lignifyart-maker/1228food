---
description: 如何新增食物圖片到世界美食圖鑑專案
---

# 新增食物圖片工作流程

## 概覽
使用 Antigravity 的 generate_image 工具生成食物圖片，然後轉換為 WebP 格式。

## 步驟

### 1. 使用 generate_image 工具生成圖片

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
- 圖片會自動儲存在 `C:/Users/gmk/.gemini/antigravity/brain/[session-id]/` 目錄
- 檔名格式：`[ImageName]_[timestamp].png`
- 如遇到 429 錯誤（容量不足），請等待約 45 秒後重試
- 建議一次生成 3-4 張圖片，避免超過速率限制

### 2. 複製圖片到專案目錄

將生成的 PNG 圖片複製到：
```
d:\202601app\1228food\public\items\
```

重新命名格式：`[編號]-[英文名稱].png`
例如：`09-ramen.png`, `10-pasta.png`

### 3. 轉換為 WebP 格式

在專案目錄執行：
```powershell
cd d:\202601app\1228food
node convert-to-webp.mjs
```

這會將所有 `.png` 檔案轉換為 `.webp` 並刪除原始 PNG。

### 4. 更新 page.tsx

在 `app/page.tsx` 的 `items` 陣列中添加新食物資料：

```typescript
{
  name: "食物名稱 (English Name)",
  theme: "#主題色(hex)",  // 選擇與食物相配的顏色
  image: "/items/[編號]-[英文名稱].webp",
  description: `詳細描述文字...`
},
```

### 5. 推送更新

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
