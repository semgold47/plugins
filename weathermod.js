//МОЙ Последний, Рабочий, с vps
(function () {
  "use strict";

  const DEFAULT_API_KEY = "941fa32cfc1144b1a1e213238242812" || {};
  const WEATHER_CACHE_KEY = "weatherData";
  const CACHE_EXPIRATION_MS = 6 * 60 * 60 * 1000;
  const CACHE_REFRESH_MS = 60 * 60 * 1000;
  const FORECAST_HOURS = 10;

  var API_KEY = localStorage.getItem("weatherApiKey") || DEFAULT_API_KEY;
  var network = new Lampa.Reguest();
  var storedLocation = localStorage.getItem("weatherLocation") || "Москва";
  var city = storedLocation;
  var html,
    modalHtml,
    weatherData = {};
  var lastUpdateTime = 0;

  function WeatherInterface() {
    var LAST_API_UPDATE_KEY = "weatherLastApiUpdate";
    var API_UPDATE_INTERVAL = 6 * 60 * 60 * 1000;
    var lastUpdateHour = -1;

    this.create = function () {
      createWeatherWidget();
      createModal();
      setupSettings();
      $(".head__actions").append(html);
      html.hide();
      this.getWeather();
    };

    function convertTo24HourFormat(time) {
      var match = /\d+:\d+\s*(AM|PM)/i.exec(time);
      if (!match) return 0;
      var parts = time.split(" ");
      var hour = parseInt(parts[0].split(":"[0]), 10);
      var period = parts[1];
      if (period === "PM" && hour < 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return hour;
    }

    function convertTo24(timeStr) {
      var [time, meridian] = timeStr.split(" ");
      var [hour, minute] = time.split(":").map(Number);

      if (meridian === "PM" && hour < 12) hour += 12;
      if (meridian === "AM" && hour === 12) hour = 0;

      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
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
      var timeParts = $(".head__time-now").text().split(":");
      return {
        hour: parseInt(timeParts[0], 10),
        minute: parseInt(timeParts[1], 10),
      };
    }

    function getWeatherUrl(city) {
      return (
        "https://api.weatherapi.com/v1/forecast.json?key=" +
        API_KEY +
        "&q=" +
        city +
        "&days=7&lang=ru"
      );
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
      if (!storedData.timestamp) return true;
      return Date.now() - storedData.timestamp >= CACHE_EXPIRATION_MS;
    }

    function shouldRefreshFromCache() {
      return Date.now() - lastUpdateTime >= CACHE_REFRESH_MS;
    }

    function getWeatherByCity(city, attempt, forceRefresh) {
      attempt = attempt || 1;
      forceRefresh = !!forceRefresh;
      var useCache = !forceRefresh && !shouldFetchFromAPI();

      if (useCache) {
        var cachedWeather = getStoredWeatherData();
        if (cachedWeather) {
          Lampa.Noty.show("☁ Данные о погоде получены из кэша");
          processWeatherData({ weather: cachedWeather });
          if (shouldRefreshFromCache()) {
            lastUpdateTime = Date.now();
            updateAllWidgets();
            Lampa.Noty.show(
              "🔄 Кэш обновлён, погода обновлена во всех виджетах"
            );
          }
          return;
        } else {
          Lampa.Noty.show("⚠ Кэш пуст — запрашиваем с сервера");
        }
      } else {
        Lampa.Noty.show("🌐 Запрос погоды по API...");
      }

      network.clear();
      network.timeout(1500);
      network.silent(
        getWeatherUrl(city),
        function (weatherResponse) {
          if (!weatherResponse || !Object.keys(weatherResponse).length) {
            Lampa.Noty.show(
              "⚠ Пустой ответ от API. Попытка " + attempt + " из 3"
            );
            if (attempt < 3) {
              setTimeout(function () {
                getWeatherByCity(city, attempt + 1, forceRefresh);
              }, 500);
            } else {
              Lampa.Noty.show(
                "❌ Не удалось получить данные. Проверь API ключ в настройках погоды"
              );
            }
          } else {
            Lampa.Noty.show("✅ Погода обновлена из API для города " + city);
            weatherData = { weather: weatherResponse };
            saveWeatherData(weatherResponse);
            processWeatherData(weatherData);
            updateAllWidgets();
          }
        },
        function (error) {
          Lampa.Noty.show(
            "⚠ Ошибка сети при получении погоды. Попытка " + attempt + " из 3"
          );
          if (attempt < 3) {
            setTimeout(function () {
              getWeatherByCity(city, attempt + 1, forceRefresh);
            }, 500);
          } else {
            Lampa.Noty.show(
              "❌ Не удалось подключиться к API. Проверь подключение или API ключ"
            );
          }
        }
      );
    }

    function updateAllWidgets() {
      var cachedWeather = getStoredWeatherData();
      if (cachedWeather) {
        processWeatherData({ weather: cachedWeather });
        if (modalHtml && modalHtml.is(":visible")) {
          updateModalData();
        }
      }
    }

    function processWeatherData(result) {
      if (!result || !result.weather || !result.weather.forecast) {
        var cachedData = Lampa.Storage.get("weather_cache");
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
      $("#weather-icon").html(
        '<img src="https:' +
          icon +
          '" alt="Weather Icon" style="height: 2.8em;">'
      );
      if (html) html.show();
      updateModalData();
      Lampa.Storage.set("weather_cache", weatherData);
    }

    function createWeatherWidget() {
      html = $(`
          <div class="head__action  cursor-pointer selector weather-temp weather-widget " 
             style="align-items: center; justify-content: end; margin: 0 0 0 10px; padding: 0px;" 
             >
            <div id="weather-temp" style="margin: 0px; padding: 0px; font-weight: bold; 
                 display: flex; align-items: center; justify-content: end; font-size: large;"></div>
        </div>
        <div class="head__action selector weather-widget cursor-pointer weather-icon" 
             id="weather-icon" style="height: 2.8em; margin: 0px; padding: 0px;" tabindex="0"></div>
        `);

      $(".head__actions").append(html);
      return html;
    }
    function createModal() {
      if (modalHtml) return modalHtml;

      modalHtml = $(`
    <div class="modal modal--large animate weather-modal" data-nav="modal" style="display: none;" tabindex="0">  
      <div class="modal__content" data-nav="modal" style="z-index: 1001; overflow: auto;">
        <div class="modal__head" style="margin-bottom: 5px;">
          <div class="modal__title" id="weather-modal-city" style="font-size: 1.4em; text-align: center; font-weight: 900;">Погода</div>
        </div>                    
        <div class="modal__body" style="max-height: 99%;">
          <div class="scroll scroll--over" style="max-height: 97%; overflow: auto;">
            <div class="scroll__content" style="padding: 0; max-height: 96%;">
              <div class="scroll__body" style="transform: translate3d(0px, 0px, 0px);">

                <div id="hourly-forecast" class="scroll__body full-episodes" style="display: flex; gap: 10px; overflow: auto; padding: 5px 2px; justify-content: space-between;"></div>

                <div class="navigation-tabs" style="margin: 5px 0;">
                  <div class="navigation-tabs__button selector active" data-tab="current">Текущая</div>
                  <div class="navigation-tabs__split">|</div>
                  <div class="navigation-tabs__button selector" data-tab="hourly">Следующий час</div>
                  <div class="navigation-tabs__split">|</div>
                  <div class="navigation-tabs__button selector" data-tab="details">День</div>
                </div>   

                <div style="width: 100%; text-align: center; display: flex; flex-direction: column; gap: 20px;">
                  <!-- Текущая погода -->
                  <div class="weather-tab selector" data-tab-content="current" style="width: 100%; display: flex; flex-direction: row; align-items: center; padding: 10px; border-radius: 16px; background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); box-shadow: 0 4px 16px rgba(0,0,0,0.3); gap: 20px;">
                    <div style="flex-shrink: 0; text-align: center;">
                      <div id="weather-icon-big" style=""></div>
                    </div>
                    <div style="flex: 1;">
                     
                      <div style="overflow-y: auto; font-size: 1em; line-height: 1.4;">
                        <div id="weather-current-details"></div>
                        <div id="weather-update-time" style="margin-top: 10px; font-style: italic; color: #aaa;"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Почасовой прогноз -->
                  <div class="weather-tab selector" data-tab-content="hourly" style="width: 100%; display: none; flex-direction: column; padding: 10px; border-radius: 16px; background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); box-shadow: 0 4px 16px rgba(0,0,0,0.3);">
                    
                    <div style="overflow-x: auto;">
                      <div id="hourly-forecast2" style="font-size: 1em; line-height: 1.5;"></div>
                    </div>
                  </div>

                  <!-- Подробный прогноз -->
                  <div class="weather-tab selector" data-tab-content="details" style="width: 100%; display: none; flex-direction: column; padding: 10px; border-radius: 16px; background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); box-shadow: 0 4px 16px rgba(0,0,0,0.3);">
                    
                    <div style="font-size: 1em; line-height: 1.5;">
                      <div id="weather-details-content"></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

      modalHtml.prepend(`
    <div class="modal__backdrop" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999;"></div>
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
      // Если точного часа нет — берём ближайший предыдущий
      if (!hourData) {
        const currentHour = now.getHours();
        for (let i = currentHour; i >= 0; i--) {
          const tryTime = nowTimeStr.replace(
            /\d{2}:00$/,
            String(i).padStart(2, "0") + ":00"
          );
          hourData = forecastHours.find((h) => h.time === tryTime);
          if (hourData) break;
        }
      }
      return hourData || forecastHours[0]; // fallback
    }
    function getNextHourForecast(data) {
      if (!data?.forecast?.forecastday?.length) return null;
      const now = new Date();
      const forecastHours = data.forecast.forecastday[0].hour;
      const nextHour = (now.getHours() + 1) % 24;
      const dateStr = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const targetTime = `${dateStr} ${String(nextHour).padStart(2, "0")}:00`;
      let hourData = forecastHours.find((h) => h.time === targetTime);
      // fallback: если следующего часа нет — берём первый
      return hourData || forecastHours[0];
    }
    // В обработчике событий
    function updateModalData() {
      if (!modalHtml) return;
      if (!modalHtml) createModal();
      const location = weatherData.weather?.location;
      const forecastHourCurrent = getCurrentHourForecast(weatherData.weather);
      const forecastHourNext = getNextHourForecast(weatherData.weather);
      const current = {
        ...forecastHourCurrent,
        condition: forecastHourCurrent.condition,
        last_updated: weatherData.weather.current?.last_updated || "",
        pressure_mb: weatherData.weather.current?.pressure_mb || "",
      };

      const forecast = weatherData.weather?.forecast?.forecastday?.[0];
      if (!location || !current || !forecast) {
        console.error(
          "Не удалось получить данные для модального окна",
          weatherData
        );
        return;
      }

      $("#weather-modal-city").text(`Погода в ${location.name}`);
      $("#weather-current-title").text(`Погода в ${location.name}`);
      $("#weather-update-time").text(`Обновлено: ${current.last_updated}`);
      $("#weather-icon-big").html(
        `<img style="width: 100%; height: 100%; object-fit: contain; display: block;" 
             src="https:${current.condition.icon}" 
             alt="${current.condition.text}">`
      );

      const createRow = (label, value) => `
        <div class="weather-data-row" style="
          display: flex;
          border-radius: 5px;
              margin: 0;
          justify-content: space-between;
          padding: 0 5px;
          font-size: 1.1em;
          line-height: 1.2;
          >
          
          <span class="weather-data-label" style="
            flex: 1;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;">
            ${label}:
          </span>
          
          <span class="weather-data-value" style="
            flex: 1;
            text-align: right;
            white-space: nowrap;">
            ${value}
          </span>
        </div>`;

      // Текущая погода
      $("#weather-current-details").html(`
        ${createRow("Условия", current.condition.text)}
        ${createRow("Температура", `${current.temp_c}°C`)}
        ${createRow("Ощущается как", `${current.feelslike_c}°C`)}
        ${createRow(
          "Ветер",
          current.wind_kph +
            " км/ч, " +
            translateWindDirection(current.wind_dir)
        )}
        ${createRow("Порывы ветра", `${current.gust_kph} км/ч`)}
        ${createRow("Облачность", `${current.cloud}%`)}
        ${createRow(
          "Шанс дождя сегодня",
          `${forecast.day.daily_chance_of_rain}%`
        )}
        ${createRow("Влажность", `${current.humidity}%`)}
        ${createRow("Давление", `${current.pressure_mb} гПа`)}
        ${createRow("Видимость", `${current.vis_km} км`)}
        ${createRow("Точка росы", `${current.dewpoint_c ?? "–"}°C`)}
        ${createRow("УФ-индекс", `${current.uv}`)}
      `);

      // Следующий час
      $("#hourly-forecast2").html(`
        ${createRow("Погода в", forecastHourNext.time.split(" ")[1], " часов")}
        ${createRow("Условия", forecastHourNext.condition.text)}
        ${createRow("Температура", `${forecastHourNext.temp_c}°C`)}
        ${createRow("Ощущается как", `${forecastHourNext.feelslike_c}°C`)}
       
         ${createRow(
           "Ветер",
           forecastHourNext.wind_kph +
             " км/ч, " +
             translateWindDirection(forecastHourNext.wind_dir)
         )}
        ${createRow("Порывы ветра", `${forecastHourNext.gust_kph} км/ч`)}
        ${createRow("Облачность", `${forecastHourNext.cloud}%`)}
        ${createRow(
          "Шанс дождя сегодня",
          `${forecast.day.daily_chance_of_rain}%`
        )}
        ${createRow("Влажность", `${forecastHourNext.humidity}%`)}
        ${createRow("Давление", `${forecastHourNext.pressure_mb} гПа`)}
        ${createRow("Видимость", `${forecastHourNext.vis_km} км`)}
        ${createRow("Точка росы", `${forecastHourNext.dewpoint_c ?? "–"}°C`)}
        ${createRow("УФ-индекс", `${forecastHourNext.uv}`)}
      `);

      // Почасовой прогноз
      updateHourlyForecast(forecast, forecast.astro);

      // Подробности
      $("#weather-details-content").html(`
        <div style="margin-bottom: 5px;">
          <h3 style="margin: 0 0 5px 0; font-size: 1em;">Прогноз на день</h3>
          ${createRow("Макс. температура", `${forecast.day.maxtemp_c}°C`)}
          ${createRow("Мин. температура", `${forecast.day.mintemp_c}°C`)}
          ${createRow("Средняя температура", `${forecast.day.avgtemp_c}°C`)}
          ${createRow("Макс. ветер", `${forecast.day.maxwind_kph} км/ч`)}
          
          ${createRow("Осадки", `${forecast.day.totalprecip_mm} мм`)}
          ${createRow("Влажность", `${forecast.day.avghumidity}%`)}
          ${createRow("Видимость", `${forecast.day.avgvis_km} км`)}
          ${createRow("УФ-индекс", `${forecast.day.uv}`)}
          ${createRow("Шанс дождя", `${forecast.day.daily_chance_of_rain}%`)}
          ${createRow("Шанс снега", `${forecast.day.daily_chance_of_snow}%`)}
          ${createRow(
            "Восход / Закат",
            `${convertTo24(forecast.astro.sunrise)} / ${convertTo24(
              forecast.astro.sunset
            )}`
          )}
          ${createRow(
            "Фаза луны",
            translateMoonPhase(forecast.astro.moon_phase)
          )}
          ${createRow(
            "Освещённость",
            translateMoonIllumination(forecast.astro.moon_illumination)
          )}
      `);
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
              var all = modalHtml.find(".selector");
              Lampa.Controller.collectionSet(all, modalHtml, "weather_modal");

              var activeTab = modalHtml.find(
                ".navigation-tabs__button.active.selector"
              )[0];
              if (activeTab) {
                Lampa.Controller.collectionFocus(false, activeTab);
                $(activeTab).trigger("hover:focus");
              } else {
                var firstTab = modalHtml
                  .find(".navigation-tabs__button.selector")
                  .first()[0];
                if (firstTab) {
                  Lampa.Controller.collectionFocus(false, firstTab);
                  $(firstTab).trigger("hover:focus");
                }
              }
            },
            back: closeModal,
            left: function (event) {
              try {
                var currentTab = modalHtml.find(
                  ".navigation-tabs__button.active.selector"
                );
                if (!currentTab.length) return;

                var prevTab = currentTab
                  .prevAll(".navigation-tabs__button.selector")
                  .first();
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
                var currentTab = modalHtml.find(
                  ".navigation-tabs__button.active.selector"
                );
                if (!currentTab.length) return;

                var nextTab = currentTab
                  .nextAll(".navigation-tabs__button.selector")
                  .first();
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
          } else {
            console.warn(
              "WeatherInterface: нет доступных .selector для навигации в модальном окне"
            );
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
          Lampa.Controller.collectionFocus(
            false,
            $(".weather-temp.selector")[0]
          );
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
        .on(
          "click hover:enter",
          ".navigation-tabs__button.selector",
          function () {
            var tab = $(this).data("tab");
            $(".navigation-tabs__button").removeClass("active");
            $(this).addClass("active");
            $(".weather-tab").hide();
            $('.weather-tab[data-tab-content="' + tab + '"]').fadeIn(200);

            var all = modalHtml.find(".selector");
            Lampa.Controller.collectionSet(all);
            Lampa.Controller.collectionFocus(false, this);
            $(this).trigger("hover:focus");
          }
        );
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
      return directions[dir] || dir; // Возвращаем оригинал, если перевод не найден
    }

    $(document).ready(function () {
      Lampa.Listener.follow("app", function (e) {
        if (e.type === "start") {
          setTimeout(() => {
            Lampa.Controller.toggle("weather_widget");
          }, 1500);
        }
      });
      createModal();
      setupModalHandlers();
    });

    function interpolateColor(from, to, progress) {
      var rgb = from.map(function (start, idx) {
        return Math.round(start + (to[idx] - start) * progress);
      });
      return "rgb(" + rgb.join(",") + ")";
    }

    function applyHourlyBackgrounds(
      currentHour,
      sunrise,
      sunset,
      currentConditionText
    ) {
      $(".hourly-block").each(function (i) {
        var blockHour = (currentHour + i) % 24;

        // Погодные условия
        var isSunny = /солнечно|ясно|sunny|clear/i.test(currentConditionText);
        var isNight = blockHour < sunrise || blockHour >= sunset;

        // Рассветный период (3 часа ДО рассвета)
        var dawnStart = sunrise - 3;
        var dawnEnd = sunrise;

        // Закатный период (3 часа ДО заката)
        var sunsetStart = sunset - 3;
        var sunsetEnd = sunset;

        // Нормализация часов
        if (dawnStart < 0) dawnStart += 24;
        if (sunsetStart < 0) sunsetStart += 24;

        var background;

        // Рассветный период (3 часа до рассвета)
        if (isBetween(blockHour, dawnStart, dawnEnd)) {
          var progress = normalize(blockHour, dawnStart, dawnEnd);

          // Плавный переход от ночи к рассвету
          var color1 = interpolateColor([10, 25, 79], [22, 98, 133], progress);
          var color2 = interpolateColor(
            [35, 70, 196],
            [50, 105, 153],
            progress
          );

          background =
            "linear-gradient(225deg, " + color1 + " 10%, " + color2 + " 100%)";
        }
        // Закатный период (3 часа до заката) - ТОЛЬКО СИНИЕ ТОНА
        else if (isBetween(blockHour, sunsetStart, sunsetEnd)) {
          var progress = normalize(blockHour, sunsetStart, sunsetEnd);

          // Приглушенный синий закат (без красного)
          var color1 = interpolateColor(
            [80, 125, 155],
            [50, 80, 120],
            progress
          );
          var color2 = interpolateColor(
            [150, 180, 210, 0.3],
            [100, 130, 170, 0.6],
            progress
          );

          background =
            "linear-gradient(135deg, " + color1 + " 20%, " + color2 + " 80%)";
        }
        // Ночное время
        else if (isNight) {
          background =
            "linear-gradient(225deg, rgb(10, 25, 79) 0%, rgb(35, 70, 196) 100%)";
        }
        // Дневное время
        else {
          var progress = getDayProgress(blockHour, sunrise, sunset);
          var color1 = interpolateColor(
            [22, 98, 133],
            [80, 125, 155],
            progress
          );
          var color2 = isSunny
            ? "rgba(200, 200, 150, 0.2)" // Едва заметный теплый оттенок
            : "rgba(55, 110, 175, 0.5)";

          background =
            "linear-gradient(225deg, " + color1 + " 10%, " + color2 + " 100%)";
        }

        // Применяем стили
        $(this).css({
          background: background,
          opacity: isNight ? 0.92 : 1,
          transition: "all 0.5s ease",
          boxShadow: isNight
            ? "0 4px 8px rgba(0,0,0,0.3)"
            : "0 4px 12px rgba(0,0,0,0.15)",
        });
      });
    }

    // Вспомогательные функции
    function isBetween(hour, start, end) {
      if (start <= end) return hour >= start && hour <= end;
      return hour >= start || hour <= end;
    }

    function normalize(value, min, max) {
      return Math.min(1, Math.max(0, (value - min) / (max - min)));
    }

    function interpolateColor(color1, color2, factor) {
      if (Array.isArray(color1)) {
        var r = Math.round(color1[0] + factor * (color2[0] - color1[0]));
        var g = Math.round(color1[1] + factor * (color2[1] - color1[1]));
        var b = Math.round(color1[2] + factor * (color2[2] - color1[2]));
        var a =
          color1.length === 4
            ? color1[3] + factor * (color2[3] - color1[3])
            : 1;
        return a === 1
          ? "rgb(" + r + "," + g + "," + b + ")"
          : "rgba(" + r + "," + g + "," + b + "," + a + ")";
      }
      return color1;
    }

    function updateHourlyForecast() {
      var forecast =
        weatherData.weather &&
        weatherData.weather.forecast &&
        weatherData.weather.forecast.forecastday &&
        weatherData.weather.forecast.forecastday[0];
      if (!forecast) return;

      var currentHour = getCurrentTime().hour;
      var sunrise = convertTo24HourFormat(forecast.astro.sunrise);
      var sunset = convertTo24HourFormat(forecast.astro.sunset);
      var hourlyForecast = "";

      for (var i = 0; i < FORECAST_HOURS; i++) {
        var index = (currentHour + i) % 24;
        var hourData = forecast.hour[index];
        if (!hourData) continue;

        var date = new Date(hourData.time_epoch * 1000);
        var formattedTime =
          date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0");

        hourlyForecast +=
          '<div class="hourly-block selector" style="' +
          "font-style: italic; font-weight: bold;" +
          "display: flex; flex-wrap: wrap;" +
          "min-width: 100px; min-height: 120px;" +
          "aspect-ratio: 1/1;" +
          "border-radius: 8px;" +
          "overflow: hidden;" +
          "backdrop-filter: blur(20px);" +
          "text-align: center;" +
          "justify-content: center;" +
          "padding: 8px;" +
          'align-items: center;">' +
          '<div style="margin-right: 1px">' +
          formattedTime +
          "<br>" +
          '<img src="https:' +
          hourData.condition.icon +
          '" alt="icon" style="height: auto;" /><br>' +
          hourData.temp_c +
          "°C</div></div>";
      }

      $("#hourly-forecast").html(hourlyForecast);

      var currentCondition =
        (weatherData.weather &&
          weatherData.weather.current &&
          weatherData.weather.current.condition &&
          weatherData.weather.current.condition.text) ||
        "";
      applyHourlyBackgrounds(currentHour, sunrise, sunset, currentCondition);
    }

    function getDayProgress(hour, sunrise, sunset) {
      var dayDuration = sunset - sunrise;
      var midDay = sunrise + dayDuration / 2;
      if (hour < midDay) {
        return (hour - sunrise) / (midDay - sunrise);
      } else {
        return (hour - midDay) / (sunset - midDay);
      }
    }

    function setupSettings() {
      Lampa.SettingsApi.addComponent({
        component: "weather_settings",
        name: "Настройки погоды",
        icon:
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-icon">' +
          '<path d="M7 16C4 16 2 14 2 11C2 8 4 6 7 6C7 4 9 2 12 2C15 2 17 4 17 6C19 6 21 8 21 11C21 14 19 16 17 16H7Z" fill="currentColor"/>' +
          '<path d="M5 18L4 21M10 18L9 21M15 18L14 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
          "</svg>" +
          "<style>.weather-icon { color: white; } .weather-icon:focus { color: black !important; }</style>",
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
          description:
            "Введите название города для получения прогноза погоды. (По умолчанию Москва!)",
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
          description:
            "Нажмите, чтобы перейти на сайт для получения API ключа.",
        },
        onChange: function () {
          if (typeof AndroidOpenUrl === "function") {
            AndroidOpenUrl("https://www.weatherapi.com/signup.aspx");
          } else {
            window.open("https://www.weatherapi.com/signup.aspx", "_blank");
          }
        },
      });
    }

    this.create = function () {
      createWeatherWidget();
      createModal();
      setupSettings();
      $(".head__actions").append(html);
      html.hide();
      this.getWeather();
    };

    this.getWeather = function () {
      const { hour } = getCurrentTime();
      if (lastUpdateHour === hour) return;
      lastUpdateHour = hour;

      const now = Date.now();
      const lastApiUpdate = Lampa.Storage.get(LAST_API_UPDATE_KEY, 0);

      if (now - lastApiUpdate > API_UPDATE_INTERVAL) {
        console.log("[Weather] Обновление из API");
        Lampa.Storage.set(LAST_API_UPDATE_KEY, now);
        getWeatherByCity(city, 1, true);
      } else {
        console.log("[Weather] Обновление из кэша");
        const cachedWeather = getStoredWeatherData();
        if (cachedWeather) {
          processWeatherData({ weather: cachedWeather });
        }
      }
    };

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      html?.remove();
      modalHtml?.remove();
    };
  }

  $(document).ready(function () {
    setTimeout(function () {
      const weatherInterface = new WeatherInterface();
      weatherInterface.create();
      setInterval(() => weatherInterface.getWeather(), CACHE_REFRESH_MS); // раз в час
      setInterval(() => weatherInterface.getWeather(), 60000); // или 60000
    }, 3000);
  });
})();
