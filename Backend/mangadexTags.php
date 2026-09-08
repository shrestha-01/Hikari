<?php
$url = "https://api.mangadex.org/manga/tag";
$response = file_get_contents($url);
header('Content-Type: application/json');
echo $response;