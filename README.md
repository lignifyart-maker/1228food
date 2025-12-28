This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Development Rules

- **局部改動原則**：在進行程式碼或資料改動時，**只修改需要變動的部分**，不要更動或重新生成無關的程式碼區塊。這有助於保持檔案結構穩定，避免不必要的全檔案重作。

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
- **預設狀態**：說明文字限制 `max-height: 4.5em`（約 3 行）
- **展開狀態**：`max-height: 2000px` 顯示完整內容
- **按鈕文字**：
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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
