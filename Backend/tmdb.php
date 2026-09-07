<?php
require 'x.php';
$gmap = array(
    "Action" => 28, 
    "Adventure" => 12,
    "Animation" => 16,
    "Comedy" => 35,
    "Crime" => 80,
    "Documentary" => 99,  
    "Drama" => 18,
    "Family" => 10751,
    "Fantasy" => 14,
    "History" => 36,
    "Horror" => 27,
    "Music" => 10402,
    "Mystery" => 9648,
    "Romance" => 10749,
    "Science Fiction" => 878,
    "Thriller" => 53,
    "War" => 10752,
    "Western" => 37
);
$genreUrl = "";
if (isset($_GET['genres']) && $_GET['genres'] !== ""){
    $pickedGenres = explode(",", $_GET['genres']);
    $genreIds = array();
    foreach ($pickedGenres as $g){
        if(isset($gmap[$g])){
            $genreIds[] = $gmap[$g];
        }
    }
    if(count($genreIds)){
        $genreUrl = "&with_genres=" . implode(",", $genreIds);
    }
}

$randomPage = rand(1, 500);
$url = "https://api.themoviedb.org/3/discover/movie?api_key=" . TMDB_KEY .
    "&sort_by=popularity.desc&page=" . $randomPage . $genreUrl;

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