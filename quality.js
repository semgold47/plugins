(function () {
  "use strict";
  var allQUALITY_CONFIG = {
    CACHE_VERSION: 2,
    LOGGING: { GENERAL: true, QUALITY: true, CARDLIST: false },
    CACHE: {
      VALID_TIME_MS: 3 * 24 * 60 * 60 * 1000,
      REFRESH_THRESHOLD_MS: 12 * 60 * 60 * 1000,
      KEY: "lampa_quality_cache",
    },
    JACRED: {
      PROTOCOL: "https://",
      HOST: "jacred.xyz",
      API_PATH: "/api/v1.0/torrents",
      PROXY_LIST: [
        "https://api.codetabs.com/v1/proxy?quest=",
        "https://cors.convertapi.com/",
        "https://cors.bridged.cc/",
        "https://api.allorigins.win/raw?url=",
        "https://corsproxy.io/?",
        "https://proxy.cors.sh/",
      ],
      TIMEOUT_MS: 15000,
    },
    DISPLAY: {
      SHOW_QUALITY_FOR_TV_SERIES: true,
    },
    MANUAL_OVERRIDES: {
        // 4K releases
        90802: { quality_code: 2160, full_label: "4K Web-DLRip" },
        20873: { quality_code: 2160, full_label: "4K BDRip" },
        1128655: { quality_code: 2160, full_label: "4K Web-DL" },
        57778: { quality_code: 2160, full_label: "4K Web-DL" },
        22101: { quality_code: 2160, full_label: "4K BluRay" },
        43001: { quality_code: 2160, full_label: "4K BDRemux" },
        52002: { quality_code: 2160, full_label: "4K Hybrid" },
        
        // 1080p releases
        9564: { quality_code: 1080, full_label: "1080 BDRemux" },
        21028: { quality_code: 1080, full_label: "1080 BDRemux" },
        46010: { quality_code: 1080, full_label: "1080 Web-DLRip" },
        32334: { quality_code: 1080, full_label: "1080 Web-DLRip" },
        20932: { quality_code: 1080, full_label: "1080 HDTVRip" },
        20977: { quality_code: 1080, full_label: "HDTVRip-AVC" },
        12801: { quality_code: 1080, full_label: "1080 BluRay" },
        15501: { quality_code: 1080, full_label: "1080 WEB-DL" },
        18902: { quality_code: 1080, full_label: "1080 WEBRip" },
        23001: { quality_code: 1080, full_label: "1080 Hybrid" },
        
        // 720p releases
        33645: { quality_code: 720, full_label: "720p HDTVRip" },
        10201: { quality_code: 720, full_label: "720p BluRay" },
        13201: { quality_code: 720, full_label: "720p WEB-DL" },
        17501: { quality_code: 720, full_label: "720p WEBRip" },
        21001: { quality_code: 720, full_label: "720p HDTV" },
        
        // SD releases
        801: { quality_code: 480, full_label: "DVD Rip" },
        901: { quality_code: 480, full_label: "WEB-DL" },
        1101: { quality_code: 480, full_label: "WEBRip" },
        1201: { quality_code: 480, full_label: "HDTV" },
        
        // Special cases
        500: { quality_code: 0, full_label: "CAM" },
        600: { quality_code: 0, full_label: "TS" },
        700: { quality_code: 0, full_label: "SCR" },
    },
  };

  // ---- CSS ----
  var styleQUALITY = 
    '<style id="lampa_quality_styles">' +
    ".card__view{position:relative!important}" +
    ".card__quality{position:absolute!important; background:rgba(26,26,23,.61)!important;z-index:10;font-size:.7em;max-width:calc(100% - 1em)!important;border-radius:1.3em!important;border:1.1px solid #fff!important;padding:.2em .2em}" +
    ".card__quality div{text-transform:uppercase!important;font-family:'Roboto Condensed','Arial Narrow',Arial,sans-serif!important;font-weight:700!important;letter-spacing:.5px!important;font-size:1.1em!important;color:#fff;padding:.1em .5em .08em .4em!important;white-space:nowrap;text-shadow:.5px .5px 1px rgba(0,0,0,.3)!important}" +
    "</style>";
  
  if (!document.getElementById("lampa_quality_styles")) {
    document.head.insertAdjacentHTML('beforeend', styleQUALITY);
  }

  // ---- утилиты ----
  function getCardType(c) {
    var t = c.media_type || c.type;
    return t === "movie" || t === "tv" ? t : 
           (c.name || c.original_name) ? "tv" : "movie";
  }

  function getCache(k) {
    var c = Lampa.Storage.get(allQUALITY_CONFIG.CACHE.KEY) || {};
    var i = c[k];
    return i && Date.now() - i.timestamp < allQUALITY_CONFIG.CACHE.VALID_TIME_MS ? i : null;
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

  function translateQuality(title) {
    if (!title) return "";
    
    var s = title.toLowerCase();
    
    // Ищем разрешение
    var resolution = "";
    if (/2160p|4k|4к/.test(s)) resolution = "4K";
    else if (/1080p/.test(s)) resolution = "1080";
    else if (/720p/.test(s)) resolution = "720";
    else if (/480p/.test(s)) resolution = "SD";
    
    // Ищем источник (от лучшего к худшему)
    var source = "";
    if (/blu-?ray|bd(?:re)?mux|bdrip|brrip|remux|bd(?:$|\s)|blurayrip|blueray/i.test(s)) {
        source = "BluRay";
    } else if (/(?:web-?dl|webdl)(?:rip)?|dlrip|itunes(?:hd)?|amazonhd|netflixhd|disney[+-]?hd?/i.test(s)) {
        source = "Web-DL";
    } else if (/web-?rip|webrip|streamrip|hulu|maxrip|apple tv|atvp/i.test(s)) {
        source = "WEBRip";
    } else if (/hdtv|pdtv|dsr|satrip|dttv|dth|dvb|tvrip|episode/i.test(s)) {
        source = "HDTV";
    } else if (/dvd(?:rip)?|dvd(?:$|\s)|dvdr|dvd5|dvd9|dvd-full|customdvd|retail dvd/i.test(s)) {
        source = "DVD";
    } else if (/vhsrip|tvrip|tv-?rip|camrip|telecine|ts|telesync|wp|workprint|scr(?:eener)?|dvdscr|bdscr|webscr|r5|rc/i.test(s)) {
        source = "Low Quality";
    }
    
    // Собираем результат
    var result = "";
    if (resolution && source) result = resolution + " " + source;
    else if (resolution) result = resolution;
    else if (source) result = source;
    else {
      var words = title.split(/[\/,]/)[0].trim().split(/\s+/);
      if (words.length > 3) {
        result = words.slice(0, 3).join(' ');
      } else {
        result = title;
      }
    }
    
    return result;
  }

  // Улучшенная функция fetch с повторными попытками
  function fetchWithRetry(url, options = {}, retries = 3, backoff = 300) {
    return new Promise((resolve, reject) => {
      const attempt = (n) => {
        fetch(url, options)
          .then(resolve)
          .catch((error) => {
            if (n === 1) {
              reject(error);
            } else {
              setTimeout(() => attempt(n - 1), backoff);
            }
          });
      };
      attempt(retries);
    });
  }

  function fetchWithTimeout(url, ms) {
    return new Promise(function (resolve, reject) {
      var timeout = setTimeout(function () {
        reject(new Error("timeout"));
      }, ms);
      
      fetchWithRetry(url, {}, 2, 500)
        .then(function(resp) {
          clearTimeout(timeout);
          if (!resp.ok) reject(new Error("status " + resp.status));
          else resp.text().then(resolve).catch(reject);
        })
        .catch(function(e) {
          clearTimeout(timeout);
          reject(e);
        });
    });
  }

  function buildProxyUrl(proxy, url) {
    if (proxy.includes('?')) {
      return proxy + encodeURIComponent(url);
    } else if (proxy.endsWith('/')) {
      return proxy + url;
    } else {
      return proxy + '?' + encodeURIComponent(url);
    }
  }

  // Улучшенная функция для работы с прокси
  function fetchViaProxies(rawUrl) {
    var proxies = [...allQUALITY_CONFIG.JACRED.PROXY_LIST];
    var customProxy = localStorage.getItem("customJacredProxy");
    
    // Добавляем кастомный прокси в начало списка если есть
    if (customProxy && customProxy.trim()) {
      proxies.unshift(customProxy);
    }
    
    // Пробуем сначала без прокси (иногда работает)
    var directAttempt = fetchWithTimeout(rawUrl, 8000)
      .then(function(response) {
        if (allQUALITY_CONFIG.LOGGING.GENERAL) {
          console.log("Direct connection success!");
        }
        return response;
      })
      .catch(function(error) {
        if (allQUALITY_CONFIG.LOGGING.GENERAL) {
          console.log("Direct connection failed:", error.message);
        }
        throw error; // Продолжаем к прокси
      });

    function tryProxy(index) {
      if (index >= proxies.length) {
        return Promise.reject(new Error("all proxies failed"));
      }

      var proxy = proxies[index];
      var proxUrl = buildProxyUrl(proxy, rawUrl);

      if (allQUALITY_CONFIG.LOGGING.GENERAL) {
        console.log("Trying proxy [" + (index + 1) + "/" + proxies.length + "]:", proxy);
      }

      return fetchWithTimeout(proxUrl, allQUALITY_CONFIG.JACRED.TIMEOUT_MS)
        .then(function(response) {
          if (allQUALITY_CONFIG.LOGGING.GENERAL) {
            console.log("Success with proxy:", proxy);
          }
          return response;
        })
        .catch(function(error) {
          if (allQUALITY_CONFIG.LOGGING.GENERAL) {
            console.log("Proxy failed:", proxy, "Error:", error.message);
          }
          return tryProxy(index + 1);
        });
    }

    // Сначала пробуем прямое соединение, затем прокси
    return directAttempt.catch(function() {
      return tryProxy(0);
    });
  }

  // ---- UI функции ----
  function setFullCardText(renderEl, text) {
    if (!renderEl) return;
    var details = $(".full-start-new__details", renderEl);
    if (!details.length) return;
    
    // Ищем элемент с текстом, начинающимся на "Качество: "
    var qualitySpan = $("span", details).filter(function() {
      return $(this).text().indexOf("Качество:") === 0;
    });
    
    if (qualitySpan.length) {
      // Создаем новый элемент с сохранением слова "Качество: "
      var newSpan = $('<span class="my-quality">Качество: ' + text + '</span>');
      
      // Заменяем старый элемент
      qualitySpan.replaceWith(newSpan);
    } else {
      // Если не нашли, добавляем в конец с разделителем
      details.append('<span class="full-start-new__split">●</span>');
      details.append('<span class="my-quality">Качество: ' + text + '</span>');
    }
  }

  function updateListCardQuality(cardEl, label) {
    var view = cardEl.querySelector(".card__view");
    if (!view) return;
    
    var txt = translateQuality(label);
    
    var olds = view.getElementsByClassName("card__quality");
    while (olds.length > 0) {
      olds[0].parentNode.removeChild(olds[0]);
    }
    
    var div = document.createElement("div");
    div.className = "card__quality";
    div.innerHTML = "<div>" + txt + "</div>";
    view.appendChild(div);
    
    var marker = view.querySelector(".card__marker");
    div.style.bottom = marker ? "2.7em" : "10px";
  }

  // ---- Основная логика ----
  function fetchAndUpdate(cardEl, card, isFull) {
    if (!cardEl || !card) return;
    
    var type = getCardType(card);
    var key = allQUALITY_CONFIG.CACHE_VERSION + "_" + type + "_" + card.id;
    var override = allQUALITY_CONFIG.MANUAL_OVERRIDES[card.id];
    
    if (override) {
      if (isFull) {
        setFullCardText(cardEl, override.full_label);
      } else {
        updateListCardQuality(cardEl, override.full_label);
      }
      return;
    }
    
    if (type === "tv" && !allQUALITY_CONFIG.DISPLAY.SHOW_QUALITY_FOR_TV_SERIES) return;
    
    var cache = getCache(key);
    if (cache) {
      if (isFull) {
        setFullCardText(cardEl, translateQuality(cache.full_label));
      } else {
        updateListCardQuality(cardEl, cache.full_label);
      }
      
      if (Date.now() - cache.timestamp > allQUALITY_CONFIG.CACHE.REFRESH_THRESHOLD_MS) {
        getBestReleaseFromJacred(card).then(function(res) {
          if (res) {
            setCache(key, res);
            if (isFull) {
              setFullCardText(cardEl, translateQuality(res.full_label));
            } else {
              updateListCardQuality(cardEl, res.full_label);
            }
          }
        }).catch(function(error) {
          // Игнорируем ошибки при фоновом обновлении
        });
      }
      return;
    }
    
    if (isFull) {
      setFullCardText(cardEl, "Загрузка...");
    }
    
    getBestReleaseFromJacred(card).then(function(res) {
      if (res) {
        setCache(key, res);
        if (isFull) {
          setFullCardText(cardEl, translateQuality(res.full_label));
        } else {
          updateListCardQuality(cardEl, res.full_label);
        }
      } else if (isFull) {
        setFullCardText(cardEl, "Не найдено");
      }
    }).catch(function(error) {
      if (allQUALITY_CONFIG.LOGGING.GENERAL) {
        console.log("Error fetching quality for card:", card.title, error);
      }
      if (isFull) {
        setFullCardText(cardEl, "Ошибка загрузки");
      }
    });
  }

  function getBestReleaseFromJacred(card) {
    if (!card || (!card.original_title && !card.title)) {
      return Promise.resolve(null);
    }

    var year = (card.release_date || card.first_air_date || "").slice(0, 4);
    if (!year || year === "undefined") {
      return Promise.resolve(null);
    }

    var uid = Lampa.Storage.get("lampac_unic_id", "") || "";
    
    function buildUrl(query, exact) {
      var normalizedQuery = query.replace(/[^\w\sа-яА-ЯёЁ\-]/gi, '').trim();
      if (!normalizedQuery) return null;
      
      var url = allQUALITY_CONFIG.JACRED.PROTOCOL + 
                allQUALITY_CONFIG.JACRED.HOST + 
                allQUALITY_CONFIG.JACRED.API_PATH +
                "?search=" + encodeURIComponent(normalizedQuery) +
                "&year=" + year +
                (exact ? "&exact=true" : "") +
                (uid ? "&uid=" + uid : "");
      return url;
    }
    
    var strategies = [];
    if (card.original_title && card.original_title.trim()) {
      var url1 = buildUrl(card.original_title, true);
      if (url1) strategies.push({
        title: card.original_title,
        exact: true,
        name: "original exact",
        url: url1
      });
      var url3 = buildUrl(card.original_title, false);
      if (url3) strategies.push({
        title: card.original_title,
        exact: false,
        name: "original fuzzy",
        url: url3
      });
    }
    if (card.title && card.title.trim() && card.title !== card.original_title) {
      var url2 = buildUrl(card.title, true);
      if (url2) strategies.push({
        title: card.title, 
        exact: true, 
        name: "title exact",
        url: url2
      });
      var url4 = buildUrl(card.title, false);
      if (url4) strategies.push({
        title: card.title, 
        exact: false, 
        name: "title fuzzy",
        url: url4
      });
    }
    
    if (strategies.length === 0) {
      return Promise.resolve(null);
    }
    
    function tryStrategy(idx) {
      if (idx >= strategies.length) {
        return Promise.resolve(null);
      }
      
      var st = strategies[idx];
      
      if (allQUALITY_CONFIG.LOGGING.GENERAL) {
        console.log("JacRed request:", st.name, st.url);
      }
      
      return fetchViaProxies(st.url).then(
        function(txt) {
          var arr;
          try {
            arr = JSON.parse(txt);
          } catch (e) {
            console.log("JSON parse error:", e, "Response:", txt);
            arr = [];
          }
          
          if (!arr || !arr.length || !Array.isArray(arr)) {
            return tryStrategy(idx + 1);
          }
          
          var best = null;
          var bestQ = -1;
          var searchYear = parseInt(year, 10);
          
          for (var k = 0; k < arr.length; k++) {
            var t = arr[k];
            if (!t || !t.title) continue;
            
            var ttl = t.title.toLowerCase();
            var q = t.quality || 0;
            
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
              var m = t.title.match(/(^|[^\d])(\d{4})([^\d]|$)/);
              ty = m ? parseInt(m[2], 10) : 0;
            }
            
            if (ty && ty !== searchYear) continue;
            
            if (q > bestQ || (q === bestQ && t.title && best && t.title.length > best.title.length)) {
              bestQ = q;
              best = t;
            }
          }
          
          if (best) {
            if (allQUALITY_CONFIG.LOGGING.QUALITY) {
              console.log("Found quality for", card.title, ":", best.title, "quality:", bestQ);
            }
            return { quality_code: bestQ, full_label: best.title };
          }
          
          return tryStrategy(idx + 1);
        },
        function(error) {
          if (allQUALITY_CONFIG.LOGGING.GENERAL) {
            console.log("Strategy failed:", st.name, error);
          }
          return tryStrategy(idx + 1);
        }
      );
    }
    
    return tryStrategy(0);
  }

  // ---- Обработчики карточек ----
  function handleListCard(cardEl) {
    if (!cardEl || cardEl.hasAttribute("data-my-quality-processed")) return;
    cardEl.setAttribute("data-my-quality-processed", "true");
    
    if (cardEl.card_data) {
      fetchAndUpdate(cardEl, cardEl.card_data, false);
    }
  }

  function handleCardReposition(cardEl) {
    var view = cardEl.querySelector(".card__view");
    if (!view) return;
    
    var qualityEl = view.querySelector(".card__quality");
    if (qualityEl) {
      var marker = view.querySelector(".card__marker");
      qualityEl.style.bottom = marker ? "2.7em" : "10px";
    }
  }

  // ---- Инициализация ----
  function init() {
    if (window.lampaQualityPlugin) return;
    window.lampaQualityPlugin = true;
    
    var cards = document.querySelectorAll(".card");
    for (var i = 0; i < cards.length; i++) {
      handleListCard(cards[i]);
      handleCardReposition(cards[i]);
    }
    
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          var node = mutation.addedNodes[i];
          if (node.nodeType === 1) {
            if (node.classList && node.classList.contains("card")) {
              handleListCard(node);
              handleCardReposition(node);
            }
            
            if (node.querySelectorAll) {
              var childCards = node.querySelectorAll(".card");
              for (var j = 0; j < childCards.length; j++) {
                handleListCard(childCards[j]);
                handleCardReposition(childCards[j]);
              }
            }
          }
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    Lampa.Listener.follow("full", function(e) {
      if (e.type === "complite" && e.data && e.data.movie) {
        var renderEl = e.object && e.object.activity && e.object.activity.render ? 
                       e.object.activity.render() : null;
        if (renderEl) {
          fetchAndUpdate(renderEl, e.data.movie, true);
        }
      }
    });
  }

  // ---- НАСТРОЙКИ ----
  function setupQualitySettings() {
    Lampa.SettingsApi.addComponent({
      component: "quality_settings",
      name: "Качество на постерах",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M18 7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4V7zm-8 8c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1zm4 0c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1zm4 0c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1z"/></svg>',
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
        description: "Добавьте свой CORS-прокси для jacred.xyz. Этот прокси будет использоваться первым.",
      },
      onChange: function (value) {
        if (value && typeof value === "string") {
          localStorage.setItem("customJacredProxy", value);
          Lampa.Noty.show("Добавлен свой прокси: " + value);
        } else {
          localStorage.removeItem("customJacredProxy");
          Lampa.Noty.show("Прокси удален");
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
        Lampa.Noty.show("Свой прокси сброшен");
      },
    });

    // Настройка отображения качества для сериалов
    Lampa.SettingsApi.addParam({
      component: "quality_settings",
      param: {
        name: "show_tv_quality",
        type: "toggle",
        value: allQUALITY_CONFIG.DISPLAY.SHOW_QUALITY_FOR_TV_SERIES,
      },
      field: {
        name: "Показывать качество для сериалов",
        description: "Включите, чтобы отображать качество для сериалов",
      },
      onChange: function (value) {
        allQUALITY_CONFIG.DISPLAY.SHOW_QUALITY_FOR_TV_SERIES = value;
        Lampa.Noty.show("Настройка сохранена");
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

    // Кнопка очистки кэша
    Lampa.SettingsApi.addParam({
      component: "quality_settings",
      param: {
        name: "clear_cache",
        type: "button",
        default: false,
      },
      field: {
        name: "Очистить кэш качества",
        description: "Удалить все сохраненные данные о качестве",
      },
      onChange: function() {
        Lampa.Storage.set(allQUALITY_CONFIG.CACHE.KEY, {});
        Lampa.Noty.show("Кэш качества очищен");
      },
    });
  }

  function testAllProxies() {
    var testUrl = "https://jacred.xyz/api/v1.0/torrents?search=test&year=2020";
    var workingProxies = 0;
    var testedProxies = 0;
    var totalProxies = allQUALITY_CONFIG.JACRED.PROXY_LIST.length;
    
    if (localStorage.getItem("customJacredProxy")) {
      totalProxies++;
    }
    
    Lampa.Noty.show("Тестируем " + totalProxies + " прокси...");
    
    function testProxy(proxy, index) {
      var proxiedUrl = buildProxyUrl(proxy, testUrl);
      
      return fetchWithTimeout(proxiedUrl, 8000)
        .then(function() {
          workingProxies++;
          Lampa.Noty.show("✓ Прокси " + (index + 1) + " работает: " + proxy);
          return true;
        })
        .catch(function(error) {
          Lampa.Noty.show("✗ Прокси " + (index + 1) + " не работает: " + proxy, 3000);
          return false;
        })
        .finally(function() {
          testedProxies++;
          if (testedProxies === totalProxies) {
            setTimeout(function() {
              Lampa.Noty.show("Тестирование завершено. Работает: " + workingProxies + " из " + totalProxies + " прокси");
            }, 500);
          }
        });
    }
    
    var customProxy = localStorage.getItem("customJacredProxy");
    
    // Тестируем кастомный прокси первым
    if (customProxy) {
      testProxy(customProxy, 0);
    }
    
    // Тестируем остальные прокси
    allQUALITY_CONFIG.JACRED.PROXY_LIST.forEach(function(proxy, index) {
      testProxy(proxy, customProxy ? index + 1 : index);
    });
  }

  // Запускаем
  if (window.Lampa) {
    init();
    setupQualitySettings();
  } else {
    document.addEventListener("lampaLoaded", function() {
      init();
      setupQualitySettings();
    });
  }
})();
