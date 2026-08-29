// getting elements 
const backBtn = document.getElementById("backBtn");
const whatsNextBtn = document.getElementById("whatsNext");
const nextBtn = document.getElementById("nextBtn");
const engName = document.getElementById("engName");
const jpName = document.getElementById("jpName");
const genreList = document.getElementById("genreList");
var loading = false;
const btnText = document.getElementById("btnText");
const categorybtn = document.getElementById("categorybtn");
const categories = document.getElementById("categories");
// the apis 
// var jikanUrl = "https://api.jikan.moe/v4/random/anime";
var anilistUrl = "https://graphql.anilist.co";

// text animation 
var btnTime = null;
function textChange(el, newText){
    clearTimeout(btnTime);
    el.style.opacity = 0;
    setTimeout(function(){
        el.textContent = newText;
        el.style.opacity = 1;
    },250);
}
function hikariGets() {
    if(loading){
        return;
    }
    loading = true;
    whatsNextBtn.disabled = true;
    textChange(btnText, "Ummmmm....");
    console.log("geting a anime.......!!!!!!");
    // oh dude , jikan down rn 
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
                    english
                    native
                }
                coverImage {
                    large
                }
                genres
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
        engName.textContent = anime.title.english || anime.title.romaji;
        jpName.textContent = anime.title.native;
        genreList.innerHTML = "";
        for(var i =0; i<anime.genres.length; i++){
            var bubble = document.createElement("div");
            bubble.className = "theGenre";
            bubble.textContent = anime.genres[i];
            genreList.appendChild(bubble);
        }
    })
    .catch(function(e){
        console.log("oops", e);
    })
    .finally(function(){
        loading = false;
        whatsNextBtn.disabled = false;
        textChange(btnText, "What's Next?");
    });
}
whatsNextBtn.addEventListener("click", hikariGets);
//the category choosing btn opens and closes
 categorybtn.addEventListener("click",function(){
    categories.classList.toggle("open");
 });