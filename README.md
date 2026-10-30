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
