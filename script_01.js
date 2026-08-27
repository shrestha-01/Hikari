// getting elements 
const backBtn = document.getElementById("backBtn");
const whatsNextBtn = document.getElementById("whatsNext");
const nextBtn = document.getElementById("nextBtn");
// the apis 
var jikanUrl = "https://api.jikan.moe/v4/random/anime";

function hikariGets() {
    console.log("geting a anime.......!!!!!!");
    fetch(jikanUrl)
        .then(function(r){
            return r.json();
        })
        .then(function(d){
            console.log(d);
            var anime = d.data;
            posterImg.src = anime.images.jpg.large_image_url;
            posterImg.style.display = "block";
        })
        .catch(function(e){
            console.log("oops",e);
        });
}
whatsNextBtn.addEventListener("click", hikariGets);