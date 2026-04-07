<?php
// generate_image.php

// header('Content-Type: application/json');
// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST');
// header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Метод не поддерживается']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'error' => 'Некорректный JSON']);
    exit;
}

$baseImage = $input['baseImage'] ?? '';
$text = $input['text'] ?? '';
$x = (int)($input['x'] ?? 100);
$y = (int)($input['y'] ?? 100);
$fontSize = (int)($input['fontSize'] ?? 40);
$fontColor = $input['fontColor'] ?? '#ffffff';
$backgroundColor = $input['backgroundColor'] ?? 'rgba(0,0,0,0.5)';

if (empty($baseImage) || empty($text)) {
    echo json_encode(['success' => false, 'error' => 'Изображение и текст обязательны']);
    exit;
}

try {
    // 1. Декодируем base64 изображение
    $base64Data = preg_replace('/^data:image\/\w+;base64,/', '', $baseImage);
    $imageData = base64_decode($base64Data);

    if (!$imageData) {
        throw new Exception('Не удалось декодировать изображение');
    }

    // 2. Создаем изображение из строки
    $sourceImage = imagecreatefromstring($imageData);
    if (!$sourceImage) {
        throw new Exception('Не удалось создать изображение');
    }

    // 3. Получаем размеры
    $width = imagesx($sourceImage);
    $height = imagesy($sourceImage);

    // 4. Создаем изображение с поддержкой альфа-канала
    $outputImage = imagecreatetruecolor($width, $height);
    imagealphablending($outputImage, true);
    imagesavealpha($outputImage, true);

    // Копируем исходное изображение
    imagecopy($outputImage, $sourceImage, 0, 0, 0, 0, $width, $height);

    // 5. Парсим цвет подложки (RGBA)
    preg_match('/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/', $backgroundColor, $matches);
    if (count($matches) >= 4) {
        $bgR = (int)$matches[1];
        $bgG = (int)$matches[2];
        $bgB = (int)$matches[3];
        $bgA = isset($matches[4]) ? (float)$matches[4] : 1.0;
        $bgAlpha = 127 - (int)($bgA * 127);
    } else {
        // По умолчанию черный с полупрозрачностью
        $bgR = 0;
        $bgG = 0;
        $bgB = 0;
        $bgAlpha = 63; // примерно 0.5 прозрачности
    }

    // 6. Парсим цвет текста (HEX)
    list($textR, $textG, $textB) = hex2rgb($fontColor);

    // 7. Вычисляем размер подложки
    $fontPath = __DIR__ . '/fonts/arial.ttf'; // путь к шрифту .ttf

    // Если нет TTF, используем встроенный шрифт
    $useTTF = file_exists($fontPath);

    if ($useTTF) {
        // Получаем размеры текста для точной подложки
        $bbox = imagettfbbox($fontSize, 0, $fontPath, $text);
        $textWidth = $bbox[2] - $bbox[0];
        $textHeight = $bbox[1] - $bbox[7];

        $paddingX = 15;
        $paddingY = 10;

        $bgX = $x - $paddingX;
        $bgY = $y - $textHeight - $paddingY;
        $bgWidth = $textWidth + ($paddingX * 2);
        $bgHeight = $textHeight + ($paddingY * 2);

        // Рисуем подложку
        imagefilledrectangle($outputImage, $bgX, $bgY, $bgX + $bgWidth, $bgY + $bgHeight,
            imagecolorallocatealpha($outputImage, $bgR, $bgG, $bgB, $bgAlpha));

        // Рисуем текст
        $textColor = imagecolorallocate($outputImage, $textR, $textG, $textB);
        imagettftext($outputImage, $fontSize, 0, $x, $y, $textColor, $fontPath, $text);

    } else {
        // Fallback: используем встроенный шрифт (только латиница)
        $fontSizeGD = $fontSize / 3; // GD шрифты имеют размер 1-5
        $fontSizeGD = min(5, max(1, $fontSizeGD));

        $textWidth = imagefontwidth($fontSizeGD) * strlen($text);
        $textHeight = imagefontheight($fontSizeGD);

        $paddingX = 10;
        $paddingY = 8;

        $bgX = $x - $paddingX;
        $bgY = $y - $textHeight - $paddingY;
        $bgWidth = $textWidth + ($paddingX * 2);
        $bgHeight = $textHeight + ($paddingY * 2);

        // Рисуем подложку
        imagefilledrectangle($outputImage, $bgX, $bgY, $bgX + $bgWidth, $bgY + $bgHeight,
            imagecolorallocatealpha($outputImage, $bgR, $bgG, $bgB, $bgAlpha));

        // Рисуем текст
        $textColor = imagecolorallocate($outputImage, $textR, $textG, $textB);
        imagestring($outputImage, $fontSizeGD, $x, $y - $textHeight, $text, $textColor);
    }

    // 8. Сохраняем в буфер
    ob_start();
    imagepng($outputImage);
    $imageBuffer = ob_get_clean();

    // 9. Очищаем память
    imagedestroy($sourceImage);
    imagedestroy($outputImage);

    // 10. Возвращаем результат
    $resultBase64 = 'data:image/png;base64,' . base64_encode($imageBuffer);

    echo json_encode([
        'success' => true,
        'image' => $resultBase64,
        'dimensions' => ['width' => $width, 'height' => $height]
    ]);
    die();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    die();
}

function hex2rgb($hex) {
    $hex = str_replace('#', '', $hex);
    if (strlen($hex) == 3) {
        $r = hexdec(substr($hex, 0, 1) . substr($hex, 0, 1));
        $g = hexdec(substr($hex, 1, 1) . substr($hex, 1, 1));
        $b = hexdec(substr($hex, 2, 1) . substr($hex, 2, 1));
    } else {
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
    }
    return [$r, $g, $b];
}
?>