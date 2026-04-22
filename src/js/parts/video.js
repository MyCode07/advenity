let activeVideo = null;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;

        if (entry.isIntersecting) {
            prepareVideo(video);
        } else {
            pauseVideo(video, true); // полная очистка
        }
    });
}, {
    threshold: 0.05
});

function prepareVideo(video) {
    if (!video) return;

    const sources = video.querySelectorAll('source[data-src]');

    // Загружаем только один раз
    if (video.dataset.loaded !== 'true') {
        if (sources.length) {
            sources.forEach(source => {
                if (!source.src) {
                    source.src = source.dataset.src;
                }
            });
        } else if (video.dataset.src && !video.src) {
            video.src = video.dataset.src;
        }

        video.load();
        video.dataset.loaded = 'true';
    }

    playVideo(video);
}

function playVideo(video) {
    if (!video || video.dataset.loaded !== 'true') return;

    // Останавливаем предыдущее видео
    if (activeVideo && activeVideo !== video) {
        pauseVideo(activeVideo, true);
    }

    const playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => { });
    }

    activeVideo = video;
}

function pauseVideo(video, reset = false) {
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    if (reset) {
        const sources = video.querySelectorAll('source');

        sources.forEach(source => {
            source.removeAttribute('src');
        });

        video.removeAttribute('src');
        video.load();

        video.dataset.loaded = 'false';
    }

    if (video.dataset.poster) {
        video.poster = video.dataset.poster;
    }

    if (activeVideo === video) {
        activeVideo = null;
    }
}

// Hover события
document.addEventListener('mouseenter', (e) => {
    const target = e.target;
    if (!target || !target.nodeType) return;

    const casesItem = target.closest?.('.cases-item');
    if (!casesItem) return;

    const video = casesItem.querySelector('._video');
    if (video && video.tagName === 'VIDEO') {
        prepareVideo(video);
        playVideo(video);
    }
}, true);

document.addEventListener('mouseleave', (e) => {
    const target = e.target;
    if (!target || !target.nodeType || !target.classList) return;


    if (target.classList.contains('cases-item')) {
        const video = target.querySelector('._video');
        if (video && video.tagName === 'VIDEO') {
            pauseVideo(video);
        }
    }

}, true);

// Инициализация
function initVideos(container = document) {
    const videos = container.querySelectorAll('._video:not([data-initialized])');

    videos.forEach(video => {
        if (video.tagName !== 'VIDEO') return;

        const project = video.closest('.cases-item');

        // Если не внутри hover-блока — следим через observer
        if (!project) {
            observer.observe(video);
        }

        video.dataset.initialized = 'true';
    });
}

// Отслеживание DOM изменений
const domObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                if (node.tagName === 'VIDEO' && node.classList?.contains('_video')) {
                    initVideos(node.parentNode);
                }

                if (node.querySelectorAll) {
                    initVideos(node);
                }
            }
        });
    });
});

// Запуск
export const playVideoAction = () => {
    initVideos();

    domObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
};