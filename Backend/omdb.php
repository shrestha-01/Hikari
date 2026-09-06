<?php
require 'x.php';
$searchWords = ["the", "man",  "love", "war", "star", "night", "day", "king", "world", "life"];
$randomWord = $searchWords[array_rand($searchWords)];
$randomPage = rand(1, 5);
$searchUr1 = "http://www.omdbapi.com/?apikey=" . OMDB_KEY . 
"&s=" . urlencode($randomWord) . "&type=movie&page=" . $randomPage;
$searchResponse = file_get_contents($searchUr1);
$searchData = json_decode($searchResponse, true);
if(!$searchData || $searchData['Response'] === "False" || empty($searchData['Search'])){
    header('Content-Type: application/json');
    echo json_encode(['Response'=>'False','Error'=>'no search results']);
    exit;
}
$randomIndex = array_rand($searchData['Search']);
$imdbId = $searchData['Search'][$randomIndex]['imdbID'];

$detailUrl = "http://www.omdbapi.com/?apikey=" . OMDB_KEY . "&i=" . $imdbId . "&plot=full";
$detailResponse = file_get_contents($detailUrl);
header('Content-Type: application/json');
echo $detailResponse;