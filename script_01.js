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
const avgscore = document.getElementById("avgscore");
const startDate = document.getElementById("startDate");
const statusrn = document.getElementById("statusrn");
const describe = document.getElementById("describe");
var animelist = [];
var historyPos = -1;
// the apis 
var jikanUrl = "https://api.jikan.moe/v4/random/anime";
var anilistUrl = "https://graphql.anilist.co";
// text animation 
var btnTime = null;
function textChange(el, newText) {
    clearTimeout(btnTime);
    el.style.opacity = 0;
    setTimeout(function () {
        el.textContent = newText;
        el.style.opacity = 1;
    }, 250);
}
function hikariGets() {
    if (loading) {
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
    var anime = null;
    try {
        anime = await tryAnilist();
    } catch (e) {
        console.log("oh shoot ,, anilist down", e);
    }
    if (!anime) {
        try {
            anime = await tryJikan();
        } catch (e) {
            console.log("jikan down tooo =("), e;
        }
    }
    if (anime) {
        animelist.push(anime);
        historyPos = animelist.length - 1;
        showanime(anime);
        backBtn.disabled = historyPos <= 0;
        nextBtn.disabled = historyPos >= animelist.length - 1;
    } else {
        console.log("both apis down, rough day");
    }
    loading = false;
    whatsNextBtn.disabled = false;
    textChange(btnText, "What's Next?");
}
async function tryAnilist() {
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
                averageScore
                startDate{
                    year
                    month
                    day
                }
                status
                description
            }
        }
    }`;
    var res = await fetch(anilistUrl,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: thegqlQuery,
            variables: {
                page: randPage
            }
        })
    });
    var d = await res.json();
    if(!d.data || !d.data.Page.media.length){
        throw new Error("no anilist data");
    }
    return d.data.Page.media[0];
}
async function tryJikan() {
    var res = await fetch(jikanUrl);
    var d = await res.json();
    if(!d.data){
        throw new Error("no jikan data");
    }
    var a = d.data;
    var jgenres = [];
    for (var i =0; i<a.genres.length; i++){
        jgenres.push(a.genres[i].name);
    }
    var jyear = "?";
    var jmonth= "?";
    var jday = "?";
    if(a.aired && a.aired.from){
        var adate = new Date(a.aired.from);
        year = adate.getFullYear();
        jmonth = adate.getMonth() + 1;
        jday = adate.getDate();
    }
    var janime = {
        title: {
            romaji: a.title,
            english: a.title_english,
            native: a.title_japanese
        },
        coverImage:{
            large: a.images.jpg.large_image_url
        },
        genres:jgenres,
        averageScore: a.score ? Math.round(a.score * 10) : null,
        startDate:{
            year: jyear,
            month: jmonth,
            day: jday
        },
        status: a.status,
        description: a.synopsis
    };
    return janime;
}
// whatsNextBtn.addEventListener("click", hikariGets);

function showanime(anime) {
    posterImg.src = anime.coverImage.large;
    posterImg.style.display = "block";
    engName.textContent = anime.title.english || anime.title.romaji;
    jpName.textContent = anime.title.native;
    // if(anime.averageScore){
    //     avgscore.textContent = "N/a"
    // }
    if (anime.averageScore) {
        avgscore.textContent = "✦ " + (anime.averageScore / 10) + "/10";
    } else {
        avgscore.textContent = "N/A";
    }
    startDate.textContent = anime.startDate.year + "-" +
        anime.startDate.month + "-" + anime.startDate.day;
    statusrn.textContent = anime.status;
    describe.innerHTML = anime.description;
    genreList.innerHTML = "";
    for (var i = 0; i < anime.genres.length; i++) {
        var bubble = document.createElement("div");
        bubble.className = "theGenre";
        bubble.textContent = anime.genres[i];
        genreList.appendChild(bubble);
    }
}
// for the backbtn 
backBtn.addEventListener("click", function () {
    if (historyPos > 0) {
        historyPos = historyPos - 1;
        showanime(animelist[historyPos]);
        backBtn.disabled = historyPos <= 0;
        nextBtn.disabled = historyPos >= animelist.length - 1;
    }
});
// nextbtn 
nextBtn.addEventListener("click", function () {
    if (historyPos < animelist.length - 1) {
        historyPos = historyPos + 1;
        showanime(animelist[historyPos]);
        backBtn.disabled = historyPos <= 0;
        nextBtn.disabled = historyPos >= animelist.length - 1;
    }
});
whatsNextBtn.addEventListener("click", hikariGets);
//the category choosing btn opens and closes
categorybtn.addEventListener("click", function () {
    categories.classList.toggle("open");
});