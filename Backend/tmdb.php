<?php
require 'x.php';

$randomPage = rand(1, 500);
$url = "https://api.themoviedb.org/3/discover/movie?api_key=" . TMDB_KEY .
    "&sort_by=popularity.desc&page=" . $randomPage;

$response = file_get_contents($url);
$data = json_decode($response, true);

if (!$data || empty($data['results'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'status_message' => 'no results on this page']);
    exit;
}

$randomIndex = array_rand($data['results']);
$movieId = $data['results'][$randomIndex]['id'];

$detailUrl = "https://api.themoviedb.org/3/movie/" . $movieId . "?api_key=" . TMDB_KEY;
$detailResponse = file_get_contents($detailUrl);

header('Content-Type: application/json');
echo $detailResponse;