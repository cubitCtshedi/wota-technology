<?php
/**
 * WOTA contact form endpoint.
 * Receives the form as JSON, validates it, and emails info@wota.africa via the
 * Resend REST API. The API key stays server-side (see secrets.sample.php).
 *
 * Requires: the sending domain (wota.africa) verified in your Resend account,
 * and PHP with the cURL extension (standard on Afrihost cPanel hosting).
 */

header('Content-Type: application/json; charset=utf-8');

// --- method guard ---------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

// --- load the Resend API key ----------------------------------------------
// Prefer a real environment variable; otherwise fall back to secrets.php,
// which you create on the server from secrets.sample.php (it is git-ignored
// and blocked from HTTP access by .htaccess).
$apiKey = getenv('RESEND_API_KEY') ?: '';
if ($apiKey === '' && is_file(__DIR__ . '/secrets.php')) {
    require __DIR__ . '/secrets.php';
    if (!empty($RESEND_API_KEY)) {
        $apiKey = $RESEND_API_KEY;
    }
}
if ($apiKey === '') {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Email service is not configured yet.']);
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
$hp       = trim($data['website']  ?? ''); // honeypot: real people leave it empty

// Silently accept-and-drop obvious bots
if ($hp !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$fields = [];
if ($name === '')                                        $fields[] = 'name';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $fields[] = 'email';
if ($interest === '')                                    $fields[] = 'interest';
if (mb_strlen($message) < 10)                            $fields[] = 'message';
if ($fields) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please check the highlighted fields.', 'fields' => $fields]);
    exit;
}

// --- build the email ------------------------------------------------------
$to      = 'info@wota.africa';
$from    = 'WOTA Website <noreply@wota.africa>'; // must be on a Resend-verified domain
$subject = 'WOTA enquiry — ' . $interest;

$textLines = ["Name: $name", "Email: $email"];
if ($company !== '') $textLines[] = "Company: $company";
if ($phone   !== '') $textLines[] = "Phone: $phone";
$textLines[] = "Interest: $interest";
$textLines[] = '';
$textLines[] = $message;
$text = implode("\n", $textLines);

$e = fn($v) => htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
$eName = $e($name); $eEmail = $e($email); $eCompany = $e($company);
$ePhone = $e($phone); $eInterest = $e($interest); $eMessage = nl2br($e($message));
$rows = "<tr><td><b>Name</b></td><td>$eName</td></tr>"
      . "<tr><td><b>Email</b></td><td>$eEmail</td></tr>";
if ($company !== '') $rows .= "<tr><td><b>Company</b></td><td>$eCompany</td></tr>";
if ($phone   !== '') $rows .= "<tr><td><b>Phone</b></td><td>$ePhone</td></tr>";
$rows .= "<tr><td><b>Interest</b></td><td>$eInterest</td></tr>";
$html = "<h2>New WOTA enquiry</h2>"
      . "<table cellpadding='6' style='border-collapse:collapse'>$rows</table>"
      . "<p style='white-space:pre-wrap'>$eMessage</p>";

$payload = [
    'from'     => $from,
    'to'       => [$to],
    'reply_to' => $email,
    'subject'  => $subject,
    'text'     => $text,
    'html'     => $html,
];

// --- send via Resend ------------------------------------------------------
$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS     => json_encode($payload),
]);
$response = curl_exec($ch);
$status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($curlErr || $status < 200 || $status >= 300) {
    error_log('WOTA contact: Resend failed (' . $status . ') ' . $curlErr . ' ' . $response);
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'We couldn’t send your message just now.']);
    exit;
}

echo json_encode(['ok' => true]);
