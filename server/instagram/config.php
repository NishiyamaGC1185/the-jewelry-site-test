<?php
/**
 * THE JEWELRY Instagram integration -- CONFIG
 * ----------------------------------------------------------------
 * PASTE YOUR VALUES BELOW ON THE SERVER ONLY. This is the only file you edit.
 * Never commit a real token to git or paste it in chat.
 *
 * Where to get each value (Instagram API with Instagram Login):
 *   1. Meta app  ->  Use cases  ->  "Manage messaging & content on Instagram"
 *   2. "API setup with Instagram login"  ->  Generate access token
 *   3. Copy the long-lived token into IG_ACCESS_TOKEN below.
 *   4. The same screen shows the Instagram user id  ->  IG_USER_ID.
 *
 * NOTE: the account must be added as an Instagram Tester AND the invite
 *       accepted inside the Instagram app, or token generation fails.
 *
 * This file outputs nothing in a browser, and the .htaccess in this folder
 * blocks HTTP access to *.php and the logs.
 */

// ---- PASTE HERE -------------------------------------------------
define('IG_ACCESS_TOKEN', 'PASTE_LONG_LIVED_TOKEN_HERE');
define('IG_USER_ID',      'PASTE_INSTAGRAM_USER_ID_HERE');
// -----------------------------------------------------------------

// Caption keyword => where the post appears on the site. Posts without one of these
// keywords stay off the site, and the keyword is removed from the shown text.
$IG_TAGS = [
    '#thejewelry_news'  => 'news',
    '#thejewelry_event' => 'event',
];

// Newest posts to scan, and matching posts to keep on the site.
define('IG_SCAN_LIMIT', 30);
define('IG_KEEP', 24);

// Dates are shown in Japan time.
date_default_timezone_set('Asia/Tokyo');

// Paths (this folder = /instagram/ on the website).
define('IG_DIR', __DIR__);
define('IG_IMAGES_DIR', __DIR__ . '/images');
define('IG_POSTS_JSON', __DIR__ . '/posts.json');

// Graph API host for Instagram-login tokens.
define('IG_GRAPH_HOST', 'https://graph.instagram.com');
