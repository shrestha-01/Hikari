<?php
require 'x.php';

$movieId = rand(1, 500000);
$url = "https://api.themoviedb.org/3/movie/" . $movieId . "?api_key=" . TMDB_KEY;

$response = file_get_contents($url);

header('Content-Type: application/json');
echo $response;