<?php
/**
 * THE JEWELRY Instagram integration -- FETCH (run hourly via cron)
 * ----------------------------------------------------------------
 * Same as the LOBMEYR fetch.php: pulls the newest posts, keeps only posts whose
 * caption contains one of the keywords in config.php, downloads each image locally
 * (Instagram CDN urls expire) and writes posts.json, which the website reads.
 *
 * Cron command (php CLI), e.g. on Sakura:
 *   php /home/<user>/www/instagram/fetch.php
 *
 * CLI only. HTTP access is blocked by .htaccess.
 */

require __DIR__ . '/config.php';

function ig_log($msg) {
    file_put_contents(IG_DIR . '/fetch.log', '[' . date('Y-m-d H:i:s') . '] ' . $msg . "\n", FILE_APPEND);
}

function ig_get($url) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);
    if ($body === false) {
        return [null, 0, $err];
    }
    return [$body, $code, null];
}

if (IG_ACCESS_TOKEN === 'PASTE_LONG_LIVED_TOKEN_HERE') {
    ig_log('ABORT: token not set yet. Paste it in config.php.');
    fwrite(STDERR, "Token not set. Edit config.php.\n");
    exit(1);
}

// 1. Newest media.
$fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
$url = IG_GRAPH_HOST . '/' . rawurlencode(IG_USER_ID) . '/media'
     . '?fields=' . $fields
     . '&limit=' . (int) IG_SCAN_LIMIT
     . '&access_token=' . rawurlencode(IG_ACCESS_TOKEN);

list($body, $code, $err) = ig_get($url);
if ($err || $code !== 200) {
    // Keep the last good posts.json; a failed fetch must not empty the site.
    ig_log("ABORT: media fetch failed (http $code) $err :: " . substr((string) $body, 0, 300));
    exit(1);
}

$data = json_decode($body, true);
if (!isset($data['data']) || !is_array($data['data'])) {
    ig_log('ABORT: unexpected response :: ' . substr($body, 0, 300));
    exit(1);
}

if (!is_dir(IG_IMAGES_DIR)) {
    mkdir(IG_IMAGES_DIR, 0755, true);
}

$posts = [];
$keptImageFiles = [];

foreach ($data['data'] as $m) {
    $type = $m['media_type'] ?? 'IMAGE';
    // Thumbnail for video, media_url otherwise (first image of a carousel).
    $remote = ($type === 'VIDEO') ? ($m['thumbnail_url'] ?? $m['media_url'] ?? '') : ($m['media_url'] ?? '');
    if ($remote === '') {
        continue;
    }

    $caption = trim((string) ($m['caption'] ?? ''));

    // FILTER: keep only posts with one of the keywords; the first match decides the section.
    $kind = null;
    foreach ($IG_TAGS as $tag => $k) {
        if (mb_stripos($caption, $tag) !== false) {
            $kind = $k;
            break;
        }
    }
    if ($kind === null) {
        continue;
    }
    // Remove every keyword so none shows in the text.
    foreach (array_keys($IG_TAGS) as $tag) {
        $caption = str_ireplace($tag, '', $caption);
    }
    $caption = trim(preg_replace("/[ \t]+\n/", "\n", $caption));

    $igId    = preg_replace('/[^A-Za-z0-9_]/', '', $m['id']);
    $imgName = $igId . '.jpg';
    $imgPath = IG_IMAGES_DIR . '/' . $imgName;

    // Download the image only once.
    if (!file_exists($imgPath)) {
        list($imgBody, $imgCode, $imgErr) = ig_get($remote);
        if ($imgErr || $imgCode !== 200 || $imgBody === null) {
            ig_log("WARN: image download failed for $igId (http $imgCode) $imgErr");
            continue;
        }
        file_put_contents($imgPath, $imgBody);
    }
    $keptImageFiles[$imgName] = true;

    // Title = first caption line; the text below it becomes the body (full caption if the title was cut).
    $lines     = explode("\n", $caption);
    $firstLine = trim($lines[0]) !== '' ? trim($lines[0]) : 'Instagram';
    $rest      = trim(implode("\n", array_slice($lines, 1)));
    $cut       = mb_strlen($firstLine) > 40;
    $title     = $cut ? mb_substr($firstLine, 0, 40) . '…' : $firstLine;
    $desc      = $cut ? $caption : ($rest !== '' ? $rest : $caption);

    $ts = isset($m['timestamp']) ? strtotime($m['timestamp']) : time();

    $posts[] = [
        'id'        => 'ig-' . $igId,
        'kind'      => $kind,
        'date'      => date('Y.m.d', $ts),
        'ts'        => $ts * 1000,
        'title'     => $title,
        'desc'      => $desc,
        'image'     => 'instagram/images/' . $imgName, // relative to the site root
        'permalink' => $m['permalink'] ?? '',
    ];
    if (count($posts) >= IG_KEEP) {
        break;
    }
}

// Newest first.
usort($posts, function ($a, $b) { return $b['ts'] <=> $a['ts']; });

// 2. Write posts.json atomically.
$tmp = IG_POSTS_JSON . '.tmp';
file_put_contents($tmp, json_encode($posts, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
rename($tmp, IG_POSTS_JSON);

// 3. Remove local images no longer in the feed.
foreach (glob(IG_IMAGES_DIR . '/*.jpg') as $file) {
    if (!isset($keptImageFiles[basename($file)])) {
        @unlink($file);
    }
}

ig_log('OK: wrote ' . count($posts) . ' posts.');
echo 'OK: ' . count($posts) . " posts written.\n";
