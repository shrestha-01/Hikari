// movie stuff lives here
var movielist = [];
var movhisPos = -1;
var resizetimer;
async function tryTmdb() {
    var genreq = "";
    if (movgenresarr.length) {
        genreq ="?genres=" + encodeURIComponent(movgenresarr.join(","));
    }
    var res = await fetch("Backend/tmdb.php" + genreq);
    var d = await res.json();
    if (!d || d.success === false) {
        throw new Error("no tmdb data / invalid movie id");
    }
    var genreNames = [];
    if (d.genres) {
        for (var i = 0; i < d.genres.length; i++) {
            genreNames.push(d.genres[i].name);
        }
    }
    var tmovie = {
        title: {
            romaji: d.title || d.original_title,
            english: d.title,
            native: d.original_title
        },
        coverImage: {
            large: d.poster_path ? "https://image.tmdb.org/t/p/w500" + d.poster_path : ""
        },
        genres: genreNames,
        averageScore: d.vote_average ? Math.round(d.vote_average * 10) : null,
        startDate: {
            year: d.release_date ? d.release_date.split("-")[0] : "?",
            month: d.release_date ? d.release_date.split("-")[1] : "?",
            day: d.release_date ? d.release_date.split("-")[2] : "?"
        },
        status: d.status,
        description: d.overview
    };
    return tmovie;
}
async function hikariMovies() {
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
    var movie = null;
    try {
        movie = await tryTmdb();
    } catch (e) {
        // console.log("failed moved fatch from tmdb",e);
    }
    if (!movie) {
        try {
            movie = await tryOmdb();
        } catch (e) {
            // console.log("failed movie fetch from omdb",e);
        }
    }
    if (movie) {
        movielist.push(movie);
        movhisPos = movielist.length - 1;
        showmovie(movie);
        backBtn.disabled = movhisPos <= 0;
        nextBtn.disabled = movhisPos >= movielist.length - 1;
    } else {
        // console.log("failed movie fetch from tmdb");
    }
    loading = false;
    whatsNextBtn.disabled = false;
    textChange(btnText, "What's Next?");
}
function showmovie(movie) {
    posterImg.src = movie.coverImage.large;
    cardresizer(defaultratio);
    loadingClip.pause();
    loadingClip.style.display = "none";
    posterImg.style.display = "block";
    rightInfo.classList.remove("centerMode");
    instruct.style.display = "none";
    bgPoster.style.backgroundImage = "url('" + movie.coverImage.large + "')";
    engName.textContent = movie.title.english || movie.title.romaji;
    jpName.textContent = movie.title.native;
    if (movie.averageScore) {
        avgscore.textContent = "✦ " + (movie.averageScore / 10) + "/10";
    } else {
        avgscore.textContent = "N/A";
    }
    startDate.textContent = movie.startDate.year + "-" +
        movie.startDate.month + "-" + movie.startDate.day;
    statusrn.textContent = movie.status;
    describe.innerHTML = movie.description;
    genreList.innerHTML = "";
    for (var i = 0; i < movie.genres.length; i++) {
        var bubble = document.createElement("div");
        bubble.className = "theGenre";
        bubble.textContent = movie.genres[i];
        genreList.appendChild(bubble);
    }
}
function cardresizer(ratio) {
    if (!ratio || ratio <= 0) {
        ratio = defaultratio;
    }
    lastratio = ratio;
    var gap = 30;
    var infoMinWidth = 280;
    var maxHeight = infoArea.clientHeight;
    if (!maxHeight) {
        maxHeight = window.innerHeight * 0.6;
    }
    var maxWidth = infoArea.clientWidth - gap - infoMinWidth;
    if (maxWidth < 200) {
        maxWidth = 220;
    }
    var width = maxHeight * ratio;
    var height = maxHeight;
    if (width > maxWidth) {
        width = maxWidth;
        height = width / ratio;
    }
    if (width < 180) {
        width = 180;
    }
    if (height < 180) {
        height = 180;
    }
    posterCard.style.width = width + "px";
    posterCard.style.height = height + "px";
}
cardresizer(defaultratio);
var posterRatio = defaultratio;
posterImg.onload = function () {
    var picratio = posterImg.naturalWidth / posterImg.naturalHeight;
    posterRatio = picratio;
    cardresizer(picratio);
}
window.addEventListener("resize", function () {
    clearTimeout(resizetimer);
    resizetimer = setTimeout(function () {
        cardresizer(lastratio);
    }, 200);
});
// function toggleTrailer(){
//     trailerIconBtn.classList.add("clickPulse");
//     setTimeout(function(){
//         trailerIconBtn.classList.remove("clickPulse");
//     },400);
//     if(trailerplay){
//         trailerplay = false;
//         trailerFrame.style.display = "none";
//         trailerFrame.src = "";
//         posterImg.style.display = "block";
//         trailerBtn.textContent = "Watch Trailer";
//         trailerIconBtn.classList.remove("playing");
//         cardresizer(posterRatio);
//     } else {
//         trailerplay = true;
//         trailerFrame.src="https://www.youtube.com/embed/"+ trailerWrap.dataset.trailerid+"?autoplay=1";
//         trailerFrame.style.display = "block";
//         posterImg.style.display = "none";
//         trailerBtn.textContent="Close Trailer";
//         trailerIconBtn.classList.add("playing");
//         cardresizer(defaultratio);
//         posterCard.style.transform ="";
//     }
// }
// trailerBtn.addEventListener("click",toggleTrailer);
// trailerIconBtn.addEventListener("click",toggleTrailer);
function toggleTrailer() {
    if (trailerplay) {
        trailerplay = false;
        trailerFrame.style.display = "none";
        trailerFrame.src = "";
        posterImg.style.display = "block";
        btnLabel.textContent = "Watch Trailer";
        cardresizer(posterRatio);
    } else {
        trailerplay = true;
        trailerFrame.src = "https://www.youtube.com/embed/" + trailerBtn.dataset.trailerid + "?autoplay=1";
        trailerFrame.style.display = "block";
        posterImg.style.display = "none";
        btnLabel.textContent = "Close Trailer";
        cardresizer(defaultratio);
        posterCard.style.transform = "";
    }
}
trailerBtn.addEventListener("click", toggleTrailer);
// trailerBtn.addEventListener("click", function () {
//     trailerBtn.classList.add("clickPulse");
//     setTimeout(function () {
//         trailerBtn.classList.remove("clickPulse");
//     }, 400);

