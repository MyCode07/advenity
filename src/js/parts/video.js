const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Если видео в зоне видимости, подготавливаем его
            prepareVideo(entry.target);
        } else {
            // Если видео ушло из зоны видимости - останавливаем
            pauseVideo(entry.target);
        }
    })
}, {
    threshold: 0.3 // Видео считается видимым, когда видно хотя бы 30% элемента
});

function prepareVideo(video) {
    if (!video) return;

    // Проверяем, загружены ли уже источники
    if (video.dataset.loaded === 'true') return;

    const sources = video.querySelectorAll('source[data-src]');

    if (sources.length) {
        sources.forEach(source => {
            source.src = source.dataset.src;
        });
    } else if (video.dataset.src) {
        video.src = video.dataset.src;
    }

    video.load();
    video.dataset.loaded = 'true';
    playVideo(video)
    observer.unobserve(video);
}

function playVideo(video) {
    if (!video || !video.dataset.loaded) return;

    const playPromise = video.play();


    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Auto-play prevented:', error);
        });
    }
}

function pauseVideo(video) {
    if (!video) return;

    video.pause();
    // Возвращаем постер (если есть data-poster)
    if (video.dataset.poster) {
        video.poster = video.dataset.poster;
    }
}

function resetVideo(video) {
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    if (video.dataset.poster) {
        video.poster = video.dataset.poster;
    }
}

const videos = document.querySelectorAll('._video');

export const playVideoAction = () => {
    if (!videos.length) return;

    videos.forEach(video => {
        // Наблюдаем за появлением видео в зоне видимости

        // Ищем проект (родительский элемент с классом .cases-item .img)
        const project = video.closest('.cases-item');

        if (project) {
            // При наведении на проект - воспроизводим
            project.addEventListener('mouseenter', () => {
                console.log('Video play on hover');
                prepareVideo(video); // Убеждаемся, что видео загружено
                playVideo(video);
            });

            // При уходе мыши - ставим на паузу
            project.addEventListener('mouseleave', () => {
                console.log('Video pause on leave');
                pauseVideo(video);
            });
        } else {
            observer.observe(video);

        }
    });
};

// // Дополнительно: функция для остановки всех видео
// export const stopAllVideos = () => {
//     videos.forEach(video => {
//         pauseVideo(video);
//     });
// };

// // Дополнительно: функция для сброса всех видео
// export const resetAllVideos = () => {
//     videos.forEach(video => {
//         resetVideo(video);
//     });
// };