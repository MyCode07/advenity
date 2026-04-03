const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            playVideo(entry.target);
        }
    })
});

function playVideo(video) {
    if (!video) return;

    const sources = video.querySelectorAll('source[data-src]');

    if (sources) {
        sources.forEach(source => {
            source.src = source.dataset.src;
        });
    } else {
        video.src = video.dataset.src;
    }

    video.load();
    video.play();
    observer.unobserve(video);
}

const videos = document.querySelectorAll('._video');

export const playVideoAction = () => {
    if (!videos.length) return;

    videos.forEach(video => {
        observer.observe(video);
    })
}

// document.addEventListener("DOMContentLoaded", function () {
//     var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

//     if ("IntersectionObserver" in window) {
//         var lazyVideoObserver = new IntersectionObserver(function (entries, observer) {
//             entries.forEach(function (video) {
//                 if (video.isIntersecting) {
//                     for (var source in video.target.children) {
//                         var videoSource = video.target.children[source];
//                         if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
//                             videoSource.src = videoSource.dataset.src;
//                         }
//                     }

//                     video.target.load();
//                     video.target.classList.remove("lazy");
//                     lazyVideoObserver.unobserve(video.target);
//                 }
//             });
//         });

//         lazyVideos.forEach(function (lazyVideo) {
//             lazyVideoObserver.observe(lazyVideo);
//         });
//     }
// });