// movie stuff lives here
var movielist = [];
var movhisPos = -1;

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
    textChange(ImageBitmapRenderingContext, "Ummm...");
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