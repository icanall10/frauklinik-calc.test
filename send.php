<?php

require 'recaptchalib.php';

$recaptchaPrivateKey = ""; // введите тут внутри кавычек приватный ключ recaptcha
$recipient = "wibev44726@tmail7.com"; // введите тут почту, на которую будет отправляться заявка

header('Content-Type: application/json');

function error($message)
{
    echo json_encode([
        'error' => $message
    ]);
    exit;
}

$sum = isset($_POST['sum']) ? $_POST['sum'] : null;
$term = isset($_POST['term']) ? $_POST['term'] : null;
$contribution = isset($_POST['contribution']) ? $_POST['contribution'] : null;

$name = isset($_POST['name']) ? $_POST['name'] : null;
$phone = isset($_POST['phone']) ? $_POST['phone'] : null;

if (!$name) {
    error('Введите имя');
}

if (!$phone) {
    error('Введите телефон');
}

if (!$sum) {
    error('Введите сумму кредита');
}

if ($recaptchaPrivateKey) {
    $resp = recaptcha_check_answer(
        $recaptchaPrivateKey,
        $_SERVER["REMOTE_ADDR"],
        $_POST["recaptcha_challenge_field"],
        $_POST["recaptcha_response_field"]
    );

    if (!$resp->is_valid) {
        error('Проверка не пройдена');
    }
}

$subject = 'Заявка из формы "Расчет кредита"';

$message = implode("\r\n", [
    "Сумма кредита: {$sum} руб.",
    "Срок кредита: {$term} месяцев.",
    "Первоначальный взнос: {$contribution}%",
    "Имя: {$name}",
    "Телефон: {$phone}",
]);

$headers = array(
    'From' => 'noreply@frauklinik.ru',
    'Reply-To' => 'noreply@frauklinik.ru',
    'X-Mailer' => 'PHP/' . phpversion()
);

mail($recipient, $subject, $message, $headers);

echo json_encode([
    'ok' => true
]);


