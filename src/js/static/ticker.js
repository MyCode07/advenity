import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger)

function scroll(target, options, reverse) {
    const timeline = gsap.timeline({
        repeat: -1,
        onReverseComplete() {
            this.totalTime(this.rawTime() + this.duration() * 10);
        }
    });
    options = options || {};
    options.ease || (options.ease = "none");
    timeline.to(target, {
        xPercent: reverse ? 100 : -100,
        ...options,
    }, 0);

    return timeline;
}

export const runTicker = () => {
    const ticker = document.querySelector('._ticker');
    const tickers = document.querySelectorAll('._ticker-text');

    if (!ticker) return;


    tickers.forEach(line => {
        let time = line.closest('._ticker').dataset.speed ?? 25

        let direction = 1;
        const roll = scroll(line, { duration: time })

        ScrollTrigger.create({
            onUpdate(self) {
                if (self.direction !== direction) {
                    direction *= -1;
                    gsap.to(roll, {
                        timeScale: direction,
                        overwrite: true,
                    });
                }
                roll.timeScale(self.direction * 2)

                setTimeout(() => {
                    roll.timeScale(self.direction)
                }, 100);
            }
        });
    })
}