// import "./parts/popup.js";
import "./parts/menu.js";
import "./parts/tabs.js";
import "./parts/sliders.js";
import "./parts/popup.js";
// import "./parts/lenis-scroll.js";
import "./parts/input-placeholder.js";

import { playVideoAction } from "./parts/video.js";
import { maskInputs } from "./static/inputmask.js";
import { stickyHeader } from "./parts/header.js";
import { runTicker } from "./static/ticker.js";
import { accorden } from "./static/accordeon.js";
import { Fancybox } from "@fancyapps/ui";
import { animateTextAction } from "./parts/animations.js";
import { smoothscroll } from "./utils/smoothscrol.js";

maskInputs('+7 (999) 999-99-99', '._mask-phone')
stickyHeader()
playVideoAction()
runTicker()
accorden()
animateTextAction()
smoothscroll()

Fancybox.bind("[data-fancybox]", {
});

document.addEventListener('click', function (e) {
    let targetEl = e.target;
    if (targetEl.classList.contains('pages-close')) {
        document.querySelector('.pages').classList.toggle('_hide');
    }
})