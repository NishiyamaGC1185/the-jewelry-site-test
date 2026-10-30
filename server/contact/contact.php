<?php
/**
 * THE JEWELRY contact form -> email (Sakura rental server, PHP 8).
 * ----------------------------------------------------------------
 * The site's form (ContactForm.tsx) posts JSON here; this checks it and emails it to
 * CONTACT_TO in config.php, with Reply-To set to the visitor so a reply goes straight back.
 * Answers JSON: {"success": true} or {"success": false, "message": "..."}.
 *
 * Guards: POST only, same-site requests only, hidden "botcheck" field, field length limits,
 * no line breaks in header values, and at most RATE_MAX messages per visitor per RATE_WINDOW.
 */

require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function reply($ok, $message = '', $status = 200) {
    http_response_code($status);
    echo json_encode($ok ? ['success' => true] : ['success' => false, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    reply(false, 'POST only', 405);
}

// Same-site only: the browser's Origin (or Referer) must be this site.
$host = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''); // without a port
$from = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($host === '' || parse_url($from, PHP_URL_HOST) !== $host) {
    reply(false, 'Forbidden', 403);
}

if (CONTACT_TO === 'PASTE_EMAIL_HERE' || !filter_var(CONTACT_TO, FILTER_VALIDATE_EMAIL)) {
    reply(false, 'Recipient not configured', 500);
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$in = json_decode((string) $raw, true);
if (!is_array($in)) {
    reply(false, 'Bad request', 400);
}

// Bots fill in the hidden checkbox; pretend it worked.
if (!empty($in['botcheck'])) {
    reply(true);
}

$limits = ['type' => 60, 'company' => 200, 'name' => 100, 'email' => 254, 'tel' => 40, 'date' => 100, 'guests' => 60, 'message' => 5000, 'lang' => 2];
$v = [];
foreach ($limits as $key => $max) {
    $s = trim((string) ($in[$key] ?? ''));
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s); // control characters
    if (mb_strlen($s) > $max) {
        reply(false, 'Too long: ' . $key, 400);
    }
    $v[$key] = $s;
}
// One-line fields must not carry line breaks (they reach the mail headers or subject).
foreach (['type', 'company', 'name', 'email', 'tel', 'date', 'guests'] as $key) {
    $v[$key] = str_replace(["\r", "\n"], ' ', $v[$key]);
}
foreach (['company', 'name', 'email', 'message'] as $key) {
    if ($v[$key] === '') {
        reply(false, 'Missing: ' . $key, 400);
    }
}
if (!filter_var($v['email'], FILTER_VALIDATE_EMAIL)) {
    reply(false, 'Invalid email', 400);
}

// Rate limit per visitor (hashed IP), kept in a small file next to this script.
$ip = $_SERVER['HTTP_X_SAKURA_FORWARDED_FOR'] ?? ($_SERVER['REMOTE_ADDR'] ?? '');
$key = hash('sha256', $ip . '|the-jewelry');
$file = __DIR__ . '/ratelimit.json';
$fh = fopen($file, 'c+');
if ($fh && flock($fh, LOCK_EX)) {
    $hits = json_decode(stream_get_contents($fh) ?: '{}', true) ?: [];
    $now = time();
    foreach ($hits as $k => $times) {
        $hits[$k] = array_values(array_filter($times, fn($t) => $t > $now - RATE_WINDOW));
        if (!$hits[$k]) unset($hits[$k]);
    }
    if (count($hits[$key] ?? []) >= RATE_MAX) {
        flock($fh, LOCK_UN);
        fclose($fh);
        reply(false, 'Too many messages, please try again later', 429);
    }
    $hits[$key][] = $now;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);
}

$lang = $v['lang'] === 'en' ? 'English' : '日本語';
$date = date('Y-m-d H:i');
$dash = fn($s) => $s === '' ? '-' : $s;
$body = <<<TXT
THE JEWELRY ウェブサイトからお問い合わせがありました。
New enquiry from the THE JEWELRY website.

■ 種別 / Type
{$dash($v['type'])}

■ 会社名・団体名 / Company
{$v['company']}

■ お名前 / Name
{$v['name']}

■ メール / Email
{$v['email']}

■ 電話番号 / Phone
{$dash($v['tel'])}

■ 希望時期 / Preferred timing
{$dash($v['date'])}

■ 想定人数 / Expected guests
{$dash($v['guests'])}

■ 内容 / Message
{$v['message']}

――――――――――――――――――
送信日時 / Sent: {$date}
サイト言語 / Site language: {$lang}
このメールに返信すると、お問い合わせ者に届きます。
Reply to this email to answer the sender directly.
TXT;

// UTF-8 mail ('uni'): ISO-2022-JP cannot hold characters such as 髙, ①, ㈱ or "—".
mb_language('uni');
mb_internal_encoding('UTF-8');
$subject = '【THE JEWELRY】お問い合わせ / Enquiry: ' . $dash($v['type']) . ' — ' . mb_strimwidth($v['company'], 0, 60, '…');
$headers = implode("\r\n", [
    'From: ' . mb_encode_mimeheader(CONTACT_FROM_NAME) . ' <' . CONTACT_FROM . '>',
    'Reply-To: ' . $v['email'],
]);

$sent = mb_send_mail(CONTACT_TO, $subject, $body, $headers, '-f' . CONTACT_FROM);
if (!$sent) {
    error_log('contact.php: mb_send_mail failed');
    reply(false, 'Mail could not be sent', 500);
}
reply(true);
