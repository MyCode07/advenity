import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

const sliders = document.querySelectorAll('.swiper');
if (sliders.length) {
    sliders.forEach(slider => {
        const section = slider.closest('section');
        const prev = section.querySelector('.prev');
        const next = section.querySelector('.next');
        const pagination = section.querySelector('.pagination');

        if (slider.closest('.reviews')) {
            new Swiper(slider, {
                modules: [
                    Navigation
                ],
                navigation: {
                    prevEl: prev,
                    nextEl: next,
                },
                slidesPerView: 'auto',
                breakpoints: {
                    300: {
                        spaceBetween: 10
                    },
                    1025: {
                        spaceBetween: 20
                    }
                }
            });
        }
    })
}
