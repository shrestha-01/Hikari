// movie stuff lives here
var movielist = [];
var movhisPos = -1;
var resizetimer; 
async function tryTmdb() {
    var res = await fetch("Backend/tmdb.php");
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
async function hikariMovies(){
    if(loading){
        return;
    }
    loading = true;
    whatsNextBtn.disabled = true;
    textChange(btnText, "Ummm...");
    var movie = null;
    try{
        movie = await tryTmdb();
    } catch (e){
        // console.log("failed moved fetch from tmdb",e);
    }
    if(movie){
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
function showmovie(movie){
    posterImg.src = movie.coverImage.large;
    cardresizer(defaultratio);
    posterImg.style.display = "block";
    rightInfo.classList.remove("centerMode");
    instruct.style.display = "none";
    bgPoster.style.backgroundImage = "url('" + movie.coverImage.large + "')";
    engName.textContent = movie.title.english || movie.title.romaji;
    jpName.textContent = movie.title.native;
    if(movie.averageScore){
        avgscore.textContent = "✦ " + (movie.averageScore/10) + "/10";
    } else {
        avgscore.textContent = "N/A";
    }
    startDate.textContent = movie.startDate.year + "-" +
    movie.startDate.month + "-" + movie.startDate.day;
    statusrn.textContent = movie.status;
    describe.innerHTML = movie.description;
    genreList.innerHTML = "";
    for(var i = 0; i<movie.genres.length; i++){
        var bubble = document.createElement("div");
        bubble.className = "theGenre";
        bubble.textContent = movie.genres[i];
        genreList.appendChild(bubble);
    }
}
function cardresizer(ratio){
    if(!ratio || ratio <= 0){
        ratio = defaultratio;
    }
    lastratio = ratio;
    var gap = 30;
    var infoMinWidth = 280;
    var maxHeight = infoArea.clientHeight;
    if(!maxHeight){
        maxHeight = window.innerHeight * 0.6;
    }
    var maxWidth = infoArea.clientWidth - gap - infoMinWidth;
    if(maxWidth < 200){
        maxWidth = 220;
    }
    var width = maxHeight * ratio;
    var height = maxHeight;
    if(width > maxWidth){
        width = maxWidth;
        height = width / ratio;
    }
    if(width < 180){
        width = 180;
    }
    if(height < 180){
        height = 180;
    }
    posterCard.style.width = width + "px";
    posterCard.style.height = height + "px";
}
cardresizer(defaultratio);
posterImg.onload = function (){
    var picratio = posterImg.naturalWidth / posterImg.naturalHeight;
    cardresizer(picratio);
}
window.addEventListener("resize",function(){
    clearTimeout(resizetimer);
    resizetimer =setTimeout(function (){ 
        cardresizer(lastratio); 
    },200);
});