//     if (trailerplay) {
//         trailerplay = false;
//         trailerFrame.style.display = "none";
//         trailerFrame.src = "";
//         posterImg.style.display = "block";
//         trailerBtnText.textContent = "Watch Trailer";
//         trailerBtn.classList.remove("playing");
//         cardresizer(posterRatio);
//     } else {
//         trailerplay = true;
//         trailerFrame.src = "https://www.youtube.com/embed/" + trailerBtn.dataset.trailerid + "?autoplay=1";
//         trailerFrame.style.display = "block";
//         posterImg.style.display = "none";
//         trailerBtnText.textContent = "Close Trailer";
//         trailerBtn.classList.add("playing");
//         cardresizer(defaultratio);
//         posterCard.style.transform = "";
//     }
// });
async function tryOmdb() {
    var res = await fetch("Backend/omdb.php");
    var d = await res.json();
    if (!d || d.Response === "False") {
        throw new Error("no omdb data");
    }
    var ogenres = [];
    if (d.Genre && d.Genre !== "N/A") {
        ogenres = d.Genre.split(",").map(function (g) {
            return g.trim();
        });
    }
    if(movgenresarr.length){
        var genreMatch = false;
        for (var i = 0; i< ogenres.length; i++){
            if(movgenresarr.indexOf(ogenres[i]) !== -1){
                genreMatch = true;
            }
        }
        if(!genreMatch){
            throw new Error("omdb movie doesnt match picked genres");
        }
    }
    var oyear = "?";
    var omonth = "?";
    var oday = "?";
    if (d.Released && d.Released !== "N/A") {
        var odate = new Date(d.Released);
        if (!isNaN(odate)) {
            oyear = odate.getFullYear();
            omonth = odate.getMonth() + 1;
            oday = odate.getDate();
        }
    }
    var omovie = {
        title: {
            romaji: d.Title,
            english: d.Title,
            native: ""
        },
        coverImage: {
            large: (d.Poster && d.Poster !== "N/A") ? d.Poster : ""
        },
        genres: ogenres,
        averageScore: (d.imdbRating && d.imdbRating !== "N/A") ? Math.round(parseFloat(d.imdbRating) * 10) : null,
        startDate: {
            year: oyear,
            month: omonth,
            day: oday
        },
        status: "Released",
        description: (d.Plot && d.Plot !== "N/A") ? d.Plot : "no description available"
    };
    return omovie;
}