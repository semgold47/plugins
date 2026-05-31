(function () {
  "use strict";
  console.log("[raiting] v1.7 - Rating Formatter",);

  var icons = {
    imdb: {
      html: '<img style="width: 2.5em; height: 1.2em;  object-fit: cover;"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACYUlEQVR4nGNgGAWjYBSMglEwCkbBKBgFQxv8388p8/8A++r/B9g//T/I/n9Q4wNgN679f4BNFdnxbwfcYQdJ9sjb/3s4pRnAIT/QjjlINl7JMCSSzUGc+APDIHDEf0owXg+s6JD6r2ZkAcYZsZpgsdpsVbgYCE+tlgeLR4XooojjUq9rZvbfxtH4f1KU1v8rSwXBaq4sEURRA+LTzQMFyepgcTsnY6I8gIzNbEz/f9nFNbAe8PIy+P9zL+d/DRNUx2FTP7FC/v+OSeIo6k7OFcbwwMpOqf9pMVr/3TwM//eVKfz/d4CGHtA0Mf9/a6UARuhiUz+pUh7DsXuniWGI+fvq/dcxM4PzD8wQpZ0HQHhOgyxVPbCiQ+p/gK8eCp+mHogO1aG6BwL96eABW0dIxtU0NkfhDxkPJEVpoVicjMQfEh7oLFZCsbirRHFoeWB9jySKxcj8IeGBvdPEUCowUM2KT31LvvL/5e3SKI49NFMUwwMgNYF+dPJASjQk3VvYmfx/uYmHqFILhvUtzP6/2cKN4QFvbwOwHIy/qpOGHoCl+7hwHaI9oGVq/j8iWPf/8TnCYDXIHrCyN/kfE6oDriBBfANL0/+3VvCT54FH63j/b58kAcZnFwjBLYOJgRz8YC0fmH1psdD/73s4MdS/28YFNgeG32/n+v9rLweKPR+3c8P1XVwM0fdtNyc4SYLk8LlxGDSnD7B/HGhH/KewQ7N2EDjkP1n4APtqhv+H2NT+H2R7MwQd//b/fnYVyMjEHk5pUAd5SCSnA+wfwQMRMMePglEwCkbBKBgFo2AUMJANAD6Iz9B+XasFAAAAAElFTkSuQmCC" alt="imdb">',
    },
    tmdb: {
      html: '<img  style="width: 2.5em; height: 1.2em;  object-fit: cover;"  src="data:image/png;base64,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" alt="themoviedb">',
    },
    kp: {
      html: '<img src="https://semgold47.github.io/plugins/kp.svg" class="rating-icon" style=" width: 2.5em; object-fit: contain;"/>',
    },
    tomatoes: {
      html: '<svg style="width: 1.4em; height: 1.4em; vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" fill="#FA320A" viewBox="0 0 24 24" id="rotten-tomatoes"><path d="M5.866 0L4.335 1.262l2.082 1.8c-2.629-.989-4.842 1.4-5.012 2.338 1.384-.323 2.24-.422 3.344-.335-7.042 4.634-4.978 13.148-1.434 16.094 5.784 4.612 13.77 3.202 17.91-1.316C27.26 13.363 22.993.65 10.86 2.766c.107-1.17.633-1.503 1.243-1.602-.89-1.493-3.67-.734-4.556 1.374C7.52 2.602 5.866 0 5.866 0zM4.422 7.217H6.9c2.673 0 2.898.012 3.55.202 1.06.307 1.868.973 2.313 1.904.05.106.092.206.13.305l7.623.008.027 2.912-2.745-.024v7.549l-2.982-.016v-7.522l-2.127.016a2.92 2.92 0 0 1-1.056 1.134c-.287.176-.3.19-.254.264.127.2 2.125 3.642 2.125 3.659l-3.39.019-2.013-3.376c-.034-.047-.122-.068-.344-.084l-.297-.02.037 3.48-3.075-.038zm3.016 2.288l.024.338c.014.186.024.729.024 1.206v.867l.582-.025c.32-.013.695-.049.833-.078.694-.146 1.048-.478 1.087-1.018.027-.378-.063-.636-.303-.87-.318-.309-.761-.416-1.733-.418Z"></path></svg>',
    },
    metacritic: {
      html: '<img style="width: 1.5em; height: 1.5em; padding: object-fit: contain;" src="https://img.icons8.com/color/48/metascore.png" alt="metascore"/>',
    },
    trakt: {
      html: `<svg style="width: 1.4em; height: 1.4em; vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="trakt">
            <path fill="#DE2318" d="M19.178 18.464a9.654 9.654 0 0 0 2.484-6.466c0-3.885-2.287-7.215-5.568-8.76l-6.089 6.076 9.173 9.15zm-6.83-7.393v-.008l-.678-.676 4.788-4.79.679.689-4.789 4.785zm3.863-7.265.677.682-5.517 5.517-.68-.679 5.52-5.52zM4.89 18.531A9.601 9.601 0 0 0 12 21.644a9.618 9.618 0 0 0 4.027-.876l-6.697-6.68-4.44 4.443z"></path>
            <path fill="#DE2318" d="M12 24c6.615 0 12-5.385 12-12S18.615 0 12 0 0 5.385 0 12s5.385 12 12 12zm0-22.789c5.95 0 10.79 4.839 10.79 10.789S17.95 22.79 12 22.79 1.211 17.95 1.211 12 6.05 1.211 12 1.211z"></path>
            <path fill="#DE2318" d="m4.276 17.801 5.056-5.055.359.329 7.245 7.245a3.31 3.31 0 0 0 .42-.266L9.33 12.05l-4.854 4.855-.679-.679 5.535-5.535.359.331 8.46 8.437c.135-.1.255-.215.375-.316L9.39 10.027l-.083.015-.006-.007-5.074 5.055-.679-.68L15.115 2.849A9.756 9.756 0 0 0 12 2.34C6.663 2.337 2.337 6.663 2.337 12c0 2.172.713 4.178 1.939 5.801z"></path>
        </svg>`,
    },
    letterboxd: {
      html: '<img style="width: 2.5em; height: 1.2em;  object-fit: cover;" src="data:image/png;base64,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" alt="letterboxd">',
    },
    rogerebert: {
      html: '<img src="https://cdn.brandfetch.io/idfhr_K_np/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B" class="rating-icon" style=" width: 2.5em; object-fit: contain;"/>',
    },
    myanimelist: { html: "у" },
    oscars: { html: "е" },
  };

  async function getKpRatingFromAPI(filmId, apiKey) {
    if (!filmId || !apiKey) return null;
    let cacheKey = "kp_rating_raw_" + filmId;
    let cached = getCache(cacheKey);
    if (cached) return cached;
    try {
      let res = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`, {
        headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
      });
      if (!res.ok) return null;
      let data = await res.json();
      let rating = data.ratingKinopoisk;
      if (rating && rating !== 0) {
        let formatted = formatRating(rating, "kp");
        setCache(cacheKey, formatted);
        return formatted;
      }
      setCache(cacheKey, "—");
      return "—";
    } catch (e) {
      console.warn("KP rating error", e);
      return null;
    }
  }

  // ---------------------- ФОРМАТИРОВАНИЕ РЕЙТИНГОВ ----------------------
  function formatRating(value, source) {
    if (value === undefined || value === null || value === "" || value === "—") return "—";
    let num = parseFloat(value);
    if (isNaN(num) || num === 0) return "—";

    // Для 100-балльных систем (tomatoes, metacritic) показываем целое число
    if (source === "tomatoes" || source === "rt" || source === "metacritic" || source === "meta") {
      return Math.round(num).toString();
    }

    // Для 10-балльных систем оставляем одну десятую
    return (Math.floor(num * 10) / 10).toFixed(1);
  }

  // ---------------------- СТИЛИ ----------------------
  var style = document.createElement("style");
  style.textContent = `
        .full-start-new__rate-line {
            display: flex;
            overflow-x: auto;
            margin-bottom: 0.2em;
            flex-wrap: nowrap;
        }
        .full-start__rate {
            width: auto;
            min-width: max-content;
            margin-right: 0.5em !important;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
            .rate--imdb  { background: #f5c5184d; } 
            .rate--rt    { background: #fa320a4d; } 
            .rate--meta  { background: #00ce7a4d; } 
            .rate--kp    { background: #ff5c004d; } 
            .rate--tmdb  { background: #01b4e44d; } 
            .rate--trakt { background: #b81d244d; } 
            .rate--letterboxd { background: #00aaff49; }
            .rate--rogerebert { background: #e67d223a; }
            .rate--myanimelist { background: #2ecc703a; }
            .rate--oscars { background: #f1c40f3b; color: #000; }
            .full-start-new__box-office {
                display: flex;
                overflow-x: auto;
                flex-wrap: nowrap;
        }

        .full-start-new__box-office .box-office-line {
            display: flex;
            gap: 0.3em;
            margin: 5px -5px;
            padding: 5px;
            font-size: 1.1em;
            flex-wrap: nowrap;
            overflow-x: hidden;
            min-width: max-content;
        }
        .full-start-new__box-office .box-office-item {
            padding: 0.4em 0.6em;
            border-radius: 5px;
            color: #fff;
            text-align: center;
            overflow-x: auto;
            flex-wrap: nowrap;          
        }

        .box-office-item.budget { background: #1e88e54d; } 
        .box-office-item.world  { background: #10b9814d; } 
        .box-office-item.usa    { background: #ffb3004d; } 
        .box-office-item.russia { background: #9c27b04d; } 
    `;
  document.head.appendChild(style);

  const CACHE_KEY = "rait_boxoffice_cache_v5";
  const CACHE_TTL = (Lampa.Storage.get("cache_ttl_days", 7) || 7) * 24 * 60 * 60 * 1000;
  let cache = Lampa.Storage.get(CACHE_KEY) || {};

  const saveCache = () => Lampa.Storage.set(CACHE_KEY, cache);
  const getCache = (k) => {
    let e = cache[k];
    if (!e) return null;
    if (Date.now() - e.t > CACHE_TTL) {
      delete cache[k];
      saveCache();
      return null;
    }
    return e.d;
  };
  const setCache = (k, data) => {
    cache[k] = { d: data, t: Date.now() };
    saveCache();
  };

  const formatCurrency = (n, s = "$") => {
    if (!n) return "—";
    if (n >= 1_000_000_000) return `${s}${(n / 1_000_000_000).toFixed(1)} млрд`;
    if (n >= 1_000_000) return `${s}${(n / 1_000_000).toFixed(1)} млн`;
    if (n >= 1_000) return `${s}${(n / 1_000).toFixed(1)} тыс`;
    return `${s}${n}`;
  };

  function getMediaType(cardData) {
    // Приоритет: type, media_type, а если нет — пробуем по наличию season/episode
    if (cardData.type === "tv" || cardData.media_type === "tv" || cardData.media_type === "show") return "show";
    if (cardData.type === "movie" || cardData.media_type === "movie") return "movie";
    // fallback
    if (cardData.season_number !== undefined || cardData.episode_number !== undefined) return "show";
    return "movie";
  }

  async function getFromMDBList(mediaId, provider, mediaType, apiKey) {
    let cacheKey = `mdblist_raw_${provider}_${mediaType}_${mediaId}`;
    let cached = getCache(cacheKey);
    if (cached) return cached;

    try {
      let url = `https://api.mdblist.com/${provider}/${mediaType}/${mediaId}?apikey=${apiKey}`;
      let res = await fetch(url);
      if (!res.ok) {
        let fail = { ratings: {}, failed: true };
        setCache(cacheKey, fail);
        return fail;
      }
      let data = await res.json();
      let ratings = {
        imdb: "—",
        tmdb: "—",
        kp: "—",
        rt: "—",
        meta: "—",
        trakt: "—",
        letterboxd: "—",
        rogerebert: "—",
        myanimelist: "—",
      };

      if (data.ratings && Array.isArray(data.ratings)) {
        data.ratings.forEach((r) => {
          if (!r.source) return;
          let src = r.source.toLowerCase();
          let rawValue = r.value;
          // Нормализация для 10-балльных
          if ((src === "tmdb" || src === "trakt" || src === "letterboxd" || src === "rogerebert") && typeof rawValue === "number" && rawValue > 10) {
            rawValue = rawValue / 10;
          }
          let cleanVal = formatRating(rawValue, src);
          if (src === "imdb") ratings.imdb = cleanVal;
          if (src === "tmdb") ratings.tmdb = cleanVal;
          if (src === "kinopoisk") ratings.kp = cleanVal;
          if (src === "tomatoes") ratings.rt = cleanVal !== "—" ? cleanVal + "" : "—";
          if (src === "metacritic") ratings.meta = cleanVal;
          if (src === "trakt") ratings.trakt = cleanVal;
          if (src === "letterboxd") ratings.letterboxd = cleanVal;
          if (src === "rogerebert") ratings.rogerebert = cleanVal;
          if (src === "myanimelist") ratings.myanimelist = cleanVal;
        });
      }

      let result = {
        ratings,
        budget: data.budget ? { amount: data.budget, symbol: "$" } : null,
        world: data.revenue ? { amount: data.revenue, symbol: "$" } : null,
      };
      setCache(cacheKey, result);
      return result;
    } catch (e) {
      let fail = { ratings: {}, failed: true };
      setCache(cacheKey, fail);
      return fail;
    }
  }

  async function getFromKPBoxOffice(filmId, apiKey) {
    if (!filmId || !apiKey) return null;
    let cacheKey = "kp_box_raw_" + filmId;
    let cached = getCache(cacheKey);
    if (cached) return cached;
    try {
      let res = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/box_office`, {
        headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
      });
      if (!res.ok) return null;
      let data = await res.json();
      let result = {};
      (data.items || []).forEach((i) => {
        if (i.type === "BUDGET") result.budget = { amount: i.amount, symbol: i.symbol || "$" };
        if (i.type === "WORLD") result.world = { amount: i.amount, symbol: i.symbol || "$" };
        if (i.type === "USA") result.usa = { amount: i.amount, symbol: i.symbol || "$" };
        if (i.type === "RUS") result.russia = { amount: i.amount, symbol: i.symbol || "₽" };
      });
      setCache(cacheKey, result);
      return result;
    } catch (e) {
      return null;
    }
  }

  async function getMergedData(imdbId, tmdbId, kpId, mediaType) {
    let id = imdbId || tmdbId || kpId;
    if (!id) return { ratings: {} };

    let provider = imdbId ? "imdb" : tmdbId ? "tmdb" : kpId ? "mdblist" : null;
    if (!provider) return { ratings: {} };
    let mediaId = imdbId || tmdbId || kpId;

    let cacheKey = `merged_ratings_v7_${provider}_${mediaType}_${mediaId}`;
    let cached = getCache(cacheKey);
    if (cached) return cached;

    let merged = {
      ratings: { imdb: "—", tmdb: "—", kp: "—", rt: "—", meta: "—", trakt: "—", letterboxd: "—", rogerebert: "—", myanimelist: "—" },
      wins: 0,
    };
    let mdblistKey = Lampa.Storage.get("mdblist_api_key", "");

    if (mdblistKey && mediaType) {
      let mdb = await getFromMDBList(mediaId, provider, mediaType, mdblistKey);
      if (mdb && mdb.ratings) {
        Object.assign(merged.ratings, mdb.ratings);
        if (mdb.budget) merged.budget = mdb.budget;
        if (mdb.world) merged.world = mdb.world;
      }
    }

    let omdbKey = Lampa.Storage.get("omdbapi_key", "");
    if (omdbKey && imdbId && (merged.ratings.rt === "—" || merged.ratings.meta === "—" || merged.wins === 0)) {
      let omdb = await getFromOMDb(imdbId, omdbKey);
      if (omdb && omdb.ratings) {
        if (merged.ratings.rt === "—") merged.ratings.rt = omdb.ratings.rt;
        if (merged.ratings.meta === "—") merged.ratings.meta = omdb.ratings.meta;
      }
      if (omdb && omdb.wins && merged.wins === 0) {
        merged.wins = omdb.wins;
      }
    }

    let kpKey = Lampa.Storage.get("box_kp_api_key", "");
    if (kpKey && kpId && merged.ratings.kp === "—") {
      let kpRating = await getKpRatingFromAPI(kpId, kpKey);
      if (kpRating && kpRating !== "—") merged.ratings.kp = kpRating;
      let kpBox = await getFromKPBoxOffice(kpId, kpKey);
      if (kpBox) {
        if (kpBox.budget && !merged.budget) merged.budget = kpBox.budget;
        if (kpBox.world && !merged.world) merged.world = kpBox.world;
        if (kpBox.usa && !merged.usa) merged.usa = kpBox.usa;
        if (kpBox.russia && !merged.russia) merged.russia = kpBox.russia;
      }
    }

    setCache(cacheKey, merged);
    return merged;
  }

  async function getFromOMDb(imdbId, apiKey) {
    if (!imdbId || !apiKey) return null;
    let cacheKey = "omdb_raw_" + imdbId;
    let cached = getCache(cacheKey);
    if (cached) return cached;
    try {
      let res = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`);
      let data = await res.json();
      if (data.Response === "False") return null;
      let ratings = { imdb: "—", rt: "—", meta: "—" };
      if (data.imdbRating && data.imdbRating !== "N/A") ratings.imdb = formatRating(data.imdbRating, "imdb");
      (data.Ratings || []).forEach((s) => {
        if (s.Source === "Rotten Tomatoes") {
          let val = s.Value.replace("%", "");
          ratings.rt = formatRating(val, "tomatoes") + "%";
        }
        if (s.Source === "Metacritic") {
          let val = s.Value.replace("/100", "");
          ratings.meta = formatRating(val, "metacritic");
        }
      });
      let wins = 0;
      if (data.Awards && data.Awards !== "N/A") {
        let match = data.Awards.match(/(\d+)\s*wins?/i);
        if (match) wins = parseInt(match[1], 10);
        else {
          match = data.Awards.match(/won\s+(\d+)/i);
          if (match) wins = parseInt(match[1], 10);
        }
      }
      let result = { ratings, wins };
      if (data.BoxOffice && data.BoxOffice !== "N/A") {
        result.usa = { amount: parseInt(data.BoxOffice.replace(/\D/g, ""), 10), symbol: "$" };
      }
      setCache(cacheKey, result);
      return result;
    } catch (e) {
      return null;
    }
  }

  async function getFromKP(filmId, apiKey) {
    let cacheKey = "kp_raw_" + filmId;
    let cached = getCache(cacheKey);
    if (cached) return cached;
    try {
      let res = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/box_office`, {
        headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
      });
      if (!res.ok) {
        let fail = { failed: true };
        setCache(cacheKey, fail);
        return fail;
      }
      let data = await res.json();
      let result = {};
      (data.items || []).forEach((i) => {
        if (i.type === "BUDGET") result.budget = { amount: i.amount, symbol: i.symbol || "$" };
        if (i.type === "WORLD") result.world = { amount: i.amount, symbol: i.symbol || "$" };
        if (i.type === "USA") result.usa = { amount: i.amount, symbol: i.symbol || "$" };
        if (i.type === "RUS") result.russia = { amount: i.amount, symbol: i.symbol || "₽" };
      });
      setCache(cacheKey, result);
      return result;
    } catch (e) {
      let fail = { failed: true };
      setCache(cacheKey, fail);
      return fail;
    }
  }

  // ---------------------- ОБРАБОТКА КАРТОЧЕК ----------------------
  function getRatingHtml(rating, iconHtml) {
    return `<div style="display: flex; align-items: center; gap: 0.3em;">${rating} ${iconHtml || ""}</div>`;
  }

  function getCardData(cardEl) {
    if (cardEl.card_data) return cardEl.card_data;
    for (let key in cardEl) {
      if (key.startsWith("__lampa") && cardEl[key] && cardEl[key].data) return cardEl[key].data;
    }
    return null;
  }

  async function updateSingleCard($card, cardData) {
    if (!$card.length || !cardData) return;

    let source = Lampa.Storage.get("card_rating_source", "tmdb");
    let imdbId = cardData.imdb_id || (cardData.imdb && cardData.imdb.id);
    let tmdbId = cardData.id || cardData.tmdb_id;
    let kpId = cardData.kinopoisk_id || cardData.kp_id;
    let mediaType = getMediaType(cardData);

    let ratings = cardData.ratings || { imdb: "—", tmdb: "—", kp: "—", rt: "—", meta: "—", trakt: "—" };

    let needExternal =
      (source === "tomatoes" && ratings.rt === "—") ||
      (source === "metacritic" && ratings.meta === "—") ||
      (source === "trakt" && ratings.trakt === "—") ||
      (source === "imdb" && !cardData.imdb_rating && ratings.imdb === "—") ||
      (source === "kp" && !cardData.kp_rating && ratings.kp === "—");

    if (needExternal && (imdbId || tmdbId || kpId)) {
      let extData = await getMergedData(imdbId, tmdbId, kpId, mediaType);
      if (extData && extData.ratings) {
        ratings = { ...ratings, ...extData.ratings };
        cardData.ratings = ratings;
      }
    }

    let voteValue = "—";
    let finalSource = source;

    if (source === "kp") voteValue = ratings.kp !== "—" ? ratings.kp : cardData.kp_rating ? formatRating(cardData.kp_rating, "kp") : "—";
    else if (source === "imdb")
      voteValue = ratings.imdb !== "—" ? ratings.imdb : cardData.imdb_rating ? formatRating(cardData.imdb_rating, "imdb") : "—";
    else if (source === "tomatoes") voteValue = ratings.rt;
    else if (source === "metacritic") voteValue = ratings.meta;
    else if (source === "trakt") voteValue = ratings.trakt;
    else
      voteValue =
        ratings.tmdb !== "—"
          ? ratings.tmdb
          : cardData.tmdb_rating || cardData.vote_average
            ? formatRating(cardData.tmdb_rating || cardData.vote_average, "tmdb")
            : "—";

    if (!voteValue || voteValue === "—" || voteValue === "0" || voteValue === 0) {
      voteValue =
        ratings.tmdb !== "—"
          ? ratings.tmdb
          : cardData.tmdb_rating || cardData.vote_average
            ? formatRating(cardData.tmdb_rating || cardData.vote_average, "tmdb")
            : "—";
      finalSource = "tmdb";
    }

    let iconHtml = icons[finalSource]?.html || "";
    let $vote = $card.find(".card__vote");
    if ($vote.length) $vote.html(getRatingHtml(voteValue, iconHtml));
  }

  function initCardListener() {
    Lampa.Listener.follow("card", async (e) => {
      if (e.type !== "build") return;
      let cardObj = e.object;
      let $card = $(cardObj.card);
      let cardData = cardObj.data || getCardData(cardObj.card);
      setTimeout(() => updateSingleCard($card, cardData), 50);
    });
  }

  function updateAllCards() {
    $(".card").each(function () {
      let cardData = getCardData(this);
      if (cardData) updateSingleCard($(this), cardData);
    });
  }

  function observeCards() {
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && $(node).closest(".card").length) {
            let $card = $(node).closest(".card");
            if ($card.length && !$card.hasClass("rait-processed")) {
              $card.addClass("rait-processed");
              let cardData = getCardData($card[0]);
              if (cardData) updateSingleCard($card, cardData);
            }
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  async function renderFullRatingsAndBoxOffice(event) {
    if (event.type !== "start") return;
    let movie = event.data || {};
    let fullData = (Lampa.Full && Lampa.Full.data) || {};
    let card = movie.card || movie.movie || fullData.card || {};

    let filmId = movie.id || movie.filmId || card.kinopoisk_id || fullData.kinopoisk_id || null;
    let imdbId = movie.imdb_id || card.imdb_id || fullData.imdb_id || (card.imdb && card.imdb.id) || null;
    let tmdbId = movie.tmdb_id || card.tmdb_id || card.id || fullData.id || null;
    let cardBudget = movie.budget || card.budget || movie.movie?.budget || fullData.movie?.budget || fullData.budget || null;
    let mediaType = getMediaType({ ...fullData, ...card, ...movie });

    let extData = await getMergedData(imdbId, tmdbId, filmId, mediaType);

    let box = {
      ratings: extData.ratings || {},
      budget: extData.budget || (cardBudget ? { amount: cardBudget, symbol: "$" } : null),
      world: extData.world || null,
      usa: extData.usa || null,
      russia: extData.russia || null,
      wins: extData.wins || 0,
    };

    let rateLine = document.querySelector(".full-start-new__rate-line");
    if (!rateLine) return;

    let combined = { ...fullData, ...card, ...movie };
    let tmdb =
      box.ratings.tmdb !== "—"
        ? box.ratings.tmdb
        : combined.vote_average || combined.tmdb_rating
          ? formatRating(combined.vote_average || combined.tmdb_rating, "tmdb")
          : "—";
    let kp =
      box.ratings.kp !== "—"
        ? box.ratings.kp
        : combined.kp_rating || combined.rating_kp
          ? formatRating(combined.kp_rating || combined.rating_kp, "kp")
          : "—";
    let imdb =
      box.ratings.imdb !== "—"
        ? box.ratings.imdb
        : combined.imdb_rating || combined.rating_imdb
          ? formatRating(combined.imdb_rating || combined.rating_imdb, "imdb")
          : "—";
    let rt = box.ratings.rt !== "—" ? box.ratings.rt : null;
    let meta = box.ratings.meta !== "—" ? box.ratings.meta : null;
    let trakt = box.ratings.trakt !== "—" ? box.ratings.trakt : null;
    let letterboxd = box.ratings.letterboxd !== "—" ? box.ratings.letterboxd : null;
    let rogerebert = box.ratings.rogerebert !== "—" ? box.ratings.rogerebert : null;
    let myanimelist = box.ratings.myanimelist !== "—" ? box.ratings.myanimelist : null;
    let totalWins = box.wins && box.wins > 0 ? box.wins : null;

    const addRate = (cls, val, iconHtml) => {
      if (val === null || val === undefined || val === "—") return;
      let el = rateLine.querySelector(`.${cls}`);
      if (!el) {
        el = document.createElement("div");
        el.className = `full-start__rate ${cls}`;
        let pg = rateLine.querySelector(".full-start__pg");
        if (pg) rateLine.insertBefore(el, pg);
        else rateLine.appendChild(el);
      }
      el.innerHTML = `<div style="padding:0 0.2em;">${val}</div><div class="source--icon">${iconHtml || ""}</div>`;
    };

    addRate("rate--tmdb", tmdb, icons.tmdb?.html);
    addRate("rate--kp", kp, icons.kp?.html);
    addRate("rate--imdb", imdb, icons.imdb?.html);
    if (rt) addRate("rate--rt", rt, icons.tomatoes?.html);
    if (meta) addRate("rate--meta", meta, icons.metacritic?.html);
    if (trakt) addRate("rate--trakt", trakt, icons.trakt?.html);
    if (Lampa.Storage.get("show_letterboxd", "disabled") === "enabled" && letterboxd) addRate("rate--letterboxd", letterboxd, icons.letterboxd?.html);
    if (Lampa.Storage.get("show_rogerebert", "disabled") === "enabled" && rogerebert) addRate("rate--rogerebert", rogerebert, icons.rogerebert?.html);
    if (Lampa.Storage.get("show_myanimelist", "disabled") === "enabled" && myanimelist)
      addRate("rate--myanimelist", myanimelist, icons.myanimelist?.html);

    let oldBox = document.querySelector(".full-start-new__box-office");
    if (oldBox) oldBox.remove();
    let values = Object.entries(box).filter(([k, v]) => ["budget", "world", "usa", "russia"].includes(k) && v && v.amount);
    if (values.length) {
      let details = document.querySelector(".full-start-new__details");
      if (details) {
        let container = document.createElement("div");
        container.className = "full-start-new__box-office";
        let colors = { budget: "budget", world: "world", usa: "usa", russia: "russia" };
        let names = { budget: "Бюджет", world: "Мир", usa: "США", russia: "Россия" };
        container.innerHTML = `<div class="box-office-line">${values.map(([k, v]) => `<div class="box-office-item ${colors[k]}">${names[k]}: ${formatCurrency(v.amount, v.symbol)}</div>`).join("")}</div>`;
        details.parentNode.insertBefore(container, details);
      }
    }
  }

  // ---------------------- НАСТРОЙКИ ----------------------
  function registerSettings() {
    try {
      if (!Lampa.SettingsApi) return;
      if (Lampa.SettingsApi.removeParams) Lampa.SettingsApi.removeParams("rait_ratings");
      try {
        Lampa.SettingsApi.removeComponent("rait_ratings");
      } catch (e) {}

      Lampa.SettingsApi.addComponent({
        component: "rait_ratings",
        name: "Рейтинг",
        icon: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEeklEQVR4nO2dy4sdRRSHJ2JifAUNiaCJ/4D6F4S4ULIIuIiOIrgQFXeCCxeKogujYBInymBWgYAL0ZWaRSQiiuDOByZiBLNWxwg+ZxSCj/jJ0ZrQXLseXX3vPbcnvw9mM9V1qup8PVV9u6vvzM01AK4BngVOAr8hxoXl8kTI7dZmzpvJvwtYGVuTIsYyMN+W/L+jVcS4OXdeQph2dOZPn1/+nY7CvCR82GsCPnNqXMCJucT0s6N1tRadAXZGcrxiha10b0akiOZZAqaDBDgjAc5IgDMS4IwEOCMBzkiAMxLgjAQ4IwHOSIAzEuCMBDgjAc5IgDMS4IwEOCMBzkiAMxLgjAQ4IwFrVQCwATgAfAssAfvtd43y9cBCKLeffcDFHeKvH4n/vP0u0n7btvDTwFHgAeDqvuOZRQHWwVH2N8oPtpQf6BB/oaX+Qqb91IbYJ4BLa8dTSzTP0YLywHaWjLLUKP8ucmZeXhD7ssiLImcy7ef4BNhWM55aJikgWT+RhLsLYt/ZI36Or9sk5NqrJRq3b4O5+okEvF4Q+7Ue8Uv4GNjYZTy1ROP2bTBXPzH4s8CmRNyN4XWe2vilPN5lPLVE4/ZtMFc/M/h7EnH3pCqWtG/rDHALcCwR6ufm1VGuvVqicfs2mKtPmqOJuK+kKpa23zjuyUS4+7vG60o0bt8Gc/VJc7ZtGgIuCZeMUWoSlvhLeLOgvx8CP4arsi+AReCmoQsw7m2JeRsZKgXcGjn8dIf+NvkLOFTyQS3azxkQcKwl5ssTEnBl5PCVSgGrvJeTEO3nDAj4Hbhq5NbDT5MQMKb+xnhpqAJGF8HdFDCDAmw6unGoAo43jj8yUAHGi0MV8Aew2e6SAt/PqIC37NYFsN1OmMgxp4YqwHgQ2EUhDgK2N465PreYD1HAO8DhWRXQNc4QBfwJ/FB6sASMX0AnJGCAAoBNkcOXNQVNR0D1rYiuU2/x8V0Dde1IrNweK1L24aYqfqSvdinZxhsXooBD5Hm/Nn5LP59KtHPfhXgZejN5HqqNH8quCNNO7MxffSDTvBcV43j4EGbJf3stfBC7CPgm88V21/aIX8qjJeMp5OBgBISyxcRgPugpuISPSh/KF65XNwxNwI7EgB6esICvgOtKx1PAYlWeprAxK1oOrAuJaJt+tvWIX3Lm/y/5PeK929wuOW0BbVv59nUof6Sl/NWe8VML7mP2zLnjeFK3TxZzyZ+0gA2h00uRzbm58nVhx8KZ8CD+SHPbYsf4o/wKfGkP3e1Ss3m1Uzge26D7XNjf+nn4hkmLeQp4ITXnT02AKEMCnJEAZyTAGQlwRgKckQBnJMAZCXBGApyRAGckwBkJcEYCnJEAZyTAGQlwRgKckQBnJMAZCXBGApyRAGckwBkJcEYCnJEAZyRghgXE/qX5Tu9OrxUSr2MtW+HJmB0xcT41Ac9Mvh0R4WkTsDX1/ZxiYti7EFtW56j58FqQmA6W69tHF4r53FdFirFgOb4jtlpvAfba4hBexRGMBbvStJxabv+bdgL/AJMbblfhELaMAAAAAElFTkSuQmCC" alt="rating-icon"><style>.rating-icon { color: white; }</style>',
      });

      Lampa.SettingsApi.addParam({
        component: "rait_ratings",
        param: {
          name: "card_rating_source",
          type: "select",
          values: {
            tmdb: "TMDb ⚪",
            imdb: "IMDb 🔵",
            kp: "КиноПоиск 🟡",
            tomatoes: "Rotten Tomatoes 🍅",
            metacritic: "Metacritic 🟢",
            trakt: "Trakt 🔴",
          },
          default: Lampa.Storage.get("card_rating_source", "tmdb"),
        },
        field: { name: "Рейтинг в карточках (главная, списки)" },
        onChange: function (v) {
          Lampa.Storage.set("card_rating_source", v);
          Lampa.Noty.show("✅ Источник рейтинга: " + v);
          updateAllCards();
        },
      });

      // ---------------------- Настройка отображения дополнительных рейтингов на странице фильма ----------------------
      Lampa.SettingsApi.addParam({
        component: "rait_ratings",
        param: { type: "title" },
        field: { name: "Дополнительные рейтинги на странице фильма" },
      });

      Lampa.SettingsApi.addParam({
        component: "rait_ratings",
        param: {
          name: "show_letterboxd",
          type: "select",
          values: { enabled: "Вкл", disabled: "Выкл" },
          default: Lampa.Storage.get("show_letterboxd", "disabled"),
        },
        field: { name: "Letterboxd" },
        onChange: (v) => {
          Lampa.Storage.set("show_letterboxd", v);
        },
      });

      Lampa.SettingsApi.addParam({
        component: "rait_ratings",
        param: {
          name: "show_rogerebert",
          type: "select",
          values: { enabled: "Вкл", disabled: "Выкл" },
          default: Lampa.Storage.get("show_rogerebert", "disabled"),
        },
        field: { name: "Roger Ebert" },
        onChange: (v) => {
          Lampa.Storage.set("show_rogerebert", v);
        },
      });

      Lampa.SettingsApi.addParam({
        component: "rait_ratings",
        param: {
          name: "show_myanimelist",
          type: "select",
          values: { enabled: "Вкл", disabled: "Выкл" },
          default: Lampa.Storage.get("show_myanimelist", "disabled"),
        },
        field: { name: "MyAnimeList" },
        onChange: (v) => {
          Lampa.Storage.set("show_myanimelist", v);
        },
      });

      Lampa.SettingsApi.addParam({
        component: "rait_ratings",
        param: {
          name: "show_oscars",
          type: "select",
          values: { enabled: "Вкл", disabled: "Выкл" },
          default: Lampa.Storage.get("show_oscars", "disabled"),
        },
        field: { name: "Количество Оскаров" },
        onChange: (v) => {
          Lampa.Storage.set("show_oscars", v);
        },
      });

      Lampa.SettingsApi.addParam({
        component: "rait_ratings",
        param: {
          name: "mdblist_api_key",
          type: "input",
          values: "",
          placeholder: "Введите API ключ MDBList",
          default: Lampa.Storage.get("mdblist_api_key", ""),
        },
        field: { name: "API ключ MDBList (Все рейтинги и Trakt)" },
        onChange: function (v) {
          if (v !== undefined) {
            Lampa.Storage.set("mdblist_api_key", v);
            Lampa.Noty.show("✅ Ключ MDBList сохранён");
          }
        },
      });

      Lampa.SettingsApi.addParam({
        component: "rait_ratings",
        param: {
          name: "box_kp_api_key",
          type: "input",
          values: "",
          placeholder: "Введите API ключ Кинопоиска",
          default: Lampa.Storage.get("box_kp_api_key", ""),
        },
        field: { name: "API ключ Кинопоиска (Детальные сборы)" },
        onChange: function (v) {
          if (v !== undefined) {
            Lampa.Storage.set("box_kp_api_key", v);
            Lampa.Noty.show("✅ Ключ КП сохранён");
          }
        },
      });

      Lampa.SettingsApi.addParam({
        component: "rait_ratings",
        param: {
          name: "omdbapi_key",
          type: "input",
          values: "",
          placeholder: "Введите API ключ OMDB",
          default: Lampa.Storage.get("omdbapi_key", ""),
        },
        field: { name: "API ключ OMDB (Резервный для RT/Meta)" },
        onChange: function (v) {
          if (v !== undefined) {
            Lampa.Storage.set("omdbapi_key", v);
            Lampa.Noty.show("✅ Ключ OMDB сохранён");
          }
        },
      });

      // ---------------------- НАСТРОЙКИ TTL КЭША ----------------------
      Lampa.SettingsApi.addParam({
        component: "rait_ratings",
        param: {
          name: "cache_ttl_days",
          type: "select",
          values: { 7: "7 дней", 14: "14 дней", 30: "30 дней" },
          default: Lampa.Storage.get("cache_ttl_days", 7),
        },
        field: {
          name: "TTL кэша (дни)",
          description: "Время жизни записей кэша (MDBList, OMDb, КП)",
        },
        onChange: function (v) {
          const days = parseInt(v, 10) || 7;
          Lampa.Storage.set("cache_ttl_days", days);
          Lampa.Noty.show(`✅ TTL кэша установлен: ${days} дней`);
        },
      });

      Lampa.SettingsApi.addParam({
        component: "rait_ratings",
        param: {
          name: "clear_cache",
          type: "button",
          values: "",
        },
        field: { name: "🧹 Очистить кэш рейтингов и сборов" },
        onChange: function () {
          cache = {};
          saveCache();
          Lampa.Noty.show("✅ Кэш очищен");
          updateAllCards();
        },
      });
    } catch (e) {
      console.error("Ошибка регистрации настроек", e);
    }
  }

  // ---------------------- ЗАПУСК ----------------------
  function start() {
    if (!window.Lampa) return;
    initCardListener();
    observeCards();
    if (Lampa.SettingsApi) registerSettings();
    else
      Lampa.Listener.follow("app", (e) => {
        if (e.type === "ready") registerSettings();
      });
    Lampa.Listener.follow("full", renderFullRatingsAndBoxOffice);
    Lampa.Listener.follow("full", (e) => {
      if (e.type === "complite") setTimeout(updateAllCards, 500);
    });
    setTimeout(updateAllCards, 2000);
  }

  if (window.appready) start();
  else
    Lampa.Listener.follow("app", (e) => {
      if (e.type === "ready") start();
    });
})();
