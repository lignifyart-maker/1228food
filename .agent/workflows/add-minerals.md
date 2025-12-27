---
description: 如何新增礦石到 LITHOS 專案
---

# 新增礦石工作流程

本說明檔描述如何為 LITHOS 專案新增新礦石（例如：101-125 號）。

---

## 📋 前置作業

1. **確認目前礦石數量**：查看 `app/page.tsx` 中的 `minerals` 陣列，確認目前有多少礦石。
2. **閱讀圖片生成 Prompt 模板**：參考 `.agent/workflows/mineral-image-prompt.md`

---

## 🔄 工作流程

### 步驟 1：生成礦石列表

生成指定數量的新礦石列表（例如 25 個），格式如下：

```
| # | 中文名 | 英文名 | 主題色 (Hex) |
|---|--------|--------|--------------|
| 101 | 礦石名 | Mineral Name | #hexcode |
```

**重要檢查項目：**
- ✅ 確保與現有礦石不重複（查看 `app/page.tsx` 中的 `minerals` 陣列）
- ✅ 確保英文名稱拼寫正確
- ✅ 確保中文名稱使用正確的礦物學術語
- ✅ 主題色應反映礦石的實際顏色

### 步驟 2：確認列表

**停下來詢問使用者：**
> 「以下是新增的礦石列表，請確認是否有需要修改的項目？」

如果使用者要求修改：
1. 移除指定的礦石
2. 補足新的礦石
3. 重複步驟 1-2 直到使用者確認

### 步驟 3：生成圖片

使用 `generate_image` 工具為每個礦石生成圖片。

**⚠️ 重要：圖片必須是正方形 (1:1 比例)**

**Prompt 模板：**
```
A cute, minimalistic 3D illustration designed as a collectible game asset, square format 1:1 aspect ratio. A large [MINERAL_NAME] specimen rendered with scientifically accurate mineral habit: [CRYSTAL_SYSTEM], [CRYSTAL_HABIT], [TERMINATION_DESCRIPTION]. The mineral color matches natural characteristics: [COLOR_DESCRIPTION]. All mineral edges and faces are outlined with a clean, solid white border, giving a stylized toy-like appearance similar to a museum display model. Next to the specimen stands a small cute chibi [ANIMAL] character [ACTION]. The scene is set on a soft neutral background with studio-style lighting, gentle shadows beneath the mineral, a few small broken fragments scattered on the ground. Style: whimsical, cozy, educational, high-quality 3D game illustration, soft lighting, smooth surfaces, no text, no UI, no watermark.
```

**變數說明：**
- `[MINERAL_NAME]`：礦石英文名
- `[CRYSTAL_SYSTEM]`：晶系（如 trigonal, monoclinic, cubic 等）
- `[CRYSTAL_HABIT]`：晶體習性（如 prismatic, tabular, botryoidal 等）
- `[TERMINATION_DESCRIPTION]`：**重要！** 尖端/頂端形態描述（見下表）
- `[COLOR_DESCRIPTION]`：顏色描述
- `[ANIMAL]`：可愛的**小動物**角色（優先使用動物而非人物）
- `[ACTION]`：動物的動作描述

**🔸 礦物形態注意事項：**

1. **避免所有礦物都畫成水晶尖端！** 不同礦物有不同的尖端形態：

| 礦物類型 | 正確尖端形態 | 錯誤示例 |
|----------|--------------|----------|
| 水晶 (Quartz) | 六角尖端 ✅ | - |
| 鑽石 (Diamond) | 八面體 (雙金字塔) | 六角尖端 ❌ |
| 祖母綠 (Emerald) | 平頂六方柱 | 尖端 ❌ |
| 藍寶石 (Sapphire) | 桶狀平頂 | 尖端 ❌ |
| 藍晶石 (Kyanite) | 扁平刀片狀 | 尖端 ❌ |
| 鋯石 (Zircon) | 四方雙錐 (兩端都尖) | 單端尖 ❌ |
| 方解石 (Calcite) | 菱面體 | 六角尖端 ❌ |
| 魚眼石 (Apophyllite) | 正方形平頂 | 尖端 ❌ |

2. **非結晶型態礦物**：使用 `ore` 或 `specimen` 描述，不要用 `crystal`：
   - 天使石 (Angelite)：MASSIVE or NODULAR form, smooth tumbled shape
   - 拉利瑪 (Larimar)：massive or cabochon form
   - 蛋白石類：amorphous, polished cabochon

