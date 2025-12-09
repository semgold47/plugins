(function () {
  "use strict";

  console.log("%c[raitNew] ⚡️ v4.0", "color:#0ff;font-weight:bold;");
  // --- Функция перевода наград с английского на русский ---
  function translateAwards(awardsText) {
    if (!awardsText) return awardsText;
    let translated = awardsText
      .replace(/(\d+) wins?/g, (match, num) => {
        const n = parseInt(num);
        if (n === 1) return `${num} победа`;
        if (n >= 2 && n <= 4) return `${num} победы`;
        return `${num} побед`;
      })
      .replace(/(\d+) nominations?/g, (match, num) => {
        const n = parseInt(num);
        if (n === 1) return `${num} номинация`;
        if (n >= 2 && n <= 4) return `${num} номинации`;
        return `${num} номинаций`;
      })
      .replace(/Nominated for (\d+) Oscars?/g, (match, num) => {
        const n = parseInt(num);
        if (n === 1) return `Номинирован на ${num} Оскар`;
        if (n >= 2 && n <= 4) return `Номинирован на ${num} Оскара`;
        return `Номинирован на ${num} Оскаров`;
      })
      .replace(/Won (\d+) Oscars?/g, (match, num) => {
        const n = parseInt(num);
        if (n === 1) return `Получил ${num} Оскар`;
        if (n >= 2 && n <= 4) return `Получил ${num} Оскара`;
        return `Получил ${num} Оскаров`;
      })
      .replace(/Nominated for (\d+) BAFTA/g, (match, num) => {
        const n = parseInt(num);
        if (n === 1) return `Номинирован на ${num} BAFTA`;
        return `Номинирован на ${num} BAFTA`;
      })
      .replace(/Won (\d+) BAFTA/g, (match, num) => {
        const n = parseInt(num);
        if (n === 1) return `Получил ${num} BAFTA`;
        return `Получил ${num} BAFTA`;
      })
      .replace(/Nominated for (\d+) Golden Globes?/g, (match, num) => {
        const n = parseInt(num);
        if (n === 1) return `Номинирован на ${num} Золотой глобус`;
        if (n >= 2 && n <= 4) return `Номинирован на ${num} Золотых глобуса`;
        return `Номинирован на ${num} Золотых глобусов`;
      })
      .replace(/Won (\d+) Golden Globes?/g, (match, num) => {
        const n = parseInt(num);
        if (n === 1) return `Получил ${num} Золотой глобус`;
        if (n >= 2 && n <= 4) return `Получил ${num} Золотых глобуса`;
        return `Получил ${num} Золотых глобусов`;
      })
      .replace(/Nominated for (\d+) Primetime Emmys?/g, (match, num) => {
        return `Номинирован на ${num} Прайм-тайм Эмми`;
      })
      .replace(/Won (\d+) Primetime Emmys?/g, (match, num) => {
        return `Получил ${num} Прайм-тайм Эмми`;
      })
      .replace(/Nominated for (\d+) Emmys?/g, (match, num) => {
        return `Номинирован на ${num} Эмми`;
      })
      .replace(/Won (\d+) Emmys?/g, (match, num) => {
        return `Получил ${num} Эмми`;
      })
      .replace(/wins?/g, "побед")
      .replace(/nominations?/g, "номинаций")
      .replace(/total/g, "всего")
      .replace(/&/g, "и")
      .replace(/\s+/g, " ")
      .trim();

    if (
      awardsText.includes("Nominated for") &&
      awardsText.includes("win") &&
      awardsText.includes("nomination")
    ) {
      const nominatedMatch = awardsText.match(
       /Nominated for (\d+) ([^\.]+)\.?\s*(\d+)\s*wins?\s*&\s*(\d+)\s*nominations?/
       );
      if (nominatedMatch) {
        const [_, numAwards, awardType, wins, nominations] = nominatedMatch;
        const nAwards = parseInt(numAwards);
        const nWins = parseInt(wins);
        const nNominations = parseInt(nominations);

        let awardText = "";
        if (awardType.includes("Oscar")) {
          if (nAwards === 1) awardText = `Номинирован на ${numAwards} Оскар`;
          else if (nAwards >= 2 && nAwards <= 4)
            awardText = `Номинирован на ${numAwards} Оскара`;
          else awardText = `Номинирован на ${numAwards} Оскаров`;
        } else if (awardType.includes("Golden Globe")) {
          if (nAwards === 1)
            awardText = `Номинирован на ${numAwards} Золотой глобус`;
          else if (nAwards >= 2 && nAwards <= 4)
            awardText = `Номинирован на ${numAwards} Золотых глобуса`;
          else awardText = `Номинирован на ${numAwards} Золотых глобусов`;
        } else if (awardType.includes("Primetime Emmy")) {
          awardText = `Номинирован на ${numAwards} Прайм-тайм Эмми`;
        } else if (awardType.includes("Emmy")) {
          awardText = `Номинирован на ${numAwards} Эмми`;
        } else {
          awardText = `Номинирован на ${numAwards} ${awardType}`;
        }

        let winsText = "";
        if (nWins === 1) winsText = `${wins} победа`;
        else if (nWins >= 2 && nWins <= 4) winsText = `${wins} победы`;
        else winsText = `${wins} побед`;

        let nominationsText = "";
        if (nNominations === 1) nominationsText = `${nominations} номинация`;
        else if (nNominations >= 2 && nNominations <= 4)
          nominationsText = `${nominations} номинации`;
        else nominationsText = `${nominations} номинаций`;

        translated = `${awardText}. ${winsText} и ${nominationsText}`;
      }
    }

    if (
      awardsText.includes("Won") &&
      awardsText.includes("win") &&
      awardsText.includes("nomination")
    ) {
	const wonMatch = awardsText.match(
	  /Won (\d+) ([^\.]+)\.?\s*(\d+)\s*wins?\s*&\s*(\d+)\s*nominations?/
	);
      if (wonMatch) {
        const [_, numAwards, awardType, wins, nominations] = wonMatch;
        const nAwards = parseInt(numAwards);
        const nWins = parseInt(wins);
        const nNominations = parseInt(nominations);

        let awardText = "";
        if (awardType.includes("Oscar")) {
          if (nAwards === 1) awardText = `Получил ${numAwards} Оскар`;
          else if (nAwards >= 2 && nAwards <= 4)
            awardText = `Получил ${numAwards} Оскара`;
          else awardText = `Получил ${numAwards} Оскаров`;
        } else if (awardType.includes("Golden Globe")) {
          if (nAwards === 1) awardText = `Получил ${numAwards} Золотой глобус`;
          else if (nAwards >= 2 && nAwards <= 4)
            awardText = `Получил ${numAwards} Золотых глобуса`;
          else awardText = `Получил ${numAwards} Золотых глобусов`;
        } else if (awardType.includes("Primetime Emmy")) {
          awardText = `Получил ${numAwards} Прайм-тайм Эмми`;
        } else if (awardType.includes("Emmy")) {
          awardText = `Получил ${numAwards} Эмми`;
        } else {
          awardText = `Получил ${numAwards} ${awardType}`;
        }

        let winsText = "";
        if (nWins === 1) winsText = `${wins} победа`;
        else if (nWins >= 2 && nWins <= 4) winsText = `${wins} победы`;
        else winsText = `${wins} побед`;

        let nominationsText = "";
        if (nNominations === 1) nominationsText = `${nominations} номинация`;
        else if (nNominations >= 2 && nNominations <= 4)
          nominationsText = `${nominations} номинации`;
        else nominationsText = `${nominations} номинаций`;

        translated = `${awardText}. ${winsText} и ${nominationsText}`;
      }
    }

    return translated;
  }

  // --- Функция перевода названий премий ---
  function translateAwardName(name) {
    const awardMap = {
      "Academy Awards, USA": "Оскар",
      "Golden Globes, USA": "Золотой глобус",
      "BAFTA Awards": "BAFTA",
      "Primetime Emmy Awards": "Прайм-тайм Эмми",
      "Emmy Awards": "Эмми",
    };
    return awardMap[name] || name;
  }

const style = document.createElement("style");
style.textContent = `
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .full-start-new__box-office {
    width: 100%;
    overflow: hidden;
    margin-top: 0.6em;
    line-height: 1.2;
  }


  .full-start-new__box-office .box-office-line {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.25em;
  margin-bottom: 0.2em;
  font-size: 1.05em;
  overflow-x: auto;
  scrollbar-width: none;
  
  /* Для больших экранов/телевизоров - перенос строк */
  @media (min-width: 900px) {
    flex-wrap: wrap;
    overflow-x: visible;
    }
  }
  .full-start-new__box-office .box-office-line::-webkit-scrollbar {
    display: none;
  }

  .full-start-new__box-office .box-office-item {
    padding: 0.4em 0.25em;
    border-radius: 0.35em;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    min-width: fit-content;
   
  }

  .box-office-item.budget { background: #207ed194; }
  .box-office-item.world  { background: #1e9e448f; }
  .box-office-item.usa    { background: #ad7a0498; }
  .box-office-item.russia { background: #642e9385; }

  .full-start__rate {
    width: auto;
    max-width: 100%;
    min-width: min-content;
    margin-right: 0.2em !important;

  }

  .full-start-new__rate-line {
    margin-bottom: 0.2em;
    display: flex;
  // width: 70%;
    overflow-x: auto;
    gap: 0.2em 0;
    flex-wrap: nowrap;
    
    /* Для телевизоров/больших экранов */
    @media (min-width: 900px) {
      flex-wrap: wrap;
      overflow-x: visible;
      width: 66%;
    }
  }
  .rate--awards {
    width: max-content;
    background: #97c93952;
  }
  .full-start__status {
  white-space: nowrap;
  }
  .rate--awards > div:first-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
        background: none;
  }

  .source--icon {
    flex-shrink: 0;
    width: max-content;
  }

  .rate--imdb  { background: #bb994aa2; }
  .rate--rt    { background: #7b2716a9; }
  .rate--meta  { background: #66c2a582; }
  .rate--kp    { background: #642e9385; }
  .rate--tmdb  { background: #1978938f; }

  .full-start-new__awards {
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 1em;
    padding: 0.2em;
    overflow: hidden;
  }

  .full-start-new__awards .awards-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 0.5em 0.7em;
    border-radius: 0.5em;
    color: #fff;
    background-color: rgba(255,255,255,0.05);
    font-size: 1.6em;
    font-weight: 400;
    box-shadow: 0 0 0.4em rgba(255,255,255,0.5);
  }

  .full-start-new__awards .awards-content {
    overflow: hidden;
    margin-top: 0.3em;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 0.5em;
  }

  .full-start-new__awards .award-group {
    margin-bottom: 0.4em;
    overflow: hidden;
  }

  .full-start-new__awards .award-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 0.4em 0.2em;
    background-color: rgba(0,0,0,0.3);
    border-radius: 0.5em;
    color: #fff;
  }

  .full-start-new__awards .award-items {
    margin: 0 0 0.4em 0.4em;
    padding-left: 0;
    color: #fff;
    overflow: hidden;
    font-size: 1.2em;
    font-weight: 600;
  }

  .award-toggle {
    font-weight: bold;
    color: #999;
  }
`;
document.head.appendChild(style);

  // --- Иконки ---
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
    tomatoes: { html: "🍅" },
    metacritic: {
      html: '<img style="width: 1.5em; height: 1.5em; padding: object-fit: contain;" src="https://img.icons8.com/color/48/metascore.png" alt="metascore"/>',
    },
    oscars: {
      html: '<img style="width: 2.5em; height: 1.2em;  object-fit: contain;"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFNklEQVR4nNWZXWhbZRjHX8E7RbzUC/FaGMI+3NS1TdMkJzn5Ol85XznJOUmaZG23VTeHVSvrCtvcQJHdqBcqDAUR3JCpbCK6yXRjm6xp2s1O3I0gFGRsbFN2sfGX520SbA2CgtubH7w3yc3z+/Oc531Owtj/wNTU1P2mX33NCmqLpl9d1AvlPfQZ6xVMv7rfKddhl+swgypMfxhqIdjDegW7vGmRip85thWzxzYh5w9DL5QWWa9glWpXSeBGczOunlFhFCvQvfJN1itYQfWcVaph4fgoml/oXEDNl35gPcJ9ZjD8GfX+t4fHcPSgDb1QhuIGh+k7JjJmUC1ZpdplSp8Ezh/djFOHXGheCapXQsYt/pyyXI+JiBkMT7Ynz/jzdZw6sgX4aTMwl8FXH+qojRaQdYrIOEWkcs6LTDTsSv0qCZw4tAV3Lj0H/OgDc1lgLgU0k7g9k8Dn72tI2wWkTO8KEw27XL9D6d+5tAWYU3nyvHguIAPNBG7PSFwgaXq3mWjYpdot6v1b86Ot4tOd9Kl4NOO4eVZC2vIgm+4fTDSsoHqDBK43Rrqmj1kJV75LIGXmkTTy15ho5ILqLzR5fjs32jV9Evj1RALJXB4Jw77MRMMoVs7QzrPwzUjX9OnMfJrkAnHNPslEQy+WPyKB45+0ngGevtxJH7MxHHk3AznnIq7aB5loqF4poKVt3+4qMG/8LX3MRvHqRA4Jw8FQNucw0VCU4GHdK12nteGVCQ9oppalv2ObydNP6M619YnEQ0xE0m7B4GtDPgAWgmXpLz28DuIZQ2Eio7YFLlU66ZMAT99wwERH9UpQXH+FQKTVPnYPCOQDvrRhodxJH42hpfbRekBAcf2WQKmTPhfQ7d4QyDrFa7Qy/97wO+lfPx3hxUuqJd4KsZKM4zVo47zwZamT/vnDcS4QU83zTHSSprefBN5+3QeaEtAI441pBZJmIZo19jLRyTj+k7QyexUPuGAAjUGYnknpI6ZZq5joxDXvUVqZucBFjwvk8jkuEEqajzDRkQ1bplt38uUCcMHmAtvHVUQVE2HVkJjoyDnnBRJ474APzGtAI4QDu1OIZHMIp41tTHSSujtJt+4Hb9FDnOQC7+xLcoFQWn+JiY6kWWW6dd/cW1gSmBnA7sk0IlkDYTnrM9GR9HyYBHZsd5d+Vpnpx9iogqGMjsG0GmKiE9b1x2ltKFZsYF4HZvpgeSrCaR39kvIYE52QaT5It65qW8BFkwvIusYFYrHCA0xUErp7rr0yt9YGPjqp93n7pDSEUioGZAV98expJhpy64WFL220NvDic7x4Sp+KDyUV9Cey6ItnIGz609PTCIIAvu+jWCyiUCjA8zzk83lomsYFNsbT2BhLnWKiIBvO2Xb6u3bt4sXToeLpUPFtAUqfBJ6Nyt8zkWj3/tTUVNf0XdflAjx9KS1WC7UFqPf/SUBV1aX0YynxBOKtyUMC3Yp3HAeKovD0n4kmxROQNIsL7Ny5s6uAbdtcgNIXUiDWmvsk8Nfi6VD6JJDNZrnA01FZDIGUZq2Kac54TDEPkQDN/ZUC7fTbApT+hoiMdYPSx2tD8ZENA9En7knxsu6cXHlxGV6AiYmJZaOznb5lWfwh7peWBNaH43gqLGFtKIbVA9Gv77oAFU+Tx6vUMLJ1HKNjY6jX67z/u6VvmiY/NErTmSyGJBl90QTWDESxZiBy91vq36wNNHnavb8y/TUDUazuvwcCcc0+0548VDx/YUkvX9o6a0NrdJLA+qEEF1g32BaIYHX/0H/+x+ZP07lkQ4nz4iEAAAAASUVORK5CYII=" alt="external-Oscar-vote-and-reward-those-icons-lineal-color-those-icons">',
    },
    emmy: {
      html: '<img style="width: 2.5em; height: 1.2em;  object-fit: contain;"  src="https://semgold47.github.io/plugins/emmy-svgrepo-com.svg" class="rating-icon" />',
    },
    awards: { html: "🏆" },
  };

  // --- API ключи ---
  const OMDB_API_KEY = Lampa.Storage.get("omdbapi_key", "");
  const KP_API_KEY = Lampa.Storage.get("box_kp_api_key", Lampa.Storage.get("kp_api_key", ""));
  // --- Кэш ---
  const CACHE_KEY = "rait_boxoffice_cache_v2";
  const CACHE_TTL = Lampa.Storage.get("box_cache_ttl_days", Lampa.Storage.get("cache_ttl_days", 7)) * 24 * 60 * 60 * 1000;
  let cache = Lampa.Storage.get(CACHE_KEY) || {};

  const saveCache = () => {
    Lampa.Storage.set(CACHE_KEY, cache);
  };

  const getCache = (k) => {
    const e = cache[k];
    if (!e) return null;
    if (Date.now() - e.t > CACHE_TTL) {
      delete cache[k];
      saveCache();
      return null;
    }
    return e.d;
  };

  const setCache = (keys, data) => {
    if (!Array.isArray(keys)) keys = [keys];
    for (const k of keys.filter(Boolean)) cache[k] = { d: data, t: Date.now() };
    saveCache();
  };

  // --- Формат денег ---
  const formatCurrency = (n, s = "$") => {
    if (!n) return "—";
    if (n >= 1_000_000_000) return `${s}${(n / 1_000_000_000).toFixed(1)} млрд`;
    if (n >= 1_000_000) return `${s}${(n / 1_000_000).toFixed(1)} млн`;
    if (n >= 1_000) return `${s}${(n / 1_000).toFixed(1)} тыс`;
    return `${s}${n}`;
  };

  // --- Kinopoisk Awards ---
  async function getAwardsFromKinopoisk(filmId) {
    if (!filmId) return null;

    const cacheKey = "kp_awards_" + filmId;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(
        `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/awards`,
        {
          headers: {
            "X-API-KEY": KP_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("HTTP " + res.status);

      const data = await res.json();
      setCache(cacheKey, data);
      return data;
    } catch (e) {
      Lampa.Noty.show(`❌ Ошибка KP Awards API: ${e.message}`);
      return null;
    }
  }

  // --- Kinopoisk Box Office ---
  async function getFromKinopoisk(filmId) {
    if (!filmId) return null;

    const cached = getCache("Кинопоиск" + filmId);
    if (cached) return cached;

    try {
      const res = await fetch(
        `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/box_office`,
        {
          headers: {
            "X-API-KEY": KP_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("HTTP " + res.status);

      const data = await res.json();
      const result = {};

      (data.items || []).forEach((i) => {
        if (i.type === "BUDGET") {
          result.budget = { amount: i.amount, symbol: i.symbol || "$" };
        }
        if (i.type === "WORLD") {
          result.world = { amount: i.amount, symbol: i.symbol || "$" };
        }
        if (i.type === "USA") {
          result.usa = { amount: i.amount, symbol: i.symbol || "$" };
        }
        if (i.type === "RUS") {
          result.russia = { amount: i.amount, symbol: i.symbol || "₽" };
        }
      });

      setCache(["Кинопоиск" + filmId], result);
      return result;
    } catch (e) {
      Lampa.Noty.show(`❌ Ошибка KP API: ${e.message}`);
      return null;
    }
  }

  // --- OMDb ---
  async function getFromOMDb(imdbId) {
    if (!imdbId) return null;

    const cached = getCache("omdb_" + imdbId);
    if (cached) return cached;

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`
      );

      const data = await res.json();

      if (data.Response === "False") {
        return null;
      }

      const r = { imdb: data.imdbRating !== "N/A" ? data.imdbRating : null };

      (data.Ratings || []).forEach((s) => {
        if (s.Source === "Rotten Tomatoes") r.rt = s.Value;
        if (s.Source === "Metacritic") r.meta = s.Value;
      });

      const boxOffice = parseInt(data.BoxOffice?.replace(/\D/g, ""), 10);
      let translatedAwards = data.Awards;

      if (data.Awards && data.Awards !== "N/A") {
        translatedAwards = translateAwards(data.Awards);
      }

      const result = {
        imdbID: data.imdbID,
        awards: translatedAwards,
        ratings: r,
        usa: !isNaN(boxOffice) ? { amount: boxOffice, symbol: "$" } : null,
      };

      setCache(["omdb_" + imdbId, imdbId], result);
      return result;
    } catch (e) {
      Lampa.Noty.show(`❌ Ошибка OMDb API: ${e.message}`);
      return null;
    }
  }

  // --- Собираем все ---
  async function getFullBoxOfficeData({ filmId, imdbId, cardBudget }) {
    const data = {
      budget: cardBudget ? { amount: cardBudget, symbol: "$" } : null,
      ratings: {},
    };

    const kp = filmId ? await getFromKinopoisk(filmId) : null;
    if (kp) Object.assign(data, kp);

    const awards = filmId ? await getAwardsFromKinopoisk(filmId) : null;
    if (awards && awards.items) {
      data.awardsItems = awards.items;
    }

    const omdb = imdbId ? await getFromOMDb(imdbId) : null;
    if (omdb) {
      if (omdb.usa && !data.usa) data.usa = omdb.usa;
      if (omdb.ratings) data.ratings = omdb.ratings;
      if (omdb.awards) data.awards = omdb.awards;
    }

    return data;
  }

  const CACHE_KEYS = {
      combined: "rait_boxoffice_cache_v2",
      tmdb: "tmdb_id_mapping"
  };

  // Инициализация улучшенного кэша
  let combinedCache = JSON.parse(localStorage.getItem(CACHE_KEYS.combined) || "{}");
  let cacheQueue = Object.keys(combinedCache).sort((a, b) => combinedCache[a].timestamp - combinedCache[b].timestamp); // Initial queue

  function saveCombinedCache() {
      localStorage.setItem(CACHE_KEYS.combined, JSON.stringify(combinedCache));
  }

  function cleanupCombinedCache() {
      const now = Date.now();
      const ttlDays = Lampa.Storage.get("cache_ttl_days", 7);
      const ttlMs = ttlDays * 24 * 60 * 60 * 1000;
      const lruLimit = Lampa.Storage.get("cache_lru_limit", 300);

      // Удаляем устаревшие записи
      cacheQueue = cacheQueue.filter(key => {
          if (now - combinedCache[key].timestamp > ttlMs) {
              delete combinedCache[key];
              return false;
          }
          return true;
      });

      // LRU cleanup если превышен лимит
      while (cacheQueue.length > lruLimit) {
          const oldestKey = cacheQueue.shift();
          delete combinedCache[oldestKey];
      }

      saveCombinedCache();
  }

  // Инициализация очистки кэша
  cleanupCombinedCache();

    // Универсальные функции кэширования (совместимые с вашей системой)
  const cacheManager = {
      get: (imdbId) => {
          // Сначала проверяем улучшенный кэш
          const entry = combinedCache[imdbId];
          if (entry) {
              const ttlDays = Lampa.Storage.get("cache_ttl_days", 7);
              const ttlMs = ttlDays * 24 * 60 * 60 * 1000;
              
              if (Date.now() - entry.timestamp < ttlMs) {
                  return entry.data;
              } else {
                  delete combinedCache[imdbId];
                  cacheQueue = cacheQueue.filter(k => k !== imdbId);
                  saveCombinedCache();
              }
          }
          
          // Затем проверяем старый кэш для совместимости
          const oldData = getCache(`omdb_${imdbId}`);
          if (oldData) {
              // Преобразуем старые ключи в новые
              return {
                  tomatoes: oldData.rtRating,
                  metacritic: oldData.metacriticRating,
                  oscars: oldData.oscars,
                  emmy: oldData.emmy,
                  awards: oldData.awards,
                  nominations: oldData.avg
              };
          }
          
          return null;
      },
    
      set: (imdbId, data, ttlMs = null) => {
          if (!data || !imdbId) return;
          
          // Сохраняем в улучшенный кэш
          const existing = combinedCache[imdbId]?.data || {};
          combinedCache[imdbId] = {
              timestamp: Date.now(),
              data: { ...existing, ...data }
          };
          
          // Также сохраняем в старый кэш для совместимости с плагинами
          const oldFormatData = {
              rtRating: data.tomatoes,
              metacriticRating: data.metacritic,
              oscars: data.oscars,
              emmy: data.emmy,
              awards: data.awards,
              avg: data.nominations
          };
          setCache(`omdb_${imdbId}`, oldFormatData);
          
          // Обновляем очередь LRU
          cacheQueue = cacheQueue.filter(k => k !== imdbId);
          cacheQueue.push(imdbId);
          
          // Автоматическая очистка при добавлении
          cleanupCombinedCache();
      }
  };

  function renderRatings(box, event = null) {
    const rateLine = document.querySelector(".full-start-new__rate-line");
    if (!rateLine) return;

    const movie = event?.data?.movie || {};
    const card = event?.data?.card || {};
    const fullData = (typeof Lampa.Full !== "undefined" && Lampa.Full.data) || {};
    const combined = { ...fullData, ...card, ...movie };
    const imdbId = combined.imdb_id || combined.imdbID || combined.imdb || null;

    // Проверяем наличие кэша
    let cached = null;
    if (imdbId) cached = cacheManager.get(imdbId);

    // Получаем рейтинги (если есть в box или кэше)
    const ratings = box?.ratings || {};
    const cacheRatings = cached || {};

    const tmdbRate =
      ratings.tmdb ||
      combined.vote_average ||
      combined.tmdb_rating ||
      "—";

    const kpRate =
      ratings.kp ||
      combined.kp_rating ||
      combined.rating_kp ||
      "—";

    const imdbRate =
      ratings.imdb ||
      combined.imdb_rating ||
      combined.rating_imdb ||
      "—";

    // Смотрим, есть ли доп. источники рейтингов из кэша
    const rtRate = ratings.rt || cacheRatings.tomatoes || null;
    const metaRate = ratings.meta || cacheRatings.metacritic || null;
    const awards =
      box.awards ||
      cacheRatings.awards ||
      cacheRatings.oscars ||
      cacheRatings.emmy ||
      null;

    // Универсальная функция добавления блока рейтинга
    const addRate = (cls, value, iconHtml) => {
      if (value === null || value === undefined) return;

      let el = rateLine.querySelector(`.${cls}`);
      if (!el) {
        el = document.createElement("div");
        el.className = `full-start__rate ${cls}`;

        const pgElement = rateLine.querySelector(".full-start__pg");
        if (pgElement) {
          rateLine.insertBefore(el, pgElement);
        } else {
          rateLine.appendChild(el);
        }
      }

      el.innerHTML = `
        <div style="width: max-content; padding: 0 0.2em;">${value}</div>
        <div class="source--icon" style="width: max-content;">${iconHtml}</div>`;
    };

    // Добавляем базовые рейтинги
    addRate("rate--tmdb", tmdbRate, icons.tmdb?.html || "⚪");
    addRate("rate--imdb", imdbRate, icons.imdb?.html || "🔵");
    addRate("rate--kp", kpRate, icons.kp?.html || "🟡");

    // Добавляем дополнительные, если есть
    if (rtRate)
      addRate("rate--rt", rtRate, icons.tomatoes?.html || "🍅");

    if (metaRate) {
      const metaRating = metaRate.toString().replace("/100", "");
      addRate("rate--meta", metaRating, icons.metacritic?.html || "🟢");
    }

    if (awards)
  //    addRate("rate--awards", awards, icons.awards?.html || "🏆");
  addRate("rate--awards", awards,"");

    // Если получили рейтинги — сохраняем их в кэш
    if (imdbId) {
      const toCache = {
        tomatoes: rtRate,
        metacritic: metaRate,
        awards: awards,
      };
      cacheManager.set(imdbId, toCache);
    }
  }


  function renderAwardsAccordionUI(awardsItems) {
    if (!awardsItems || !awardsItems.length) return;

    const oldAccordion = document.querySelector(".full-start-new__awards");
    if (oldAccordion) oldAccordion.remove();

    const container = document.createElement("div");
    container.className = "full-start-new__awards accordion-container";

    container.innerHTML = `
      <div class="awards-header selector" data-nav="main">
          <span>Все награды</span>
          <span class="award-toggle"> ▶</span>
      </div>
      <div class="awards-content"></div>
    `;

    const tagsBlock = document.querySelector(".full-descr__text");
    if (tagsBlock) tagsBlock.insertAdjacentElement("afterend", container);

    const contentEl = container.querySelector(".awards-content");
    const groups = new Map();

    awardsItems.forEach((item) => {
      const name = item.name || "Другие";
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(item);
    });

    let html = "";
    groups.forEach((items, name) => {
      const wins = items.filter((i) => i.win).length;
      const noms = items.length - wins;
      const translatedName = translateAwardName(name) || name;

      const itemsHtml = items
        .map((i) => {
          const persons = i.persons
            ? i.persons.map((p) => p.name).join(", ")
            : "";
          const status = i.win ? "🏆 Победа" : "🎬 Номинация";
          return `<li>${i.year}: ${i.nominationName} — ${status}${
            persons ? ` (${persons})` : ""
          }</li>`;
        })
        .join("");

      html += `
        <div class="award-group">
          <div class="award-header selector" data-nav="group" tabindex="-1">
            <span>${translatedName} (${wins} побед, ${noms} номинаций)</span>
            <span class="award-toggle"> ▶</span>
          </div>
          <ul class="award-items">${itemsHtml}</ul>
        </div>
      `;
    });

    contentEl.innerHTML = html;

    let isMainOpen = false;
    const header = container.querySelector(".awards-header");
    const toggle = header.querySelector(".award-toggle");
    const awardGroups = contentEl.querySelectorAll(".award-group");

    contentEl.style.height = "0px";
    contentEl.style.overflow = "hidden";
    contentEl.style.transition = "height 0.4s ease";

    header.addEventListener("hover:enter", () => {
      isMainOpen = !isMainOpen;

      if (isMainOpen) {
        contentEl.style.height = contentEl.scrollHeight + "px";
        toggle.textContent = "▼";
      } else {
        contentEl.style.height = "0px";
        toggle.textContent = " ▶";
      }
      updateNavigation();
    });

    awardGroups.forEach((group) => {
      const gHeader = group.querySelector(".award-header");
      const gList = group.querySelector(".award-items");
      let isGroupOpen = false;

      gList.style.height = "0px";
      gList.style.overflow = "hidden";
      gList.style.transition = "height 0.3s ease";

      gHeader.addEventListener("hover:enter", () => {
        if (!isMainOpen) return;

        isGroupOpen = !isGroupOpen;

        if (isGroupOpen) {
          gList.style.height = gList.scrollHeight + "px";
          gHeader.querySelector(".award-toggle").textContent = "▼";

          awardGroups.forEach((g) => {
            if (g !== group) {
              const otherList = g.querySelector(".award-items");
              const otherHeader = g.querySelector(".award-header");
              otherList.style.height = "0px";
              otherHeader.querySelector(".award-toggle").textContent = " ▶";
            }
          });
        } else {
          gList.style.height = "0px";
          gHeader.querySelector(".award-toggle").textContent = " ▶";
        }

        if (isMainOpen) {
          contentEl.style.height = "auto";
          const newHeight = contentEl.scrollHeight;
          contentEl.style.height = newHeight + "px";
        }

        if (
          typeof Lampa !== "undefined" &&
          Lampa.Focused &&
          Lampa.Focused.update
        ) {
          setTimeout(() => Lampa.Focused.update(), 50);
        }
      });
    });

    contentEl.addEventListener("transitionend", function () {
      if (isMainOpen) {
        contentEl.style.height = "auto";
        contentEl.style.overflow = "visible";
      }
    });

    awardGroups.forEach((group) => {
      const gList = group.querySelector(".award-items");
      gList.addEventListener("transitionend", function () {
        const isOpen = gList.style.height !== "0px";
        if (isOpen) gList.style.overflow = "visible";
      });
    });

    function updateNavigation() {
      if (typeof Lampa === "undefined" || !Lampa.Focused) return;

      try {
        Lampa.Focused.pause();
        const allSelectors = container.querySelectorAll(".selector");
        Lampa.Focused.remove(Array.from(allSelectors));
        Lampa.Focused.add(header);

        if (isMainOpen) {
          const groupHeaders = container.querySelectorAll(
            ".award-header.selector"
          );
          Lampa.Focused.add(Array.from(groupHeaders));
        }

        Lampa.Focused.play();
        if (Lampa.Focused.update) setTimeout(() => Lampa.Focused.update(), 10);
      } catch (e) {}
    }

    setTimeout(updateNavigation, 100);
  }

  function updateUI(box, type, event) {
    if (!event || !event.data) return;

    renderRatings(box, event);

    if (type && type.toLowerCase() !== "movie") return;

    const oldBox = document.querySelector(".full-start-new__box-office");
    if (oldBox) oldBox.remove();

    const values = Object.entries(box).filter(
      ([k, v]) =>
        ["budget", "world", "usa", "russia"].includes(k) && v && v.amount
    );

    if (!values.length) return;

    const detailsEl = document.querySelector(".full-start-new__details");
    if (!detailsEl) return;

    const container = document.createElement("div");
    container.className = "full-start-new__box-office";
    const colors = {
      budget: "budget",
      world: "world",
      usa: "usa",
      russia: "russia",
    };

    container.innerHTML = `
        <div class="box-office-line">
          ${values
            .map(
              ([k, v]) =>
                `<div class="box-office-item ${colors[k]}">${
                  k === "budget"
                    ? "Бюджет"
                    : k === "world"
                    ? "Мир"
                    : k === "usa"
                    ? "США"
                    : "Россия"
                }: <b>${formatCurrency(v.amount, v.symbol)}</b></div>`
            )
            .join("")}
        </div>`;

    detailsEl.parentNode.insertBefore(container, detailsEl);

    if (box.awardsItems && box.awardsItems.length) {
      renderAwardsAccordionUI(box.awardsItems);
    }
  }

  function start() {
    if (!window.Lampa || !window.Lampa.Listener || !window.Lampa.Card) return;
  }

  if (window.appready) {
    start();
  } else {
    Lampa.Listener.follow("app", function (e) {
      if (e.type === "ready") start();
    });
  }

  // --- Listener ---
  Lampa.Listener.follow("full", async (event) => {
    if (event.type !== "start") return;

    const movie = event.data || {};
    const fullData =
      (typeof Lampa.Full !== "undefined" && Lampa.Full.data) || {};
    const card = movie.card || movie.movie || fullData.card || {};

    const filmId =
      movie.id ||
      movie.filmId ||
      card.kinopoisk_id ||
      fullData.kinopoisk_id ||
      null;
    const imdbId =
      movie.imdb_id ||
      card.imdb_id ||
      fullData.imdb_id ||
      (card.imdb && card.imdb.id) ||
      null;
    const cardBudget =
      movie.budget ||
      card.budget ||
      movie.movie?.budget ||
      fullData.movie?.budget ||
      fullData.budget ||
      null;

    const box = await getFullBoxOfficeData({ filmId, imdbId, cardBudget });
    updateUI(box, movie.type, event);
  });

  // --- Настройки ---
  function registerSettings() {
    const DEFAULTS = {
      cache_ttl_days: 7,
      omdb_apikey: "",
      kp_apikey: "",
    };

    Lampa.SettingsApi.addParam({
      component: "boxoffice_info",
      param: {
        name: "box_kp_api_key",
        type: "input",
        values: "",
        placeholder: "Введите API ключ КиноПоиска",
        default: Lampa.Storage.get("box_kp_api_key", Lampa.Storage.get("kp_api_key", DEFAULTS.kp_apikey)),
      },
      field: {
        name: "Введите API ключ КиноПоиска",
        description: "API ключ для КиноПоиск API",
      },
      onChange: (v) => {
        if (v) {
          Lampa.Storage.set("box_kp_api_key", v);
          Lampa.Noty.show(`✅ КиноПоиск API ключ сохранен`);
        }
      },
    });

    Lampa.SettingsApi.addParam({
      component: "boxoffice_info",
      param: {
        name: "omdbapi_key",
        type: "input",
        values: "",
        placeholder: "Введите API ключ OMDB",
        default: Lampa.Storage.get("omdbapi_key", Lampa.Storage.get("omdbapi_key", DEFAULTS.omdb_apikey)),
      },
      field: {
        name: "Введите API ключ OMDB",
        description: "API ключ для OMDB (Rotten Tomatoes, Metacritic)",
      },
      onChange: (v) => {
        if (v) {
          Lampa.Storage.set("omdbapi_key", v);
          Lampa.Noty.show(`✅ OMDb API ключ сохранен`);
        }
      },
    });

    Lampa.SettingsApi.addParam({
      component: "boxoffice_info",
      param: {
        name: "box_cache_ttl_days",
        type: "select",
        values: { 7: "7 дней", 14: "14 дней", 30: "30 дней" },
        default: Lampa.Storage.get("box_cache_ttl_days", Lampa.Storage.get("cache_ttl_days", DEFAULTS.cache_ttl_days)),
      },
      field: {
        name: "TTL кэша (дни)",
        description: "Время жизни записей кэша",
      },
      onChange: (v) => {
        const days = parseInt(v, 10) || 7;
        Lampa.Storage.set("box_cache_ttl_days", days);
        Lampa.Noty.show(`✅ TTL кэша установлен: ${days} дней`);
      },
    });

    Lampa.SettingsApi.addParam({
      component: "boxoffice_info",
      param: { name: "clear_box_cache", type: "button", values: "" },
      field: {
        name: "🧹 Очистить кэш",
        description: "Полная очистка кэша рейтингов",
      },
      onChange: () => {
        const beforeCount = Object.keys(cache).length;
        cache = {};
        saveCache();
        Lampa.Noty.show(`✅ Кэш очищен (${beforeCount} записей)`);
      },
    });

    Lampa.SettingsApi.addComponent({
      component: "boxoffice_info",
      name: "Сборы и награды",
      icon: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEeklEQVR4nO2dy4sdRRSHJ2JifAUNiaCJ/4D6F4S4ULIIuIiOIrgQFXeCCxeKogujYBInymBWgYAL0ZWaRSQiiuDOByZiBLNWxwg+ZxSCj/jJ0ZrQXLseXX3vPbcnvw9mM9V1qup8PVV9u6vvzM01AK4BngVOAr8hxoXl8kTI7dZmzpvJvwtYGVuTIsYyMN+W/L+jVcS4OXdeQph2dOZPn1/+nY7CvCR82GsCPnNqXMCJucT0s6N1tRadAXZGcrxiha10b0akiOZZAqaDBDgjAc5IgDMS4IwEOCMBzkiAMxLgjAQ4IwHOSIAzEuCMBDgjAc5IgDMS4IwEOCMBzkiAMxLgjAQ4IwFrVQCwATgAfAssAfvtd43y9cBCKLeffcDFHeKvH4n/vP0u0n7btvDTwFHgAeDqvuOZRQHWwVH2N8oPtpQf6BB/oaX+Qqb91IbYJ4BLa8dTSzTP0YLywHaWjLLUKP8ucmZeXhD7ssiLImcy7ef4BNhWM55aJikgWT+RhLsLYt/ZI36Or9sk5NqrJRq3b4O5+okEvF4Q+7Ue8Uv4GNjYZTy1ROP2bTBXPzH4s8CmRNyN4XWe2vilPN5lPLVE4/ZtMFc/M/h7EnH3pCqWtG/rDHALcCwR6ufm1VGuvVqicfs2mKtPmqOJuK+kKpa23zjuyUS4+7vG60o0bt8Gc/VJc7ZtGgIuCZeMUWoSlvhLeLOgvx8CP4arsi+AReCmoQsw7m2JeRsZKgXcGjn8dIf+NvkLOFTyQS3azxkQcKwl5ssTEnBl5PCVSgGrvJeTEO3nDAj4Hbhq5NbDT5MQMKb+xnhpqAJGF8HdFDCDAmw6unGoAo43jj8yUAHGi0MV8Aew2e6SAt/PqIC37NYFsN1OmMgxp4YqwHgQ2EUhDgK2N465PreYD1HAO8DhWRXQNc4QBfwJ/FB6sASMX0AnJGCAAoBNkcOXNQVNR0D1rYiuU2/x8V0Dde1IrNweK1L24aYqfqSvdinZxhsXooBD5Hm/Nn5LP59KtHPfhXgZejN5HqqNH8quCNNO7MxffSDTvBcV43j4EGbJf3stfBC7CPgm88V21/aIX8qjJeMp5OBgBISyxcRgPugpuISPSh/KF65XNwxNwI7EgB6esICvgOtKx1PAYlWeprAxK1oOrAuJaJt+tvWIX3Lm/y/5PeK929wuOW0BbVv59nUof6Sl/NWe8VML7mP2zLnjeFK3TxZzyZ+0gA2h00uRzbm58nVhx8KZ8CD+SHPbYsf4o/wKfGkP3e1Ss3m1Uzge26D7XNjf+nn4hkmLeQp4ITXnT02AKEMCnJEAZyTAGQlwRgKckQBnJMAZCXBGApyRAGckwBkJcEYCnJEAZyTAGQlwRgKckQBnJMAZCXBGApyRAGckwBkJcEYCnJEAZyRghgXE/qX5Tu9OrxUSr2MtW+HJmB0xcT41Ac9Mvh0R4WkTsDX1/ZxiYti7EFtW56j58FqQmA6W69tHF4r53FdFirFgOb4jtlpvAfba4hBexRGMBbvStJxabv+bdgL/AJMbblfhELaMAAAAAElFTkSuQmCC" alt="rating-icon"><style>.rating-icon { color: white; }</style>',
    });
  }

  registerSettings();
})();
