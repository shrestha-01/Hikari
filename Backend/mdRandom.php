<?php
$tagUrl  = "";
if(isset($_GET['tags']) && $_GET['tags'] !== ""){
    $tagIds = explode(",", $_GET['tags']);
    foreach ($tagIds as $t){
        $tagUrl .="&includedTags[]=" .urlencode($t);
    }
}
$url = "https://api.mangadex.org/manga/random?includes[]=cover_art&contentRating[]=safe" . $tagUrl;
$response = file_get_contents($url);
header('Content-Type: application/json');
echo $response;