3. **在 Prompt 中明確排除錯誤形態**：
   ```
   (NOT pointed like quartz)
   ```

**🔸 動物角色優先：**
- 優先使用小動物 (cat, bunny, fox, frog, bird, hamster 等)
- 偶爾可使用人物角色，但大部分應為動物
- 動物顏色/特性盡量與礦石主題相關

**API 限制處理：**
- ⚠️ **一次只生成一張圖片**：避免平行呼叫 API，否則容易觸發速率限制
- 如果遇到 429 錯誤（Too Many Requests），等待約 40 秒後重試
- 生成完一張圖片後，再呼叫 API 生成下一張

### 步驟 4：複製並轉換圖片

1. **複製圖片到專案目錄：**
```powershell
Copy-Item "C:\Users\gmk\.gemini\antigravity\brain\[SESSION_ID]\[IMAGE_NAME]_*.png" -Destination "d:\202601app\lithos\public\minerals\[##]-[mineral-name].png"
```

2. **轉換為 WebP 格式：**
```javascript
// 使用 convert-to-webp.mjs 腳本
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const mineralsDir = './public/minerals';
const files = fs.readdirSync(mineralsDir);
const pngFiles = files.filter(f => f.endsWith('.png'));

for (const file of pngFiles) {
  const inputPath = path.join(mineralsDir, file);
  const outputPath = path.join(mineralsDir, file.replace('.png', '.webp'));
  
  await sharp(inputPath)
    .webp({ quality: 85 })
    .toFile(outputPath);
  
  fs.unlinkSync(inputPath); // 刪除原始 PNG
}
```

執行：
```powershell
node convert-to-webp.mjs
```

### 步驟 5：生成三段小語

為每個礦石生成三段訊息：

1. **嚴肅/智慧型**：關於創作、生活或心靈的深思熟慮建議
2. **勵志/正向型**：鼓勵性質的訊息
3. **迷因/詼諧型**：幽默、自嘲或網路梗的風格，通常會吐槽使用者

**格式範例：**
```javascript
{
  name: "礦石名 (English Name)",
  theme: "#hexcode",
  image: "/minerals/##-mineral-name.webp",
  messages: [
    "嚴肅/智慧型訊息。",
    "勵志/正向型訊息。",
    "迷因/詼諧型訊息（吐槽風格）。"
  ]
}
```

### 步驟 6：更新 page.tsx

將新礦石資料加入 `app/page.tsx` 的 `minerals` 陣列中。

**注意事項：**
- 確保圖片路徑正確（使用 .webp 副檔名）
- 確保編號連續
- 確保 messages 陣列有正好 3 個元素

---

## 📁 檔案結構

```
lithos/
├── app/
│   └── page.tsx          # 礦石資料陣列
├── public/
│   └── minerals/         # 礦石圖片 (webp 格式)
│       ├── 01-imperial-topaz-v3.webp
│       ├── 02-amethyst.webp
│       └── ...
└── .agent/
    └── workflows/
        ├── add-minerals.md           # 本說明檔
        └── mineral-image-prompt.md   # Prompt 模板參考
```

---

## ⚠️ 注意事項

1. **圖片格式**：所有圖片必須是 **正方形 (1:1)** 且為 **WebP 格式**
2. **命名規則**：圖片命名為 `##-mineral-name.webp`（編號-英文名小寫連字號）
3. **避免重複**：新增前務必檢查是否與現有礦石重複
4. **API 限制**：生成圖片時注意 API 速率限制
5. **備份**：修改 `page.tsx` 前建議先 commit 目前版本

---

## 📝 現有礦石列表 (截至 2024-12-27)

共 100 種礦石，編號 01-100。詳細列表請查看 `app/page.tsx`。

**已使用的礦石類型（避免重複）：**
- 水晶類：紫水晶、粉晶、黃水晶、白水晶、煙水晶、幽靈水晶、鈦晶
- 碧玉類：紅碧玉、海洋碧玉
- 瑪瑙類：瑪瑙、黑瑪瑙、苔紋瑪瑙、藍紋瑪瑙、樹紋瑪瑙
- 蛋白石類：蛋白石、火蛋白石、粉紅蛋白石
- 碧璽類：黑碧璽、西瓜碧璽
- 月光石類：月光石、彩虹月光石
- 玉髓類：藍玉髓、紅玉髓、綠玉髓
- 方解石類：方解石、鈷方解石、黃色方解石
- 螢石類：螢石、彩虹螢石
- 以及其他各類寶石與礦物...
