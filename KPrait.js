"use strict";

// Проверяем, не были ли плагины уже загружены
if (window.lampa_listener_extensions && window.imdb_vote_plugin) {
  // Если плагины уже загружены, просто выходим из функции
  console.log("Плагины уже загружены.");
} else {
  function initCardListener() {
    // Модифицируем Card.prototype только если это еще не сделано
    if (!window.lampa_listener_extensions) {
      window.lampa_listener_extensions = true;

      Object.defineProperty(window.Lampa.Card.prototype, "build", {
        get: function () {
          return this._build;
        },
        set: function (value) {
          this._build = function () {
            value.apply(this);
            Lampa.Listener.send("card", {
              type: "build",
              object: this,
            });
          }.bind(this);
        },
      });
    }

    // Добавляем обработчик рейтинга IMDb или КиноПоиск
    if (!window.imdb_vote_plugin) {
      window.imdb_vote_plugin = true;

      Lampa.Listener.follow("card", function (event) {
        if (event.type === "build") {
          const voteElement = $(".card__vote", event.object.card);
          const useImdbRating = Lampa.Storage.get("use_imdb_rating", true); // По умолчанию IMDb
          const useKpRating = Lampa.Storage.get("use_kp_rating", false); // По умолчанию не КиноПоиск
          const useTmdbRating = !useImdbRating && !useKpRating; // По умолчанию TMDb если IMDb и КиноПоиск выключены

          if (voteElement.length) {
            if (useImdbRating && event.object.data.imdb_rating) {
              // Если выбран IMDb
              voteElement.text(event.object.data.imdb_rating);
              voteElement.css({
                "font-weight": "bold",
                color: "#0065A1", // IMDb-синий
              });
            } else if (useKpRating && event.object.data.kp_rating) {
              // Если выбран КиноПоиск
              voteElement.text(event.object.data.kp_rating);
              voteElement.css({
                "font-weight": "bold",
                color: "#f5c518", // КиноПоиск-желтый
              });
            } else if (useTmdbRating && event.object.data.tmdb_rating) {
              // Если выбран TMDb
              voteElement.text(event.object.data.tmdb_rating);
              voteElement.css({
                "font-weight": "bold",
                color: "#999", // TMDb-серый
              });
            }
          }
        }
      });
    }
  }

  // Универсальная функция запуска
  function start() {
    // Проверяем наличие необходимых объектов
    if (!window.Lampa || !window.Lampa.Listener || !window.Lampa.Card) {
      console.warn("Lampa objects not available");
      return;
    }
    initCardListener();
  }

  // Запускаем сразу или ждем готовности приложения
  if (window.appready) {
    start();
  } else {
    Lampa.Listener.follow("app", function (event) {
      if (event.type === "ready") start();
    });
  }

  // === Добавляем пункты для выбора рейтинга ===

  Lampa.SettingsApi.addComponent({
    component: "rating_choice",
    name: "Рейтинг",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="rating-star">
    <path d="M12 2L14.5 8.5L21 9L16 13L17.5 20L12 16.5L6.5 20L8 13L3 9L9.5 8.5L12 2Z" stroke="currentColor" stroke-width="2"/>
  </svg>
  <style>
    .rating-star {
      color: white;  /* Белый контур по умолчанию */
      fill: black;   /* Чёрный центр по умолчанию */
      transition: all 0.5s;
    }
    .rating-star:focus {
      color: black !important;  /* Чёрный контур при фокусе */
      fill: white !important;   /* Белый центр при фокусе */
    }
  </style>`,
  });
  // Кнопка для выбора "Рейтинг TMDb" (по умолчанию)
  Lampa.SettingsApi.addParam({
    component: "rating_choice",
    param: {
      type: "button",
    },
    field: {
      name: "Рейтинг TMDb",
    },
    onChange: function () {
      // Отключаем IMDb и КиноПоиск
      Lampa.Storage.set("use_imdb_rating", false);
      Lampa.Storage.set("use_kp_rating", false);
      Lampa.Noty.show("Выбран рейтинг TMDb");
    },
  });

  // Кнопка для выбора "Рейтинг КиноПоиск"
  Lampa.SettingsApi.addParam({
    component: "rating_choice",
    param: {
      type: "button",
    },
    field: {
      name: "Рейтинг КиноПоиск",
    },
    onChange: function () {
      // Отключаем IMDb и включаем КиноПоиск
      Lampa.Storage.set("use_imdb_rating", false);
      Lampa.Storage.set("use_kp_rating", true);
      Lampa.Noty.show("Выбран рейтинг КиноПоиск");
    },
  });

  // Кнопка для выбора "Рейтинг IMDb"
  Lampa.SettingsApi.addParam({
    component: "rating_choice",
    param: {
      type: "button",
    },
    field: {
      name: "Рейтинг IMDb",
    },
    onChange: function () {
      // Включаем IMDb и отключаем КиноПоиск
      Lampa.Storage.set("use_imdb_rating", true);
      Lampa.Storage.set("use_kp_rating", false);
      Lampa.Noty.show("Выбран рейтинг IMDb");
    },
  });
}
