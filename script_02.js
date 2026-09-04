//making seperate file so that my laptop wont lag much
// getting elements
var mangalist = [];
var mhistoryPos = -1;
var mgenmap = {};
var jmgenmap = {};
var kmgenmap = {};
async function hikariManga() {
    // console.log("manga fetch not built yet, wait , ok");
    if (loading) {
        return;
    }
    loading = true;
    whatsNextBtn.disabled = true;
    textChange(btnText, "Ummmm...");
    // console.log("getting a manga...!!");
    var manga = null;
    try {
        manga = await tryAnilistmanga();
        // console.log("manga form anilist");
    } catch (e) {
        // console.log("anilist ddown", e);
    }
    if (!manga) {
        try {
            manga = await tryMangadexManga();
            // console.log("manga from mangadex");
        } catch (e) {
            // console.log("oh shoot, mangadex manga down", e);
        }
    }
    if (!manga) {
        try {
            manga = await tryJikanManga();
            // console.log("manga from jikan");
        } catch (e) {
            // console.log("jikan manga down too", e);
        }
    }
    if (!manga) {
        try {
            manga = await tryKitsuManga();
            // console.log("manga from kitsu");
        } catch (e) {
            // console.log("kitsu manga down too", e);
        }
    }
    // if(manga){
    //     mangalist.push(manga);
    //     mhistoryPos = mangalist.length - 1;
    //     showmanga(manga);
    // } else {
    //     console.log("anilist manga down, rough day");
    // }
    if (manga) {
        mangalist.push(manga);
        mhistoryPos = mangalist.length - 1;
        showmanga(manga);
        backBtn.disabled = mhistoryPos <= 0;
        nextBtn.disabled = mhistoryPos >= mangalist.length - 1;
    } else {
        // console.log("anilist manga down");
    }
    loading = false;
    whatsNextBtn.disabled = false;
    textChange(btnText, "What's Next?");
}
function showmanga(manga) {
    posterImg.src = manga.coverImage.large || manga.coverImage.extraLarge;
    posterImg.style.display = "block";
    bgPoster.style.backgroundImage = "url('" + (manga.coverImage.large || manga.coverImage.extraLarge) + "')";
    engName.textContent = manga.title.english || manga.title.romaji;
    jpName.textContent = manga.title.native;
    if (manga.averageScore) {
        avgscore.textContent = "✦ " + (manga.averageScore / 10) + "/10";
    } else {
        avgscore.textContent = "N/A";
    }
    startDate.textContent = manga.startDate.year + "-" +
        manga.startDate.month + "-" + manga.startDate.day;
    statusrn.textContent = manga.status;
    describe.innerHTML = manga.description;
    genreList.innerHTML = "";
    for (var i = 0; i < manga.genres.length; i++) {
        var bubble = document.createElement("div");
        bubble.className = "theGenre";
        bubble.textContent = manga.genres[i];
        genreList.appendChild(bubble);
    }
}
async function tryMangadexManga() {
    await lmgen();
    var tagUrl = "";
    if (genresarr.length) {
        var tagIds = [];
        for (var i = 0; i < genresarr.length; i++) {
            if (mgenmap[genresarr[i]]) {
                tagIds.push(mgenmap[genresarr[i]]);
            }
        }
        for (var i = 0; i < tagIds.length; i++) {
            tagUrl += "&includedTags[]=" + tagIds[i];
        }
    }
    var res = await fetch("https://api.mangadex.org/manga/random?includes[]=cover_art&contentRating[]=safe" + tagUrl);
    var d = await res.json();
    if (!d.data) {
        throw new Error("no mangadex data");
    }
    var a = d.data.attributes;
    var mdgenres = [];
    for (var i = 0; i < a.tags.length; i++) {
        if (a.tags[i].attributes.group === "genre") {
            mdgenres.push(a.tags[i].attributes.name.en);
        }
    }
    var coverFile = "";
    for (var i = 0; i < d.data.relationships.length; i++) {
        if (d.data.relationships[i].type === "cover_art") {
            coverFile = d.data.relationships[i].attributes.fileName;
        }
    }
    var coverUrl = coverFile ?
        "https://uploads.mangadex.org/covers/" + d.data.id + "/" + coverFile :
        "";
    var mdmanga = {
        title: {
            romaji: a.title.en || a.title.ja
                || Object.values(a.title)[0],
            english: a.title.en,
            native: a.title.ja
        },
        coverImage: {
            large: coverUrl
        },
        genres: mdgenres,
        averageScore: null,
        startDate: {
            year: a.year || "?",
            month: "?",
            day: "?"
        },
        status: a.status,
        description: (a.description.en || "no description available"),
        chapters: a.lastChapter || null,
        volumes: a.lastVolume || null
    };
    return mdmanga;
}

