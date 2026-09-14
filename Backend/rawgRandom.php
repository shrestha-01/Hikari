<?php
require 'x.php';
$page_size = 40; 
$countUrl = "https://api.rawg.io/api/games?key="  . RAWG_KEY . "&page_size=1&ordering=-added";
$countResponse = file_get_contents($countUrl);
$countData= json_decode($countResponse, true);
if (!$countData || empty($countData['count'])){
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'status_message' => 'no rawg count']);
    exit;
}
$totalPages = (int)($countData['count'] / $page_size);
if($totalPages > 500){
    $totalPages = 500;
}
if($totalPages < 1){
    $totalPages = 1;
}
$randomPage = rand(1, $totalPages);
$url = "https://api.rawg.io/api/games?key=" . RAWG_KEY . "&page_size=" . $page_size . "&page=" . $randomPage . "&ordering=-added";
$response = file_get_contents($url);
$data = json_decode($response, true);
if(!$data || empty($data['results'])){
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'status_message' => 'no results on  this page']);
    exit;
}
$randomIndex = array_rand($data['results']);
$game = $data['results'][$randomIndex];
$gameId = $game['id'];
$detailUrl = "https://api.rawg.io/api/games/" . $gameId . "?key=" . RAWG_KEY;
$detailResponse = file_get_contents($detailUrl);
$detailData = json_decode($detailResponse, true);
if($detailData && isset($detailData['description_raw'])){
    $game['description_raw'] = $detailData['description_raw'];
}
header('Content-Type: application/json');
echo json_encode($game);