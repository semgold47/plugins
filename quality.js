(function () {
  "use strict";
  var allQUALITY_CONFIG = {
    CACHE_VERSION: 2,
    LOGGING: { GENERAL: false, QUALITY: true, CARDLIST: false },
    CACHE: {
      VALID_TIME_MS: 3 * 24 * 60 * 60 * 1000,
      REFRESH_THRESHOLD_MS: 12 * 60 * 60 * 1000,
      KEY: "lampa_quality_cache",
    },
    JACRED: {
      PROTOCOL: "https://",
      URL: "jacred.xyz",
      API_KEY: "",
      PROXY_LIST: [
        "http://cors.bwa.workers.dev/",
        "https://corsproxy.io/?",
        "https://api.allorigins.win/raw?url=",
        "https://yacdn.org/proxy/",
        "https://cors-anywhere.herokuapp.com/",
        "https://thingproxy.freeboard.io/fetch/",
      ],
      TIMEOUT_MS: 3000,
    },
    DISPLAY: {
      SHOW_QUALITY_FOR_TV_SERIES: true,
      FULL_CARD: {
        BORDER_COLOR: "#fffacd00",
        TEXT_COLOR: "#FFFFFF",
        FONT_WEIGHT: "normal",
        FONT_SIZE: "1.2em",
        FONT_STYLE: "",
      },
    },
    MANUAL_OVERRIDES: {
      90802: { quality_code: 2160, full_label: "4K Web-DLRip" },
      20873: { quality_code: 2160, full_label: "4K BDRip" },
      1128655: { quality_code: 2160, full_label: "4K Web-DL" },
      46010: { quality_code: 1080, full_label: "1080 Web-DLRip" },
      9564: { quality_code: 1080, full_label: "1080 BDRemux" },
      32334: { quality_code: 1080, full_label: "1080 Web-DLRip" },
      21028: { quality_code: 1080, full_label: "1080 BDRemux" },
      20932: { quality_code: 1080, full_label: "1080 HDTVRip" },
      57778: { quality_code: 2160, full_label: "4K Web-DL" },
      20977: { quality_code: 1080, full_label: "HDTVRip-AVC" },
      33645: { quality_code: 720, full_label: "720p HDTVRip" },
    },
  };

  // ---- CSS ----
  var styleQUALITY =
    '<style id="lampa_quality_styles">' +
    ".full-start-new__rate-line{visibility:hidden;gap:.4em 0}" +
    ".full-start-new__rate-line>*{margin-right:.5em!important;flex:0 0 auto}" +
    ".my-quality{min-width:2.8em;text-align:center;border:1.1px solid " +
    allQUALITY_CONFIG.DISPLAY.FULL_CARD.BORDER_COLOR +
    " !important;color:" +
    allQUALITY_CONFIG.DISPLAY.FULL_CARD.TEXT_COLOR +
    ";font-weight:" +
    allQUALITY_CONFIG.DISPLAY.FULL_CARD.FONT_WEIGHT +
    ";font-size:" +
    allQUALITY_CONFIG.DISPLAY.FULL_CARD.FONT_SIZE +
    ";font-style:" +
    allQUALITY_CONFIG.DISPLAY.FULL_CARD.FONT_STYLE +
    ";border-radius:.3em!important;padding:.2em .8em!important;background:rgba(0,0,0,.3)}" +
    ".card__view{position:relative!important}" +
    ".card__quality{position:absolute!important; background:rgba(26,26,23,.61)!important;z-index:10;font-size:.7em;max-width:calc(100% - 1em)!important;border-radius:1.3em!important;border:1.1px solid #fff!important;padding:.2em .2em}" +
    ".card__quality div{text-transform:uppercase!important;font-family:'Roboto Condensed','Arial Narrow',Arial,sans-serif!important;font-weight:700!important;letter-spacing:.5px!important;font-size:1.1em!important;color:#fff;padding:.1em .5em .08em .4em!important;white-space:nowrap;text-shadow:.5px .5px 1px rgba(0,0,0,.3)!important}" +
    ".my-loading{opacity:.7}" +
    "</style>";
  if (!document.getElementById("lampa_quality_styles"))
    $("body").append(styleQUALITY);

  // ---- утилиты ----
  var MAP = {
    "2160p": "4K",
    "4k": "4K",
    "4к": "4K",
    "1080p": "1080p",
    1080: "1080p",
    "720p": "720p",
    "480p": "SD",
    480: "SD",
    "web-dl": "Web-DL",
    webrip: "WEBRip",
    "web-dlrip": "WEB-DLRip",
    bluray: "BluRay",
    bdrip: "BDRip",
    bdremux: "BDRemux",
    hdtv: "HDTV",
    hdrip: "HDRip",
    dvdrip: "DVDRip",
    camrip: "CAMRip",
    ts: "TS",
    telesync: "TS",
    telecine: "TC",
  };

  function getCardType(c) {
    var t = c.media_type || c.type;
    return t === "movie" || t === "tv"
      ? t
      : c.name || c.original_name
      ? "tv"
      : "movie";
  }
  function getCache(k) {
    var c = Lampa.Storage.get(allQUALITY_CONFIG.CACHE.KEY) || {};
    var i = c[k];
    return i && Date.now() - i.timestamp < allQUALITY_CONFIG.CACHE.VALID_TIME_MS
      ? i
      : null;
  }
  function setCache(k, d) {
    var c = Lampa.Storage.get(allQUALITY_CONFIG.CACHE.KEY) || {};
    c[k] = {
      quality_code: d.quality_code,
      full_label: d.full_label,
      timestamp: Date.now(),
    };
    Lampa.Storage.set(allQUALITY_CONFIG.CACHE.KEY, c);
  }
  function pick(str, re) {
    var m = re.exec(str);
    return m ? m[1] || m[0] : "";
  }
  function translateQuality(code, title) {
    var s = (title || "").toLowerCase(),
      res = pick(s, /(2160p|4k|4к|1080p|720p|480p)/i),
      src = pick(
        s,
        /(web-dl|webrip|web-dlrip|bluray|bdremux|bdrip|hdtv|hdrip|dvdrip|camrip|telesync|telecine|ts)/i
      ),
      out = "";
    if (res) out += MAP[res] || res.toUpperCase();
    if (src) out += (out ? " " : "") + (MAP[src] || src.toUpperCase());
    if (!out && code) out = String(code);
    return out || title || "";
  }
  function fetchWithTimeout(url, ms) {
    return new Promise(function (r, j) {
      var t = false,
        tm = setTimeout(function () {
          t = true;
          j(new Error("timeout"));
        }, ms);
      fetch(url).then(
        function (resp) {
          if (t) return;
          clearTimeout(tm);
          if (!resp.ok) j(new Error("status " + resp.status));
          else resp.text().then(r, j);
        },
        function (e) {
          if (t) return;
          clearTimeout(tm);
          j(e);
        }
      );
    });
  }
  function fetchViaProxies(rawUrl, cardId) {
    var i = 0;

    function buildProxyUrl(proxy, url) {
      var encodedUrl = encodeURIComponent(url);
      
      if (proxy.includes('?')) {
        return proxy + encodedUrl;
      } else if (proxy.endsWith('/')) {
        return proxy + url;
      } else {
        return proxy + '?' + encodedUrl;
      }
    }

    function tryNext() {
      if (i >= allQUALITY_CONFIG.JACRED.PROXY_LIST.length) {

        return Promise.reject(new Error("all proxies failed"));
      }

      var proxy = allQUALITY_CONFIG.JACRED.PROXY_LIST[i++];
      var proxUrl = buildProxyUrl(proxy, rawUrl);



      return fetchWithTimeout(proxUrl, allQUALITY_CONFIG.JACRED.TIMEOUT_MS)
        .then(function(response) {
          return response;
        })
        .catch(function(error) {

          return tryNext();
        });
    }

    return tryNext();
  }

  function normalizeCard(c) {
    return {
      id: c.id,
      title: c.title || c.name || "",
      original_title: c.original_title || c.original_name || "",
      type: getCardType(c),
      release_date: c.release_date || c.first_air_date || "",
    };
  }

  // ---- UI ----
  function repositionQuality(view) {
    if (!view) return;
    var q = view.querySelector(".card__quality"),
      m = view.querySelector(".card__marker");
    if (q) q.style.bottom = m ? "2.7em" : "10px";
  }
  function setFullCardText(renderEl, text) {
    if (!renderEl) return;
    var rate = $(".full-start-new__rate-line", renderEl);
    if (!rate.length) return;
    rate.css("visibility", "hidden");
    var el = $(".full-start__status.my-quality", renderEl);
    if (el.length) el.text(text).removeClass("my-loading");
    else
      rate.append(
        '<div class="full-start__status my-quality">' + text + "</div>"
      );
    rate.css("visibility", "visible");
  }
  function updateFullCardQuality(card, renderEl, qCode, label) {
    setFullCardText(renderEl, translateQuality(qCode, label));
  }
  function updateListCardQuality(cardEl, qCode, label) {
    var view = cardEl.querySelector(".card__view");
    if (!view) return;
    var txt = translateQuality(qCode, label);
    var olds = view.getElementsByClassName("card__quality");
    while (olds.length) olds[0].parentNode.removeChild(olds[0]);
    var div = document.createElement("div");
    div.className = "card__quality";
    div.innerHTML = "<div>" + txt + "</div>";
    view.appendChild(div);
    repositionQuality(view);
  }

  // ---- Универсальный fetch+update ----
  function fetchAndUpdate(cardEl, card, isFull) {
    if (!cardEl || !card) return;
    var type = getCardType(card),
      key = allQUALITY_CONFIG.CACHE_VERSION + "_" + type + "_" + card.id,
      override = allQUALITY_CONFIG.MANUAL_OVERRIDES[card.id];
    if (override) {
      isFull
        ? updateFullCardQuality(card, cardEl, null, override.full_label)
        : updateListCardQuality(cardEl, null, override.full_label);
      return;
    }
    if (type === "tv" && !allQUALITY_CONFIG.DISPLAY.SHOW_QUALITY_FOR_TV_SERIES)
      return;
    var cache = getCache(key);
    if (cache) {
      isFull
        ? updateFullCardQuality(
            card,
            cardEl,
            cache.quality_code,
            cache.full_label
          )
        : updateListCardQuality(cardEl, cache.quality_code, cache.full_label);
      if (
        Date.now() - cache.timestamp >
        allQUALITY_CONFIG.CACHE.REFRESH_THRESHOLD_MS
      ) {
        getBestReleaseFromJacred(normalizeCard(card), card.id).then(function (res) {
          if (!res || res.quality === "NO") return;
          setCache(key, res);
          isFull
            ? updateFullCardQuality(card, cardEl, res.quality, res.full_label)
            : updateListCardQuality(cardEl, res.quality, res.full_label);
        });
      }
      return;
    }
    if (isFull) setFullCardText(cardEl, "Загрузка...");
    getBestReleaseFromJacred(normalizeCard(card), card.id).then(function (res) {
      if (!res || res.quality === "NO") return;
      setCache(key, res);
      isFull
        ? updateFullCardQuality(card, cardEl, res.quality, res.full_label)
        : updateListCardQuality(cardEl, res.quality, res.full_label);
    });
  }

  // ---- Обработчики карточек ----
  function handleFullCard(card, renderEl) {
    fetchAndUpdate(renderEl, card, true);
  }
  function handleListCard(cardEl) {
    if (!cardEl || cardEl.hasAttribute("data-my-quality-processed")) return;
    cardEl.setAttribute("data-my-quality-processed", "true");
    fetchAndUpdate(cardEl, cardEl.card_data, false);
  }
  function handleCardReposition(cardEl) {
    var view = cardEl.querySelector(".card__view");
    if (!view) return;
    repositionQuality(view);
    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.type === "childList" || m.type === "attributes")
          repositionQuality(view);
      });
    });
    mo.observe(view, { attributes: true, childList: true, subtree: true });
  }

  // ---- MutationObserver для всех новых карточек ----
  var observer = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      Array.prototype.forEach.call(m.addedNodes, function (node) {
        if (node.nodeType !== 1) return;
        if (node.classList && node.classList.contains("card")) {
          handleListCard(node);
          handleCardReposition(node);
        }
        if (node.querySelectorAll) {
          Array.prototype.forEach.call(
            node.querySelectorAll(".card"),
            function (c) {
              handleListCard(c);
              handleCardReposition(c);
            }
          );
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  function setupQualitySettings() {
    Lampa.SettingsApi.addComponent({
      component: "quality_settings",
      name: "Качество на постерах",
       icon: '<img src="data:image/png;base64,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" alt="video-call">',
     });

    // Ввод своего прокси
    Lampa.SettingsApi.addParam({
      component: "quality_settings",
      param: {
        name: "custom_jacred_proxy",
        type: "input",
        values: localStorage.getItem("customJacredProxy") || "",
        placeholder: "Например: https://corsproxy.io/?",
        default: localStorage.getItem("customJacredProxy") || "",
      },
      field: {
        name: "Добавить свой прокси",
        description:
          "Добавьте свой CORS-прокси (начинается с http/https) для jacred.xyz. JacRed нужен для отображения качества на постерах. Добавленный CORS-прокси станет первым в списке бесплатных,",
      },
      onChange: function (value) {
        if (value && typeof value === "string") {
          localStorage.setItem("customJacredProxy", value);

          // добавляем в список PROXY_LIST динамически
          if (allQUALITY_CONFIG && allQUALITY_CONFIG.JACRED) {
            // убираем старый кастомный
            allQUALITY_CONFIG.JACRED.PROXY_LIST =
              allQUALITY_CONFIG.JACRED.PROXY_LIST.filter(function (p) {
                return p !== localStorage.getItem("customJacredProxy");
              });

            // добавляем новый в начало списка
            allQUALITY_CONFIG.JACRED.PROXY_LIST.unshift(value);
          }

          Lampa.Noty.show("Добавлен свой прокси: " + value);
        }
      },
    });

    // Кнопка очистить кастомный прокси
    Lampa.SettingsApi.addParam({
      component: "quality_settings",
      param: {
        name: "reset_custom_proxy",
        type: "button",
        default: false,
      },
      field: {
        name: "Сбросить прокси",
        description: "Удалить свой прокси из настроек.",
      },
      onChange: function () {
        localStorage.removeItem("customJacredProxy");
        if (allQUALITY_CONFIG && allQUALITY_CONFIG.JACRED) {
          // можно восстановить дефолтные без кастомного
          allQUALITY_CONFIG.JACRED.PROXY_LIST = [
            "https://corsproxy.io/?",
            "https://api.allorigins.win/raw?url=",
            "https://yacdn.org/proxy/",
            "https://cors-anywhere.herokuapp.com/",
            "https://thingproxy.freeboard.io/fetch/",
          ];
        }
        Lampa.Noty.show("Свой прокси сброшен");
      },
    });

    // Кнопка тестирования прокси
    Lampa.SettingsApi.addParam({
      component: "quality_settings",
      param: {
        name: "test_proxy",
        type: "button",
        default: false,
      },
      field: {
        name: "Тестировать прокси",
        description: "Проверить работу текущих прокси",
      },
      onChange: function() {
        testAllProxies();
      },
    });
  }

  function testAllProxies() {
    var testUrl = "https://jacred.xyz/api/v1.0/torrents?search=test&year=2020";
    
    allQUALITY_CONFIG.JACRED.PROXY_LIST.forEach(function(proxy, index) {
      var proxiedUrl = proxy + (proxy.includes('?') ? encodeURIComponent(testUrl) : testUrl);
      
      fetchWithTimeout(proxiedUrl, 5000)
        .then(function() {
          Lampa.Noty.show("Прокси " + (index + 1) + " работает");
        })
        .catch(function() {
          Lampa.Noty.show("Прокси " + (index + 1) + " не работает", 5000);
        });
    });
  }

  // ---- Инициализация ----
  function init() {
    if (window.lampaQualityPlugin) return;
    window.lampaQualityPlugin = true;
    Array.prototype.forEach.call(
      document.querySelectorAll(".card"),
      function (c) {
        handleListCard(c);
        handleCardReposition(c);
      }
    );
    Lampa.Listener.follow("full", function (e) {
      if (e.type === "complite" && e && e.data && e.data.movie) {
        var renderEl =
          e.object && e.object.activity && e.object.activity.render
            ? e.object.activity.render()
            : null;

        handleFullCard(e.data.movie, renderEl);
      }
    });
  }

  init();
  setupQualitySettings();

  // ---- JacRed fetch ----
  function getBestReleaseFromJacred(card, cardId) {
    if (!allQUALITY_CONFIG.JACRED.URL) {

      return Promise.resolve(null);
    }
    
    var year = (card.release_date || "").slice(0, 4);
    if (!year || isNaN(parseInt(year, 10))) {
      return Promise.resolve(null);
    }

    // Проверяем, что есть что искать
    if (!card.original_title && !card.title) {
      return Promise.resolve(null);
    }

    var uid = Lampa.Storage.get("lampac_unic_id", "") || "";
    
    function buildUrl(q, exact) {
      // Нормализация запроса - удаляем лишние символы
      var normalizedQuery = q.replace(/[^\w\sа-яА-ЯёЁ\-]/gi, '').trim();
      
      return (
        allQUALITY_CONFIG.JACRED.PROTOCOL +
        allQUALITY_CONFIG.JACRED.URL +
        "/api/v1.0/torrents?search=" +
        encodeURIComponent(normalizedQuery) +
        "&year=" +
        encodeURIComponent(year) +
        (exact ? "&exact=true" : "") +
        (uid ? "&uid=" + encodeURIComponent(uid) : "")
      );
    }
    
    var strategies = [];
    if ((card.original_title || "").replace(/\s+/g, "").length)
      strategies.push({
        title: card.original_title,
        exact: true,
        name: "original exact",
      });
    if ((card.title || "").replace(/\s+/g, "").length)
      strategies.push({ title: card.title, exact: true, name: "title exact" });
      
    function tryStrategy(idx) {
      if (idx >= strategies.length) return Promise.resolve(null);
      var st = strategies[idx];
      var url = buildUrl(st.title, st.exact);
      return fetchViaProxies(url, cardId).then(
        function (txt) {
          var arr;
          try {
            arr = JSON.parse(txt);
          } catch (e) {
            arr = [];
          }
          if (!arr || !arr.length) return tryStrategy(idx + 1);
          var best = null,
            bestQ = -1,
            searchYear = parseInt(year, 10);
          for (var k = 0; k < arr.length; k++) {
            var t = arr[k],
              ttl = (t.title || "").toLowerCase(),
              q = t.quality || 0;
            if (!q) {
              if (/2160p|4k/.test(ttl)) q = 2160;
              else if (/1080p/.test(ttl)) q = 1080;
              else if (/720p/.test(ttl)) q = 720;
              else if (/480p/.test(ttl)) q = 480;
              else if (/telesync|ts/.test(ttl)) q = 1;
              else if (/camrip|камрип/.test(ttl)) q = 2;
              else q = 0;
            }
            if (!q) continue;
            var ty = parseInt(t.relased, 10);
            if (!ty || isNaN(ty) || ty < 1900) {
              var m = t.title && t.title.match(/(^|[^\d])(\d{4})([^\d]|$)/);
              ty = m ? parseInt(m[2], 10) : 0;
            }
            if (ty && ty !== searchYear) continue;
            if (
              q > bestQ ||
              (q === bestQ &&
                t.title &&
                best &&
                t.title.length > best.title.length)
            ) {
              bestQ = q;
              best = t;
            }
          }
          if (best) {
            return { quality: bestQ, full_label: best.title };
          }
          return tryStrategy(idx + 1);
        },
        function () {
          return tryStrategy(idx + 1);
        }
      );
    }
    return tryStrategy(0);
  }
})();
