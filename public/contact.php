<?php
/**
 * WOTA contact form endpoint.
 * Receives the form as JSON, validates it, and emails info@wota.africa using
 * the server's local mail system (Afrihost / cPanel Exim) via PHP mail().
 *
 * No third-party service or API key needed — the message is delivered straight
 * to the info@wota.africa mailbox hosted on the same server.
 */

header('Content-Type: application/json; charset=utf-8');

// Where enquiries go, and the address they are sent "from".
// FROM is a REAL mailbox on the wota.africa domain: it passes SPF/DKIM and,
// because the mailbox actually exists, Afrihost's mail server won't reject the
// envelope sender. (Reply-To below points back at the visitor.)
const MAIL_TO   = 'info@wota.africa';
const MAIL_FROM = 'info@wota.africa';

// --- method guard ---------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

// --- read + validate the submission ---------------------------------------
$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Malformed request.']);
    exit;
}

$name     = trim($data['name']     ?? '');
$email    = trim($data['email']    ?? '');
$company  = trim($data['company']  ?? '');
$phone    = trim($data['phone']    ?? '');
$interest = trim($data['interest'] ?? '');
$message  = trim($data['message']  ?? '');
$hp       = trim($data['website']  ?? '');           // honeypot
$elapsed  = (int) ($data['elapsed'] ?? 0);            // seconds spent on the form

// Return a fake success so bots don't learn they were caught.
$dropAsBot = function () {
    echo json_encode(['ok' => true]);
    exit;
};

// 1) Honeypot — real people never fill the hidden "website" field.
if ($hp !== '') $dropAsBot();

// 2) Time-trap — humans take more than a couple of seconds to fill the form.
if ($elapsed > 0 && $elapsed < 3) $dropAsBot();

// 3) Link spam — enquiries rarely contain links; a URL in the name is a red
//    flag, and a message crammed with links is almost always spam.
$linksInMsg = preg_match_all('~https?://|www\.~i', $message);
if (preg_match('~https?://|www\.~i', $name . ' ' . $company) || $linksInMsg > 2) {
    $dropAsBot();
}

// 4) Per-IP rate limit — min 15s between sends, max 5 per hour.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rlDir = sys_get_temp_dir() . '/wota_contact_rl';
@mkdir($rlDir, 0700, true);
$rlFile = $rlDir . '/' . md5($ip) . '.json';
$now = time();
$hits = is_file($rlFile) ? (json_decode(@file_get_contents($rlFile), true) ?: []) : [];
$hits = array_values(array_filter($hits, fn ($t) => $t > $now - 3600));
if (($hits && $now - max($hits) < 15) || count($hits) >= 5) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Too many messages — please try again in a little while.']);
    exit;
}
$hits[] = $now;
@file_put_contents($rlFile, json_encode($hits), LOCK_EX);

// Allowed "interest" values — must match the dropdown in ContactForm.jsx.
$allowedInterests = [
    'Event or activation', 'Sponsorship', 'Bulk / branded order',
    'Partnership', 'Media & press', 'Something else',
];

$fields = [];
if ($name === '' || mb_strlen($name) < 2 || mb_strlen($name) > 80)       $fields[] = 'name';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || mb_strlen($email) > 120)                                          $fields[] = 'email';
if (!in_array($interest, $allowedInterests, true))                       $fields[] = 'interest';
if ($phone !== '' && !preg_match('~^[+\d][\d\s()\-]{6,}$~', $phone))      $fields[] = 'phone';
if (mb_strlen($message) < 10 || mb_strlen($message) > 2000)              $fields[] = 'message';
if ($fields) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please check the highlighted fields.', 'fields' => $fields]);
    exit;
}

// Cap the optional company field defensively (not shown as an error).
if (mb_strlen($company) > 100) $company = mb_substr($company, 0, 100);

// Strip CR/LF from any value that goes into a mail header (anti-injection).
$h = fn($v) => str_replace(["\r", "\n"], ' ', $v);

// --- build the email ------------------------------------------------------
$subject = 'WOTA enquiry — ' . $h($interest);

$e = fn($v) => htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
$eName = $e($name); $eEmail = $e($email); $eCompany = $e($company);
$ePhone = $e($phone); $eInterest = $e($interest); $eMessage = nl2br($e($message));
$rows = "<tr><td style='padding:4px 10px'><b>Name</b></td><td style='padding:4px 10px'>$eName</td></tr>"
      . "<tr><td style='padding:4px 10px'><b>Email</b></td><td style='padding:4px 10px'>$eEmail</td></tr>";
if ($company !== '') $rows .= "<tr><td style='padding:4px 10px'><b>Company</b></td><td style='padding:4px 10px'>$eCompany</td></tr>";
if ($phone   !== '') $rows .= "<tr><td style='padding:4px 10px'><b>Phone</b></td><td style='padding:4px 10px'>$ePhone</td></tr>";
$rows .= "<tr><td style='padding:4px 10px'><b>Interest</b></td><td style='padding:4px 10px'>$eInterest</td></tr>";
$body = "<div style='font-family:Arial,sans-serif;font-size:15px;color:#111'>"
      . "<h2 style='margin:0 0 12px'>New WOTA enquiry</h2>"
      . "<table style='border-collapse:collapse;background:#f6f6f6;border-radius:6px'>$rows</table>"
      . "<p style='white-space:pre-wrap;margin-top:16px'>$eMessage</p>"
      . "</div>";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: WOTA Website <' . MAIL_FROM . '>',
    // reply straight to the person who wrote in
    'Reply-To: ' . $h($name) . ' <' . $h($email) . '>',
    'X-Mailer: PHP/' . phpversion(),
];

// 5th arg sets the envelope sender (Return-Path) to a real domain address,
// which keeps the message out of spam on most cPanel/Exim setups.
$sent = mail(MAIL_TO, $subject, $body, implode("\r\n", $headers), '-f ' . MAIL_FROM);

if (!$sent) {
    error_log('WOTA contact: mail() returned false');
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'We couldn’t send your message just now.']);
    exit;
}

echo json_encode(['ok' => true]);
