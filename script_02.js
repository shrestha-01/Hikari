//making seperate file so that my laptop wont lag
// getting elements
var mangalist = [];
var mhistoryPos = -1;
async function hikariManga() {
    // console.log("manga fetch not built yet, wait , ok");
    if (loading) {
        return;
    }
    loading = true;
    whatsNextBtn.disabled = true;
    textChange(btnText, "Ummmm...");
    console.log("getting a manga...!!");
    var manga = null;
    try {
        manga = await tryAnilistmanga();
        console.log("manga from anilist");
    } catch (e) {
        console.log("oh shoot, anilist manga down", e);
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
        console.log("anilist manga down");
    }
    loading = false;
    whatsNextBtn.disabled = false;
    textChange(btnText, "What's Next?");
}
function showmanga(manga) {
    posterImg.src = manga.coverImage.large || manga.coverImage.extraLarge;
    posterImg.style.display = "block";
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