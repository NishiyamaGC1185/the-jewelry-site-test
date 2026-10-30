<?php
/**
 * THE JEWELRY Instagram integration -- TOKEN REFRESH (run weekly via cron)
 * ----------------------------------------------------------------
 * Long-lived Instagram-login tokens expire after 60 days. Refreshing (while the
 * token is still valid and over 24h old) extends it another 60 days, so running
 * weekly keeps it alive. The new token is written back into config.php.
 * (The LOBMEYR feed stopped in 2026-07 because its token expired.)
 *
 * Cron command (php CLI), e.g. on Sakura:
 *   php /home/<user>/www/instagram/refresh.php
 */

require __DIR__ . '/config.php';

function refresh_log($msg) {
    file_put_contents(IG_DIR . '/refresh.log', '[' . date('Y-m-d H:i:s') . '] ' . $msg . "\n", FILE_APPEND);
}

if (IG_ACCESS_TOKEN === 'PASTE_LONG_LIVED_TOKEN_HERE') {
    refresh_log('ABORT: token not set yet.');
    exit(1);
}

$url = IG_GRAPH_HOST . '/refresh_access_token'
     . '?grant_type=ig_refresh_token'
     . '&access_token=' . rawurlencode(IG_ACCESS_TOKEN);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_SSL_VERIFYPEER => true,
]);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($body === false || $code !== 200) {
    refresh_log("ABORT: refresh failed (http $code) :: " . substr((string) $body, 0, 300));
    exit(1);
}

$data = json_decode($body, true);
$newToken = $data['access_token'] ?? '';
if ($newToken === '') {
    refresh_log('ABORT: no token in response :: ' . substr($body, 0, 300));
    exit(1);
}

// Rewrite the token line in config.php.
$cfgPath = __DIR__ . '/config.php';
$cfg = file_get_contents($cfgPath);
$new = preg_replace(
    "/define\\('IG_ACCESS_TOKEN',\\s*'[^']*'\\);/",
    "define('IG_ACCESS_TOKEN', '" . $newToken . "');",
    $cfg,
    1,
    $count
);
if ($count === 1 && $new !== null) {
    file_put_contents($cfgPath, $new);
    refresh_log('OK: token refreshed and saved.');
    echo "OK: token refreshed.\n";
} else {
    refresh_log('ABORT: could not locate token line in config.php.');
    exit(1);
}
