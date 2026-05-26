(function () {
  "use strict";
  var DEFAULT_API_KEY = "62e890ca6e044d4b937144001251005";
  var WEATHER_CACHE_KEY = "weatherData";
  
  var CACHE_EXPIRATION_MS = 21600000; // 6 часов
  var CACHE_REFRESH_MS = 1800000; // полчаса
  var FORECAST_HOURS = 10;
  var API_KEY = localStorage.getItem("weatherApiKey") || DEFAULT_API_KEY;
  var network = new Lampa.Reguest();
  var city = localStorage.getItem("weatherLocation") || "Санкт-Петербург";
  var html, modalHtml, weatherData = {};
  var lastUpdateTime = 0;

  function WeatherInterface() {
    var LAST_API_UPDATE_KEY = "weatherLastApiUpdate";
    var API_UPDATE_INTERVAL = 21600000; // 6 часов
    var lastUpdateHour = -1;

    function convertTime12to24(timeStr) {
      if (!timeStr) return { hour: 0, formatted: "00:00" };
      var parts = timeStr.split(" ");
      var timePart = parts[0];
      var period = parts.length > 1 ? parts[1].toUpperCase() : "";
      var timeComponents = timePart.split(":");
      var hour = parseInt(timeComponents[0], 10);
      var minute =
        timeComponents.length > 1 ? parseInt(timeComponents[1], 10) : 0;
      if (period === "PM" && hour < 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return {
        hour: hour,
        formatted:
          (hour < 10 ? "0" + hour : hour) +
          ":" +
          (minute < 10 ? "0" + minute : minute),
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
      return (
        !storedData.timestamp ||
        Date.now() - storedData.timestamp >= CACHE_EXPIRATION_MS
      );
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
         console.log("Weather"," ☁ Данные о погоде в " + city);
          processWeatherData({ weather: cachedWeather });
          if (shouldRefreshFromCache()) {
            lastUpdateTime = Date.now();
            updateAllWidgets();
            console.log("Weather"," 🔄 Кэш обновлён, погода обновлена во всех виджетах");
          }
          return;
        }
      }

      network.clear();
      network.timeout(3500);
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
        }
      );
    }

   function updateAllWidgets() {
      var cachedWeather = getStoredWeatherData();
      if (cachedWeather) {
        processWeatherData({ weather: cachedWeather });
        if (modalHtml && modalHtml.is(":visible")) updateModalData();
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
      $("#weather-icon").html(
        '<img src="https:' +
          icon +
          '" alt="Weather Icon" style="height: 2.8em;">'
      );
      if (html) html.show();
      updateModalData();
      Lampa.Storage.set("WEATHER_CACHE_KEY", weatherData);
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
      modalHtml = $(
        '<div class="modal--large animate weather-modal" data-nav="modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1001; width: 100%; height: 100%; padding: 50px;" tabindex="0">' +
          '<div class="modal__backdrop" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5);"></div>' +
          '<div class="modal__content" style="max-height: 90vh; overflow: hidden;">' +
          '<div class="modal__head" style="margin-bottom: 5px;">' +
          '<div class="modal__title" id="weather-modal-city" style="font-size: 1.4em; text-align: center; font-weight: 900;">Погода</div>' +
          "</div>" +
          '<div class="modal__body" style="max-height: 70vh;">' +
          '<div class="scroll scroll--over" style="max-height: 100%;">' +
          '<div class="scroll__content" style="padding: 0;">' +
          '<div class="scroll__body">' +
          '<div id="hourly-forecast" class="full-episodes" style="display: flex; gap: 10px; overflow: auto; padding: 5px 2px; justify-content: space-between;"></div>' +
          '<div class="navigation-tabs" style="margin: 5px 0;">' +
          '<div class="navigation-tabs__button selector active" data-tab="current">Текущая</div>' +
          '<div class="navigation-tabs__split">|</div>' +
          '<div class="navigation-tabs__button selector" data-tab="hourly">Следующий час</div>' +
          '<div class="navigation-tabs__split">|</div>' +
          '<div class="navigation-tabs__button selector" data-tab="details">День</div>' +
          "</div>" +
          '<div style="width: 100%; text-align: center; display: flex; flex-direction: column; gap: 20px; align-items: center;">' +
          '<div class="weather-tab selector" data-tab-content="current" style="width: 100%; display: flex; flex-direction: row; align-items: center; padding: 10px; border-radius: 16px; background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); box-shadow: 0 4px 16px rgba(0,0,0,0.3); gap: 20px;">' +
          '<div style="width: 15%; text-align: center;"><div id="weather-icon-big"></div></div>' +
          '<div style="width: 85%"><div style="overflow-y: auto; font-size: 1em; line-height: 1.4;"><div id="weather-current-details"></div><div id="weather-update-time" style="margin-top: 10px; font-style: italic; color: #aaa;"></div></div></div>' +
          "</div>" +
          '<div class="weather-tab selector" data-tab-content="hourly" style="width: 100%; display: none; flex-direction: column; padding: 10px; border-radius: 16px; background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); box-shadow: 0 4px 16px rgba(0,0,0,0.3);">' +
          '<div style="overflow-x: auto;"><div id="hourly-forecast2" style="font-size: 1em; line-height: 1.5;"></div></div>' +
          "</div>" +
          '<div class="weather-tab selector" data-tab-content="details" style="width: 100%; display: none; flex-direction: column; padding: 10px; border-radius: 16px; background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); box-shadow: 0 4px 16px rgba(0,0,0,0.3);">' +
          '<div style="font-size: 1em; line-height: 1.5;"><div id="weather-details-content"></div></div>' +
          "</div></div></div></div></div></div>"
      );
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
      if (!modalHtml) createModal();
      var location = weatherData.weather && weatherData.weather.location;
      var forecastHourCurrent = getCurrentHourForecast(weatherData.weather);
      var forecastHourNext = getNextHourForecast(weatherData.weather);
      var forecast =
        weatherData.weather &&
        weatherData.weather.forecast &&
        weatherData.weather.forecast.forecastday &&
        weatherData.weather.forecast.forecastday[0];
      if (!location || !forecastHourCurrent || !forecast) {
        console.error(
         "Weather", "Не удалось получить данные для модального окна",
          weatherData
        );
        return;
      }

      $("#weather-modal-city").text("Погода в " + location.name);
      $("#weather-update-time").text(
        "Обновлено: " + (weatherData.weather.current.last_updated || "")
      );
      $("#weather-icon-big").html(
        '<img style="width: 13%; object-fit: contain; display: block; position: fixed; top: 0;" src="https:' +
          forecastHourCurrent.condition.icon +
          '" alt="' +
          forecastHourCurrent.condition.text +
          '">'
      );

      function createRow(label, value) {
        return (
          '<div class="weather-data-row" style="display: flex; border-radius: 12px; margin: 2px 0; justify-content: space-between; padding: 1px 16px; font-size: 1.1em; line-height: 1.4; background: linear-gradient(135deg, rgba(240, 255, 255, 0.15) 0%, rgba(200, 230, 255, 0.1) 100%); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05) inset; transition: all 0.3s ease; position: relative; overflow: hidden;">' +
          '<div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(to bottom, #64b5f6, #1976d2); border-radius: 12px 0 0 12px;"></div>' +
          '<span class="weather-data-label" style="flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-left: 12px; font-weight: 500; color: #e3f2fd; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">' +
          label +
          ":</span>" +
          '<span class="weather-data-value" style="flex: 1; text-align: right; white-space: nowrap; font-weight: 600; color: #bbdefb; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); padding-right: 8px;">' +
          value +
          "</span></div>"
        );
      }

      $("#weather-current-details").html(
          createRow("Условия", forecastHourCurrent.condition.text) +
          createRow("Температура", forecastHourCurrent.temp_c + "°C") +
          createRow("Ощущается как", forecastHourCurrent.feelslike_c + "°C") +
          createRow(
            "Ветер",
            forecastHourCurrent.wind_kph +
              " км/ч, " +
              translateWindDirection(forecastHourCurrent.wind_dir)
          ) +
          createRow("Порывы ветра", forecastHourCurrent.gust_kph + " км/ч") +
          createRow("Облачность", forecastHourCurrent.cloud + "%") +
          createRow("Шанс дождя", forecast.day.daily_chance_of_rain + "%") +
          createRow("Влажность", forecastHourCurrent.humidity + "%") +
          createRow("Давление",(weatherData.weather.current.pressure_mb || "") + " гПа") +
          createRow("Видимость", forecastHourCurrent.vis_km + " км") +
          createRow("Точка росы",(forecastHourCurrent.dewpoint_c || "–") + "°C") +
          createRow("УФ-индекс", forecastHourCurrent.uv)
      );

      $("#hourly-forecast2").html(
          createRow("Погода в", forecastHourNext.time.split(" ")[1] + " часов") +
          createRow("Условия", forecastHourNext.condition.text) +
          createRow("Температура", forecastHourNext.temp_c + "°C") +
          createRow("Ощущается как", forecastHourNext.feelslike_c + "°C") +
          createRow(
            "Ветер",
            forecastHourNext.wind_kph +
              " км/ч, " +
              translateWindDirection(forecastHourNext.wind_dir)
          ) +
          createRow("Порывы ветра", forecastHourNext.gust_kph + " км/ч") +
          createRow("Облачность", forecastHourNext.cloud + "%") +
          createRow("Шанс дождя", forecast.day.daily_chance_of_rain + "%") +
          createRow("Влажность", forecastHourNext.humidity + "%") +
          createRow("Давление", forecastHourNext.pressure_mb + " гПа") +
          createRow("Видимость", forecastHourNext.vis_km + " км") +
          createRow("Точка росы", (forecastHourNext.dewpoint_c || "–") + "°C") +
          createRow("УФ-индекс", forecastHourNext.uv)
      );

      $("#weather-details-content").html(
          createRow("Макс. температура", forecast.day.maxtemp_c + "°C") +
          createRow("Мин. температура", forecast.day.mintemp_c + "°C") +
          createRow("Средняя температура", forecast.day.avgtemp_c + "°C") +
          createRow("Макс. ветер", forecast.day.maxwind_kph + " км/ч") +
          createRow("Осадки", forecast.day.totalprecip_mm + " мм") +
          createRow("Влажность", forecast.day.avghumidity + "%") +
          createRow("Видимость", forecast.day.avgvis_km + " км") +
          createRow("УФ-индекс", forecast.day.uv) +
          createRow("Шанс дождя", forecast.day.daily_chance_of_rain + "%") +
          createRow("Шанс снега", forecast.day.daily_chance_of_snow + "%") +
          createRow(
            "Восход / Закат",
            convertTime12to24(forecast.astro.sunrise) +
              " / " +
              convertTime12to24(forecast.astro.sunset)
          ) +
          createRow(
            "Фаза луны",
            translateMoonPhase(forecast.astro.moon_phase)
          ) +
          createRow(
            "Освещённость",
            translateMoonIllumination(forecast.astro.moon_illumination)
          )
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
    function applyHourlyBackgrounds(
      currentHour,
      sunrise,
      sunset,
      currentConditionText
    ) {
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
          var color2 = interpolateColor(
            [35, 70, 196],
            [50, 105, 153],
            progress
          );
          background =
            "linear-gradient(225deg, " + color1 + " 10%, " + color2 + " 100%)";
        } else if (isBetween(blockHour, sunsetStart, sunsetEnd)) {
          var progress = normalize(blockHour, sunsetStart, sunsetEnd);
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
        } else if (isNight) {
          background =
            "linear-gradient(225deg, rgb(10, 25, 79) 0%, rgb(35, 70, 196) 100%)";
        } else {
          var progress = getDayProgress(blockHour, sunrise, sunset);
          var color1 = interpolateColor(
            [22, 98, 133],
            [80, 125, 155],
            progress
          );
          var color2 = isSunny
            ? "rgba(200, 200, 150, 0.2)"
            : "rgba(55, 110, 175, 0.5)";
          background =
            "linear-gradient(225deg, " + color1 + " 10%, " + color2 + " 100%)";
        }

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

    function isBetween(hour, start, end) {
      return start <= end
        ? hour >= start && hour <= end
        : hour >= start || hour <= end;
    }

    function normalize(value, min, max) {
      return Math.min(1, Math.max(0, (value - min) / (max - min)));
    }

    function interpolateColor(color1, color2, factor) {
      var r = Math.round(color1[0] + factor * (color2[0] - color1[0]));
      var g = Math.round(color1[1] + factor * (color2[1] - color1[1]));
      var b = Math.round(color1[2] + factor * (color2[2] - color1[2]));
      var a =
        color1.length === 4 ? color1[3] + factor * (color2[3] - color1[3]) : 1;
      return a === 1
        ? "rgb(" + r + "," + g + "," + b + ")"
        : "rgba(" + r + "," + g + "," + b + "," + a + ")";
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
      return hour < midDay
        ? (hour - sunrise) / (midDay - sunrise)
        : (hour - midDay) / (sunset - midDay);
    }

   function setupSettings() {
    // Регистрируем компонент погоды
    Lampa.SettingsApi.addComponent({
        component: "weather_settings",
        name: "Виджет погоды",
        icon:
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M7 16C4 16 2 14 2 11C2 8 4 6 7 6C7 4 9 2 12 2C15 2 17 4 17 6C19 6 21 8 21 11C21 14 19 16 17 16H7Z" fill="currentColor"/>' +
            '<path d="M5 18L4 21M10 18L9 21M15 18L14 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
            "</svg>"
    });

    // Параметр: API ключ
    Lampa.SettingsApi.addParam({
        component: "weather_settings",
        param: {
            name: "weather_api_key",
            type: "input",
            values: "",
            placeholder: "Введите API ключ",
            default: ""
        },
        field: {
            name: "API ключ",
            description: "Введите свой API ключ для получения данных о погоде."
        },
        onChange: function (value) {
            if (value) {
                localStorage.setItem("weatherApiKey", value);
                API_KEY = value;
                getWeatherByCity(city, 1, true);
            }
        }
    });

    // Параметр: город
    Lampa.SettingsApi.addParam({
        component: "weather_settings",
        param: {
            name: "weather_location",
            type: "input",
            values: localStorage.getItem("weatherLocation") || "",
            placeholder: "Введите город",
            default: localStorage.getItem("weatherLocation") || ""
        },
        field: {
            name: "Город",
            description: "Введите название города для прогноза погоды (по умолчанию Санкт-Петербург)"
        },
        onChange: function (value) {
            if (value && typeof value === "string") {
                localStorage.setItem("weatherLocation", value);
                city = value;
                Lampa.Storage.set(WEATHER_CACHE_KEY, {});
                Lampa.Noty.show("Выбран город " + city);
                getWeatherByCity(value, 1, true);
            }
        }
    });

    // Параметр: кнопка получения API
    Lampa.SettingsApi.addParam({
        component: "weather_settings",
        param: {
            name: "get_api_link",
            type: "button",
            default: false
        },
        field: {
            name: "Получить API",
            description: "Нажмите, чтобы перейти на сайт для получения API ключа."
        },
        onChange: function () {
            if (typeof AndroidOpenUrl === "function") {
                AndroidOpenUrl("https://www.weatherapi.com/signup.aspx");
            } else {
                window.open("https://www.weatherapi.com/signup.aspx", "_blank");
            }
        }
    });

    // Подключаем слушателя для правильного отображения в настройках
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


    // === автообновление погоды каждый час ===
    function setupHourlyUpdater() {
      var now = getCurrentTime();
      lastUpdateHour = now.hour;
      setInterval(function () {
        var current = getCurrentTime();
        if (current.hour !== lastUpdateHour) {
          lastUpdateHour = current.hour;
          console.log("Weather","⏰ Новый час:", current.hour, "— обновляем погоду");
          var currentCity = localStorage.getItem("weatherLocation") || city;
          // форсируем новый запрос
          getWeatherByCity(currentCity, 1, true);
        }
      }, 60 * 1000); // проверка раз в минуту
    }

    // публичные методы
    this.create = function () {
      createWeatherWidget();
      setupSettings();
      setupModalHandlers();
      setupHourlyUpdater();
      html.hide();
      // начальное получение погоды
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
        console.log("Weather"," Обновление из API");
        Lampa.Storage.set(LAST_API_UPDATE_KEY, now);
        getWeatherByCity(city, 1, true);
      } else {
        console.log("Weather"," Обновление из кэша");
        var cachedWeather = getStoredWeatherData();
        if (cachedWeather) processWeatherData({ weather: cachedWeather });
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
      var weatherInterface = new WeatherInterface();
      weatherInterface.create();
      setInterval(function () {
        weatherInterface.getWeather();
      }, CACHE_REFRESH_MS);
    }, 3000);
  });
})();
