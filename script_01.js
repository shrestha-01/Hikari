// getting elements 
const backBtn = document.getElementById("backBtn");
const whatsNextBtn = document.getElementById("whatsNext");
const nextBtn = document.getElementById("nextBtn");
// the apis 
// var jikanUrl = "https://api.jikan.moe/v4/random/anime";
var anilistUrl = "https://graphql.anilist.co";

function hikariGets() {
    console.log("geting a anime.......!!!!!!");
    // fetch(jikanUrl)
    //     .then(function(r){
    //         return r.json();
    //     })
    //     .then(function(d){
    //         console.log(d);
    //         var anime = d.data;
    //         posterImg.src = anime.images.jpg.large_image_url;
    //         titleText.textContent = anime.title;
    //         posterImg.style.display = "block";
    //     })
    //     .catch(function(e){
    //         console.log("oops",e);
    //     });
    var randPage = Math.floor(Math.random() * 500) + 1;
    var thegqlQuery = `
    query ($page: Int) {
        Page(page: $page, perPage: 1) {
            media(type: ANIME, sort: POPULARITY_DESC) {
                title {
                    romaji
                    native
                }
                coverImage {
                    large
                }
            }
        }
    }`;
    fetch(anilistUrl,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: thegqlQuery,
            variables: {
                page: randPage
            }
        })
    })
    .then(function(r){
        return r.json();
    })
    .then(function(d){
        console.log(d);
        var anime = d.data.Page.media[0];
        posterImg.src = anime.coverImage.large;
        posterImg.style.display = "block";
        titleText.textContent = anime.title.romaji;
    })
    .catch(function(e){
        console.log("oops", e);
    });
}
whatsNextBtn.addEventListener("click", hikariGets);