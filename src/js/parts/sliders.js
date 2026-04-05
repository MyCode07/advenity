import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

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


        if (slider.closest('.single-product')) {
            new Swiper(slider, {
                modules: [
                    Pagination
                ],
                pagination: {
                    el: pagination,
                    clickable: true,
                },
                slidesPerView: 1,
                spaceBetween: 10,
            });
        }
    })
}
