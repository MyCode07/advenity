import Lenis from 'lenis'; // или через <script src="...">

const lenis = new Lenis({
    // duration: 0.9, // Плавность (чем больше, тем "тягучее")
    // // easing: (t) => t,
    // // easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Формула плавности
    // smoothWheel: true, // Включаем плавность для колеса
    smooth: true,
    lerp: 0.08, // не
});

lenis.on('scroll', () => {
    // просто пусто — важно для триггера
})

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);