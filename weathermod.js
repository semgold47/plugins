(function () {
  "use strict";
  var DEFAULT_API_KEY = "";
  var WEATHER_CACHE_KEY = "weatherData";
  var requestInProgress = false;
  var refreshInterval = null;
  var hourlyInterval = null;
  var CACHE_EXPIRATION_MS = 21600000; // 6 часов
  var CACHE_REFRESH_MS = 1800000; // полчаса
  var FORECAST_HOURS = 10; // количество плиток час/погода для отображения в модальном окне
  var API_KEY = localStorage.getItem("weatherApiKey") || DEFAULT_API_KEY;
  var network = new Lampa.Reguest();
  var city = localStorage.getItem("weatherLocation") || "Санкт-Петербург";
  var html,
    modalHtml,
    weatherData = {};
  var lastUpdateTime = 0;

  function WeatherInterface() {
    var LAST_API_UPDATE_KEY = "weatherLastApiUpdate";
    var API_UPDATE_INTERVAL = 21600000; //  6 часов
    var lastUpdateHour = -1;

    function convertTime12to24(timeStr) {
      if (!timeStr) {
        return {
          hour: 0,
          formatted: "00:00",
        };
      }

      var parts = timeStr.split(" ");
      var timePart = parts[0];
      var period = (parts[1] || "").toUpperCase();
      var timeComponents = timePart.split(":");
      var hour = parseInt(timeComponents[0], 10) || 0;
      var minute = parseInt(timeComponents[1], 10) || 0;
      if (period === "PM" && hour < 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      return {
        hour: hour,
        formatted: String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0"),
      };
    }
    function translateMoonPhase(phase) {
      var translations = {
        "New Moon": "Новолуние",
        "Waxing Crescent": "Растущий серп",
        "First Quarter": "Первая четверть",
        "Waxing Gibbous": "Растущая луна",
        "Full Moon": "Полнолуние",
        "Waning Gibbous": "Убывающая луна",
        "Last Quarter": "Последняя четверть",
        "Waning Crescent": "Старая луна",
      };
      return translations[phase] || phase;
    }

    function getCurrentTime() {
      var timeText = $(".head__time-now").text();
      if (!timeText || timeText.indexOf(":") === -1) {
        var now = new Date();
        return {
          hour: now.getHours(),
          minute: now.getMinutes(),
        };
      }

      var timeParts = timeText.split(":");
      return {
        hour: parseInt(timeParts[0], 10) || 0,
        minute: parseInt(timeParts[1], 10) || 0,
      };
    }

    function getWeatherUrl(city) {
      return "https://api.weatherapi.com/v1/forecast.json?key=" + API_KEY + "&q=" + city + "&days=7&lang=ru";
    }

    function saveWeatherData(data) {
      var storedData = { timestamp: Date.now(), weather: data };
      Lampa.Storage.set(WEATHER_CACHE_KEY, storedData);
      lastUpdateTime = Date.now();
    }

    function getStoredWeatherData() {
      var storedData = Lampa.Storage.get(WEATHER_CACHE_KEY, {});
      return storedData.weather || null;
    }

    function shouldFetchFromAPI() {
      var storedData = Lampa.Storage.get(WEATHER_CACHE_KEY, {});
      return !storedData.timestamp || Date.now() - storedData.timestamp >= CACHE_EXPIRATION_MS;
    }

    function shouldRefreshFromCache() {
      return Date.now() - lastUpdateTime >= CACHE_REFRESH_MS;
    }

    function getWeatherByCity(city, attempt, forceRefresh) {
      attempt = attempt || 1;
      var useCache = !forceRefresh && !shouldFetchFromAPI();

      if (useCache) {
        var cachedWeather = getStoredWeatherData();
        if (cachedWeather) {
          console.log("Weather", " ☁ Данные о погоде в " + city);
          processWeatherData({ weather: cachedWeather });
          if (shouldRefreshFromCache()) {
            lastUpdateTime = Date.now();
            updateAllWidgets();
            console.log("Weather", " 🔄 Кэш обновлён, погода обновлена во всех виджетах");
          }
          return;
        }
      }

      network.clear();
      network.timeout(4000);
      network.silent(
        getWeatherUrl(city),
        function (weatherResponse) {
          if (!weatherResponse || !Object.keys(weatherResponse).length) {
            if (attempt < 3) {
              setTimeout(function () {
                getWeatherByCity(city, attempt + 1, forceRefresh);
              }, 500);
            } else {
              Lampa.Noty.show("❌ Не удалось получить данные. Проверь API ключ");
            }
          } else {
            weatherData = { weather: weatherResponse };
            saveWeatherData(weatherResponse);
            processWeatherData(weatherData);
            updateAllWidgets();
          }
        },
        function () {
          if (attempt < 3) {
            setTimeout(function () {
              getWeatherByCity(city, attempt + 1, forceRefresh);
            }, 500);
          } else {
            Lampa.Noty.show("❌ Не удалось подключиться к API");
          }
        },
      );
    }

    function updateAllWidgets() {
      var cachedWeather = getStoredWeatherData();
      if (!cachedWeather) return;
      processWeatherData({
        weather: cachedWeather,
      });
      if (modalHtml && modalHtml.length && modalHtml.is(":visible")) {
        updateModalData();
      }
    }

    function processWeatherData(result) {
      if (!result || !result.weather || !result.weather.forecast) {
        var cachedData = Lampa.Storage.get(WEATHER_CACHE_KEY);
        if (cachedData && cachedData.weather && cachedData.weather.forecast) {
          result = cachedData;
        } else {
          console.error("Не удалось получить данные о погоде", result);
          if (html) html.hide();
          return;
        }
      }

      weatherData = result;
      var forecastHour = getCurrentHourForecast(weatherData.weather);
      if (!forecastHour) {
        console.error("Не удалось найти актуальный час прогноза");
        if (html) html.hide();
        return;
      }

      var temp = forecastHour.temp_c;
      var icon = forecastHour.condition.icon;
      $("#weather-temp").text(Math.floor(temp) + "°");
      $("#weather-icon").html('<img src="https:' + icon + '" alt="Weather Icon" style="height:2.8em;">');
      if (html) html.show();
      updateModalData();
    }

    function createWeatherWidget() {
      if ($(".weather-widget").length) return;

      html = $(`
        <div class="head__action cursor-pointer selector weather-temp weather-widget"
            style="align-items:center;justify-content:end;margin:0 0 0 10px;padding:0px;">
            <div id="weather-temp"
                style="margin:0;padding:0;font-weight:bold;
                display:flex;align-items:center;justify-content:end;
                font-size:large;">
            </div>
        </div>

        <div class="head__action weather-widget cursor-pointer weather-icon"
            id="weather-icon"
            style="height:2.8em;margin:0;padding:0;">
        </div>
      `);

      $(".head__actions").append(html);
      return html;
    }

    function createModal() {
    if (modalHtml) return modalHtml;
    $(".weather-modal").remove();
    var isMobile = window.innerWidth < 700;

    modalHtml = $(`
        <div class="modal--large animate weather-modal"
            data-nav="modal"
            tabindex="0"
            style="display:none; position:fixed; inset:0; z-index:1001; padding:${isMobile ? "14em 0.5em 0" : "24px"}; box-sizing:border-box;">

        <div class="modal__backdrop"
            style="position:absolute; inset:0; background: radial-gradient(circle at top right, rgba(80,140,255,0.16), transparent 30%), radial-gradient(circle at bottom left, rgba(0,220,255,0.12), transparent 30%), rgba(0,0,0,0.76); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);">
        </div>

        <div class="modal__content"
            style="position:relative; width:100%; max-width:${isMobile ? "100%" : "1450px"}; height:calc(100vh - ${isMobile ? "16px" : "48px"}); max-height:calc(100vh - ${isMobile ? "16px" : "48px"}); padding-top: 0.6em; margin:0 auto; overflow:hidden; border-radius:${isMobile ? "18px" : "34px"}; background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08); display:flex; flex-direction:column;">

            <div class="modal__head" style="padding:${isMobile ? "0.7em 0.7em 0 0.7em" : "0 0.9em "}; margin-bottom: 0.1em; flex-shrink:0;">
            <div style="display:flex; align-items:center; justify-content:space-between;">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div id="weather-modal-city" style="font-size:${isMobile ? "1em" : "1.1em"}; font-weight:800; color:#fff; line-height:1.1; word-break:break-word;">Погода</div>
                <div id="weather-update-time" style="color:rgba(255,255,255,0.55); font-size:${isMobile ? "0.8em" : "0.95em"};"></div>
                </div>
            </div>
            
            <div id="hourly-forecast" class="full-episodes" style="display:flex; gap: 1em; overflow-x:auto; overflow-y:hidden; margin: 1em 0 0.5em 0;"></div>

            <div class="navigation-tabs" style="background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));">
                <div class="navigation-tabs__button selector active" data-tab="current">Текущая</div>
                <div class="navigation-tabs__button selector" data-tab="hourly">Следующий час</div>
                <div class="navigation-tabs__button selector" data-tab="details">День</div>
            </div>
            </div>

            <div class="modal__body" style="flex:1; min-height:0; overflow:hidden; padding:${isMobile ? "0 10px" : "0 0.9em"};">
            <div class="scroll scroll--over" style="height:100%; overflow-y:auto; overflow-x:hidden;">

                <div class="weather-tab" data-tab-content="current" style="width:100%; display:flex; flex-direction:${isMobile ? "column" : "row"}; gap:${isMobile ? "12px" : "18px"}; align-items:flex-start; padding:${isMobile ? "12px" : "18px"}; border-radius:${isMobile ? "18px" : "28px"}; background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)); border: 1px solid rgba(255,255,255,0.08); overflow:auto;">
                <div style="width:100%;">
                    <div id="weather-current-details" style="display:grid; grid-template-columns:${isMobile ? "1fr" : "repeat(auto-fit,minmax(190px,2fr))"}; gap:${isMobile ? "10px" : "16px"};"></div>
                </div>
                </div>

                <div class="weather-tab" data-tab-content="hourly" style="width:100%; display:none; padding:${isMobile ? "12px" : "18px"}; border-radius:${isMobile ? "18px" : "28px"}; background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)); border: 1px solid rgba(255,255,255,0.08);">
                <div id="hourly-forecast2" style="display:grid; grid-template-columns:${isMobile ? "1fr" : "repeat(auto-fit,minmax(190px,2fr))"}; gap:${isMobile ? "10px" : "16px"};"></div>
                </div>

                <div class="weather-tab" data-tab-content="details" style="width:100%; display:none; padding:${isMobile ? "12px" : "18px"}; border-radius:${isMobile ? "18px" : "28px"}; background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)); border: 1px solid rgba(255,255,255,0.08);">
                <div id="weather-details-content" style="display:grid; grid-template-columns:${isMobile ? "1fr" : "repeat(auto-fit,minmax(190px,2fr))"}; gap:${isMobile ? "10px" : "16px"};"></div>
                </div>
                
            </div>
            </div>
        </div>
        </div>
    `);

    $("body").append(modalHtml);
    return modalHtml;
    }
    function getCurrentHourForecast(data) {
      if (!data?.forecast?.forecastday?.length) return null;
      const now = new Date();
      const forecastHours = data.forecast.forecastday[0].hour;
      const nowTimeStr =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        " " +
        String(now.getHours()).padStart(2, "0") +
        ":00";
      let hourData = forecastHours.find((h) => h.time === nowTimeStr);
      if (!hourData) {
        const currentHour = now.getHours();
        for (let i = currentHour; i >= 0; i--) {
          const tryTime = nowTimeStr.replace(/\d{2}:00$/, String(i).padStart(2, "0") + ":00");
          hourData = forecastHours.find((h) => h.time === tryTime);
          if (hourData) break;
        }
      }
      return hourData || forecastHours[0];
    }

    function getNextHourForecast(data) {
      if (!data?.forecast?.forecastday?.length) return null;
      const now = new Date();
      const forecastHours = data.forecast.forecastday[0].hour;
      const nextHour = (now.getHours() + 1) % 24;
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const targetTime = `${dateStr} ${String(nextHour).padStart(2, "0")}:00`;
      let hourData = forecastHours.find((h) => h.time === targetTime);
      return hourData || forecastHours[0];
    }

    function updateModalData() {
      if (!modalHtml) createModal();
      var location = weatherData.weather && weatherData.weather.location;
      var forecastHourCurrent = getCurrentHourForecast(weatherData.weather);
      var forecastHourNext = getNextHourForecast(weatherData.weather);
      var forecast =
        weatherData.weather &&
        weatherData.weather.forecast &&
        weatherData.weather.forecast.forecastday &&
        weatherData.weather.forecast.forecastday[0];
      if (!location || !forecastHourCurrent || !forecast) {console.error("Weather", "Не удалось получить данные для модального окна", weatherData);
        return;
      }

      $("#weather-modal-city").text("Погода в " + location.name);
      $("#weather-update-time").text("Обновлено: " + (weatherData.weather.current.last_updated || ""));

      function createRow(label, value) {
        var isMobile = window.innerWidth < 700;
        // МОБИЛА = обычные строки
        if (isMobile) {
          return `
                <div class="weather-data-row"
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        gap:16px;
                        padding:14px 18px;
                        margin-bottom:10px;
                        border-radius:18px;
                        background:
                          linear-gradient(
                            145deg,
                            rgba(255,255,255,0.08),
                            rgba(255,255,255,0.03)
                          );
                        border:1px solid rgba(255,255,255,0.06);
                        backdrop-filter:blur(10px);
                        box-shadow:
                          0 8px 24px rgba(0,0,0,0.18),
                          inset 0 1px 0 rgba(255,255,255,0.04);
                    ">

                  <div style="
                        color:rgba(255,255,255,0.62);
                        font-weight:800;
                        flex:1;
                    ">
                    ${label}
                  </div>

                  <div style="
                        color:#fff;
                        font-size:1.05em;
                        font-weight:700;
                        text-align:right;
                    ">
                    ${value}
                  </div>
                </div>
              `;
        }

        // TV /DESKTOP = плитки
        return `
              <div class="weather-data-tile"
                  style="
                      position:relative;
                      min-height:60px;
                      padding: 12px 5px;
                      border-radius:28px;
                      overflow:hidden;
                      display:flex;
                      align-items: center;
                      text-align: center;
                      flex-direction:column;
                      justify-content:center;
                      background:
                        linear-gradient(
                          145deg,
                          rgba(255,255,255,0.10),
                          rgba(255,255,255,0.03)
                        );
                      border:1px solid rgba(255,255,255,0.08);
                      align-items: center;
                      backdrop-filter:blur(18px);
                      box-shadow:
                        0 12px 40px rgba(0,0,0,0.22),
                        inset 0 1px 0 rgba(255,255,255,0.04);
                      transition:
                        transform .2s ease,
                        box-shadow .2s ease;
                  ">

                <!-- title -->
                <div style="
                      position:relative;
                      z-index:2;
                      color:rgba(255,255,255,0.58);
                      font-size:0.95em;
                      font-weight:700;
                      word-break:break-word;
                      overflow-wrap:anywhere;
                  ">
                  ${label}
                </div>
                <!-- value -->
                <div style="
                      position:relative;
                      z-index:2;
                      font-weight:800;
                      padding-top: 0.5em;
                      align-items: center;
                      text-align: center;
                      text-shadow:
                        0 4px 20px rgba(0,0,0,0.35);
                      word-break:break-word;
                      overflow-wrap:anywhere;
                  ">
                  ${value}
                </div>
              </div>
            `;
      }

      $("#weather-current-details").html(
        createRow("Условия", forecastHourCurrent.condition.text) +
          createRow("Ощущается как", forecastHourCurrent.feelslike_c + "°C") +
          createRow("Мин/Макс °C", forecast.day.mintemp_c + "°C / " + forecast.day.maxtemp_c + "°C") +
          createRow("Ветер", forecastHourCurrent.wind_kph + " км/ч, " + translateWindDirection(forecastHourCurrent.wind_dir)) +
          createRow("Порывы ветра", forecastHourCurrent.gust_kph + " км/ч") +
          createRow("Облачность", forecastHourCurrent.cloud + "%") +
          createRow("Шанс дождя", forecast.day.daily_chance_of_rain + "%") +
          createRow("Влажность", forecastHourCurrent.humidity + "%") +
          createRow("Давление", (weatherData.weather.current.pressure_mb || "") + " гПа") +
          createRow("Видимость", forecastHourCurrent.vis_km + " км") +
          createRow("Точка росы", (forecastHourCurrent.dewpoint_c || "–") + "°C") +
          createRow("УФ-индекс", forecastHourCurrent.uv),
      );

      $("#hourly-forecast2").html(
        createRow("Условия", forecastHourNext.condition.text) +
          createRow("Ощущается как", forecastHourNext.feelslike_c + "°C") +
          createRow("Ветер", forecastHourNext.wind_kph + " км/ч, " + translateWindDirection(forecastHourNext.wind_dir)) +
          createRow("Порывы ветра", forecastHourNext.gust_kph + " км/ч") +
          createRow("Облачность", forecastHourNext.cloud + "%") +
          createRow("Шанс дождя", forecast.day.daily_chance_of_rain + "%") +
          createRow("Влажность", forecastHourNext.humidity + "%") +
          createRow("Давление", forecastHourNext.pressure_mb + " гПа") +
          createRow("Видимость", forecastHourNext.vis_km + " км") +
          createRow("Точка росы", (forecastHourNext.dewpoint_c || "–") + "°C") +
          createRow("УФ-индекс", forecastHourNext.uv),
      );

      $("#weather-details-content").html(
        createRow("Макс. °C", forecast.day.maxtemp_c + "°C") +
          createRow("Мин. °C", forecast.day.mintemp_c + "°C") +
          createRow("Средняя °C", forecast.day.avgtemp_c + "°C") +
          createRow("Макс. ветер", forecast.day.maxwind_kph + " км/ч") +
          createRow("Осадки", forecast.day.totalprecip_mm + " мм") +
          createRow("Влажность", forecast.day.avghumidity + "%") +
          createRow("Видимость", forecast.day.avgvis_km + " км") +
          createRow("УФ-индекс", forecast.day.uv) +
          createRow("Шанс дождя / снега", forecast.day.daily_chance_of_rain + "% / " + forecast.day.daily_chance_of_snow + "%") +
          createRow("Восход / Закат", convertTime12to24(forecast.astro.sunrise).formatted + " / " + convertTime12to24(forecast.astro.sunset).formatted,) +
          createRow("Фаза луны", translateMoonPhase(forecast.astro.moon_phase)) +
          createRow("Освещенность", translateMoonIllumination(forecast.astro.moon_illumination)),
      );

      updateHourlyForecast(forecast, forecast.astro);
    }

    function setupModalHandlers() {
      var modalIsOpen = false;
      var ignoreNextEnter = false;

      function closeModal() {
        if (!modalIsOpen) return;
        modalHtml.fadeOut(200, function () {
          Lampa.Controller.toggle("head");
          modalIsOpen = false;
          setTimeout(function () {
            $("header .selector:first").focus();
            ignoreNextEnter = true;
            setTimeout(function () {
              ignoreNextEnter = false;
            }, 100);
          }, 50);
        });
      }

      function openModal() {
        if (!modalHtml) createModal();
        modalIsOpen = true;
        modalHtml.fadeIn(200, function () {
          Lampa.Controller.add("weather_modal", {
            toggle: function () {

                var all = modalHtml.find(".selector").filter(function() {
                    return this && this.nodeType === 1;
                });
                
                if (all.length > 0) {
                    Lampa.Controller.collectionSet(all, modalHtml, "weather_modal");
                    var activeTab = modalHtml.find(".navigation-tabs__button.active.selector")[0];
                    if (activeTab) {
                        Lampa.Controller.collectionFocus(false, activeTab);
                        $(activeTab).trigger("hover:focus");
                    } else {
                        var firstTab = modalHtml.find(".navigation-tabs__button.selector").first()[0];
                        if (firstTab) {
                            Lampa.Controller.collectionFocus(false, firstTab);
                            $(firstTab).trigger("hover:focus");
                        }
                    }
                }
            },
            back: closeModal,
            left: function (event) {
              try {
                var currentTab = modalHtml.find(".navigation-tabs__button.active.selector");
                if (!currentTab.length) return;

                var prevTab = currentTab.prevAll(".navigation-tabs__button.selector").first();
                if (prevTab.length) {
                  if (event && event.preventDefault) event.preventDefault();
                  prevTab.trigger("click");
                  Lampa.Controller.collectionFocus(false, prevTab[0]);
                  prevTab.trigger("hover:focus");
                }
              } catch (err) {
                console.warn("WeatherInterface LEFT error:", err);
              }
            },
            right: function (event) {
              try {
                var currentTab = modalHtml.find(".navigation-tabs__button.active.selector");
                if (!currentTab.length) return;

                var nextTab = currentTab.nextAll(".navigation-tabs__button.selector").first();
                if (nextTab.length) {
                  if (event && event.preventDefault) event.preventDefault();
                  nextTab.trigger("click");
                  Lampa.Controller.collectionFocus(false, nextTab[0]);
                  nextTab.trigger("hover:focus");
                }
              } catch (err) {
                console.warn("WeatherInterface RIGHT error:", err);
              }
            },
          });

          var focusable = modalHtml.find(".selector:visible");

          if (focusable.length) {
            Lampa.Controller.toggle("weather_modal");
          }
        });
      }

      $(".weather-temp.selector").on("hover:enter", function (e) {
        if (modalIsOpen || ignoreNextEnter) return;
        e.preventDefault();
        openModal();
      });

      $(document).on("click", ".weather-temp.selector", function (e) {
        if (modalIsOpen) return;
        e.preventDefault();
        openModal();
      });

      Lampa.Controller.add("weather_widget", {
        toggle: function () {
          Lampa.Controller.collectionSet($(".weather-temp.selector"));
          Lampa.Controller.collectionFocus(false, $(".weather-temp.selector")[0]);
        },
        back: function () {
          Lampa.Controller.toggle("head");
        },
      });

      $(document)
        .on("click hover:enter", "#weather-modal-close.selector", closeModal)
        .on("click hover:enter", ".modal__backdrop", function (e) {
          if ($(e.target).is(".modal__backdrop")) closeModal();
        })
        .on("click hover:enter", ".navigation-tabs__button.selector", function () {
          var tab = $(this).data("tab");
          $(".navigation-tabs__button").removeClass("active");
          $(this).addClass("active");
          $(".weather-tab").hide();
          $('.weather-tab[data-tab-content="' + tab + '"]').fadeIn(200);

          var all = modalHtml.find(".selector");
          Lampa.Controller.collectionSet(all);
          Lampa.Controller.collectionFocus(false, this);
          $(this).trigger("hover:focus");
        });
    }

    function translateMoonIllumination(illumination) {
      var percent = parseInt(illumination, 10);
      var note = "";

      if (percent === 100) {
        note = " — Полнолуние";
      } else if (percent >= 75) {
        note = " — Почти полная";
      } else if (percent >= 45 && percent <= 55) {
        note = " — Половина";
      } else if (percent <= 10) {
        note = " — Почти невидима";
      }

      return `${percent}%${note}`;
    }

    function translateWindDirection(dir) {
      var directions = {
        N: "С",
        NNE: "ССВ",
        NE: "СВ",
        ENE: "ВСВ",
        E: "В",
        ESE: "ВЮВ",
        SE: "ЮВ",
        SSE: "ЮЮВ",
        S: "Ю",
        SSW: "ЮЮЗ",
        SW: "ЮЗ",
        WSW: "ЗЮЗ",
        W: "З",
        WNW: "ЗСЗ",
        NW: "СЗ",
        NNW: "ССЗ",
      };
      return directions[dir] || dir;
    }

    $(document).ready(function () {
      Lampa.Listener.follow("app", function (e) {
        if (e.type === "start") {
          setTimeout(function () {
            Lampa.Controller.toggle("weather_widget");
          }, 1500);
        }
      });
    });
    function applyHourlyBackgrounds(currentHour, sunrise, sunset, currentConditionText) {
      $(".hourly-block").each(function (i) {
        var blockHour = (currentHour + i) % 24;
        var isSunny = /солнечно|ясно|sunny|clear/i.test(currentConditionText);
        var isNight = blockHour < sunrise || blockHour >= sunset;
        var dawnStart = (sunrise - 3 + 24) % 24;
        var dawnEnd = sunrise;
        var sunsetStart = (sunset - 3 + 24) % 24;
        var sunsetEnd = sunset;
        var background;

        if (isBetween(blockHour, dawnStart, dawnEnd)) {
          var progress = normalize(blockHour, dawnStart, dawnEnd);
          var color1 = interpolateColor([10, 25, 79], [22, 98, 133], progress);
          var color2 = interpolateColor([35, 70, 196], [50, 105, 153], progress);
          background = "linear-gradient(225deg, " + color1 + " 10%, " + color2 + " 100%)";
        } else if (isBetween(blockHour, sunsetStart, sunsetEnd)) {
          var progress = normalize(blockHour, sunsetStart, sunsetEnd);
          var color1 = interpolateColor([80, 125, 155], [50, 80, 120], progress);
          var color2 = interpolateColor([150, 180, 210, 0.3], [100, 130, 170, 0.6], progress);
          background = "linear-gradient(135deg, " + color1 + " 20%, " + color2 + " 80%)";
        } else if (isNight) {
          background = "linear-gradient(225deg, rgb(10, 25, 79) 0%, rgb(35, 70, 196) 100%)";
        } else {
          var progress = getDayProgress(blockHour, sunrise, sunset);
          var color1 = interpolateColor([22, 98, 133], [80, 125, 155], progress);
          var color2 = isSunny ? "rgba(200, 200, 150, 0.2)" : "rgba(55, 110, 175, 0.5)";
          background = "linear-gradient(225deg, " + color1 + " 10%, " + color2 + " 100%)";
        }

        $(this).css({
          background: background,
          opacity: isNight ? 0.92 : 1,
          transition: "all 0.5s ease",
          boxShadow: isNight ? "0 4px 8px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.15)",
        });
      });
    }

    function isBetween(hour, start, end) {
      return start <= end ? hour >= start && hour <= end : hour >= start || hour <= end;
    }

    function normalize(value, min, max) {
      return Math.min(1, Math.max(0, (value - min) / (max - min)));
    }

    function interpolateColor(color1, color2, factor) {
      var r = Math.round(color1[0] + factor * (color2[0] - color1[0]));
      var g = Math.round(color1[1] + factor * (color2[1] - color1[1]));
      var b = Math.round(color1[2] + factor * (color2[2] - color1[2]));
      var a = color1.length === 4 ? color1[3] + factor * (color2[3] - color1[3]) : 1;
      return a === 1 ? "rgb(" + r + "," + g + "," + b + ")" : "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }

    function updateHourlyForecast() {
      var forecast =
        weatherData.weather &&
        weatherData.weather.forecast &&
        weatherData.weather.forecast.forecastday &&
        weatherData.weather.forecast.forecastday[0];

      if (!forecast) return;

      var currentHour = getCurrentTime().hour;
      var sunrise = convertTime12to24(forecast.astro.sunrise).hour;
      var sunset = convertTime12to24(forecast.astro.sunset).hour;
      var hourly = [];

      for (var i = 0; i < FORECAST_HOURS; i++) {
        var index = (currentHour + i) % 24;
        var hourData = forecast.hour[index];
        if (!hourData) continue;
        var date = new Date(hourData.time_epoch * 1000);
        var formattedTime = String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0");

        hourly.push(
          '<div class="hourly-block selector" style="' +
            "font-style:italic;font-weight:bold;" +
            "display:flex;flex-wrap:wrap;" +
            "min-width:100px;min-height:120px;" +
            "aspect-ratio:1/1;" +
            "border-radius:8px;" +
            "overflow:hidden;" +
            "backdrop-filter:blur(20px);" +
            "text-align:center;" +
            "justify-content:center;" +
            "padding:8px;" +
            'align-items:center;">' +
            '<div style="margin-right:1px">' +
            formattedTime +
            "<br>" +
            '<img src="https:' +
            hourData.condition.icon +
            '" alt="icon" style="height:auto;" /><br>' +
            hourData.temp_c +
            "°C</div></div>",
        );
      }

      $("#hourly-forecast").html(hourly.join(""));

      var currentCondition =
        (weatherData.weather && weatherData.weather.current && weatherData.weather.current.condition && weatherData.weather.current.condition.text) || "";
      applyHourlyBackgrounds(currentHour, sunrise, sunset, currentCondition);
    }

    function getDayProgress(hour, sunrise, sunset) {
      var dayDuration = sunset - sunrise;
      var midDay = sunrise + dayDuration / 2;
      return hour < midDay ? (hour - sunrise) / (midDay - sunrise) : (hour - midDay) / (sunset - midDay);
    }

    function setupSettings() {
      Lampa.SettingsApi.addComponent({
        component: "weather_settings",
        name: "Виджет погоды",
        icon:
          '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M7 16C4 16 2 14 2 11C2 8 4 6 7 6C7 4 9 2 12 2C15 2 17 4 17 6C19 6 21 8 21 11C21 14 19 16 17 16H7Z" fill="white"/>' +
          '<path d="M5 18L4 21M10 18L9 21M15 18L14 21" stroke="white" stroke-width="2" stroke-linecap="round"/>' +
          "</svg>",
      });

      Lampa.SettingsApi.addParam({
        component: "weather_settings",
        param: {
          name: "weather_api_key",
          type: "input",
          values: "",
          placeholder: "Введите API ключ",
          default: "",
        },
        field: {
          name: "API ключ",
          description: "Введите свой API ключ для получения данных о погоде.",
        },
        onChange: function (value) {
          if (value) {
            localStorage.setItem("weatherApiKey", value);
            API_KEY = value;
            getWeatherByCity(city, 1, true);
          }
        },
      });

      Lampa.SettingsApi.addParam({
        component: "weather_settings",
        param: {
          name: "weather_location",
          type: "input",
          values: localStorage.getItem("weatherLocation") || "",
          placeholder: "Введите город",
          default: localStorage.getItem("weatherLocation") || "",
        },
        field: {
          name: "Город",
          description: "Введите название города для прогноза погоды (по умолчанию Санкт-Петербург)",
        },
        onChange: function (value) {
          if (value && typeof value === "string") {
            localStorage.setItem("weatherLocation", value);
            city = value;
            Lampa.Storage.set(WEATHER_CACHE_KEY, {});
            Lampa.Noty.show("Выбран город " + city);
            getWeatherByCity(value, 1, true);
          }
        },
      });

      Lampa.SettingsApi.addParam({
        component: "weather_settings",
        param: {
          name: "get_api_link",
          type: "button",
          default: false,
        },
        field: {
          name: "Получить API",
          description: "Нажмите, чтобы перейти на сайт для получения API ключа.",
        },
        onChange: function () {
          if (typeof AndroidOpenUrl === "function") {
            AndroidOpenUrl("https://www.weatherapi.com/signup.aspx");
          } else {
            window.open("https://www.weatherapi.com/signup.aspx", "_blank");
          }
        },
      });

      Lampa.Settings.listener.follow("open", function () {
        setTimeout(function () {
          var weatherFolder = $('.settings-folder[data-component="weather_settings"]');
          var standardFolder = $('.settings-folder[data-component="interface"]');
          if (weatherFolder.length && standardFolder.length) {
            weatherFolder.insertAfter(standardFolder);
          }
        }, 100);
      });
    }

    function setupHourlyUpdater() {
      if (hourlyInterval) {
        clearInterval(hourlyInterval);
      }

      var now = getCurrentTime();
      lastUpdateHour = now.hour;
      hourlyInterval = setInterval(function () {
        var current = getCurrentTime();
        if (current.hour !== lastUpdateHour) {
          lastUpdateHour = current.hour;
          console.log("Weather", "⏰ Новый час:", current.hour);
          var currentCity = localStorage.getItem("weatherLocation") || city;
          getWeatherByCity(currentCity, 1, true);
        }
      }, 60 * 1000);
    }

    this.create = function () {
      createWeatherWidget();
      createModal();
      setupSettings();
      setupModalHandlers();
      setupHourlyUpdater();
      html.hide();
      var initialCity = localStorage.getItem("weatherLocation") || city;
      getWeatherByCity(initialCity, 1, false);
    };

    this.getWeather = function () {
      var hour = getCurrentTime().hour;
      if (lastUpdateHour === hour) return;
      lastUpdateHour = hour;
      var now = Date.now();
      var lastApiUpdate = Lampa.Storage.get(LAST_API_UPDATE_KEY, 0);
      if (now - lastApiUpdate > API_UPDATE_INTERVAL) {
        console.log("Weather", " Обновление из API");
        Lampa.Storage.set(LAST_API_UPDATE_KEY, now);
        getWeatherByCity(city, 1, true);
      } else {
        console.log("Weather", " Обновление из кэша");
        var cachedWeather = getStoredWeatherData();
        if (cachedWeather) processWeatherData({ weather: cachedWeather });
      }
    };

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }

      if (hourlyInterval) {
        clearInterval(hourlyInterval);
        hourlyInterval = null;
      }

      $(".weather-widget").remove();
      $(".weather-modal").remove();

      html = null;
      modalHtml = null;
    };
  }

  $(document).ready(function () {
    setTimeout(function () {
      var weatherInterface = new WeatherInterface();
      weatherInterface.create();
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }

      refreshInterval = setInterval(function () {
        weatherInterface.getWeather();
      }, CACHE_REFRESH_MS);
    }, 3500);
  });
})();
