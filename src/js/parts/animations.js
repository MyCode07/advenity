
import { gsap } from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger.js'
// import { TextPlugin } from 'gsap/TextPlugin.js';
import SplitType from 'split-type'

// text fill animations
const aniamtedTexts = document.querySelectorAll('._text-animated');
export const animateTextAction = () => {
    if (aniamtedTexts.length) {
        aniamtedTexts.forEach((char, i) => {

            const bg = char.dataset.bgColor
            const fg = char.dataset.fgColor

            const text = new SplitType(char, { types: 'chars' })

            gsap.fromTo(text.chars,
                {
                    color: bg,
                },
                {
                    color: fg,
                    duration: 0.3,
                    stagger: 0.3,
                    ease: 'ease',
                    scrollTrigger: {
                        trigger: char,
                        start: 'top 80%',
                        end: 'top 35%',
                        scrub: true,
                        // markers: true,
                        toggleActions: 'play play reverse reverse',
                    }
                })
        })
    }
}