<?php
require 'x.php';
$page_size = 40;
$gmap = array(
    "Action" => "action",
    "Indie" => "indie",
    "Adventure" => "adventure",
    "RPG" => "role-playing-games-rpg",
    "Strategy" => "strategy",
    "Shooter" => "shooter",
    "Casual" => "casual",
    "Simulation" => "simulation",
    "Puzzle" => "puzzle",
    "Arcade" => "arcade",
    "Platformer" => "platformer",
    "Massively Multiplayer" => "massively-multiplayer",
    "Racing" => "racing",
    "Sports" => "sports",
    "Fighting" => "fighting",
    "Family" => "family"
);
$genreUrl = "";
if (isset($_GET['genres']) && $_GET['genres'] !== ""){
    $pickedGenres = explode(",", $_GET['genres']);
    $genreSlugs = array();
    foreach ($pickedGenres as $g){
        if (isset($gmap[$g])){
            $genreSlugs[] = $gmap[$g];
        }
    }
    if (count($genreSlugs)){
        $genreUrl = "&genres=" . implode(",", $genreSlugs);
    }
}
// $countUrl = "https://api.rawg.io/api/games?key="  . RAWG_KEY . "&page_size=1&ordering=-added";
$countUrl = "https://api.rawg.io/api/games?key=" . RAWG_KEY . "&page_size=1&ordering=-added" . $genreUrl;
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
// $url = "https://api.rawg.io/api/games?key=" . RAWG_KEY . "&page_size=" . $page_size . "&page=" . $randomPage . "&ordering=-added";
$url = "https://api.rawg.io/api/games?key=" . RAWG_KEY . "&page_size=" . $page_size . "&page=" . $randomPage . "&ordering=-added" . $genreUrl;
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
// $detailUrl = "https://api.rawg.io/api/games/" . $gameId . "?key=" . RAWG_KEY;
// $detailResponse = file_get_contents($detailUrl);
// $detailData = json_decode($detailResponse, true);
// if($detailData && isset($detailData['description_raw'])){
//     $game['description_raw'] = $detailData['description_raw'];
// }
$detailUrl = "https://api.rawg.io/api/games/" . $gameId . "?key=" . RAWG_KEY;
$detailResponse = file_get_contents($detailUrl);
$detailData = json_decode($detailResponse, true);
if($detailData && isset($detailData['description_raw'])){
    $game['description_raw'] = $detailData['description_raw'];
}
$movieUrl = "https://api.rawg.io/api/games/" . $gameId . "/movies?key=" . RAWG_KEY;
$movieResponse = file_get_contents($movieUrl);
$movieData = json_decode($movieResponse, true);
$game['trailer_url'] = null;
if($movieData && !empty($movieData['results'])){
    $firstMovie = $movieData['results'][0];
    if(isset($firstMovie['data']['max'])){
        $game['trailer_url']=$firstMovie['data']['max'];
    } else if(isset($firstMovie['data']['480'])){
        $game['trailer_url']=$firstMovie['data']['480'];
    }
}