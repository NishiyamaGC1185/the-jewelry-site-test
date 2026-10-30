# Instagram feed on the real server (PHP + cron)

Same system as LOBMEYR. Works on Sakura and most PHP rental servers (PHP 8, curl).

## Upload
1. Build the site (`npm run build` with static export) and upload it as usual.
2. Upload this folder's files to `/instagram/` on the website (next to `index.html`):
   `config.php`, `fetch.php`, `refresh.php`, `.htaccess` (README not needed).
3. When re-uploading the site later, **do not overwrite `/instagram/posts.json` or `/instagram/images/`**
   on the server — `fetch.php` creates them.

## Setup
1. Edit `config.php` on the server: paste `IG_ACCESS_TOKEN` and `IG_USER_ID`
   (Meta app → Instagram API with Instagram Login → generate token).
2. Cron (Sakura: コントロールパネル → CRON設定):
   - every hour: `php /home/<user>/www/instagram/fetch.php`
   - every week: `php /home/<user>/www/instagram/refresh.php`
3. Run `fetch.php` once by hand (or wait an hour) and check `fetch.log`.

## Posting
Put one tag in the Instagram caption:
- `#thejewelry_news` → News
- `#thejewelry_event` → Events

The first caption line becomes the title. The tag is hidden on the site.
Tags can be changed in `config.php` (`$IG_TAGS`).
