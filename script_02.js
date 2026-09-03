//making seperate file so that my laptop wont lag
// getting elements
var mangalist = [];
var mhistoryPos = -1;
async function hikariManga() {
    console.log("manga fetch not built yet, wait , ok");
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
    var res = await fetch(anilistUrl,{
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
    if(!d.data || !d.data.Page || !d.data.Page.media.length){
        throw new Error("no anilist manga data");
    }
    var mediaList = d.data.Page.media;
    var randIndex = Math.floor(Math.random() * mediaList.length);
    var m = mediaList[randIndex];
    m.chapters = m.chapters || null;
    m.volumes = m.volumes || null;
    return m;
}