# THE JEWELRY

大阪湾のイベント施設 THE JEWELRY のウェブサイト。Next.js / React / TypeScript。

## ローカル起動

```sh
npm ci
npm run dev
```

http://localhost:3000/ を開いてください。英語版は `/en/` です。

## 構成

- `src/content/`: 日本語・英語の文章
- `src/components/cinema/`: TOPページとスクロール演出
- `public/images/`: サイトで使用する画像
- `server/`: 別途サーバー設定が必要なフォーム・Instagram連携

## ビルド

```sh
npm run build -- --webpack
```

秘密情報は環境変数またはサーバー側で管理してください。フォーム送信とInstagram自動取得には接続設定が必要です。GitHub Actionsは手動実行のみです。

## デザイン案の管理

| 案 | HTML / コンポーネント | 専用CSS | 専用JavaScript |
|---|---|---|---|
| A：CINEMA | `src/components/cinema/` | `cinema-home.css` | `CinemaHero.tsx` / `CinemaHome.tsx` |
| B：THE BAY EDITION | `public/designs/ivory/index.html` | `public/designs/ivory/style.css` | `public/designs/ivory/script.js` |
| C：AFTERGLOW | `public/designs/afterglow/index.html` | `public/designs/afterglow/style.css` | `public/designs/afterglow/script.js` |

B・Cは専用フォルダ内のファイルだけでデザイン・動きを管理します。CSS・JavaScriptは相互参照しません。比較一覧は `public/designs/index.html` と `index.css` です。画像素材とリンク先の下層ページは共通です。
