(function () {
    'use strict';

    const PLUGIN_NAME = 'continue_watching';

    // ---------- Данные из lampac ----------
    function getContinueData(movie) {
        if (!movie) return null;
        const originalTitle = movie.original_title || movie.original_name || '';
        if (!originalTitle) return null;
        const hash = Lampa.Utils.hash(originalTitle);
        const watched = Lampa.Storage.get('online_watched_last', {});
        const info = watched[hash];
        if (!info) return null;
        return {
            season: info.season,
            episode: info.episode,
            balanser: info.balanser,
            balanser_name: info.balanser_name || '',
            voice_name: info.voice_name || ''
        };
    }

    // ---------- Формирование текста кнопки ----------
    function buildLabel(data) {
        const showSeason = Lampa.Storage.get(PLUGIN_NAME + '_show_season', true);
        const showBalancer = Lampa.Storage.get(PLUGIN_NAME + '_show_balancer', false);
        const showVoice = Lampa.Storage.get(PLUGIN_NAME + '_show_voice', false);
        let label = 'Продолжить';
        if (showSeason) label += ` S${data.season}E${data.episode}`;
        if (showBalancer && (data.balanser_name || data.balanser)) label += ` • ${data.balanser_name || data.balanser}`;
        if (showVoice && data.voice_name) label += ` • ${data.voice_name}`;
        return label;
    }

    // ---------- Ожидание и клик по эпизоду ----------
function waitForEpisodeListAndClick() {
    const maxWait = 15000;
    const started = Date.now();

    function findEpisode() {

        const cards = document.querySelectorAll('.online-prestige--full');

        if (!cards.length) {
            if (Date.now() - started < maxWait) {
                return setTimeout(findEpisode, 300);
            }
            return;
        }

        let target = null;
        let bestProgress = -1;

        cards.forEach(card => {

            const line = card.querySelector('.time-line');

            if (!line) return;

            const hash = line.getAttribute('data-hash');

            const timeline = Lampa.Storage.get('file_view', {});

            const item = timeline[hash];

            if (!item) return;

            const progress =
                Number(item.time || 0) +
                Number(item.percent || 0);

            if (progress > bestProgress) {
                bestProgress = progress;
                target = card;
            }
        });

        if (target) {
            $(target).trigger('hover:enter');
            return;
        }

        console.warn('[Continue] Не найден просмотренный эпизод');
    }

    setTimeout(findEpisode, 1000);
}

    // ---------- Пересборка навигации пульта ----------
    function rebuildLampaNavigation(container) {
        try {
            if (!window.Lampa || !window.Lampa.Controller) return;
            const activeController = window.Lampa.Controller.enabled();
            if (!activeController || !activeController.collection) return;
            const htmlButtons = Array.from(container.querySelectorAll('.full-start__button'));
            if (!htmlButtons.length) return;
            activeController.collection.forEach(item => {
                if (item.elements && item.elements.length > 0 && item.elements[0].classList.contains('full-start__button')) {
                    item.elements = htmlButtons;
                    if (typeof item.update === 'function') item.update();
                }
            });
            if (window.Lampa.Navigator) window.Lampa.Navigator.update();
        } catch (e) {
            console.error('[Continue] Navigation rebuild failed:', e);
        }
    }

    // ---------- Добавление кнопки в карточку ----------
function addContinueButton(event) {
    const movie = event.data.movie || event.data.card || event.data || {};
    const continueData = getContinueData(movie);
    if (!continueData) return;

    const render = event.object.activity.render();
    const buttonsContainer = render.find('.full-start-new__buttons');
    if (!buttonsContainer.length || buttonsContainer.find('.button--continue').length) return;

    const label = buildLabel(continueData);

    const button = $(`
        <div class="full-start__button selector button--continue">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M8 5v14l11-7z"/>
            </svg>
            <span>${label}</span>
        </div>
    `);

      button.on('hover:enter', function () {
      
          Lampa.Activity.push({
              component: 'lampac',
              source: continueData.balanser,
              movie: movie
          });
      
          waitForEpisodeListAndClick();
      });
  
    // Ждём, пока другие плагины добавят свои кнопки (YouTube, Rutube и т.д.)
    setTimeout(() => {
        const allButtons = buttonsContainer.children('.full-start__button');
        const position = parseInt(Lampa.Storage.get(PLUGIN_NAME + '_position', '2'));

        if (position === 1) {
            // Первая позиция: вставляем в начало и делаем главной
            buttonsContainer.prepend(button);
            allButtons.removeClass('button--priority');
            button.addClass('button--priority');
            Lampa.Controller.collectionSet(buttonsContainer);
            Lampa.Controller.collectionFocus(button[0]);
        } else {
            // Вставляем после кнопки с индексом (position - 2), т.е. position=2 → после первой
            if (allButtons.length >= position - 1) {
                button.insertAfter(allButtons.eq(position - 2));
            } else {
                buttonsContainer.append(button);
            }
            Lampa.Controller.collectionSet(buttonsContainer);
            
            // Фокус на первую кнопку, если нет приоритетной
            let focusTarget = buttonsContainer.find('.button--priority').first();
            if (!focusTarget.length) {
                focusTarget = buttonsContainer.children('.full-start__button').first();
                focusTarget.addClass('button--priority');
            }
            if (focusTarget.length) {
                Lampa.Controller.collectionFocus(focusTarget[0]);
            }
        }
    }, 200); 
}

    function registerSettings() {
        if (typeof Lampa === 'undefined' || !Lampa.SettingsApi) return;

        Lampa.SettingsApi.addComponent({
            component: PLUGIN_NAME,
            name: 'Продолжить просмотр',
            icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="white" d="M8 5v14l11-7z"/></svg>'
        });

        Lampa.SettingsApi.addParam({
            component: PLUGIN_NAME,
            param: { name: PLUGIN_NAME + '_position', type: 'select', values: ['1','2','3','4','5','6','7','8','9','10'], default: '2' },
            field: { name: 'Позиция кнопки', description: '1 — (делает кнопку последней), 2 — первой 3 - второйи т.д.))))' }
        });
        Lampa.SettingsApi.addParam({
            component: PLUGIN_NAME,
            param: { name: PLUGIN_NAME + '_show_season', type: 'trigger', default: true },
            field: { name: 'Показывать сезон/серию' }
        });
        Lampa.SettingsApi.addParam({
            component: PLUGIN_NAME,
            param: { name: PLUGIN_NAME + '_show_balancer', type: 'trigger', default: false },
            field: { name: 'Показывать балансер' }
        });
        Lampa.SettingsApi.addParam({
            component: PLUGIN_NAME,
            param: { name: PLUGIN_NAME + '_show_voice', type: 'trigger', default: false },
            field: { name: 'Показывать озвучку' }
        });
    }

    // ---------- Старт ----------
    Lampa.Listener.follow('full', function (e) {
        if (e.type === 'complite') {
            setTimeout(() => addContinueButton(e), 50);
        }
    });

    if (window.appready) registerSettings();
    else Lampa.Listener.follow('app', e => { if (e.type === 'ready') registerSettings(); });
})();