async function tryAnilistmanga() {
    var randPage2 = Math.floor(Math.random() * 20) + 1;
    var thegqlQuery;
    if (genresarr.length) {
        thegqlQuery = `
        query ($page: Int, $genres: [String]){
               Page(page: $page, perPage: 25){
                         media(type: MANGA,
                         sort: POPULARITY_DESC,
                         genre_in:$genres,
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
                            chapters
                            volumes
                        }
                }
        }`;
    } else {
        // thegqlQuery = `
        // query ($page: Int){
        // Page(Page: $page, perPage: 25){
        thegqlQuery = `
            query ($page: Int){
            Page(page: $page, perPage: 25){
            media(type: MANGA, sort: POPULARITY_DESC, isAdult: false){
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
                chapters
                volumes
            }
          }
       }`;
    }
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
    if (!d.data || !d.data.Page || !d.data.Page.media.length) {
        throw new Error("no anilist manga data");
    }
    var mediaList = d.data.Page.media;
    var randIndex = Math.floor(Math.random() * mediaList.length);
    var m = mediaList[randIndex];
    m.chapters = m.chapters || null;
    m.volumes = m.volumes || null;
    return m;
}
// jikan api 
async function tryJikanManga() {
    var a = null;
    if (genresarr.length) {
        await ljmgen();
        var jmids = [];
        for (var i = 0; i < genresarr.length; i++) {
            if (jmgenmap[genresarr[i]]) {
                jmids.push(jmgenmap[genresarr[i]]);
            }
        }
        var firstRes = await fetch("https://api.jikan.moe/v4/manga?genres=" + jmids.join(",") + "&order_by=popularity&limit=25&sfw=true");
        var firstD = await firstRes.json();
        if (!firstD.data || !firstD.data.length) {
            throw new Error("no jikan manga for these genres");
        }
        var totalPages = firstD.pagination.last_visible_page;
        var randPage = Math.floor(Math.random() * totalPages) + 1;
        var res = await fetch("https://api.jikan.moe/v4/manga?genres=" + jmids.join(",") + "&order_by=popularity&limit=25&page=" + randPage + "&sfw=true");
        var d = await res.json();
        if (!d.data || !d.data.length) {
            throw new Error("no jikan manga data fot dis page");
        }
        var randIndex = Math.floor(Math.random() * d.data.length);
        a = d.data[randIndex];
    } else {
        var res = await fetch("https://api.jikan.moe/v4/random/manga?sfw=true");
        var d = await res.json();
        if (!d.data) {
            throw new Error("no jikan manga data");
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
    if (a.published && a.published.from) {
        var jdate = new Date(a.published.from);
        jyear = jdate.getFullYear();
        jmonth = jdate.getMonth() + 1;
        jday = jdate.getDate();
    }
    var jmanga = {
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
        description: a.synopsis,
        chapters: a.chapters || null,
        volumes: a.volumes || null
    };
    return jmanga;
}
//kitsu api
var kitsuMangaUrl = "https://kitsu.io/api/edge/manga";
async function tryKitsuManga(){
    var catFilter = "";
    if(genresarr.length){
        var slugs = [];
        for(var i = 0; i<genresarr.length; i++){
            var slug = await lkmgen(genresarr[i]);
            if(slug){
                slugs.push(slug);
            }
        }
        if(slugs.length){
            catFilter = "&filter[categories]=" + slugs.join(",");
        }
    }
    var firstRes = await fetch(kitsuMangaUrl + "?page[limit]=1&page[offset]=0" + catFilter);
    var firstD = await firstRes.json();
    if(!firstD.meta || !firstD.meta.count){
        throw new Error("couldnt get kitsu manga count");
    }
    var totalCount = firstD.meta.count;
    var roff = Math.floor(Math.random() * totalCount);
    var res = await fetch(kitsuMangaUrl + "?page[limit]=1&page[offset]="
        + roff + "&include=genres" + catFilter);
    var d = await res.json();
    if(!d.data || !d.data.length){
        throw new Error("no kitsu data");
    }
    var a = d.data[0].attributes;
    if(a.nsfw){
        throw new Error("o,kitsu gave nsfw manga, skipp");
    }
    var kgenres = [];
    if(d.included){
        for (var i = 0; i<d.included.length; i++){
            kgenres.push(d.included[i].attributes.name);
        }
    }
    var kyear = "?";
    var kmonth = "?";
    var kday = "?";
    if(a.startDate){
        var kdate = new Date(a.startDate);
        kyear = kdate.getFullYear();
        kmonth = kdate.getMonth() + 1;
        kday = kdate.getDate();
    }
    var kmanga = {
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
        },
        status: a.status,
        description: a.synopsis,
        chapters: a.chapterCount || null,
        volumes: a.volumeCount || null
    };
    return kmanga;
}
// async function tryKitsuManga() {
//     var firstRes = await fetch(kitsuMangaUrl + "?page[limit]=1&page[offset]=0");
//     var firstD = await firstRes.json();
//     if (!firstD.meta || !firstD.meta.count) {
//         throw new Error("Couldnt get kitsu manga count");
//     }
//     var totalCount = firstD.meta.count;
//     var roff = Math.floor(Math.random() * totalCount);
//     var res = await fetch(kitsuMangaUrl + "?page[limit]=1&page[offset]="
//         + roff + "&include=genres");
//     var d = await res.json();
//     if (!d.data || !d.data.length) {
//         throw new Error("no kitsu data");
//     }

//     var kyear = "?";
//     var kmonth = "?";
//     var kday = "?";
//     if (a.startDate) {
//         var kdate = new Date(a.startDate);
//         kyear = kdate.getFullYear();
//         kmonth = kdate.getMonth() + 1;
//         kday = kdate.getDate();
//     }
//     return kmanga;
// }
async function lmgen() {
    if (Object.keys(mgenmap).length) {
        return;
    }
    var res = await fetch("https://api.mangadex.org/manga/tag");
    var d = await res.json();
    for (var i = 0; i < d.data.length; i++) {
        var tag = d.data[i];
        if (tag.attributes.group === "genre") {
            mgenmap[tag.attributes.name.en] = tag.id;
        }
    }
}

async function ljmgen() {
    if (Object.keys(jmgenmap).length) {
        return;
    }
    var res = await fetch("https://api.jikan.moe/v4/genres/manga");
    var d = await res.json();
    for (var i = 0; i < d.data.length; i++) {
        jmgenmap[d.data[i].name] = d.data[i].mal_id;
    }
}
async function lkmgen(name){
    if(kmgenmap[name]){
        return kmgenmap[name];
    }
    var res = await fetch("https://kitsu.io/api/edge/categories?filter[title]="
    +encodedURIComponent(name) + "&page[limit]=1");
    var d = await res.json();
    if(d.data && d.data.length){
        kmgenmap[name] = d.data[0].attributes.slug;
    }
    return kmgenmap[name];
}