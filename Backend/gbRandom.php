<?php
require 'x.php';
$context = stream_context_create([
    "http" => [
        "header" => "User-Agent: HikariApp/1.0 (contact: email@example.com)\r\n"
    ]
]);
$countUrl = "https://www.giantbomb.com/api/games/?api_key=" . GIANTBOMB_KEY . "&format=json&limit=1&field_list=id";
$countResponse = file_get_contents($countUrl, false, $context);
$countData = json_decode($countResponse, true);
if (!$countData || empty($countData['number_of_total_results'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'status_message' => 'no giant bomb count']);
    exit;
}
$totalResults = $countData['number_of_total_results'];
if ($totalResults > 5000) {
    $totalResults = 5000;
}
$randomOffset = rand(0, $totalResults - 1);
$url = "https://www.giantbomb.com/api/games/?api_key=" . GIANTBOMB_KEY . "&format=json&limit=1&offset=" . $randomOffset;
$response = file_get_contents($url, false, $context);
$data = json_decode($response, true);
if (!$data || empty($data['results'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'status_message' => 'no results at this offset']);
    exit;
}
$game = $data['results'][0];
$gameGuid = $game['guid'];

$detailUrl = "https://www.giantbomb.com/api/game/" . $gameGuid . "/?api_key=" . GIANTBOMB_KEY . "&format=json";
$detailResponse = file_get_contents($detailUrl, false, $context);
$detailData = json_decode($detailResponse, true);
if ($detailData && isset($detailData['results']['description'])) {
    $game['full_description'] = $detailData['results']['description'];
}
header('Content-Type: application/json');
echo json_encode($game);