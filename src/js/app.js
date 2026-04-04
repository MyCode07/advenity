// import "./parts/popup.js";
 import "./parts/menu.js";
// import "./parts/tabs.js";
import "./parts/sliders.js";
// import "./parts/show-more.js";
import "./parts/input-placeholder.js";
// import "./parts/select.js";

import { playVideoAction } from "./parts/video.js";

import { maskInputs } from "./static/inputmask.js";
import { stickyHeader } from "./parts/header.js";
import { runTicker } from "./static/ticker.js";
import { Fancybox } from "@fancyapps/ui";
import { accorden } from "./static/accordeon.js";
// import { replaceDomElements } from "./static/replace.js";

// replaceDomElements()
maskInputs('+7 (999) 999-99-99', '._mask-phone')
stickyHeader()
playVideoAction();
runTicker()
Fancybox.bind("[data-fancybox]", {
});
accorden()

document.addEventListener('click', function (e) {
    let targetEl = e.target;
    if (targetEl.classList.contains('pages-close')) {
        document.querySelector('.pages').classList.toggle('_hide');
    }
})