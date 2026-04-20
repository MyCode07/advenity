const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;

        if (entry.isIntersecting) {
            prepareVideo(video);
        } else {
            pauseVideo(video);
        }
    });
}, {
    threshold: 0.3
});

function prepareVideo(video) {
    if (!video || video.dataset.loaded === 'true') return;

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
    playVideo(video);
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

    if (video.dataset.poster) {
        video.poster = video.dataset.poster;
    }
}

// Делегирование событий hover с проверками
document.addEventListener('mouseenter', (e) => {
    // Проверяем, что target существует и это DOM-элемент
    const target = e.target;
    if (!target || !target.nodeType) return;

    // Безопасно ищем родителя
    const casesItem = target.closest ? target.closest('.cases-item') : null;
    if (!casesItem) return;

    const video = casesItem.querySelector('._video');
    if (video && video.tagName === 'VIDEO') {
        prepareVideo(video);
        playVideo(video);
    }
}, true);

document.addEventListener('mouseleave', (e) => {
    const target = e.target;
    if (!target || !target.nodeType) return;

    const casesItem = target.closest ? target.closest('.cases-item') : null;
    if (!casesItem) return;

    const video = casesItem.querySelector('._video');
    if (video && video.tagName === 'VIDEO') {
        pauseVideo(video);
    }
}, true);


// Функция инициализации видео
function initVideos(container = document) {
    const videos = container.querySelectorAll('._video:not([data-initialized])');

    videos.forEach(video => {
        if (video.tagName !== 'VIDEO') return;

        const project = video.closest('.cases-item');

        if (!project) {
            observer.observe(video);
        }

        video.dataset.initialized = 'true';
    });
}

// Наблюдатель за изменениями DOM
const domObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // ELEMENT_NODE
                if (node.tagName === 'VIDEO' && node.classList && node.classList.contains('_video')) {
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