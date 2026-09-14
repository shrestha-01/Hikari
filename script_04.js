//game
var gameslist = [];
var ghistoryPos = -1;
async function hikariGames() {
    if (loading) {
        return;
    }
    loading = true;
    whatsNextBtn.disabled = true;
    textChange(btnText, "Ummm...");
    cardresizer(defaultratio);
    posterImg.style.display = "none";
    loadingClip.style.display = "block";
    loadingClip.currentTime = 0;
    loadingClip.play();
    var game = null;
    try{
        game = await tryRawg();
    } catch(e){
        //console.log("rawg down",e);
    }
    // giant bomb's api is down
    // if(!game){
    //     try{
    //         game = await tryGB();
    //     } catch (e){
    //         console.log("giant bomb donw too", e);
    //     }
    // }
    if(!game){
        try{
            game = await tryF2G();
        } catch (e){
            // console.log("freetogame down too",e);
        }
    }
    if (game){
        gameslist.push(game);
        ghistoryPos = gameslist.length - 1;
        showgame(game);
        backBtn.disabled = ghistoryPos <= 0;
        nextBtn.disabled = ghistoryPos >= gameslist.length - 1;
    } else {
        // console.log("rawg down");
    }
    loading = false;
    whatsNextBtn.disabled = false;
    textChange(btnText, "What's Next?");
}
async function tryRawg() {
    var res = await fetch("Backend/rawgRandom.php");
    var d = await res.json();
    if (!d || d.success === false || !d.name) {
        throw new Error("no rawg data");
    }
    var ggenres = [];
    if (d.genres) {
        for (var i = 0; i < d.genres.length; i++) {
            ggenres.push(d.genres[i].name);
        }
    }
    var gyear = "?";
    var gmonth = "?";
    var gday = "?";
    if (d.released) {
        var gdate = new Date(d.released);
        gyear = gdate.getFullYear();
        gmonth = gdate.getMonth() + 1;
        gday = gdate.getDate();
    }
    var gstatus = d.tba ? "TBA" : "Released";
    var gscore = null;
    if (d.metacritic) {
        gscore = d.metacritic;
    } else if (d.rating) {
        gscore = Math.round(d.rating * 20);
    }
    var ggame = {
        title: {
            romaji: d.name,
            english: d.name,
            native: ""
        },
        coverImage: {
            large: d.background_image || ""
        },
        genres: ggenres,
        averageScore: gscore,
        startDate: {
            year: gyear,
            month: gmonth,
            day: gday
        },
        status: gstatus,
        description: d.description_raw || "no description"
    };
    return ggame;
}
// async function tryGB() {
//     var res = await fetch("Backend/gbRandom.php");
//     var d = await res.json();
//     if (!d || d.success === false || !d.name) {
//         throw new Error("no giant bomb data");
//     }
//     var ggenres = [];
//     if (d.genres) {
//         for (var i = 0; i < d.genres.length; i++) {
//             ggenres.push(d.genres[i].name);
//         }
//     }
//     var gyear = "?";
//     var gmonth = "?";
//     var gday = "?";
//     if (d.original_release_date) {
//         var gdate = new Date(d.original_release_date);
//         gyear = gdate.getFullYear();
//         gmonth = gdate.getMonth() + 1;
//         gday = gdate.getDate();
//     }
//     var gstatus = d.original_release_date ? "Released" : "TBA";
//     var gimage = "";
//     if (d.image){
//         gimage = d.image.super_url || d.image.medium_url || "";
//     }
//     var ggame = {
//         title: {
//             romaji: d.name,
//             english: d.name,
//             native: ""
//         },
//         coverImage: {
//             large: gimage
//         },
//         genres: ggenres,
//         averageScore: null,
//         startDate: {
//             year: gyear,
//             month: gmonth,
//             day: gday
//         },
//         status: gstatus,
//         description: d.full_description || d.deck || "no description available"
//     };
//     return ggame;
// }
async function tryF2G() {
    var listRes = await fetch("https://www.freetogame.com/api/games");
    var listData = await listRes.json();
    if (!listData || !listData.length) {
        throw new Error("no freetogame list data");
    }
    var randomIndex = Math.floor(Math.random() * listData.length);
    var pickedId = listData[randomIndex].id;
    var res = await fetch("https://www.freetogame.com/api/game?id=" + pickedId)
    var d = await res.json();
    if (!d || !d.title) {
        throw new Error("no freetogame detail data");
    }
    var gyear = "?";
    var gmonth = "?";
    var gday = "?";
    if (d.release_date){
        var gdate = new Date(d.release_date);
        gyear = gdate.getFullYear();
        gmonth = gdate.getMonth() + 1;
        gday = gdate.getDate();
    }
    var ggame = {
        title: {
            romaji: d.title,
            english: d.title,
            native: ""
        },
        coverImage: {
            large: d.thumbnail || ""
        },
        genres: d.genre ? [d.genre] : [],
        averageScore: null,
        startDate: {
            year: gyear,
            month: gmonth,
            day: gday
        },
        status: "Released",
        description: d.description || d.short_description || "no description available"
    };
    return ggame;
}

function showgame(game){
    posterImg.src = game.coverImage.large;
    cardresizer(defaultratio);
    loadingClip.pause();
    loadingClip.style.display = "none";
    posterImg.style.display = "block";
    rightInfo.classList.remove("centerMode");
    instruct.style.display = "none";
    trailerplay = false;
    trailerFrame.style.display = "none";
    trailerFrame.src = "";
    trailerBtn.style.display = "none";
    bgPoster.style.backgroundImage = "url('" + game.coverImage.large + "')";
    engName.textContent = game.title.english || game.title.romaji;
    jpName.textContent = game.title.native;
    if (game.averageScore) {
        avgscore.textContent = "✦ " + (game.averageScore / 10) + "/10";
    } else {
        avgscore.textContent = "N/A";
    }
    startDate.textContent = game.startDate.year + "-" +
        game.startDate.month + "-" + game.startDate.day;
    statusrn.textContent = game.status;
    describe.innerHTML = game.description;
    genreList.innerHTML = "";
    for (var i = 0; i < game.genres.length; i++) {
        var bubble = document.createElement("div");
        bubble.className = "theGenre";
        bubble.textContent = game.genres[i];
        genreList.appendChild(bubble);
    }
}