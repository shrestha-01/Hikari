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
const genresbox = document.getElementById("genresbox");
var catBtns = document.querySelectorAll(".categories button");
var rnMode = "anime";
var animelist = [];
var historyPos = -1;
var genresarr = [];
var hmt = 0;
// the apis 
var jikanUrl = "https://api.jikan.moe/v4/random/anime?sfw=true";
// var jikanUrl = "https://api.jikan.moe/v4/random/anime";
var jseUrl = "https://api.jikan.moe/v4/anime";
var anilistUrl = "https://graphql.anilist.co";
var kitsuUrl = "https://kitsu.io/api/edge/anime";
var shikimoriUrl = "https://shikimori.one/api/animes";
var jgenmap = {};
var kgenmap = {};
var clickSound = new Audio("Sounds/click.mp3");
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
async function hikariGets() {
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
        console.log("anime from anilist");
    } catch (e) {
        console.log("oh shoot ,, anilist down", e);
    }
    if (!anime) {
        try {
            anime = await tryJikan();
            console.log("anime from jikan");
        } catch (e) {
            console.log("jikan down tooo =(", e);
        }
    }
    if (!anime) {
        try {
            anime = await tryKitsu();
            console.log("anime from kitsu");
        } catch (e) {
            console.log("Kitsu down too, bruh", e);
        }
    }
    if (!anime) {
        try {
            anime = await tryShikimori();
            console.log("anime from shikimori");
        } catch (e) {
            console.log("shikimori down too, rip -_-", e);
        }
    }
    //     if (anime) {
    //         animelist.push(anime);
    //         historyPos = animelist.length - 1;
    //         showanime(anime);
    //         backBtn.disabled = historyPos <= 0;
    //         nextBtn.disabled = historyPos >= animelist.length - 1;
    //     } else {
    //         console.log("both apis down, rough day");
    //     }
    //     loading = false;
    //     whatsNextBtn.disabled = false;
    //     textChange(btnText, "What's Next?");
    // }
    if (anime && alreadyshown(anime)) {
        hmt = hmt + 1;
        console.log("already shown. try:", hmt);
        if (hmt < 5) {
            loading = false;
            whatsNextBtn.disabled = false;
            textChange(btnText, "What's Next?");
            await hikariGets();
            return;
        }
        console.log("5 try reachd");
        var savedGenres = genresarr;
        genresarr = genresarr.length ? [genresarr[0]] : [];
        var broadAnime = null;
        try {
            broadAnime = await tryAnilist();
        } catch (e) {
            console.log("broad anilist try failed too", e);
        }
        if (!broadAnime) {
            try {
                broadAnime = await tryJikan();
            } catch (e) {
                console.log("broad jikan try failed too", e);
            }
        }
        if (!broadAnime) {
            try {
                broadAnime = await tryKitsu();
            } catch (e) {
                console.log("broad kitsu failed too", e);
            }
        }
        genresarr = savedGenres;
        if (broadAnime) {
            anime = broadAnime;
        }
    }
    hmt = 0;
    if (anime) {
        animelist.push(anime);
        historyPos = animelist.length - 1;
        showanime(anime);
        backBtn.disabled = historyPos <= 0;
        nextBtn.disabled = historyPos >= animelist.length - 1;
    } else {
        console.log("both api down, rough day");
    }
    loading = false;
    whatsNextBtn.disabled = false;
    textChange(btnText, "What's Next?");
}
async function tryAnilist() {
    //     var randPage = Math.floor(Math.random() * 500) + 1;
    //     var thegqlQuery = `
    //  query ($page: Int, $genres: [String]) {
    //         Page(page: $page, perPage: 1) {
    //             media(type: ANIME, sort: POPULARITY_DESC, genre_in: $genres) {
    //                 title {
    //                     romaji
    //                     english
    //                     native
    //                 }
    //                 coverImage {
    //                     extraLarge
    //                 }
    //                 genres
    //                 averageScore
    //                 startDate{
    //                     year
    //                     month
    //                     day
    //                 }
    //                 status
    //                 description
    //             }
    //         }
    //     }`;
    var randPage = Math.floor(Math.random() * 500) + 1;
    var thegqlQuery;
    if (genresarr.length) {
        thegqlQuery = `
 query ($page: Int, $genres: [String]) {
        Page(page: $page, perPage: 25){
             media(type: ANIME,
             sort: POPULARITY_DESC,
             genre_in:$genres,
             isAdult: false){
                title {
                    romaji
                    english
                    native
                }
                coverImage {
                    extraLarge
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
    } else {
        thegqlQuery = `
 query ($page: Int) {
        Page(page: $page, perPage: 25){
            media(type: ANIME, sort: POPULARITY_DESC, isAdult: false){
                title {
                    romaji
                    english
                    native
                }
                coverImage {
                    extraLarge
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
    }
    var randPage2 = Math.floor(Math.random() * 20) + 1;
    var res = await fetch(anilistUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: thegqlQuery,
            variables: {
                page: randPage2,
                genres: genresarr
            }
        })
    });
    var d = await res.json();
    if (!d.data || !d.data.Page.media.length) {
        var fallbackRes = await fetch(anilistUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: thegqlQuery,
                variables: {
                    page: 1,
                    genres: genresarr
                }
            })
        });
        d = await fallbackRes.json();
    }
    if ((!d.data || !d.data.Page.media.length) && genresarr.length > 1) {
        console.log("no AND matches, trying OR instead");
        var orglqry = `
        query ($page: Int, $genres: [String]){
                Page(page: $page, perPage: 25){
                     media(type: ANIME,
                     sort: POPULARITY_DESC,
                     genre_in: $genres,
                     isAdult: false){
                          title{
                              romaji
                              english
                              native
                            }
                              coverImage{
                              extraLarge
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

        var orRes = await fetch(anilistUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: orglqry,
                variables: {
                    page: 1,
                    genres: [genresarr[0]]
                }
            })
        });
        d = await orRes.json();
        console.log("OR fallback used genre:", genresarr[0], "| results found:", d.data ? d.data.Page.media.length : 0);
    }
    if (!d.data || !d.data.Page.media.length) {
        throw new Error("no anilist data at all");
    }
    console.log("final match count for this combo:", d.data.Page.media.length);
    var randIndex = Math.floor(Math.random() * d.data.Page.media.length);
    var aresult = d.data.Page.media[randIndex];
    aresult.coverImage.large = aresult.coverImage.extraLarge;
    return aresult;
}
async function ljgen() {
    if (Object.keys(jgenmap).length) {
        return;
    }
    var res = await fetch("https://api.jikan.moe/v4/genres/anime");
    var d = await res.json();
    for (var i = 0; i < d.data.length; i++) {
        jgenmap[d.data[i].name] = d.data[i].mal_id;
    }
}
async function tryJikan() {
    var a = null;
    if (genresarr.length) {
        await ljgen();
        var jids = [];
        for (var i = 0; i < genresarr.length; i++) {
            if (jgenmap[genresarr[i]]) {
                jids.push(jgenmap[genresarr[i]]);
            }
        }
        // var res = await fetch(jseUrl + "?genres="+jids.join(",")+"&order_by=popularity&limit=25");
        // var d = await res.json();
        // if (!d.data || !d.data.length) {
        //     throw new Error("no jikan data for these genres TuT");
        // }
        // var randIndex = Math.floor(Math.random() * d.data.length);
        // a = d.data[randIndex];
        // var firstRes = await fetch(jseUrl + "?genres=" + jids.join(",") + "&order_by=popularity&limit=25");
        var firstRes = await fetch(jseUrl + "?genres=" + jids.join(",") + "&order_by=popularity&limit=25&sfw=true");
        var firstD = await firstRes.json();
        if (!firstD.data || !firstD.data.length) {
            throw new Error("no jikan data for these genres TuT");
        }
        var totalPages = firstD.pagination.last_visible_page;
        var randPage = Math.floor(Math.random() * totalPages) + 1;
        var res = await fetch(jseUrl + "?genres=" + jids.join(",") + "&order_by=popularity&limit=25&page=" + randPage + "&sfw=true");
        // var res = await fetch(jseUrl + "?genres=" + jids.join(",") + "&order_by=popularity&limit=25&page=" + randPage);
        var d = await res.json();
        if (!d.data || !d.data.length) {
            throw new Error("no jikan data for this page");
        }
        var randIndex = Math.floor(Math.random() * d.data.length);
        a = d.data[randIndex];
    } else {
        var res = await fetch(jikanUrl);
        var d = await res.json();
        if (!d.data) {
            throw new Error("no jikan data");
        }
        a = d.data;
    }
    var jgenres = [];
    for (var i = 0; i < a.genres.length; i++) {
        jgenres.push(a.genres[i].name);
    }
    var jyear = "?";
    var jmonth = "?";
    var jday = "?";
    if (a.aired && a.aired.from) {
        var adate = new Date(a.aired.from);
        jyear = adate.getFullYear();
        jmonth = adate.getMonth() + 1;
        jday = adate.getDate();
    }
    var janime = {
        title: {
            romaji: a.title,
            english: a.title_english,
            native: a.title_japanese
        },
        coverImage: {
            large: a.images.webp.large_image_url
        },
        genres: jgenres,
        averageScore: a.score ? Math.round(a.score * 10) : null,
        startDate: {
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
async function lkgen(name) {
    if (kgenmap[name]) {
        return kgenmap[name];
    }
    var res = await fetch("https://kitsu.io/api/edge/categories?filter[title]="
        + encodeURIComponent(name) + "&page[limit]=1");
    var d = await res.json();
    if (d.data && d.data.length) {
        kgenmap[name] = d.data[0].attributes.slug;
    }
    return kgenmap[name];
}
async function tryKitsu() {
    var catFilter = "";
    if (genresarr.length) {
        var slugs = [];
        for (var i = 0; i < genresarr.length; i++) {
            var slug = await lkgen(genresarr[i]);
            if(slug){
                slugs.push(slug);
            }
        }
        if(slugs.length){
            catFilter = "&filter[categories]=" + slugs.join(",");
        }
    }
    var firstRes = await fetch(kitsuUrl + "?page[limit]=1&page[offset]=0"+
        catFilter);
    var firstD = await firstRes.json();
    if(!firstD.meta || !firstD.meta.count){
        throw new Error("Couldnt get kitsu count");
    }
    var totalCount = firstD.meta.count;
    var roff = Math.floor(Math.random() * totalCount);
    var res = await fetch(kitsuUrl + "?page[limit]=1&page[offset]="
        + roff + "&include=genres"+catFilter);
    var d = await res.json();
    if(!d.data || !d.data.length){
        throw new Error("no kitsu data");
    }
    var a = d.data[0].attributes;
    if (a.nsfw) {
        throw new Error("o o, Kitsu gave nsfw content, skipping");
    }
    var kgenres = [];
    if (d.included) {
        for (var i = 0; i < d.included.length; i++) {
            kgenres.push(d.included[i].attributes.name);
        }
    }
    var kyear = "?";
    var kmonth = "?";
    var kday = "?";
    if (a.startDate) {
        var kdate = new Date(a.startDate);
        kyear = kdate.getFullYear();
        kmonth = kdate.getMonth() + 1;
        kday = kdate.getDate();
    }
    var kanime = {
        title: {
            romaji: a.titles.en_jp || a.canonicalTitle,
            english: a.titles.en,
            native: a.titles.ja_jp
        },
        coverImage: {
            large: a.posterImage.original
        },
        genres: kgenres,
        averageScore: a.averageRating ? Math.round(a.averageRating) : null,
        startDate: {
            year: kyear,
            month: kmonth,
            day: kday
        }, status: a.status,
        description: a.synopsis
    };
    return kanime;
}
async function tryShikimori() {
    var res = await fetch(shikimoriUrl + "?limit=1&order=random");
    var d = await res.json();
    if (!d.length) {
        throw new Error("no shikimori data");
    }
    var a = d[0];
    var sgenres = [];
    for (var i = 0; i < a.genres.length; i++) {
        sgenres.push(a.genres[i].name);
    }
    var syear = "?";
    var smonth = "?";
    var sday = "?";
    if (a.aired_on) {
        var sdate = new Date(a.aired_on);
        syear = sdate.getFullYear();
        smonth = sdate.getMonth() + 1;
        sday = sdate.getDate();
    }
    var sanime = {
        title: {
            romaji: a.name,
            english: a.name,
            native: ""
        },
        coverImage: {
            large: "https://shikimori.one" + a.image.original
        },
        genres: sgenres,
        averageScore: a.score ? Math.round(parseFloat(a.score) * 10) : null,
        startDate: {
            year: syear,
            month: smonth,
            day: sday
        },
        status: a.status,
        description: a.description || "no description available"
    };
    return sanime;
}
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
whatsNextBtn.addEventListener("click", function(){
    clickSound.currentTime = 0;
    clickSound.play();
    hikariGets();
});
//the category choosing btn opens and closes
categorybtn.addEventListener("click", function () {
    categories.classList.toggle("open");
});
// open closing of the genres dabba
document.getElementById("whichgenre").addEventListener("click", function () {
    genresbox.classList.toggle("open");
})
// the genre filter 
var allCheckboxes = document.querySelectorAll(".g input");
for (var i = 0; i < allCheckboxes.length; i++) {
    allCheckboxes[i].addEventListener("change", function () {
        genresarr = [];
        var checkedOnes = document.querySelectorAll(".g input:checked");
        for (var j = 0; j < checkedOnes.length; j++) {
            genresarr.push(checkedOnes[j].value);
        }
        console.log(genresarr);
    });
}
function alreadyshown(anime) {
    var title = anime.title.english || anime.title.romaji;
    for (var i = 0; i < animelist.length; i++) {
        var pastTitle = animelist[i].title.english || animelist[i].title.romaji;
        if (pastTitle === title) {
            return true;
        }
    }
    return false;
}
// modes 
for (var i =0; i<catBtns.length; i++){
    catBtns[i].addEventListener("click",function(){
        for(var j = 0; j <catBtns.length; j++){
            catBtns[j].classList.remove("selected");
        }
        this.classList.add("selected");
        console.log("mode:",this.dataset.mode);
    });
}