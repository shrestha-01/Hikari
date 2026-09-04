# Hikari

Hikari is a **recommendation site** that recommends **anime and manga** for now.

But I am planning to add **movies, games, and cartoons** in the future.

---

## How It Works

Hikari is trying to combine all the available **free APIs** and use them as a **fallback system**.

For example, the API system currently works something like this:

1. **AniList** → First priority
2. **Jikan** → Fallback
3. **Kitsu** → Fallback
4. **Shikimori** → Fallback

So, at first, Hikari will try to fetch the required information from **AniList**.

If AniList fails, or its request limit gets exhausted because of sending too many requests, Hikari will move to **Jikan**.

If Jikan also fails, it will move to **Kitsu**, and then **Shikimori**.

This way, even if one API is unavailable or reaches its limit, Hikari can still try to get the required information from another API.

---

## Current Progress

Currently, I have worked on:

- Anime Recommendation
- Manga Recommendation
- Movies — Coming in the future
- Games — Coming in the future
- Cartoons — Coming in the future

More categories will be added as I continue working on Hikari.

---

## APIs

Hikari uses multiple free APIs to make the recommendation system work.

### Anime [In Fallback Series]

- **AniList:** https://graphql.anilist.co
- **Jikan:** https://api.jikan.moe/v4/random/anime
- **Kitsu:** https://kitsu.io/api/edge/anime
- **Shikimori:** https://shikimori.one/api/animes

### Manga [In Fallback Series]

- **AniList:** https://graphql.anilist.co
- **MangaDex:** https://api.mangadex.org/manga/random
- **Jikan:** https://api.jikan.moe/v4/random/manga
- **Kitsu:** https://kitsu.io/api/edge/manga

---

## Live Website

Hikari is currently live!

**[Visit Hikari](https://shrestha-project-09.66ghz.com/)**

---

##  Credits & Sources

### Design

- **Glassmorphism:** https://hype4.academy/tools/glassmorphism-generator
- **3d card:** https://freefrontend.com/javascript-cards/

### Symbols

- **Triangle Symbols:** https://www.i2symbol.com/symbols/triangle
- **Star Symbols [Copy/Paste]:** https://www.namecheap.com/visual/font-generator/star-symbols/

### Anime APIs

- **AniList:** https://graphql.anilist.co
- **Jikan:** https://api.jikan.moe/v4/random/anime
- **Kitsu:** https://kitsu.io/api/edge/anime
- **Shikimori:** https://shikimori.one/api/animes

### Manga APIs

- **AniList:** https://graphql.anilist.co
- **MangaDex:** https://api.mangadex.org/manga/random
- **Jikan:** https://api.jikan.moe/v4/random/manga
- **Kitsu:** https://kitsu.io/api/edge/manga

---

##  Future Plans

I still have a lot planned for Hikari.

Some of the things I want to add in the future:

-  Movie recommendations
-  Game recommendations
-  Cartoon recommendations
-  More fallback APIs
-  More improvements to the recommendation system

And probably a lot more as I continue developing it.

---

## That's It!

That's pretty much what Hikari is about for now.

I'm still working on it, so more features and improvements will be added in the future.

Thank you for checking out **Hikari!** (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
