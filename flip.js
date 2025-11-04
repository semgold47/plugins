(function () {
  "use strict";

var style = document.createElement("style");
style.textContent = `
    /* === ОСНОВНЫЕ СТИЛИ КАРТОЧКИ (Android TV optimized) === */
    .card { 
        position: relative; 
        perspective: 1000px; 
        outline: none; 
    }
    
    .card__flip { 
        width: 100%; 
        height: 100%; 
        position: relative; 
        transform-style: preserve-3d; 
        transition: transform 0.6s ease-out; 
        will-change: transform;
    }
    
    /* Переворот карточки */
    .card.hover-enabled.is-flipped .card__flip,
    .card.touch-enabled.is-flipped .card__flip,
    .card.focus-enabled.is-flipped .card__flip,
    .card.focus-enabled.focus .card__flip { 
        transform: rotateY(180deg); 
    }

    /* === СТОРОНЫ КАРТОЧКИ === */
    .card__front, .card__back {
        width: 100%; 
        height: 98%; 
        backface-visibility: hidden;
        position: absolute; 
        top: 0; 
        left: 0;
        border-radius: 1em;
        opacity: 0.9; /* постоянная прозрачность для TV */
        will-change: opacity;
    }

    /* Заголовок на обороте */
    .card__back-title {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 0.2em 0;
        z-index: 2;
        border-radius: 1em;
    }

    /* Отзеркаливание изображения на обороте */
    .card.hover-enabled.is-flipped .card__view,
    .card.touch-enabled.is-flipped .card__view,
    .card.focus-enabled.is-flipped .card__view,
    .card.focus-enabled.focus .card__view {
        width: 100%;
        height: 98%;
        transform: scaleX(-1);
    }
    
    .card__back-title-content {
        font-size: 1em;
        font-weight: bold;
        color: white;
        text-align: center;
        text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
        text-overflow: ellipsis;
    }
    
    .card__back-desc {
        margin-top: 1.5em;
        height: calc(100% - 100px);
    }

    /* Оборот карточки */
    .card__back { 
        transform: rotateY(180deg);
        opacity: 0;
        transition: opacity 0.3s 0.3s ease-out;
        border: 1px solid;
        display: flex; 
        flex-direction: column; 
        justify-content: space-between;
        will-change: opacity;
    }

    /* Отображение оборота */
    .card.hover-enabled.is-flipped .card__back,
    .card.touch-enabled.is-flipped .card__back,
    .card.focus-enabled.is-flipped .card__back,
    .card.focus-enabled.focus .card__back { 
        opacity: 0.9; 
    }
    
    .card.focus .card__view::after, 
    .card.hover .card__view::after {
        box-shadow: 0 0 2em #fff, 0 0 0.8em var(--glow-color, #00a2ffd3);
    }
    
    /* Стили рейтингов и контента */
    .raitNew-line-container .vote-item:hover { 
        background: rgba(255,255,255,0.15); 
    }
    
    .raitNew-line-container .vote-item img, 
    .raitNew-line-container .vote-item svg {  
        width: 1.2em; 
        height: 1.2em; 
        object-fit: contain;  
        filter: drop-shadow(0 0 2px rgba(0,0,0,0.7)); 
    }
.raitNew-line-container .vote-item {  
        height: 100%;
    width: min-content;
    align-items: center;
    padding: 0.1em 0.2em;
    border-radius: 0.4em;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    transition: background 0.3s;
}
    .card__back-inner { 
        padding: 0.25em; 
        display: flex; 
        flex-direction: column; 
        justify-content: space-between; 
        width: 100%; 
        height: 100%; 
        box-sizing: border-box;
    }
    
    .card__back-desc { 
        font-size: 1.2em;
        line-height: 1;
        flex: 1;
        overflow: hidden;
        position: relative;
    }
    
    .card__back-desc-content {
        position: relative;
        transition: transform 0.1s linear;
    }
    
    .raitNew-title {
        font-weight: bold;
        font-size: 1.1em;
        margin-bottom: 0.3em;
    }
    
    .raitNew-overview {
        flex: 1;
        font-size: 0.95em;
        line-height: 1.3;
        margin-bottom: 0.5em;
        position: relative;
        overflow-y: auto;
    }
    
    .raitNew-overview::-webkit-scrollbar {
        width: 6px;
    }
    
    .raitNew-overview::-webkit-scrollbar-thumb {
        background: #666;
        border-radius: 3px;
    }
    
    .raitNew-overview::-webkit-scrollbar-track {
        background: #111;
    }

    .raitNew-line-container { 
        display: flex; 
        gap: 0.2em;
        padding: 0.2em 0;
        flex-wrap: nowrap;
        align-items: center;
        overflow-x: hidden;
    }

    .raitNew-line {
        flex: none;
        font-size: 0.9em;
        height: 100%;
        align-items: center;
        padding: 0.3em 0.5em;
        border-radius: 0.5em;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        transition: background 0.3s;
        align-content: flex-end;
    }
        .card__vote {
        padding: 0.3em 0.2em;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 0.5em;
        }

    /* Скрытие элементов при перевороте */
    .card.is-flipped .card__type,
    .card.is-flipped .card__vote,
    .card.is-flipped .card__quality,
    .card.is-flipped .card__icons,
    .card.is-flipped .card__title,
    .card.is-flipped .card__age,
    .card.is-flipped .card-watched,
    .card.focus-enabled.focus .card__type,
    .card.focus-enabled.focus .card__vote,
    .card.focus-enabled.focus .card__quality,
    .card.focus-enabled.focus .card__title,
    .card.focus-enabled.focus .card__age,
    .card.focus-enabled.focus .card__icons,
    .card.focus-enabled.focus .card-watched {
        display: none !important;
    }
    
/* ===== СИСТЕМА ТЕМ НА ОСНОВЕ CSS ПЕРЕМЕННЫХ ===== */
    
    /* Общие переменные для всех тем */
    .card__back {
        --bg-gradient: linear-gradient(145deg, rgb(5,50,55) 0%, rgb(8,65,70) 20%, rgb(4,40,45) 40%, rgb(2,30,35) 60%, rgb(4,40,45) 80%, rgb(5,50,55) 100%);
        --border-color: rgba(100,200,255,0.3);
        --text-color: #e0f7fa;
        --glow-color: #00a2ffd3;
        --title-bg: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%);
        
        background: var(--bg-gradient);
        border-color: var(--border-color);
        color: var(--text-color);
        box-shadow: 0 0 2em #fff, 0 0 0.8em var(--glow-color);
    }
    
    .card__back-title {
        background: var(--title-bg);
    }
    
    /* Адаптация заголовков для разных тем */
    .theme-dark .card__back-title {
        background: linear-gradient(180deg, rgba(20,20,20,0.9) 0%, transparent 100%);
    }
    
    .theme-blue .card__back-title {
        background: linear-gradient(180deg, rgba(0,50,100,0.8) 0%, transparent 100%);
    }
    
    .theme-red .card__back-title {
        background: linear-gradient(180deg, rgba(100,0,0,0.8) 0%, transparent 100%);
    }
    
    .theme-neon-blue .card__back-title {
        background: linear-gradient(180deg, rgba(0,100,255,0.7) 0%, transparent 100%);
    }
    
    .theme-neon-purple .card__back-title {
        background: linear-gradient(180deg, rgba(100,0,255,0.7) 0%, transparent 100%);
    }
    
    .theme-neon-green .card__back-title {
        background: linear-gradient(180deg, rgba(0,255,100,0.7) 0%, transparent 100%);
    }
    
    .theme-neon-orange .card__back-title {
        background: linear-gradient(180deg, rgba(255,100,0,0.7) 0%, transparent 100%);
    }
    
    .theme-cyberpunk .card__back-title {
        background: linear-gradient(180deg, rgba(255,0,150,0.6) 0%, transparent 100%);
    }
    
    .theme-galaxy .card__back-title {
        background: linear-gradient(180deg, rgba(50,0,100,0.8) 0%, transparent 100%);
    }
    
    .theme-sunset .card__back-title {
        background: linear-gradient(180deg, rgba(255,100,0,0.7) 0%, transparent 100%);
    }
    
    .theme-purple .card__back-title {
        background: linear-gradient(180deg, rgba(80,0,80,0.8) 0%, transparent 100%);
    }
    
    .theme-gold .card__back-title {
        background: linear-gradient(180deg, rgba(180,150,0,0.7) 0%, transparent 100%);
    }
    
    .theme-ocean .card__back-title {
        background: linear-gradient(180deg, rgba(0,80,120,0.8) 0%, transparent 100%);
    }
    
    .theme-twilight .card__back-title {
        background: linear-gradient(180deg, rgba(40,0,60,0.8) 0%, transparent 100%);
    }
    
    .theme-graphite .card__back-title {
        background: linear-gradient(180deg, rgba(40,40,40,0.9) 0%, transparent 100%);
    }
    
    .theme-teal .card__back-title {
        background: linear-gradient(180deg, rgba(0,100,100,0.8) 0%, transparent 100%);
    }
    
    /* Синяя тема (оригинальная) */
    .card__back.theme-blue {
        --bg-gradient: linear-gradient(145deg, rgb(5,50,55) 0%, rgb(8,65,70) 20%, rgb(4,40,45) 40%, rgb(2,30,35) 60%, rgb(4,40,45) 80%, rgb(5,50,55) 100%);
        --border-color: rgba(100,200,255,0.3);
        --text-color: #e0f7fa;
        --glow-color: #00a2ffd3;
        --title-bg: linear-gradient(180deg, rgba(0,50,100,0.8) 0%, transparent 100%);
    }
    
    /* Красная тема */
    .card__back.theme-red {
        --bg-gradient: linear-gradient(150deg, #080000 0%, #200000 40%, #3a0000 70%, #a30000 100%);
        --border-color: rgba(255,50,50,0.3);
        --text-color: #ffeaea;
        --glow-color: #ff3030d3;
        --title-bg: linear-gradient(180deg, rgba(100,0,0,0.8) 0%, transparent 100%);
    }
    
    /* Темная тема */
    .card__back.theme-dark {
        --bg-gradient: linear-gradient(145deg, #1c1c1c 0%, #2a2a2a 40%, #202020 70%, #1a1a1a 100%);
        --border-color: rgba(255,255,255,0.1);
        --text-color: #f0f0f0;
        --glow-color: #c0c0c0d3;
        --title-bg: linear-gradient(180deg, rgba(20,20,20,0.9) 0%, transparent 100%);
    }
    
    /* Неон-синяя тема */
    .card__back.theme-neon-blue {
        --bg-gradient: linear-gradient(145deg, #001122 0%, #002244 25%, #003366 50%, #004488 75%, #0055aa 100%);
        --border-color: rgba(0,200,255,0.5);
        --text-color: #e6f7ff;
        --glow-color: #00a2ffd3;
        --title-bg: linear-gradient(180deg, rgba(0,100,255,0.7) 0%, transparent 100%);
    }
    
    /* Неон-фиолетовая тема */
    .card__back.theme-neon-purple {
        --bg-gradient: linear-gradient(145deg, #110022 0%, #220044 25%, #330066 50%, #440088 75%, #5500aa 100%);
        --border-color: rgba(180,70,255,0.5);
        --text-color: #f0e6ff;
        --glow-color: #a030ffd3;
        --title-bg: linear-gradient(180deg, rgba(100,0,255,0.7) 0%, transparent 100%);
    }
    
    /* Неон-зеленая тема */
    .card__back.theme-neon-green {
        --bg-gradient: linear-gradient(145deg, #002200 0%, #004400 25%, #006600 50%, #008800 75%, #00aa00 100%);
        --border-color: rgba(100,255,100,0.5);
        --text-color: #e8ffe8;
        --glow-color: #30ff30d3;
        --title-bg: linear-gradient(180deg, rgba(0,255,100,0.7) 0%, transparent 100%);
    }
    
    /* Неон-оранжевая тема */
    .card__back.theme-neon-orange {
        --bg-gradient: linear-gradient(145deg, #221100 0%, #442200 25%, #663300 50%, #884400 75%, #aa5500 100%);
        --border-color: rgba(255,150,0,0.5);
        --text-color: #fff8e1;
        --glow-color: #ff8030d3;
        --title-bg: linear-gradient(180deg, rgba(255,100,0,0.7) 0%, transparent 100%);
    }
    
    /* Киберпанк тема */
    .card__back.theme-cyberpunk {
        --bg-gradient: linear-gradient(145deg, #0a0a2a 0%, #1a1a4a 25%, #2a2a6a 50%, #3a3a8a 75%, #4a4aaa 100%);
        --border-color: rgba(0,255,200,0.5);
        --text-color: #ccfff0;
        --glow-color: #00ffccd3;
        --title-bg: linear-gradient(180deg, rgba(255,0,150,0.6) 0%, transparent 100%);
    }
    
    /* Галактическая тема */
    .card__back.theme-galaxy {
        --bg-gradient: linear-gradient(145deg, #0f0c29 0%, #302b63 25%, #24243e 50%, #3a3563 75%, #4a4376 100%);
        --border-color: rgba(150,100,255,0.5);
        --text-color: #e6e6fa;
        --glow-color: #9060ffd3;
        --title-bg: linear-gradient(180deg, rgba(50,0,100,0.8) 0%, transparent 100%);
    }
    
    /* Закатная тема */
    .card__back.theme-sunset {
        --bg-gradient: linear-gradient(145deg, #2c003e 0%, #4c007e 25%, #6d00be 50%, #8d00fe 75%, #ad5eff 100%);
        --border-color: rgba(255,150,100,0.5);
        --text-color: #ffe8e0;
        --glow-color: #ff8060d3;
        --title-bg: linear-gradient(180deg, rgba(255,100,0,0.7) 0%, transparent 100%);
    }
    
    /* Фиолетовая тема */
    .card__back.theme-purple {
        --bg-gradient: linear-gradient(145deg, #1a0033 0%, #2d004d 25%, #400066 50%, #520080 75%, #650099 100%);
        --border-color: rgba(180,70,255,0.4);
        --text-color: #f0e6ff;
        --glow-color: #a030ffd3;
        --title-bg: linear-gradient(180deg, rgba(80,0,80,0.8) 0%, transparent 100%);
    }
    
    /* Золотая тема */
    .card__back.theme-gold {
        --bg-gradient: linear-gradient(145deg, #332100 0%, #664200 25%, #996300 50%, #cc8400 75%, #ffa500 100%);
        --border-color: rgba(255,215,0,0.4);
        --text-color: #fff8e1;
        --glow-color: #ffd700d3;
        --title-bg: linear-gradient(180deg, rgba(180,150,0,0.7) 0%, transparent 100%);
    }
    
    /* Океанская тема */
    .card__back.theme-ocean {
        --bg-gradient: linear-gradient(145deg, #001f3f 0%, #003366 25%, #00478f 50%, #0059b8 75%, #0074D9 100%);
        --border-color: rgba(0,150,255,0.4);
        --text-color: #e6f7ff;
        --glow-color: #0074d9d3;
        --title-bg: linear-gradient(180deg, rgba(0,80,120,0.8) 0%, transparent 100%);
    }
    
    /* Сумеречная тема */
    .card__back.theme-twilight {
        --bg-gradient: linear-gradient(145deg, #0f0c29 0%, #302b63 25%, #24243e 50%, #3a3563 75%, #4a4376 100%);
        --border-color: rgba(150,100,255,0.4);
        --text-color: #e6e6fa;
        --glow-color: #9060ffd3;
        --title-bg: linear-gradient(180deg, rgba(40,0,60,0.8) 0%, transparent 100%);
    }
    
    /* Графитовая тема */
    .card__back.theme-graphite {
        --bg-gradient: linear-gradient(145deg, #1a1a1a 0%, #2b2b2b 25%, #3c3c3c 50%, #4d4d4d 75%, #5e5e5e 100%);
        --border-color: rgba(200,200,200,0.3);
        --text-color: #f5f5f5;
        --glow-color: #c0c0c0d3;
        --title-bg: linear-gradient(180deg, rgba(40,40,40,0.9) 0%, transparent 100%);
    }
    
    /* Бирюзовая тема */
    .card__back.theme-teal {
        --bg-gradient: linear-gradient(145deg, #003333 0%, #004d4d 25%, #006666 50%, #008080 75%, #009999 100%);
        --border-color: rgba(0,200,200,0.4);
        --text-color: #e0ffff;
        --glow-color: #00ccccd3;
        --title-bg: linear-gradient(180deg, rgba(0,100,100,0.8) 0%, transparent 100%);
    }
         

    
    .card__back-title {
        background: var(--title-bg);
            border-radius: 1em 1em 0 0;
    }

    /* === Оптимизация для Android TV === */
    @media screen and (min-width: 1920px) {
        .card__front, .card__back {
            opacity: 0.9 !important;
            animation: none !important;
            transition: none;
        }
    }

    /* Фокус для навигации пультом */
    .card:focus-visible {
        outline: 3px solid var(--glow-color, #00a2ffd3);
        outline-offset: 3px;
    }
`;
document.head.appendChild(style);

  var icons = {
    imdb: {
      html: '<img style=" width: 1.5em; object-fit: contain;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFbElEQVR4nO2czYsbZRzH9+QfkczkfZPJy0wyb0m62SS7SVbBtaKgoCiIoKIVEboeag9bKvYN24MvvbgqbZVWPAjFKqUHlbbQTkEU8ahgoSt60YPWgwZ+8syaNG8zO7tJNjPp9wNfws488+xMPnle5oWZmQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACYCKlU6h6e9x/jON8vPO8nxD+2cJxvneN8R9l3bimEFZj0jvJ3WTjOd8ROyDordOOMTE2jiBjjy/XTcrulWAppWZv0zjbvkrS+bwgx3BEIMdwVCDHcFQgx3BUIMdwVCDGmXEgqwVue8KQE3lE5lmScp7+vFrrqfmtf2nab9BbqbyUU5EgRg7T/OYF+vaTbHlOlEKOzb1To2CsFCga5vv/pSiGsbKOxNDCd9diVY5HSYfr+Y6Wr7ofvjVKxWBxJ/a3U6w2qVCqkKhKlEgG6/F5u28c01UI0OUnnjopddScTAVpYWBypkM6USiUSZgP03bnuHwKENJZIVRXa90yiXf7nCxolE0HbbYYVwlIo5KlaCNO/1yGkK3Nzc3T/QrRd/rM3s6TmhKGFlMsVUhSlHfZ3bxkxHSbj9J1rdxDSWKLFxRrFY3z7l/raiwKpSs6xkL1PKwPLyHKOHlqK0KGXBPOT/d1bRpFFenc1DSG9EeJBuvm5ZpbfXYvRrl1zjoWcOly1FHJiJWWWYZ+DhHSWcXpMV96X6cF6lELBjZmbKgXp4J4k/fFVYXqEqHKcLp7Mmq0kMcvbDuiTFHLghSSlhZA5/tRq9fbMTZHTppifzmvTIUSRs3R8JUk/ntcoJYQ2Ld9Z/wN1YceEZMU41Wq1get1TaU5LUy3e86pdkxILhMamRD2i3ti9yx9ekIkTbYf0J3WP2ohkpgxW4XdfuWkBK2tZiYjxKqr2I4Q84RNCtLq84I5DXajkGq1as7W7E5Y2YyxMR/xfgthfXE0wtNCMbJxUC4UMhsL0N6nElTSw6Rr2YFlWHc2G+W9N4aIYsaU0NXcxSgFAn5zGtwlKhpyhZDW//ztkk6xCO/o2D0jhC1j3VTnMlVOUybZ/eWXSvOW209KyFbKeUqIrue7lum6RnI22bVM0zQI2YkxhC1TFbFrWb3e6JvFaPLGZXgIGfMsiy2TpZjl9o3/k81EIMSpkOVaYighbFbVO7A3elpMJMx5TgjrOTw5huTl0MArsI2OAb2c914LYT2HJ4U8+2icdF23rEPTVHr5yYTnhHi2hawdyJDWM7A3eqbBZ17PQMhOCWE3hmQpajugf3tWdZ2Qf64VzRPYqeuy/rxcMAd2uwH99tXCUEIeW47SO6+mzc+BQnIindzvXMj6RZ0+PCSSlI5Y7rcshr0phK1jl6vL5XLf+vn5eaoUNi7SbVcImzBks1I7gyYQshSnL96WHB1TXpcoFuUpk4paTkYqlSpl00HvCtnzeMI8Q7ca0JtDCNks7CYYuxn2+5d5x1d7N6tTU3PmBUjPCvngYNocvK0G9OYYhbDLNOwOoNNjCgY42yvR5qNF8QDdvKB5V8g3HymUzUQtB/TmiIWwPp51N3JWoOXFCP11pbClY2L3/lu3b1v1sW6KtQwm4+u1/ofvdkwIe1y0tc1WHyVly9g6NmgL8f71ycSdx0vttrdabxX2UIKeC9HxlVTf46ub1cXW/fCJSo/cF2tfQWCPmeYyQbObctoyxiYEKQ4VCDHcFQgx3BUIMdwVCDHcFQgx3BUIMTwmpPVqDfbah0nvbHPKc+3Uxqs1eN53y07IEacnWIh/JOE432FLIexVQUxKq6Ug/jHGd4vJsH09EwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDMOPkPas+57d+du5IAAAAASUVORK5CYII=" alt="imdb">' },
    tmdb: {
      html: '<img  style=" width: 1.5em; object-fit: contain;" src="data:image/png;base64,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" alt="themoviedb">',
    },
    kp: {
      html: '<img src="https://semgold47.github.io/plugins/kp.svg" class="rating-icon"/>',
    },
    kp_rating: {
      html: '<img src="https://semgold47.github.io/plugins/kp.svg" class="rating-icon" style="object-fit: contain"/>',
    },
    tomatoes: { html: '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Rotten_Tomatoes_logo.svg" class="rating-icon"  style=" width: 1.5em; object-fit: contain;"/>', },
    rtRating: { html: '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Rotten_Tomatoes_logo.svg" class="rating-icon"  style=" width: 1.5em; object-fit: contain;"/>', },
  metacriticRating:  {
      html: '<img style=" width: 1.5em; object-fit: contain;" src="https://img.icons8.com/color/48/metascore.png" alt="metascore"/>',
    },
    metacritic: {
      html: '<img style=" width: 1.5em; object-fit: contain;" src="https://img.icons8.com/color/48/metascore.png" alt="metascore"/>',
    },
    oscars: {
      html: '<img style=" width: 1.5em; object-fit: contain;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFNklEQVR4nNWZXWhbZRjHX8E7RbzUC/FaGMI+3NS1TdMkJzn5Ol85XznJOUmaZG23VTeHVSvrCtvcQJHdqBcqDAUR3JCpbCK6yXRjm6xp2s1O3I0gFGRsbFN2sfGX520SbA2CgtubH7w3yc3z+/Oc531Owtj/wNTU1P2mX33NCmqLpl9d1AvlPfQZ6xVMv7rfKddhl+swgypMfxhqIdjDegW7vGmRip85thWzxzYh5w9DL5QWWa9glWpXSeBGczOunlFhFCvQvfJN1itYQfWcVaph4fgoml/oXEDNl35gPcJ9ZjD8GfX+t4fHcPSgDb1QhuIGh+k7JjJmUC1ZpdplSp8Ezh/djFOHXGheCapXQsYt/pyyXI+JiBkMT7Ynz/jzdZw6sgX4aTMwl8FXH+qojRaQdYrIOEWkcs6LTDTsSv0qCZw4tAV3Lj0H/OgDc1lgLgU0k7g9k8Dn72tI2wWkTO8KEw27XL9D6d+5tAWYU3nyvHguIAPNBG7PSFwgaXq3mWjYpdot6v1b86Ot4tOd9Kl4NOO4eVZC2vIgm+4fTDSsoHqDBK43Rrqmj1kJV75LIGXmkTTy15ho5ILqLzR5fjs32jV9Evj1RALJXB4Jw77MRMMoVs7QzrPwzUjX9OnMfJrkAnHNPslEQy+WPyKB45+0ngGevtxJH7MxHHk3AznnIq7aB5loqF4poKVt3+4qMG/8LX3MRvHqRA4Jw8FQNucw0VCU4GHdK12nteGVCQ9oppalv2ObydNP6M619YnEQ0xE0m7B4GtDPgAWgmXpLz28DuIZQ2Eio7YFLlU66ZMAT99wwERH9UpQXH+FQKTVPnYPCOQDvrRhodxJH42hpfbRekBAcf2WQKmTPhfQ7d4QyDrFa7Qy/97wO+lfPx3hxUuqJd4KsZKM4zVo47zwZamT/vnDcS4QU83zTHSSprefBN5+3QeaEtAI441pBZJmIZo19jLRyTj+k7QyexUPuGAAjUGYnknpI6ZZq5joxDXvUVqZucBFjwvk8jkuEEqajzDRkQ1bplt38uUCcMHmAtvHVUQVE2HVkJjoyDnnBRJ474APzGtAI4QDu1OIZHMIp41tTHSSujtJt+4Hb9FDnOQC7+xLcoFQWn+JiY6kWWW6dd/cW1gSmBnA7sk0IlkDYTnrM9GR9HyYBHZsd5d+Vpnpx9iogqGMjsG0GmKiE9b1x2ltKFZsYF4HZvpgeSrCaR39kvIYE52QaT5It65qW8BFkwvIusYFYrHCA0xUErp7rr0yt9YGPjqp93n7pDSEUioGZAV98expJhpy64WFL220NvDic7x4Sp+KDyUV9Cey6ItnIGz609PTCIIAvu+jWCyiUCjA8zzk83lomsYFNsbT2BhLnWKiIBvO2Xb6u3bt4sXToeLpUPFtAUqfBJ6Nyt8zkWj3/tTUVNf0XdflAjx9KS1WC7UFqPf/SUBV1aX0YynxBOKtyUMC3Yp3HAeKovD0n4kmxROQNIsL7Ny5s6uAbdtcgNIXUiDWmvsk8Nfi6VD6JJDNZrnA01FZDIGUZq2Kac54TDEPkQDN/ZUC7fTbApT+hoiMdYPSx2tD8ZENA9En7knxsu6cXHlxGV6AiYmJZaOznb5lWfwh7peWBNaH43gqLGFtKIbVA9Gv77oAFU+Tx6vUMLJ1HKNjY6jX67z/u6VvmiY/NErTmSyGJBl90QTWDESxZiBy91vq36wNNHnavb8y/TUDUazuvwcCcc0+0548VDx/YUkvX9o6a0NrdJLA+qEEF1g32BaIYHX/0H/+x+ZP07lkQ4nz4iEAAAAASUVORK5CYII=" alt="external-Oscar-vote-and-reward-those-icons-lineal-color-those-icons">',
    },
    emmy: {
      html: '<img src="https://www.svgrepo.com/show/201360/emmy.svg" class="rating-icon" width="35" style="object-fit: contain"/>',
    },
    awards: { html: "🥇" },
    avg: { html: "✨" },
    trakt: { html: '<svg xmlns="http://www.w3.org/2000/svg" style=" width: 1.5em; object-fit: contain;" viewBox="0 0 24 24"><title>Trakt SVG Icon</title><path fill="#ff0000" d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12s-5.385 12-12 12m0-22.789C6.05 1.211 1.211 6.05 1.211 12S6.05 22.79 12 22.79S22.79 17.95 22.79 12S17.95 1.211 12 1.211m-7.11 17.32A9.6 9.6 0 0 0 12 21.644a9.6 9.6 0 0 0 4.027-.876l-6.697-6.68zm14.288-.067a9.65 9.65 0 0 0 2.484-6.466c0-3.885-2.287-7.215-5.568-8.76l-6.089 6.076l9.164 9.15zm-9.877-8.429L4.227 15.09l-.679-.68l5.337-5.336l6.23-6.225A9.8 9.8 0 0 0 12 2.34C6.663 2.337 2.337 6.663 2.337 12c0 2.172.713 4.178 1.939 5.801l5.056-5.055l.359.329l7.245 7.245a3 3 0 0 0 .42-.266L9.33 12.05l-4.854 4.855l-.679-.679l5.535-5.535l.359.331l8.46 8.437c.135-.1.255-.215.375-.316L9.39 10.027l-.083.015zm3.047 1.028l-.678-.676l4.788-4.79l.679.689l-4.789 4.785zm4.542-6.578l-5.52 5.52l-.68-.679l5.521-5.52l.679.684z"/></svg>'},
    letterboxd: {  html: '<img  style=" width: 1.5em; object-fit: contain;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Letterboxd_2018_logo_%28vertical%29.svg/1200px-Letterboxd_2018_logo_%28vertical%29.svg.png" class="rating-icon" width="35" style="object-fit: contain"/>',},
    popcorn: { html: "🍿" },
    nominations: { html: "🏆" }
  };

const API_PARAMS = {
    omdb_url: "https://www.omdbapi.com/",
    OMDB_API_KEY: Lampa.Storage.get("omdb_api_key", ""),
    MDBLIST_API_KEY: Lampa.Storage.get("mdblist_api_key", ""),
    MDBLIST_URL: "https://mdblist.com/api/",
};

// ===  СИСТЕМА КЭШИРОВАНИЯ (для совместимости с плагинами) ===
const CACHE_KEY = "rait_boxoffice_cache_v2";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
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

// === УЛУЧШЕННАЯ СИСТЕМА КЭШИРОВАНИЯ (совместимая с вашей) ===
const CACHE_KEYS = {
    combined: "rait_combined_cache_v2",
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

// === ОБНОВЛЕННЫЙ ПАРСИНГ ДАННЫХ ===
function parseAwards(awardsText) {
    if (typeof awardsText !== "string") return null;
    
    const result = { oscars: 0, emmy: 0, awards: 0, nominations: 0 };
    const patterns = [
        { regex: /Won (\d+) Oscars?/i, key: 'oscars' },
        { regex: /Won (\d+) Primetime Emmys?/i, key: 'emmy' },
        { regex: /Another (\d+) wins?/i, key: 'awards' },
        { regex: /(\d+) wins?/i, key: 'awards' },
        { regex: /(\d+) nominations?/i, key: 'nominations' }
    ];

    patterns.forEach(({ regex, key }) => {
        const match = awardsText.match(regex);
        if (match) result[key] = parseInt(match[1]) || 0;
    });

    return result;
}

function extractRatingsFromCardData(movieData) {
    if (!movieData || typeof movieData !== "object") return {};
    
    const ratings = {};
    const sources = [
        { key: "tmdb", val: movieData.vote_average || movieData.tmdb_rating || movieData.rating },
        { key: "imdb", val: movieData.imdb_rating || movieData.imdb?.rating },
        { key: "kp", val: movieData.kp_rating || movieData.kinopoisk_rating || movieData.kp?.rating }
    ];

    sources.forEach(({ key, val }) => {
        const v = parseFloat(val);
        if (!isNaN(v) && v > 0) {
            // Для TMDB, IMDb, Кинопоиска сохраняем как есть (5.0, 6.4)
            ratings[key] = v.toFixed(1);
        }
    });

    return ratings;
}

// === API ЗАПРОСЫ ===
function getImdbIdFromTmdb(id, type, cb) {
    if (!id) return cb(null);
    
    const contentType = type === "movie" ? "movie" : "tv";
    const cached = getCache(`${contentType}_${id}`);
    if (cached) return cb(cached);

    const apiKey = (window.Lampa && window.Lampa.TMDB && window.Lampa.TMDB.key) ? window.Lampa.TMDB.key() : "";
    if (!apiKey) return cb(null);

    const url = `https://api.themoviedb.org/3/${contentType}/${id}/external_ids?api_key=${apiKey}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const imdbId = data?.imdb_id || null;
            setCache(`${contentType}_${id}`, imdbId);
            cb(imdbId);
        })
        .catch(error => {
            cb(null);
        });
}

// === ОБНОВЛЕННАЯ ФУНКЦИЯ GETMDBLISTRATINGS ===
function getMDBListRatings(imdbId, callback) {
    if (!imdbId) return callback({});
    
    const cached = cacheManager.get(imdbId);
    if (cached && (cached.tomatoes !== undefined || cached.metacritic !== undefined)) {
        return callback(cached);
    }

    const url = `${API_PARAMS.MDBLIST_URL}?apikey=${API_PARAMS.MDBLIST_API_KEY}&i=${imdbId}`;
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401 && API_PARAMS.MDBLIST_API_KEY !== "") {
                API_PARAMS.MDBLIST_API_KEY = "";
                Lampa.Noty.show("⚠️ Используется ключ MDBList по умолчанию");
                return getMDBListRatings(imdbId, callback);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response format from MDBList');
        }

        const result = {
            // Основные рейтинги
            tomatoes: null,
            tomatoesaudience: null,
            metacritic: null,
            metacriticuser: null,
            trakt: null,
            letterboxd: null,
            rogerebert: null,
            myanimelist: null,
            
            // Награды
            oscars: data.awards?.oscars || 0,
            emmy: data.awards?.emmy || 0,
            awards: data.awards?.wins || 0,
            nominations: data.awards?.nominations || 0
        };

        // Парсим все рейтинги из массива
        if (data.ratings && Array.isArray(data.ratings)) {
            
            
            data.ratings.forEach(rating => {
                if (!rating || !rating.source || rating.value === null || rating.value === undefined) return;
                
                const source = rating.source.toLowerCase();
                const value = parseFloat(rating.value);
                
                if (isNaN(value)) return;
                
                switch(source) {
                    case 'tomatoes':
                        result.tomatoes = Math.round(value).toString();
                        break;
                    case 'tomatoesaudience':
                        result.tomatoesaudience = Math.round(value).toString();
                        break;
                    case 'metacritic':
                        result.metacritic = Math.round(value).toString();
                        break;
                    case 'metacriticuser':
                        result.metacriticuser = Math.round(value).toString();
                        break;
                    case 'trakt':
                        result.trakt = Math.round(value).toString();
                        break;
                    case 'letterboxd':
                        // Letterboxd использует 5-балльную систему, преобразуем в проценты
                        result.letterboxd = Math.round(value * 20).toString();
                        break;
                    case 'rogerebert':
                        // Roger Ebert использует 4-балльную систему, преобразуем в проценты
                        result.rogerebert = Math.round(value * 25).toString();
                        break;
                    case 'myanimelist':
                        // MyAnimeList использует 10-балльную систему, преобразуем в проценты
                        result.myanimelist = Math.round(value * 10).toString();
                        break;
                    case 'imdb':
                    case 'tmdb':
                        // Эти рейтинги уже есть на лицевой стороне, не дублируем
                        break;
                }
            });
        } else if (data.ratings && typeof data.ratings === 'object') {
            // Старый формат для обратной совместимости
            
            
            if (data.ratings.rottenTomatoes?.value) {
                result.tomatoes = Math.round(parseFloat(data.ratings.rottenTomatoes.value)).toString();
            }
            if (data.ratings.metacritic?.value) {
                result.metacritic = Math.round(parseFloat(data.ratings.metacritic.value)).toString();
            }
        }

        

        // Проверяем, есть ли хоть какие-то данные
        const hasValidData = Object.keys(result).some(key => 
            key !== 'oscars' && key !== 'emmy' && key !== 'awards' && key !== 'nominations' && 
            result[key] !== null && result[key] !== 0
        );
        
        if (hasValidData) {
            cacheManager.set(imdbId, result);
            callback(result);
        } else {
            cacheManager.set(imdbId, {}, 60 * 60 * 1000);
            getOMDbRatings(imdbId, callback);
        }
    })
    .catch(error => {
        cacheManager.set(imdbId, {}, 60 * 60 * 1000);
        getOMDbRatings(imdbId, callback);
    });
}


// Улучшенная функция getOMDbRatings
function getOMDbRatings(imdbId, callback) {
    if (!imdbId) return callback({});
    
    const cached = cacheManager.get(imdbId);
    if (cached && (cached.tomatoes !== undefined || cached.metacritic !== undefined)) {
        return callback(cached);
    }

    const url = `${API_PARAMS.omdb_url}?apikey=${API_PARAMS.OMDB_API_KEY}&i=${imdbId}`;
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
    })
    .then(response => {
        if (!response.ok) {
            // Если ошибка 401 (неверный ключ), пробуем ключ по умолчанию
            if (response.status === 401 && API_PARAMS.OMDB_API_KEY !== "") {
                API_PARAMS.OMDB_API_KEY = "";
                Lampa.Noty.show("⚠️ Используется ключ OMDb по умолчанию");
                // Рекурсивно вызываем с ключом по умолчанию
                return getOMDbRatings(imdbId, callback);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        
        if (data && data.Response === "True") {
            const result = {
                tomatoes: null,
                metacritic: null,
                oscars: 0,
                emmy: 0,
                awards: 0,
                nominations: 0
            };

            // Обработка рейтингов
            if (data.Ratings) {
                data.Ratings.forEach(rating => {
                    if (rating.Source === "Rotten Tomatoes") {
                        const match = rating.Value.match(/(\d+)%/);
                        if (match) result.tomatoes = parseFloat(match[1]).toFixed(1);
                    }
                    if (rating.Source === "Metacritic") {
                        const match = rating.Value.match(/(\d+)\/100/);
                        if (match) result.metacritic = parseFloat(match[1]).toFixed(1);
                    }
                });
            }

            // Обработка наград
            if (data.Awards) {
                const awards = parseAwards(data.Awards);
                if (awards) Object.assign(result, awards);
            }

            const hasData = result.tomatoes || result.metacritic || result.oscars > 0 || result.emmy > 0 || result.awards > 0 || result.nominations > 0;
            if (hasData) {
                cacheManager.set(imdbId, result);
            } else {
                // Кэшируем пустой на 1 час
                cacheManager.set(imdbId, {}, 60 * 60 * 1000);
            }
            callback(result);
        } else if (data && data.Error === "Invalid API key!") {
            // Пробуем ключ по умолчанию
            if (API_PARAMS.OMDB_API_KEY !== "") {
                API_PARAMS.OMDB_API_KEY = "";
                Lampa.Noty.show("⚠️ Используется ключ OMDb по умолчанию");
                return getOMDbRatings(imdbId, callback);
            }
            setCache(`omdb_401_${imdbId}`, { timestamp: Date.now() });
            callback({});
        } else {
            cacheManager.set(imdbId, {}, 60 * 60 * 1000);
            callback({});
        }
    })
    .catch(error => {
        cacheManager.set(imdbId, {}, 60 * 60 * 1000);
        callback({});
    });
}

function getExtraRatings(imdbId, callback) {
    const src = Lampa.Storage.get("rating_source", "omdb");
    const fallbackEnabled = Lampa.Storage.get("api_fallback", "enabled") === "enabled";
    
    if (src === "mdblist") {
        if (fallbackEnabled) {
            // С автоматическим переключением
            getMDBListRatings(imdbId, callback);
        } else {
            // Без переключения - только MDBList
            getMDBListRatings(imdbId, (result) => {
                const hasData = result.tomatoes || result.metacritic;
                if (!hasData) {
                }
                callback(result);
            });
        }
    } else {
        getOMDbRatings(imdbId, callback);
    }
}


// === ОБНОВЛЕННАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ РЕЙТИНГА КАРТОЧКИ ===
function updateCardVote(card, movieData) {
    const voteEl = card.querySelector(".card__vote");
    if (!voteEl) {
        return;
    }

    const currentData = movieData || (card.dataset.movieData && JSON.parse(card.dataset.movieData));
    if (!currentData) {
        return;
    }

    // Получаем выбранный источник рейтинга из настроек
    const ratingSource = Lampa.Storage.get("rating", "tmdb");
    
    let ratingValue = null;
    let iconHtml = icons.tmdb.html;

    switch(ratingSource) {
        case "imdb":
            ratingValue = currentData.imdb_rating || currentData.imdb?.rating;
            iconHtml = icons.imdb.html;
            break;
        case "kp":
            ratingValue = currentData.kp_rating || currentData.kinopoisk_rating || currentData.kp?.rating;
            iconHtml = icons.kp.html;
            break;
        case "tomatoes":
        case "metacritic":
            const imdbId = currentData.imdb_id;
            if (!imdbId) {
                // Если нет IMDb ID, используем TMDB как запасной вариант
                ratingValue = currentData.vote_average;
                iconHtml = icons.tmdb.html;
                break;
            }

            const cache = cacheManager.get(imdbId);
            if (cache) {
                if (ratingSource === "tomatoes" && cache.tomatoes) {
                    ratingValue = cache.tomatoes;
                    iconHtml = icons.tomatoes.html;
                } else if (ratingSource === "metacritic" && cache.metacritic) {
                    ratingValue = cache.metacritic;
                    iconHtml = icons.metacritic.html;
                } else {
                    // Если в кэше нет нужного рейтинга, используем TMDB
                    ratingValue = currentData.vote_average;
                    iconHtml = icons.tmdb.html;
                }
            } else {
                // Если кэша нет, используем TMDB как запасной вариант
                ratingValue = currentData.vote_average;
                iconHtml = icons.tmdb.html;
                
                // Асинхронно запрашиваем рейтинги и обновляем когда придут
                getExtraRatings(imdbId, (res) => {
                    if (ratingSource === "tomatoes" && res.tomatoes) {
                        voteEl.innerHTML = `${res.tomatoes} ${icons.tomatoes.html}`;
                    } else if (ratingSource === "metacritic" && res.metacritic) {
                        voteEl.innerHTML = `${res.metacritic} ${icons.metacritic.html}`;
                    }
                });
                return; // Выходим раньше для асинхронного случая
            }
            break;
        default: // tmdb
            ratingValue = currentData.vote_average;
            iconHtml = icons.tmdb.html;
    }

    if (ratingValue) {
        // Для TMDB, IMDb, Кинопоиска показываем с десятичными, для остальных - целые числа
        if (['tmdb', 'imdb', 'kp'].includes(ratingSource)) {
            voteEl.innerHTML = `${parseFloat(ratingValue).toFixed(1)} ${iconHtml}`;
        } else {
            voteEl.innerHTML = `${Math.round(parseFloat(ratingValue))} ${iconHtml}`;
        }
    } else {
    }
}

// === ОБНОВЛЕННАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ ВСЕХ РЕЙТИНГОВ ===
function refreshAllRatings() {
    
    const cards = document.querySelectorAll('.card[data-enhanced]');
    cards.forEach(card => {
        const movieData = card.card_data || (card.dataset.movieData && JSON.parse(card.dataset.movieData));
        if (movieData) {
            if (card.updateBack) {
                card.updateBack(movieData);
            }
            if (card.updateVote) {
                card.updateVote(movieData);
            } else {
                // Если метод updateVote не определен, вызываем напрямую
                updateCardVote(card, movieData);
            }
        }
    });
}

// === ОБНОВЛЕННАЯ ФУНКЦИЯ СОЗДАНИЯ ОБРАТНОЙ СТОРОНЫ ===
function createBackElement(data) {
    const back = document.createElement("div");
    back.className = `card__back theme-${Lampa.Storage.get("card_back_theme") || "blue"}`;
    
    const backInner = document.createElement("div");
    backInner.className = "card__back-inner";
    
    // Создаем заголовок для обратной стороны
    const title = document.createElement("div");
    title.className = "card__back-title";
    
    const titleContent = document.createElement("div");
    titleContent.className = "card__back-title-content";
    
    // Используем название из данных или заглушку
    const titleText = data?.title || data?.name || "Название отсутствует";
    titleContent.textContent = titleText;
    
    title.appendChild(titleContent);
    
    const desc = document.createElement("div");
    desc.className = "card__back-desc";
    const descContent = document.createElement("div");
    descContent.className = "card__back-desc-content";
    descContent.textContent = data?.overview || "Описание отсутствует";
    desc.appendChild(descContent);
    
    const meta = document.createElement("div");
    meta.className = "raitNew-line-container";
    
    // Добавляем элементы в правильном порядке: заголовок, описание, рейтинги
    backInner.appendChild(title);
    backInner.appendChild(desc);
    backInner.appendChild(meta);
    back.appendChild(backInner);
    
    return { back, title, titleContent, desc, descContent, meta };
}

// === ОБНОВЛЕННАЯ ФУНКЦИЯ UPDATECARDBACK ===
function updateCardBack(card, movieData = null) {
    const currentData = movieData || (card.dataset.movieData && JSON.parse(card.dataset.movieData));
    if (!currentData) return;

    const titleContent = card.querySelector(".card__back-title-content");
    const descContent = card.querySelector(".card__back-desc-content");
    const meta = card.querySelector(".raitNew-line-container");
    
    // Обновляем заголовок
    if (titleContent) {
        const titleText = currentData.title || currentData.name || "Название отсутствует";
        titleContent.textContent = titleText;
    }
    
    // Обновляем описание
    if (descContent) {
        descContent.textContent = currentData.overview || "Описание отсутствует";
    }
    
    // Обновляем рейтинги
    if (meta) {
        meta.innerHTML = "";

        // Рейтинги из карточки (TMDB, IMDb, Кинопоиск)
        const cardRatings = extractRatingsFromCardData(currentData);
        Object.keys(cardRatings).forEach(key => addVote(meta, key, cardRatings[key]));

        const imdbId = currentData.imdb_id;
        if (!imdbId) return;

        // Все дополнительные рейтинги из API
        getExtraRatings(imdbId, res => {
            
            // Приоритетные рейтинги (показываем первыми)
            const priorityRatings = ['tomatoes', 'metacritic', 'trakt', 'letterboxd'];
            
            // Сначала добавляем приоритетные
            priorityRatings.forEach(key => {
                if (res[key]) addVote(meta, key, res[key]);
            });
            
            // Затем остальные рейтинги
            Object.keys(res).forEach(key => {
                if (!priorityRatings.includes(key) && res[key] && 
                    [ 'myanimelist'].includes(key)) {
                    addVote(meta, key, res[key]);
                }
            });
            
            // Награды в конце
            if (res.oscars && res.oscars > 0) addVote(meta, 'oscars', res.oscars);
            if (res.emmy && res.emmy > 0) addVote(meta, 'emmy', res.emmy);
            if (res.awards && res.awards > 0) addVote(meta, 'awards', res.awards);
            if (res.nominations && res.nominations > 0) addVote(meta, 'nominations', res.nominations);
        });
    }
}

// === ОБНОВЛЕННАЯ ФУНКЦИЯ ADDVOTE ДЛЯ ВСЕХ РЕЙТИНГОВ ===
function addVote(meta, key, val) {
    if (val == null || val === "" || val <= 0) return;
    if (meta.querySelector(`[data-key="${key}"]`)) return;
    
    let displayValue;
    
    // Определяем формат отображения
    if (['tmdb', 'imdb', 'kp'].includes(key)) {
        // TMDB, IMDb, Кинопоиск: 6.6, 7.8 (десятичные)
        displayValue = parseFloat(val).toFixed(1);
    } else if (['letterboxd', 'rogerebert', 'myanimelist'].includes(key)) {
        // Эти рейтинги уже преобразованы в проценты
        displayValue = val.toString();
    } else {
        // Остальные рейтинги: целые числа
        displayValue = Math.round(parseFloat(val)).toString();
    }
    
    const element = document.createElement("div");
    element.className = "vote-item";
    element.dataset.key = key;
    element.innerHTML = `<span>${icons[key]?.html || "📊"} ${displayValue}</span>`;
    meta.appendChild(element);
}

// === АВТОПРОКРУТКА ===
function startAutoScroll(descElement) {
    if (!descElement) return;

    const content = descElement.querySelector(".card__back-desc-content");
    if (!content) return;

    const rawSpeed = Lampa.Storage.get("card_scroll_speed", "30");
    let scrollSpeed = parseFloat(rawSpeed);
    if (isNaN(scrollSpeed) || scrollSpeed <= 0) scrollSpeed = 30;

    let scrollPosition = 0;
    let isScrolling = false;
    let animationId = null;

    const checkScrollNeeded = () => {
        return content.scrollHeight > descElement.clientHeight;
    };

    if (!checkScrollNeeded()) {
        return;
    }

    function scroll() {
        if (!isScrolling) return;

        const maxScroll = content.scrollHeight - descElement.clientHeight;
        if (maxScroll <= 0) {
            isScrolling = false;
            return;
        }

        scrollPosition += (scrollSpeed / 100) * (30 / 50);

        if (scrollPosition >= maxScroll) {
            scrollPosition = maxScroll;
            setTimeout(() => {
                scrollPosition = 0;
                content.style.transform = `translateY(-${scrollPosition}px)`;
                setTimeout(() => {
                    if (isScrolling) animationId = requestAnimationFrame(scroll);
                }, 200);
            }, 3500);
            return;
        }

        content.style.transform = `translateY(-${scrollPosition}px)`;
        animationId = requestAnimationFrame(scroll);
    }

    function startScroll() {
        if (isScrolling || !checkScrollNeeded()) return;
        isScrolling = true;
        descElement.classList.add("scrolling");

        scrollPosition = 0;
        content.style.transform = `translateY(-${scrollPosition}px)`;

        setTimeout(() => {
            animationId = requestAnimationFrame(scroll);
        }, 3500);
    }

    function stopScroll() {
        isScrolling = false;
        descElement.classList.remove("scrolling");
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        content.style.transform = "translateY(0px)";
    }

    // Добавляем метод stopScroll к элементу
    descElement.stopScroll = stopScroll;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const card = mutation.target;
                if (card.classList.contains('is-flipped')) {
                    hideFrontElements(card);
                    startScroll();
                } else {
                    showFrontElements(card);
                    stopScroll();
                }
            }
        });
    });

    observer.observe(descElement.closest('.card'), { attributes: true });

}

// Функции для скрытия/показа элементов передней стороны
function hideFrontElements(card) {
    const elementsToHide = [
        '.card__type',
        '.card__vote', 
        '.card__quality',
        '.card__icons',
        '.card__title',
         '.card__age',
        '.card-watched'
    ];
    
    elementsToHide.forEach(selector => {
        const element = card.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    });
}

function showFrontElements(card) {
    const elementsToShow = [
        '.card__type',
        '.card__vote',
        '.card__quality',
        '.card__icons', 
         '.card__title',
         '.card__age',
        '.card-watched'
    ];
    
    elementsToShow.forEach(selector => {
        const element = card.querySelector(selector);
        if (element) {
            element.style.display = '';
        }
    });
}

// Глобальная переменная для отслеживания текущей перевернутой карточки
let currentFlippedCard = null;

// Вспомогательные функции для переворота карточек
function flipCardFunc(card, front, type) {
    if (!card.classList.contains("is-flipped")) {
        card.classList.add("is-flipped");
        currentFlippedCard = card;
    }
}

// === УЛУЧШЕННАЯ ФУНКЦИЯ UNFLIPCARD ===
function unflipCard(card) {
    if (card && card.classList.contains("is-flipped")) {
        card.classList.remove("is-flipped");
        if (currentFlippedCard === card) {
            currentFlippedCard = null;
        }
        // Очищаем таймаут если он есть
        if (card._flipTimeout) {
            clearTimeout(card._flipTimeout);
            card._flipTimeout = null;
        }
    }
}

// === ИСПРАВЛЕННЫЕ ОБРАБОТЧИКИ ПЕРЕВОРОТА КАРТОЧКИ ===
function setupFlipHandlers(card) {
    if (Lampa.Storage.get("card_flip_disable_all") === "enabled") {
        return; // Отключаем все перевороты если включена настройка
    }

    card.tabIndex = 0;
    
    let flipTimeout = null;
    
    const handleClick = (e) => {
        if (e.target.closest("a, button, input, select, textarea")) return;
        
        if (card.classList.contains("touch-enabled")) {
            // ДОБАВЛЕНА ПРОВЕРКА: currentFlippedCard существует и не равен текущей карточке
            if (currentFlippedCard && currentFlippedCard !== card) {
                // ДОБАВЛЕНА ПРОВЕРКА: свойство _flipTimeout существует
                if (currentFlippedCard._flipTimeout) {
                    clearTimeout(currentFlippedCard._flipTimeout);
                }
                unflipCard(currentFlippedCard);
            }
            
            if (!card.classList.contains("is-flipped")) {
                flipCardFunc(card, null, "touch");
                currentFlippedCard = card;
                
                clearTimeout(flipTimeout);
                flipTimeout = setTimeout(() => {
                    if (card.classList.contains("is-flipped")) {
                        unflipCard(card);
                    }
                }, 15000);
                
                card._flipTimeout = flipTimeout;
            } else {
                unflipCard(card);
                clearTimeout(flipTimeout);
            }
        }
    };
    
    const handleFocus = () => {
        if (card.classList.contains("focus-enabled") && card.classList.contains("focus")) {
            // ДОБАВЛЕНА ПРОВЕРКА: currentFlippedCard существует и не равен текущей карточке
            if (currentFlippedCard && currentFlippedCard !== card) {
                // ДОБАВЛЕНА ПРОВЕРКА: свойство _flipTimeout существует
                if (currentFlippedCard._flipTimeout) {
                    clearTimeout(currentFlippedCard._flipTimeout);
                }
                unflipCard(currentFlippedCard);
            }
            
            if (!card.classList.contains("is-flipped")) {
                flipCardFunc(card, null, "focus");
                currentFlippedCard = card;
            }
        }
    };
    
    const handleBlur = () => {
        if (card.classList.contains("focus-enabled") && card.classList.contains("is-flipped")) {
            unflipCard(card);
            clearTimeout(flipTimeout);
        }
    };
    
    const handleMouseEnter = () => {
        if (!card.classList.contains("is-flipped") && card.classList.contains("hover-enabled")) {
            // ДОБАВЛЕНА ПРОВЕРКА: currentFlippedCard существует и не равен текущей карточке
            if (currentFlippedCard && currentFlippedCard !== card) {
                // ДОБАВЛЕНА ПРОВЕРКА: свойство _flipTimeout существует
                if (currentFlippedCard._flipTimeout) {
                    clearTimeout(currentFlippedCard._flipTimeout);
                }
                unflipCard(currentFlippedCard);
            }
            
            flipCardFunc(card, null, "hover");
            currentFlippedCard = card;
        }
    };
    
    const handleMouseLeave = () => {
        if (card.classList.contains("is-flipped") && card.classList.contains("hover-enabled")) {
            unflipCard(card);
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e);
        }
    };
    
    // Наблюдатель для фокуса (как в ваших настройках)
    if (card.classList.contains("focus-enabled") && !card.dataset.observer) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    const hasFocus = card.classList.contains("focus");
                    const hasLoaded = card.classList.contains("card--loaded");
                    if (hasFocus && hasLoaded && !card.classList.contains("is-flipped")) {
                        const front = card.querySelector(".card__flip .card__front") || card.querySelector(".card__view");
                        flipCardFunc(card, front, "focus");
                    } else if (!hasFocus && card.classList.contains("is-flipped")) {
                        unflipCard(card);
                    }
                }
            });
        });
        
        observer.observe(card, {
            attributes: true,
            attributeFilter: ["class"],
        });
        
        card.dataset.observer = "true";
        card.observer = observer;
    }
    
    card.addEventListener("click", handleClick);
    card.addEventListener("touchstart", handleClick);
    card.addEventListener("focus", handleFocus);
    card.addEventListener("blur", handleBlur);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("keydown", handleKeyDown);
    
    card._flipHandlers = {
        click: handleClick,
        touchstart: handleClick,
        focus: handleFocus,
        blur: handleBlur,
        mouseenter: handleMouseEnter,
        mouseleave: handleMouseLeave,
        keydown: handleKeyDown
    };
}

// === ФУНКЦИЯ ДЛЯ БЕЗОПАСНОЙ ОЧИСТКИ ОБРАБОТЧИКОВ ===
function cleanupFlipHandlers(card) {
    if (!card || !card._flipHandlers) return;
    
    const handlers = card._flipHandlers;
    
    card.removeEventListener("click", handlers.click);
    card.removeEventListener("touchstart", handlers.touchstart);
    card.removeEventListener("focus", handlers.focus);
    card.removeEventListener("blur", handlers.blur);
    card.removeEventListener("mouseenter", handlers.mouseenter);
    card.removeEventListener("mouseleave", handlers.mouseleave);
    card.removeEventListener("keydown", handlers.keydown);
    
    // Останавливаем наблюдатель если есть
    if (card.observer) {
        card.observer.disconnect();
        card.observer = null;
        delete card.dataset.observer;
    }
    
    // Очищаем таймаут если есть
    if (card._flipTimeout) {
        clearTimeout(card._flipTimeout);
        card._flipTimeout = null;
    }
    
    // Если это текущая перевернутая карточка, сбрасываем
    if (currentFlippedCard === card) {
        currentFlippedCard = null;
    }
    
    delete card._flipHandlers;
}

// === ОБНОВЛЕННАЯ ФУНКЦИЯ ENHANCECARD ===
function enhanceCard(card, data) {
    if (!card || card.dataset.enhanced) return;

    // Очищаем старые обработчики если они есть
    if (card._flipHandlers) {
        cleanupFlipHandlers(card);
    }

    card.dataset.enhanced = "1";

    // Проверяем, не отключены ли все перевороты
    if (Lampa.Storage.get("card_flip_disable_all") === "enabled") {
        return;
    }

    // Включаем flip классы
    ["hover", "touch", "focus"].forEach(type => {
        card.classList.toggle(`${type}-enabled`, Lampa.Storage.get(`card_flip_${type}`) === "enabled");
    });

    // Фронт
    const front = card.querySelector(".card__flip .card__front") || card.querySelector(".card__view");
    if (!front) return;

    // Создаем back
    const { back, desc, descContent, meta } = createBackElement(data);

    // Контейнер flip
    let flip = card.querySelector(".card__flip");
    if (!flip) {
        flip = document.createElement("div");
        flip.className = "card__flip";
        while (card.firstChild) flip.appendChild(card.firstChild);
        card.appendChild(flip);
    }
    flip.appendChild(back);

    // Функция обновления рейтингов
    card.updateBack = function(movieData = data) {
        updateCardBack(card, movieData);
    };

    // Функция обновления рейтинга на лицевой стороне
    card.updateVote = function(movieData = data) {
        updateCardVote(card, movieData);
    };

    // Функция очистки
    card.cleanup = function() {
        cleanupFlipHandlers(card);
        delete card.dataset.enhanced;
    };

    // Сохраняем данные
    if (data) card.dataset.movieData = JSON.stringify(data);

    // Flip handlers
    setupFlipHandlers(card);

    // Автоскролл
    if (Lampa.Storage.get("card_scroll_enabled") !== "disabled") {
        startAutoScroll(desc);
    }

    // Обновляем рейтинги после всех манипуляций с DOM
    setTimeout(() => {
        card.updateBack();
        card.updateVote();
    }, 100);
}

// === ОБНОВЛЕННАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ СИСТЕМЫ КАРТОЧЕК ===
function initCardSystem() {
    
    // Обработка существующих карточек
    setTimeout(() => {
        try {
            const existingCards = document.querySelectorAll(".card:not([data-enhanced])");
            existingCards.forEach(card => {
                try {
                    const data = card.card_data || JSON.parse(card.dataset.movieData || "{}");
                    enhanceCard(card, data);
                    
                    // Принудительно обновляем рейтинг после улучшения карточки
                    setTimeout(() => {
                        if (card.updateVote) {
                            card.updateVote(data);
                        } else {
                            updateCardVote(card, data);
                        }
                    }, 150);
                } catch (error) {
                }
            });
        } catch (error) {
        }
    }, 1500);
    
    // MutationObserver для новых карточек
    const container = document.querySelector('.cards') || document.body; // Адаптировать селектор под структуру DOM (e.g., .cards или .items)
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && node.classList.contains('card') && !node.dataset.enhanced) {
                            try {
                                const data = node.card_data || JSON.parse(node.dataset.movieData || "{}");
                                enhanceCard(node, data);
                                
                                // Принудительно обновляем рейтинг
                                setTimeout(() => {
                                    if (node.updateVote) {
                                        node.updateVote(data);
                                    } else {
                                        updateCardVote(node, data);
                                    }
                                }, 50);
                            } catch (error) {
                            }
                        } else {
                            // Проверяем вложенные карточки
                            const newCards = node.querySelectorAll('.card:not([data-enhanced])');
                            newCards.forEach(card => {
                                try {
                                    const data = card.card_data || JSON.parse(card.dataset.movieData || "{}");
                                    enhanceCard(card, data);
                                    
                                    setTimeout(() => {
                                        if (card.updateVote) {
                                            card.updateVote(data);
                                        } else {
                                            updateCardVote(card, data);
                                        }
                                    }, 50);
                                } catch (error) {
                                }
                            });
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(container, { childList: true, subtree: true });
}

// === ГЛОБАЛЬНАЯ ФУНКЦИЯ ДЛЯ СБРОСА СИСТЕМЫ ===
function resetFlipSystem() {
    
    // Сбрасываем текущую перевернутую карточку
    currentFlippedCard = null;
    
    // Очищаем все обработчики у карточек
    const cards = document.querySelectorAll('.card[data-enhanced]');
    cards.forEach(card => {
        if (card.cleanup) {
            card.cleanup();
        }
    });
    
    // Переинициализируем систему
    setTimeout(initCardSystem, 1500);
}

// === ДОБАВИМ ОБРАБОТЧИК ИЗМЕНЕНИЯ НАСТРОЕК РЕЙТИНГА ===
function initRatingSettings() {
    // Следим за изменениями настроек рейтинга
    if (window.Lampa && window.Lampa.Storage && window.Lampa.Storage.listener) {
        Lampa.Storage.listener.follow('change', (e) => {
            if (e.key === 'rating') {
                setTimeout(refreshAllRatings, 500);
            }
        });
    }
}

// === ОБНОВЛЕННАЯ ФУНКЦИЯ START ===
function start() {
    
    // Инициализируем настройки рейтинга
    initRatingSettings();
    
    if (!window.Lampa?.Listener?.follow) {
        initCardSystem();
        return;
    }
    
    Lampa.Listener.follow("card", (e) => {
        if (e.type === "build" && e.object?.card) {
            setTimeout(() => {
                const card = e.object.card;
                const data = e.object.data || card.card_data || {};
                enhanceCard(card, data);
                
                // Обновляем рейтинг после создания карточки
                if (card.updateBack) setTimeout(() => card.updateBack(data), 200);
                if (card.updateVote) setTimeout(() => card.updateVote(data), 200);
            }, 100);
        }
    });
    
}

// === ДОБАВИМ ФУНКЦИЮ ДЛЯ ПРОВЕРКИ И ВОССТАНОВЛЕНИЯ CARD__VOTE ===
function checkAndRestoreCardVote() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const voteEl = card.querySelector('.card__vote');
        if (voteEl && (!voteEl.innerHTML || voteEl.innerHTML.trim() === '')) {
            const data = card.card_data || JSON.parse(card.dataset.movieData || "{}");
            updateCardVote(card, data);
        }
    });
}

// Автозапуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        start();
        setTimeout(initCardSystem, 1500);
        
        // Проверяем и восстанавливаем card__vote после полной загрузки
        setTimeout(() => {
            checkAndRestoreCardVote();
            refreshAllRatings();
        }, 3000);
    });
} else {
    start();
    setTimeout(initCardSystem, 1500);
    
    // Проверяем и восстанавливаем card__vote после полной загрузки
    setTimeout(() => {
        checkAndRestoreCardVote();
        refreshAllRatings();
    }, 3000);
}

// Периодическая проверка card__vote
setInterval(() => {
    const emptyVotes = document.querySelectorAll('.card__vote:empty');
    if (emptyVotes.length > 0) {
        checkAndRestoreCardVote();
    }
}, 15000);
// Добавляем refreshAllRatings в глобальную область видимости
window.refreshAllRatings = refreshAllRatings;
// Добавляем глобальную функцию для отладки
window.resetFlipSystem = resetFlipSystem;

// === Автообновление при загрузке ===
document.addEventListener("DOMContentLoaded", refreshAllRatings);

// Экспортируем функции кэширования для совместимости с плагинами
window.raitCache = {
    get: getCache,
    set: setCache,
    save: saveCache
};
  // --- Настройки ---
  Lampa.SettingsApi.addComponent({
    component: "rating_info",
    name: "Рейтинг и переворот карточек",
    icon: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEeklEQVR4nO2dy4sdRRSHJ2JifAUNiaCJ/4D6F4S4ULIIuIiOIrgQFXeCCxeKogujYBInymBWgYAL0ZWaRSQiiuDOByZiBLNWxwg+ZxSCj/jJ0ZrQXLseXX3vPbcnvw9mM9V1qup8PVV9u6vvzM01AK4BngVOAr8hxoXl8kTI7dZmzpvJvwtYGVuTIsYyMN+W/L+jVcS4OXdeQph2dOZPn1/+nY7CvCR82GsCPnNqXMCJucT0s6N1tRadAXZGcrxiha10b0akiOZZAqaDBDgjAc5IgDMS4IwEOCMBzkiAMxLgjAQ4IwHOSIAzEuCMBDgjAc5IgDMS4IwEOCMBzkiAMxLgjAQ4IwFrVQCwATgAfAssAfvtd43y9cBCKLeffcDFHeKvH4n/vP0u0n7btvDTwFHgAeDqvuOZRQHWwVH2N8oPtpQf6BB/oaX+Qqb91IbYJ4BLa8dTSzTP0YLywHaWjLLUKP8ucmZeXhD7ssiLImcy7ef4BNhWM55aJikgWT+RhLsLYt/ZI36Or9sk5NqrJRq3b4O5+okEvF4Q+7Ue8Uv4GNjYZTy1ROP2bTBXPzH4s8CmRNyN4XWe2vilPN5lPLVE4/ZtMFc/M/h7EnH3pCqWtG/rDHALcCwR6ufm1VGuvVqicfs2mKtPmqOJuK+kKpa23zjuyUS4+7vG60o0bt8Gc/VJc7ZtGgIuCZeMUWoSlvhLeLOgvx8CP4arsi+AReCmoQsw7m2JeRsZKgXcGjn8dIf+NvkLOFTyQS3azxkQcKwl5ssTEnBl5PCVSgGrvJeTEO3nDAj4Hbhq5NbDT5MQMKb+xnhpqAJGF8HdFDCDAmw6unGoAo43jj8yUAHGi0MV8Aew2e6SAt/PqIC37NYFsN1OmMgxp4YqwHgQ2EUhDgK2N465PreYD1HAO8DhWRXQNc4QBfwJ/FB6sASMX0AnJGCAAoBNkcOXNQVNR0D1rYiuU2/x8V0Dde1IrNweK1L24aYqfqSvdinZxhsXooBD5Hm/Nn5LP59KtHPfhXgZejN5HqqNH8quCNNO7MxffSDTvBcV43j4EGbJf3stfBC7CPgm88V21/aIX8qjJeMp5OBgBISyxcRgPugpuISPSh/KF65XNwxNwI7EgB6esICvgOtKx1PAYtWeprAxK1oOrAuJaJt+tvWIX3Lm/y/5PeK929wuOW0BbVv59nUof6Sl/NWe8VML7mP2zLnjeFK3TxZzyZ+0gA2h00uRzbm58nVhx8KZ8CD+SHPbYsf4o/wKfGkP3e1Ss3m1Uzge26D7XNjf+nn4hkmLeQp4ITXnT02AKEMCnJEAZyTAGQlwRgKckQBnJMAZCXBGApyRAGckwBkJcEYCnJEAZyTAGQlwRgKckQBnJMAZCXBGApyRAGckwBkJcEYCnJEAZyRghgXE/qX5Tu9OrxUSr2MtW+HJmB0xcT41Ac9Mvh0R4WkTsDX1/ZxiYti7EFtW56j58FqQmA6W69tHF4r53FdFirFgOb4jtlpvAfba4hBexRGMBbvStJxabv+bdgL/AJMbblfhELaMAAAAAElFTkSuQmCC" alt="rating-icon"><style>.rating-icon { color: white; }</style>',
  });

    Lampa.SettingsApi.addParam({
    component: "rating_info",
    param: {
        name: "card_back_theme",
        type: "select",
        values: {
            "blue": "Синяя (по умолчанию)",
            "red": "Красная", 
            "dark": "Темная",
            "neon-blue": "Неон-синяя",
            "neon-purple": "Неон-фиолетовая",
            "neon-green": "Неон-зеленая",
            "neon-orange": "Неон-оранжевая",
            "neon-teal": "Неон-бирюзовая",
            "neon-pink": "Неон-розовая",
            "cyberpunk": "Киберпанк",
            "galaxy": "Галактическая",
            "sunset": "Закатная",
            "purple": "Фиолетовая",
            "gold": "Золотая",
            "ocean": "Океанская",
            "twilight": "Сумеречная",
            "graphite": "Графитовая",
            "teal": "Бирюзовая"
        },
        default: "blue",
    },
    field: {
        name: "Тема обратной стороны",
        description: "Выберите тему для обратной стороны карточки"
    },
    onChange: (v) => {
        Lampa.Storage.set("card_back_theme", v);
        // Обновляем тему у всех карточек
        document.querySelectorAll('.card__back').forEach(back => {
            back.className = 'card__back theme-' + v;
        });
    }
});

 // === Настройка источника получения данных (OMDb / MDBList) ===
Lampa.SettingsApi.addParam({
  component: "rating_info",
  param: {
    name: "rating_source",
    type: "select",
    values: { omdb: "OMDb", mdblist: "MDBList" },
    default: "omdb",
  },
  field: {
    name: "Источник данных",
    description:
      "Выберите, откуда брать дополнительные рейтинги (OMDb или MDBList)",
  },
  onChange: function (v) {
    Lampa.Storage.set("rating_source", v);
    Lampa.Noty.show(`🔄 Источник данных: ${v.toUpperCase()}`);
    refreshAllRatings();
  },
});

  // === Настройка выбора источника рейтинга (TMDb, IMDb, КиноПоиск, RT, MC) ===
Lampa.SettingsApi.addParam({
  component: "rating_info",
  param: {
    name: "rating",
    type: "select",
    values: {
      tmdb: "TMDb ⚪",
      imdb: "IMDb 🔵",
      kp: "КиноПоиск 🟡",
      tomatoes: "Rotten Tomatoes 🍅",
      metacritic: "Metacritic 🟢",
    },
    default: "tmdb",
  },
  field: {
    name: "Источник рейтинга на карточках",
        description: "Выберите предпочитаемый источник рейтингов на карточках",
  },
  onChange: function (v) {
    Lampa.Storage.set("use_imdb_rating", v === "imdb");
    Lampa.Storage.set("use_kp_rating", v === "kp");
    Lampa.Storage.set("use_tomatoes_rating", v === "tomatoes");
    Lampa.Storage.set("use_metacritic_rating", v === "metacritic");
    Lampa.Noty.show(`✅ Источник рейтинга: ${v}`);
    refreshAllRatings();
  },
});

  Lampa.SettingsApi.addParam({
    component: "rating_info",
    param: {
        name: "api_fallback",
        type: "select",
        values: {
            "enabled": "Автопереключение при ошибках",
            "disabled": "Не переключаться"
        },
        default: "enabled",
    },
    field: {
        name: "Поведение при ошибках API",
        description: "Автоматически переключаться на запасной источник при ошибках"
    },
});

  Lampa.SettingsApi.addParam({
    component: "rating_info",
    param: { type: "title" },
    field: {
      name: "Управление переворотом",
      description: "Отключение и настройка переворота карточек",
    },
  });

  Lampa.SettingsApi.addParam({
    component: "rating_info",
    param: {
      name: "card_flip_hover",
      type: "select",
      values: { enabled: "Вкл", disabled: "Выкл" },
      default: "disabled",
    },
    field: {
      name: "Переворот при наведении мыши",
      description: "Переворот на ПК, AndroidTV",
    },
  });

    Lampa.SettingsApi.addParam({
    component: "rating_info",
    param: {
      name: "card_flip_focus",
      type: "select",
      values: { enabled: "Вкл", disabled: "Выкл" },
      default: "disabled",
    },
    field: {
      name: "Переворот при фокусе",
      description:
        "Переворот при переключении карточек кнопками пульта (когда карточка фильма получает белую рамку фокуса вокруг )",
    },
    onChange: (v) => {
      Lampa.Storage.set("card_flip_focus", v);
      $(".card[data-enhanced]").each((i, c) => {
        c.classList.toggle("focus-enabled", v === "enabled");
        if (v === "enabled") {
          if (!c.dataset.observer) {
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (
                  mutation.type === "attributes" &&
                  mutation.attributeName === "class"
                ) {
                  const hasFocus = c.classList.contains("focus");
                  const hasLoaded = c.classList.contains("card--loaded");
                  if (
                    hasFocus &&
                    hasLoaded &&
                    !c.classList.contains("is-flipped")
                  ) {
                    const front =
                      c.querySelector(".card__flip .card__front") ||
                      c.querySelector(".card__view");
                    flipCardFunc(c, front, "focus");
                  } else if (!hasFocus && c.classList.contains("is-flipped")) {
                    unflipCard(c);
                  }
                }
              });
            });
            observer.observe(c, {
              attributes: true,
              attributeFilter: ["class"],
            });
            c.dataset.observer = "true";
            c.observer = observer;
          }
        } else {
          if (c.observer) {
            c.observer.disconnect();
            delete c.dataset.observer;
            delete c.observer;
          }
        }
      });
    },
  });

  Lampa.SettingsApi.addParam({
    component: "rating_info",
    param: {
      name: "card_flip_touch",
      type: "select",
      values: { enabled: "Вкл", disabled: "Выкл" },
      default: "disabled",
    },
    field: {
      name: "Переворот при касании",
      description: "Переворот при касании в приложении на телефоне",
    },
  });

    Lampa.SettingsApi.addParam({
    component: "rating_info",
    param: {
      name: "card_flip_disable_all",
      type: "select",
      values: { enabled: "Вкл", disabled: "Выкл" },
      default: "disabled",
    },
    field: {
      name: "Отключить все перевороты",
      description: "Полное отключение",
    },
  });

  // Настройки автопрокрутки
  Lampa.SettingsApi.addParam({
    component: "rating_info",
    param: { type: "title" },
    field: {
      name: "Автопрокрутка описания",
      description: "Настройки скорости автоматической прокрутки текста",
    },
  });

  Lampa.SettingsApi.addParam({
    component: "rating_info",
    param: {
      name: "card_scroll_enabled",
      type: "select",
      values: { enabled: "Вкл", disabled: "Выкл" },
      default: "enabled",
    },
    field: {
      name: "Автопрокрутка описания",
      description: "Включить автоматическую прокрутку текста",
    },
    onChange: (v) => {
      if (v !== "enabled") {
        document
          .querySelectorAll(".card.is-flipped .card__back-desc")
          .forEach((desc) => {
            if (desc.stopScroll) desc.stopScroll();
          });
      }
    },
  });

  Lampa.SettingsApi.addParam({
    component: "rating_info",
    param: {
      name: "card_scroll_speed",
      type: "select",
      values: {
        10: "Очень медленно",
        20: "Медленно",
        30: "Средняя",
        40: "Быстро",
        50: "Очень быстро",
      },
      default: "30",
    },
    field: {
      name: "⏬ Скорость прокрутки",
      description: "Скорость автоматической прокрутки описания",
    },
  });

    // Настройки автопрокрутки
  Lampa.SettingsApi.addParam({
    component: "rating_info",
    param: { type: "title" },
    field: {
      name: "Кэш и API-ключи рейтингов ",
      description: "Настройки кэша рейтингов и API ключей",
    },
  });

    Lampa.SettingsApi.addParam({
        component: "rating_info",
        param: {
            name: "cache_ttl_days",
            type: "select",
            values: { 7: "7 дней", 14: "14 дней", 30: "30 дней" },
            default: Lampa.Storage.get("cache_ttl_days", "7"),
        },
        field: {
            name: "TTL кэша (дни)",
            description: "Время жизни записей кэша",
        },
        onChange: (v) => {
            const days = parseInt(v, 10) || 7;
            Lampa.Storage.set("cache_ttl_days", days);
            Lampa.Noty.show(`✅ TTL кэша установлен: ${days} дней`);
            cleanupCombinedCache();
        },
    });

    Lampa.SettingsApi.addParam({
        component: "rating_info",
        param: {
            name: "cache_lru_limit",
            type: "input",
            values: "",
            placeholder: "300",
            default: String(Lampa.Storage.get("cache_lru_limit", "300")),
        },
        field: {
            name: "LRU лимит записей",
            description: "По умолчанию 300. Старые записи удаляются при переполнении.",
        },
        onChange: (v) => {
            const num = Math.max(10, parseInt(v, 10) || 300);
            Lampa.Storage.set("cache_lru_limit", num);
            Lampa.Noty.show(`✅ Лимит LRU установлен: ${num} записей`);
            cleanupCombinedCache();
        },
    });

    Lampa.SettingsApi.addParam({
        component: "rating_info",
        param: { name: "clear_rating_cache", type: "button", values: "" },
        field: {
            name: "🧹 Очистить кэш",
            description: "Полная очистка кэша рейтингов и сборов",
        },
        onChange: () => {
            const beforeCount = Object.keys(combinedCache).length;
            combinedCache = {};
            saveCombinedCache();
            
            // Также очищаем старый кэш для полноты
            const oldCacheCount = Object.keys(cache).length;
            cache = {};
            saveCache();
            
            Lampa.Noty.show(`✅ Кэш очищен (${beforeCount} новых + ${oldCacheCount} старых записей)`);
        },
    });

    // Настройка API ключа MDBList
    Lampa.SettingsApi.addParam({
        component: "rating_info",
        param: {
            name: "mdblist_api_key",
            type: "input",
            values: "",
            placeholder: "🔑 Введите API ключ MDBList",
            default: Lampa.Storage.get("mdblist_api_key", ""),
        },
        field: {
            name: "API ключ MDBList",
            description: "API ключ для MDBList (Rotten Tomatoes, Metacritic)",
        },
        onChange: (v) => {
            if (v) {
                Lampa.Storage.set("mdblist_api_key", v);
                API_PARAMS.MDBLIST_API_KEY = v;
                Lampa.Noty.show("✅ API ключ MDBList сохранен");
                refreshAllRatings();
            } else {
                // Если ключ удален, используем ключ по умолчанию
                Lampa.Storage.set("mdblist_api_key", "");
                API_PARAMS.MDBLIST_API_KEY = "";
                Lampa.Noty.show("🔄 Используется ключ MDBList по умолчанию");
                refreshAllRatings();
            }
        },
    });

  Lampa.SettingsApi.addParam({
    component: "rating_info",
    param: {
      name: "omdb_api_key",
      type: "input",
      values: "",
      placeholder: "🔑 Введите API ключ OMDB",
      default: "",
    },
    field: {
      name: "Введите API ключ OMDB",
      description: "API ключ для OMDB (Rotten Tomatoes, Metacritic)",
    },
    onChange: (v) => {
      if (v) {
        Lampa.Storage.set("omdb_api_key", v);
        API_PARAMS.OMDB_API_KEY = v;
      }
    },
  });
})();
